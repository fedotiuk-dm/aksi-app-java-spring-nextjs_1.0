package com.aksi.service.cart;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.cart.dto.CartInfo;
import com.aksi.api.cart.dto.CartItemInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
import com.aksi.exception.BadRequestException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.CartMapper;
import com.aksi.repository.CartRepository;
import com.aksi.service.pricing.CartPricingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for cart-related read operations. All methods are read-only and optimized for
 * queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class CartQueryService {

  private final CartRepository cartRepository;
  private final CartMapper cartMapper;
  private final CartPricingService pricingService;
  private final CartContextService cartContextService;

  /**
   * Check if cart is expired.
   *
   * @param cart cart entity
   * @return true if cart is expired
   */
  private boolean checkCartExpired(CartEntity cart) {
    return Instant.now().isAfter(cart.getExpiresAt());
  }

  /**
   * Find active cart for customer.
   *
   * @param customerId customer ID
   * @return active cart if exists
   */
  public Optional<CartEntity> findActiveCart(UUID customerId) {
    return cartRepository
        .findActiveByCustomerId(customerId, Instant.now())
        .filter(cart -> !checkCartExpired(cart));
  }

  /**
   * Get cart with full information including pricing.
   *
   * @param cartEntity cart entity
   * @return cart info with pricing
   */
  public CartInfo getCartInfo(CartEntity cartEntity) {
    CartInfo cartInfo = cartMapper.toCartInfo(cartEntity);

    // Only calculate pricing if cart has items
    if (!cartEntity.getItems().isEmpty()) {
      cartInfo.setPricing(pricingService.getCartPricing(cartEntity));
    } else {
      // Return empty pricing for empty cart
      CartPricingInfo emptyPricing = new CartPricingInfo();
      emptyPricing.setItemsSubtotal(0);
      emptyPricing.setUrgencyAmount(0);
      emptyPricing.setDiscountAmount(0);
      emptyPricing.setDiscountApplicableAmount(0);
      emptyPricing.setTotal(0);
      cartInfo.setPricing(emptyPricing);
    }

    return cartInfo;
  }

  /**
   * Get cart item with pricing information.
   *
   * @param cartItem cart item
   * @param cartEntity parent cart for global modifiers
   * @return cart item info with pricing
   */
  public CartItemInfo getCartItemInfo(CartItem cartItem, CartEntity cartEntity) {
    CartItemInfo itemInfo = cartMapper.toCartItemInfo(cartItem);
    itemInfo.setPricing(
        pricingService.getItemPricing(
            cartItem,
            cartEntity.getUrgencyType(),
            cartEntity.getDiscountType(),
            cartEntity.getDiscountPercentage()));
    return itemInfo;
  }

  /**
   * Get cart pricing.
   *
   * @param customerId customer ID
   * @return cart pricing info
   * @throws NotFoundException if cart not found
   */
  public CartPricingInfo getCartPricing(UUID customerId) {
    CartEntity cartEntity = getActiveCartOrThrow(customerId);

    // Only calculate pricing if cart has items
    if (!cartEntity.getItems().isEmpty()) {
      return pricingService.getCartPricing(cartEntity);
    } else {
      // Return empty pricing for empty cart
      CartPricingInfo emptyPricing = new CartPricingInfo();
      emptyPricing.setItemsSubtotal(0);
      emptyPricing.setUrgencyAmount(0);
      emptyPricing.setDiscountAmount(0);
      emptyPricing.setDiscountApplicableAmount(0);
      emptyPricing.setTotal(0);
      return emptyPricing;
    }
  }

  /**
   * Find cart item in cart.
   *
   * @param cartEntity cart entity
   * @param itemId item ID
   * @return cart item
   * @throws NotFoundException if item not found
   */
  public CartItem findCartItemOrThrow(CartEntity cartEntity, UUID itemId) {
    return cartEntity.getItems().stream()
        .filter(item -> item.getId().equals(itemId))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Cart item not found: " + itemId));
  }

  /**
   * Get active cart or throw exception.
   *
   * @param customerId customer ID
   * @return active cart
   * @throws NotFoundException if cart not found
   */
  public CartEntity getActiveCartOrThrow(UUID customerId) {
    return findActiveCart(customerId)
        .orElseThrow(
            () -> new NotFoundException("No active cart found for customer: " + customerId));
  }

  /**
   * Get currently active customer ID from session context.
   *
   * @return current customer ID
   * @throws BadRequestException if no customer is activated
   */
  public UUID getCurrentCustomerId() {
    return cartContextService
        .getActiveCustomerId()
        .orElseThrow(
            () ->
                new BadRequestException(
                    "No customer activated for cart. Please select a customer first."));
  }
}
