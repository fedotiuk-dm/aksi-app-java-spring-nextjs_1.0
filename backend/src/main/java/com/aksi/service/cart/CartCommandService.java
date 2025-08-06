package com.aksi.service.cart;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.cart.dto.AddCartItemRequest;
import com.aksi.api.cart.dto.UpdateCartItemRequest;
import com.aksi.api.cart.dto.UpdateCartModifiersRequest;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemCharacteristicsEntity;
import com.aksi.domain.cart.CartItemModifierEntity;
import com.aksi.domain.catalog.PriceListItemEntity;
import com.aksi.domain.customer.CustomerEntity;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.CartItemMapper;
import com.aksi.repository.CartRepository;
import com.aksi.repository.CustomerRepository;
import com.aksi.repository.PriceListItemRepository;
import com.aksi.repository.PriceModifierRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for cart-related write operations. Handles cart creation, modification, and
 * cleanup.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CartCommandService {

  @Value("${app.cart.ttl-hours:24}")
  private int cartTtlHours;

  private final CartRepository cartRepository;
  private final CustomerRepository customerRepository;
  private final PriceListItemRepository priceListItemRepository;
  private final PriceModifierRepository priceModifierRepository;
  private final CartItemMapper cartItemMapper;

  /**
   * Create new cart for customer.
   *
   * @param customerId customer ID
   * @return new cart entity
   */
  public CartEntity createCart(UUID customerId) {
    CustomerEntity customerEntity =
        customerRepository
            .findById(customerId)
            .orElseThrow(() -> new NotFoundException("Customer not found: " + customerId));

    CartEntity cartEntity = new CartEntity();
    cartEntity.setCustomerEntity(customerEntity);
    cartEntity.setExpiresAt(Instant.now().plus(cartTtlHours, ChronoUnit.HOURS));

    log.debug("Creating new cart for customer: {}", customerId);
    return cartRepository.save(cartEntity);
  }

  /**
   * Extend cart TTL.
   *
   * @param cartEntity cart to extend
   */
  public void extendCartTtl(CartEntity cartEntity) {
    cartEntity.extendTtl(Instant.now().plus(cartTtlHours, ChronoUnit.HOURS));
    cartRepository.save(cartEntity);
  }

  /**
   * Clear all items from cart.
   *
   * @param cartEntity cart to clear
   */
  public void clearCart(CartEntity cartEntity) {
    cartEntity.getItems().clear();
    cartRepository.save(cartEntity);
  }

  /**
   * Add new item to cart.
   *
   * @param cartEntity cart entity
   * @param request add item request
   * @return added cart item
   */
  public CartItem addNewItem(CartEntity cartEntity, AddCartItemRequest request) {
    PriceListItemEntity priceListItemEntity =
        priceListItemRepository
            .findById(request.getPriceListItemId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Price list item not found: " + request.getPriceListItemId()));

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
      addModifiersToItem(cartItem, request.getModifierCodes());
    }

    cartEntity.getItems().add(cartItem);
    cartItem.setCartEntity(cartEntity);

    // Extend cart TTL when adding items
    extendCartTtl(cartEntity);

    return cartItem;
  }

  /**
   * Update existing cart item quantity.
   *
   * @param cartItem item to update
   * @param additionalQuantity quantity to add
   */
  public void updateItemQuantity(CartItem cartItem, Integer additionalQuantity) {
    cartItem.setQuantity(cartItem.getQuantity() + additionalQuantity);
  }

  /**
   * Update cart item.
   *
   * @param cartItem item to update
   * @param request update request
   */
  public void updateItem(CartItem cartItem, UpdateCartItemRequest request) {
    // Use mapper for basic field updates (quantity)
    cartItemMapper.updateEntityFromRequest(request, cartItem);

    // Handle characteristics
    if (request.getCharacteristics() != null) {
      if (cartItem.getCharacteristics() == null) {
        CartItemCharacteristicsEntity characteristics =
            cartItemMapper.toEntity(request.getCharacteristics());
        characteristics.setCartItem(cartItem);
        cartItem.setCharacteristics(characteristics);
      } else {
        cartItemMapper.updateCharacteristicsFromRequest(
            request.getCharacteristics(), cartItem.getCharacteristics());
      }
    }

    // Handle modifiers
    if (request.getModifierCodes() != null) {
      cartItem.getModifiers().clear();
      addModifiersToItem(cartItem, request.getModifierCodes());
    }
  }

  /**
   * Remove item from cart.
   *
   * @param cartEntity cart entity
   * @param cartItem item to remove
   */
  public void removeItem(CartEntity cartEntity, CartItem cartItem) {
    cartEntity.getItems().remove(cartItem);
    cartItem.setCartEntity(null);
  }

  /**
   * Update cart global modifiers.
   *
   * @param cartEntity cart entity
   * @param request update request
   */
  public void updateCartModifiers(CartEntity cartEntity, UpdateCartModifiersRequest request) {
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
  }

  /**
   * Save cart entity.
   *
   * @param cartEntity cart to save
   * @return saved cart
   */
  public CartEntity save(CartEntity cartEntity) {
    return cartRepository.save(cartEntity);
  }

  /**
   * Clean up expired carts.
   *
   * @return number of deleted carts
   */
  public int cleanupExpiredCarts() {
    int deletedCount = cartRepository.deleteExpiredCarts(Instant.now());
    log.info("Deleted {} expired carts", deletedCount);
    return deletedCount;
  }

  /**
   * Add modifiers to cart item.
   *
   * @param cartItem cart item
   * @param modifierCodes modifier codes to add
   */
  private void addModifiersToItem(CartItem cartItem, Iterable<String> modifierCodes) {
    for (String modifierCode : modifierCodes) {
      priceModifierRepository
          .findByCode(modifierCode)
          .filter(PriceModifierEntity::isActive)
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
}
