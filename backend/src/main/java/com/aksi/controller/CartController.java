package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.cart.CartApi;
import com.aksi.api.cart.dto.AddCartItemRequest;
import com.aksi.api.cart.dto.CartInfo;
import com.aksi.api.cart.dto.CartItemInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.api.cart.dto.UpdateCartItemRequest;
import com.aksi.api.cart.dto.UpdateCartModifiersRequest;
import com.aksi.service.auth.SessionManagementService;
import com.aksi.service.cart.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for shopping cart operations. Thin layer between OpenAPI and service with
 * logging.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class CartController implements CartApi {

  private final CartService cartService;
  private final SessionManagementService sessionManagementService;

  @Override
  public ResponseEntity<CartInfo> getCart() {
    UUID customerId = getCurrentCustomerId();
    log.debug("Getting cart for customer: {}", customerId);

    CartInfo cart = cartService.getOrCreateCart(customerId);
    log.debug("Retrieved cart with {} items for customer: {}", cart.getItems().size(), customerId);
    return ResponseEntity.ok(cart);
  }

  @Override
  public ResponseEntity<Void> clearCart() {
    UUID customerId = getCurrentCustomerId();
    log.debug("Clearing cart for customer: {}", customerId);

    cartService.clearCart(customerId);
    log.debug("Cart cleared for customer: {}", customerId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<CartItemInfo> addCartItem(AddCartItemRequest addCartItemRequest) {
    UUID customerId = getCurrentCustomerId();
    log.debug(
        "Adding item to cart for customer: {} (priceListItemId: {})",
        customerId,
        addCartItemRequest.getPriceListItemId());

    CartItemInfo cartItem = cartService.addItemToCart(customerId, addCartItemRequest);
    log.debug("Item added to cart for customer: {} (itemId: {})", customerId, cartItem.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(cartItem);
  }

  @Override
  public ResponseEntity<CartItemInfo> updateCartItem(
      UUID itemId, UpdateCartItemRequest updateCartItemRequest) {
    UUID customerId = getCurrentCustomerId();
    log.debug("Updating cart item {} for customer: {}", itemId, customerId);

    CartItemInfo cartItem = cartService.updateCartItem(customerId, itemId, updateCartItemRequest);
    log.debug("Cart item {} updated for customer: {}", itemId, customerId);
    return ResponseEntity.ok(cartItem);
  }

  @Override
  public ResponseEntity<Void> removeCartItem(UUID itemId) {
    UUID customerId = getCurrentCustomerId();
    log.debug("Removing item {} from cart for customer: {}", itemId, customerId);

    cartService.removeItemFromCart(customerId, itemId);
    log.debug("Item {} removed from cart for customer: {}", itemId, customerId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<CartInfo> updateCartModifiers(
      UpdateCartModifiersRequest updateCartModifiersRequest) {
    UUID customerId = getCurrentCustomerId();
    log.debug("Updating cart modifiers for customer: {}", customerId);

    CartInfo cart = cartService.updateCartModifiers(customerId, updateCartModifiersRequest);
    log.debug("Cart modifiers updated for customer: {}", customerId);
    return ResponseEntity.ok(cart);
  }

  @Override
  public ResponseEntity<CartPricingInfo> calculateCart() {
    UUID customerId = getCurrentCustomerId();
    log.debug("Calculating cart pricing for customer: {}", customerId);

    CartPricingInfo pricing = cartService.calculateCart(customerId);
    log.debug(
        "Cart pricing calculated for customer: {} (total: {})", customerId, pricing.getTotal());
    return ResponseEntity.ok(pricing);
  }

  private UUID getCurrentCustomerId() {
    return sessionManagementService.getCurrentUserIdFromContext();
  }
}
