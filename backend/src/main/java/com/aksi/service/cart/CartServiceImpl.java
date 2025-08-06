package com.aksi.service.cart;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.cart.dto.AddCartItemRequest;
import com.aksi.api.cart.dto.CartInfo;
import com.aksi.api.cart.dto.CartItemInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.api.cart.dto.UpdateCartItemRequest;
import com.aksi.api.cart.dto.UpdateCartModifiersRequest;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemCharacteristicsEntity;
import com.aksi.domain.cart.CartItemModifierEntity;
import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.domain.customer.CustomerEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.CartItemMapper;
import com.aksi.mapper.CartMapper;
import com.aksi.repository.CartRepository;
import com.aksi.repository.CustomerRepository;
import com.aksi.repository.PriceListItemRepository;
import com.aksi.repository.PriceModifierRepository;
import com.aksi.service.customer.CustomerService;
import com.aksi.service.pricing.CartPricingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of CartService */
@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

  @Value("${app.cart.ttl-hours:24}")
  private int cartTtlHours;

  private final CartRepository cartRepository;
  private final CustomerRepository customerRepository;
  private final CustomerService customerService;
  private final PriceListItemRepository priceListItemRepository;
  private final CartMapper cartMapper;
  private final CartItemMapper cartItemMapper;
  private final CartPricingService cartPricingService;
  private final PriceModifierRepository priceModifierRepository;

  @Override
  @Transactional
  public CartInfo getOrCreateCart(UUID customerId) {
    // Check if customer exists
    if (!customerService.existsById(customerId)) {
      throw new NotFoundException("Customer not found: " + customerId);
    }

    CartEntity cartEntity =
        cartRepository
            .findActiveByCustomerId(customerId, Instant.now())
            .filter(c -> !c.isExpired()) // Additional check using isExpired()
            .orElseGet(
                () -> {
                  CustomerEntity customerEntity =
                      customerRepository
                          .findById(customerId)
                          .orElseThrow(
                              () -> new NotFoundException("Customer not found: " + customerId));
                  return createNewCart(customerEntity);
                });

    // Extend TTL on access to keep cart alive
    if (!cartEntity.isExpired()) {
      cartEntity.extendTtl(Instant.now().plus(cartTtlHours, ChronoUnit.HOURS));
      cartRepository.save(cartEntity);
    }

    CartInfo cartInfo = cartMapper.toCartInfo(cartEntity);
    cartInfo.setPricing(cartPricingService.calculateCartPricing(cartEntity));

    return cartInfo;
  }

  @Override
  @Transactional
  public void clearCart(UUID customerId) {
    CartEntity cartEntity = getActiveCart(customerId);
    cartEntity.getItems().clear();
    cartRepository.save(cartEntity);
  }

  @Override
  @Transactional
  public CartItemInfo addItemToCart(UUID customerId, AddCartItemRequest request) {
    CartEntity cartEntity = getActiveCart(customerId);

    // Extend cart TTL when adding items
    cartEntity.extendTtl(Instant.now().plus(cartTtlHours, ChronoUnit.HOURS));

    PriceListItemEntity priceListItemEntity =
        priceListItemRepository
            .findById(request.getPriceListItemId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Price list item not found: " + request.getPriceListItemId()));

    // Check if item already exists in cart
    CartItem existingItem =
        cartEntity.getItems().stream()
            .filter(
                item -> item.getPriceListItemEntity().getId().equals(request.getPriceListItemId()))
            .findFirst()
            .orElse(null);

    if (existingItem != null) {
      // Update quantity of existing item
      existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
    } else {
      // Create new cart item
      CartItem cartItem = new CartItem();
      cartItem.setPriceListItemEntity(priceListItemEntity);
      cartItem.setQuantity(request.getQuantity());

      // Add characteristics if provided
      if (request.getCharacteristics() != null) {
        CartItemCharacteristicsEntity characteristics =
            cartItemMapper.toEntity(request.getCharacteristics());
        characteristics.setCartItem(cartItem);
        cartItem.setCharacteristics(characteristics);
      }

      // Add modifiers if provided
      if (request.getModifierCodes() != null) {
        for (String modifierCode : request.getModifierCodes()) {
          priceModifierRepository
              .findByCode(modifierCode)
              .filter(pm -> pm.isActive())
              .ifPresentOrElse(
                  priceModifier -> {
                    CartItemModifierEntity modifier = new CartItemModifierEntity();
                    modifier.setCode(priceModifier.getCode());
                    modifier.setName(priceModifier.getName());
                    modifier.setType(priceModifier.getType().name());
                    modifier.setValue(priceModifier.getValue());
                    modifier.setCartItem(cartItem);
                    cartItem.addModifier(modifier);
                  },
                  () -> log.warn("Unknown or inactive modifier code: {}", modifierCode));
        }
      }

      cartEntity.getItems().add(cartItem);
      cartItem.setCartEntity(cartEntity);
    }

    cartRepository.save(cartEntity);

    CartItem savedItem = existingItem != null ? existingItem : cartEntity.getItems().getLast();

    CartItemInfo itemInfo = cartMapper.toCartItemInfo(savedItem);
    itemInfo.setPricing(
        cartPricingService.calculateItemPricing(
            savedItem,
            cartEntity.getUrgencyType(),
            cartEntity.getDiscountType(),
            cartEntity.getDiscountPercentage()));

    return itemInfo;
  }

  @Override
  @Transactional
  public CartItemInfo updateCartItem(UUID customerId, UUID itemId, UpdateCartItemRequest request) {
    CartEntity cartEntity = getActiveCart(customerId);

    CartItem cartItem =
        cartEntity.getItems().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Cart item not found: " + itemId));

    // Use mapper for basic field updates (quantity)
    cartItemMapper.updateEntityFromRequest(request, cartItem);

    // Handle characteristics separately if provided
    if (request.getCharacteristics() != null) {
      if (cartItem.getCharacteristics() == null) {
        // Create new characteristics
        CartItemCharacteristicsEntity characteristics =
            cartItemMapper.toEntity(request.getCharacteristics());
        characteristics.setCartItem(cartItem);
        cartItem.setCharacteristics(characteristics);
      } else {
        // Update existing characteristics
        cartItemMapper.updateCharacteristicsFromRequest(
            request.getCharacteristics(), cartItem.getCharacteristics());
      }
    }

    // Handle modifiers separately if provided
    if (request.getModifierCodes() != null) {
      // Clear existing modifiers and add new ones
      cartItem.getModifiers().clear();
      for (String modifierCode : request.getModifierCodes()) {
        priceModifierRepository
            .findByCode(modifierCode)
            .filter(pm -> pm.isActive())
            .ifPresentOrElse(
                priceModifier -> {
                  CartItemModifierEntity modifier = new CartItemModifierEntity();
                  modifier.setCode(priceModifier.getCode());
                  modifier.setName(priceModifier.getName());
                  modifier.setType(priceModifier.getType().name());
                  modifier.setValue(priceModifier.getValue());
                  modifier.setCartItem(cartItem);
                  cartItem.addModifier(modifier);
                },
                () -> log.warn("Unknown or inactive modifier code: {}", modifierCode));
      }
    }

    cartRepository.save(cartEntity);

    CartItemInfo itemInfo = cartMapper.toCartItemInfo(cartItem);
    itemInfo.setPricing(
        cartPricingService.calculateItemPricing(
            cartItem,
            cartEntity.getUrgencyType(),
            cartEntity.getDiscountType(),
            cartEntity.getDiscountPercentage()));

    return itemInfo;
  }

  @Override
  @Transactional
  public void removeItemFromCart(UUID customerId, UUID itemId) {
    CartEntity cartEntity = getActiveCart(customerId);

    CartItem cartItem =
        cartEntity.getItems().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Cart item not found: " + itemId));

    cartEntity.getItems().remove(cartItem);
    cartItem.setCartEntity(null);
    cartRepository.save(cartEntity);
  }

  @Override
  @Transactional
  public CartInfo updateCartModifiers(UUID customerId, UpdateCartModifiersRequest request) {
    CartEntity cartEntity = getActiveCart(customerId);

    if (request.getUrgencyType() != null) {
      cartEntity.setUrgencyType(request.getUrgencyType().getValue());
    }

    if (request.getDiscountType() != null) {
      cartEntity.setDiscountType(request.getDiscountType().getValue());
    }

    if (request.getDiscountPercentage() != null) {
      cartEntity.setDiscountPercentage(request.getDiscountPercentage());
    }

    if (request.getExpectedCompletionDate() != null) {
      cartEntity.setExpectedCompletionDate(request.getExpectedCompletionDate());
    }

    cartRepository.save(cartEntity);

    CartInfo cartInfo = cartMapper.toCartInfo(cartEntity);
    cartInfo.setPricing(cartPricingService.calculateCartPricing(cartEntity));

    return cartInfo;
  }

  @Override
  @Transactional(readOnly = true)
  public CartPricingInfo calculateCart(UUID customerId) {
    CartEntity cartEntity = getActiveCart(customerId);
    return cartPricingService.calculateCartPricing(cartEntity);
  }

  @Override
  @Transactional
  public int cleanupExpiredCarts() {
    int deletedCount = cartRepository.deleteExpiredCarts(Instant.now());
    log.info("Deleted {} expired carts", deletedCount);
    return deletedCount;
  }

  private CartEntity getActiveCart(UUID customerId) {
    return cartRepository
        .findActiveByCustomerId(customerId, Instant.now())
        .filter(cart -> !cart.isExpired()) // Double-check cart is not expired
        .orElseThrow(
            () -> new NotFoundException("No active cart found for customer: " + customerId));
  }

  private CartEntity createNewCart(CustomerEntity customerEntity) {
    CartEntity cartEntity = new CartEntity();
    cartEntity.setCustomerEntity(customerEntity);
    cartEntity.setExpiresAt(Instant.now().plus(cartTtlHours, ChronoUnit.HOURS));
    return cartRepository.save(cartEntity);
  }
}
