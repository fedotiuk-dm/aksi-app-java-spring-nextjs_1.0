package com.aksi.service.cart;

import java.util.UUID;

import com.aksi.api.cart.dto.AddCartItemRequest;
import com.aksi.api.cart.dto.CartInfo;
import com.aksi.api.cart.dto.CartItemInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.api.cart.dto.UpdateCartItemRequest;
import com.aksi.api.cart.dto.UpdateCartModifiersRequest;
import com.aksi.exception.BadRequestException;

/** Service interface for managing shopping carts */
public interface CartService {

  /**
   * Get current cart for customer Creates new cart if none exists or existing cart is expired
   *
   * @param customerId Customer ID
   * @return Current cart info
   */
  CartInfo getOrCreateCart(UUID customerId);

  /**
   * Clear all items from cart
   *
   * @param customerId Customer ID
   */
  void clearCart(UUID customerId);

  /**
   * Add item to cart
   *
   * @param customerId Customer ID
   * @param request Add item request
   * @return Added cart item info
   */
  CartItemInfo addItemToCart(UUID customerId, AddCartItemRequest request);

  /**
   * Update cart item
   *
   * @param customerId Customer ID
   * @param itemId Cart item ID
   * @param request Update item request
   * @return Updated cart item info
   */
  CartItemInfo updateCartItem(UUID customerId, UUID itemId, UpdateCartItemRequest request);

  /**
   * Remove item from cart
   *
   * @param customerId Customer ID
   * @param itemId Cart item ID
   */
  void removeItemFromCart(UUID customerId, UUID itemId);

  /**
   * Update cart global modifiers (urgency, discount)
   *
   * @param customerId Customer ID
   * @param request Update modifiers request
   * @return Updated cart info
   */
  CartInfo updateCartModifiers(UUID customerId, UpdateCartModifiersRequest request);

  /**
   * Recalculate cart prices
   *
   * @param customerId Customer ID
   * @return Updated cart pricing info
   */
  CartPricingInfo calculateCart(UUID customerId);

  /**
   * Clean up expired carts (scheduled job)
   *
   * @return Number of deleted carts
   */
  int cleanupExpiredCarts();

  /**
   * Activate customer for cart operations in current session
   *
   * @param customerId Customer ID to activate
   */
  void activateCustomerForCart(UUID customerId);

  /**
   * Get currently active customer ID from session
   *
   * @return Current customer ID
   * @throws BadRequestException if no customer is activated
   */
  UUID getCurrentCustomerId();
}
