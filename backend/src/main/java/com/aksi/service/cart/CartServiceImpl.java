package com.aksi.service.cart;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.cart.dto.AddCartItemRequest;
import com.aksi.api.cart.dto.CartInfo;
import com.aksi.api.cart.dto.CartItemInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.api.cart.dto.UpdateCartItemRequest;
import com.aksi.api.cart.dto.UpdateCartModifiersRequest;
import com.aksi.domain.cart.Cart;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemCharacteristics;
import com.aksi.domain.cart.CartItemModifier;
import com.aksi.domain.catalog.PriceListItem;
import com.aksi.domain.customer.Customer;
import com.aksi.exception.ResourceNotFoundException;
import com.aksi.mapper.CartItemMapper;
import com.aksi.mapper.CartMapper;
import com.aksi.repository.cart.CartItemRepository;
import com.aksi.repository.cart.CartRepository;
import com.aksi.repository.catalog.PriceListItemRepository;
import com.aksi.repository.customer.CustomerRepository;
import com.aksi.service.modifier.ModifierService;
import com.aksi.service.pricing.CartPricingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of CartService */
@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

  private static final int CART_TTL_HOURS = 24;

  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;
  private final CustomerRepository customerRepository;
  private final PriceListItemRepository priceListItemRepository;
  private final CartMapper cartMapper;
  private final CartItemMapper cartItemMapper;
  private final CartPricingService cartPricingService;
  private final ModifierService modifierService;

  @Override
  @Transactional
  public CartInfo getOrCreateCart(UUID customerId) {
    Customer customer =
        customerRepository
            .findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));

    Cart cart =
        cartRepository
            .findActiveByCustomerId(customerId, Instant.now())
            .filter(c -> !c.isExpired()) // Additional check using isExpired()
            .orElseGet(() -> createNewCart(customer));

    // Extend TTL on access to keep cart alive
    if (!cart.isExpired()) {
      cart.extendTtl(Instant.now().plus(CART_TTL_HOURS, ChronoUnit.HOURS));
      cartRepository.save(cart);
    }

    CartInfo cartInfo = cartMapper.toCartInfo(cart);
    cartInfo.setPricing(cartPricingService.calculateCartPricing(cart));

    return cartInfo;
  }

  @Override
  @Transactional
  public void clearCart(UUID customerId) {
    Cart cart = getActiveCart(customerId);
    cart.getItems().clear();
    cartRepository.save(cart);
  }

  @Override
  @Transactional
  public CartItemInfo addItemToCart(UUID customerId, AddCartItemRequest request) {
    Cart cart = getActiveCart(customerId);

    // Extend cart TTL when adding items
    cart.extendTtl(Instant.now().plus(CART_TTL_HOURS, ChronoUnit.HOURS));

    PriceListItem priceListItem =
        priceListItemRepository
            .findById(request.getPriceListItemId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Price list item not found: " + request.getPriceListItemId()));

    // Check if item already exists in cart
    CartItem existingItem =
        cart.getItems().stream()
            .filter(item -> item.getPriceListItem().getId().equals(request.getPriceListItemId()))
            .findFirst()
            .orElse(null);

    if (existingItem != null) {
      // Update quantity of existing item
      existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
    } else {
      // Create new cart item
      CartItem cartItem = new CartItem();
      cartItem.setPriceListItem(priceListItem);
      cartItem.setQuantity(request.getQuantity());

      // Add characteristics if provided
      if (request.getCharacteristics() != null) {
        CartItemCharacteristics characteristics =
            cartItemMapper.toEntity(request.getCharacteristics());
        characteristics.setCartItem(cartItem);
        cartItem.setCharacteristics(characteristics);
      }

      // Add modifiers if provided
      if (request.getModifierCodes() != null) {
        for (String modifierCode : request.getModifierCodes()) {
          CartItemModifier modifier = modifierService.getModifierByCode(modifierCode);
          if (modifier != null) {
            cartItem.addModifier(modifier);
          } else {
            log.warn("Unknown modifier code: {}", modifierCode);
          }
        }
      }

      cart.getItems().add(cartItem);
      cartItem.setCart(cart);
    }

    cartRepository.save(cart);

    CartItem savedItem =
        existingItem != null ? existingItem : cart.getItems().get(cart.getItems().size() - 1);

    CartItemInfo itemInfo = cartMapper.toCartItemInfo(savedItem);
    itemInfo.setPricing(
        cartPricingService.calculateItemPricing(
            savedItem,
            cart.getUrgencyType(),
            cart.getDiscountType(),
            cart.getDiscountPercentage()));

    return itemInfo;
  }

  @Override
  @Transactional
  public CartItemInfo updateCartItem(UUID customerId, UUID itemId, UpdateCartItemRequest request) {
    Cart cart = getActiveCart(customerId);

    CartItem cartItem =
        cart.getItems().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + itemId));

    // Update fields if provided
    if (request.getQuantity() != null) {
      cartItem.setQuantity(request.getQuantity());
    }

    if (request.getCharacteristics() != null) {
      CartItemCharacteristics characteristics =
          cartItemMapper.toEntity(request.getCharacteristics());
      characteristics.setCartItem(cartItem);
      cartItem.setCharacteristics(characteristics);
    }

    if (request.getModifierCodes() != null) {
      // Clear existing modifiers and add new ones
      cartItem.getModifiers().clear();
      for (String modifierCode : request.getModifierCodes()) {
        CartItemModifier modifier = modifierService.getModifierByCode(modifierCode);
        if (modifier != null) {
          cartItem.addModifier(modifier);
        } else {
          log.warn("Unknown modifier code: {}", modifierCode);
        }
      }
    }

    cartRepository.save(cart);

    CartItemInfo itemInfo = cartMapper.toCartItemInfo(cartItem);
    itemInfo.setPricing(
        cartPricingService.calculateItemPricing(
            cartItem, cart.getUrgencyType(), cart.getDiscountType(), cart.getDiscountPercentage()));

    return itemInfo;
  }

  @Override
  @Transactional
  public void removeItemFromCart(UUID customerId, UUID itemId) {
    Cart cart = getActiveCart(customerId);

    CartItem cartItem =
        cart.getItems().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + itemId));

    cart.getItems().remove(cartItem);
    cartItem.setCart(null);
    cartRepository.save(cart);
  }

  @Override
  @Transactional
  public CartInfo updateCartModifiers(UUID customerId, UpdateCartModifiersRequest request) {
    Cart cart = getActiveCart(customerId);

    if (request.getUrgencyType() != null) {
      cart.setUrgencyType(request.getUrgencyType().getValue());
    }

    if (request.getDiscountType() != null) {
      cart.setDiscountType(request.getDiscountType().getValue());
    }

    if (request.getDiscountPercentage() != null) {
      cart.setDiscountPercentage(request.getDiscountPercentage());
    }

    if (request.getExpectedCompletionDate() != null) {
      cart.setExpectedCompletionDate(request.getExpectedCompletionDate());
    }

    cartRepository.save(cart);

    CartInfo cartInfo = cartMapper.toCartInfo(cart);
    cartInfo.setPricing(cartPricingService.calculateCartPricing(cart));

    return cartInfo;
  }

  @Override
  @Transactional(readOnly = true)
  public CartPricingInfo calculateCart(UUID customerId) {
    Cart cart = getActiveCart(customerId);
    return cartPricingService.calculateCartPricing(cart);
  }

  @Override
  @Transactional
  public int cleanupExpiredCarts() {
    int deletedCount = cartRepository.deleteExpiredCarts(Instant.now());
    log.info("Deleted {} expired carts", deletedCount);
    return deletedCount;
  }

  private Cart getActiveCart(UUID customerId) {
    return cartRepository
        .findActiveByCustomerId(customerId, Instant.now())
        .filter(cart -> !cart.isExpired()) // Double-check cart is not expired
        .orElseThrow(
            () ->
                new ResourceNotFoundException("No active cart found for customer: " + customerId));
  }

  private Cart createNewCart(Customer customer) {
    Cart cart = new Cart();
    cart.setCustomer(customer);
    cart.setExpiresAt(Instant.now().plus(CART_TTL_HOURS, ChronoUnit.HOURS));
    return cartRepository.save(cart);
  }
}
