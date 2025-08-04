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
import com.aksi.security.SecurityUtils;
import com.aksi.service.cart.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** REST controller for shopping cart operations */
@Slf4j
@RestController
@RequiredArgsConstructor
public class CartController implements CartApi {

  private final CartService cartService;

  @Override
  public ResponseEntity<CartInfo> getCart() {
    UUID customerId = getCurrentCustomerId();

    CartInfo cart = cartService.getOrCreateCart(customerId);
    return ResponseEntity.ok(cart);
  }

  @Override
  public ResponseEntity<Void> clearCart() {
    UUID customerId = getCurrentCustomerId();

    cartService.clearCart(customerId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<CartItemInfo> addCartItem(AddCartItemRequest addCartItemRequest) {
    UUID customerId = getCurrentCustomerId();

    CartItemInfo cartItem = cartService.addItemToCart(customerId, addCartItemRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(cartItem);
  }

  @Override
  public ResponseEntity<CartItemInfo> updateCartItem(
      UUID itemId, UpdateCartItemRequest updateCartItemRequest) {
    UUID customerId = getCurrentCustomerId();

    CartItemInfo cartItem = cartService.updateCartItem(customerId, itemId, updateCartItemRequest);
    return ResponseEntity.ok(cartItem);
  }

  @Override
  public ResponseEntity<Void> removeCartItem(UUID itemId) {
    UUID customerId = getCurrentCustomerId();

    cartService.removeItemFromCart(customerId, itemId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<CartInfo> updateCartModifiers(
      UpdateCartModifiersRequest updateCartModifiersRequest) {
    UUID customerId = getCurrentCustomerId();

    CartInfo cart = cartService.updateCartModifiers(customerId, updateCartModifiersRequest);
    return ResponseEntity.ok(cart);
  }

  @Override
  public ResponseEntity<CartPricingInfo> calculateCart() {
    UUID customerId = getCurrentCustomerId();

    CartPricingInfo pricing = cartService.calculateCart(customerId);
    return ResponseEntity.ok(pricing);
  }

  private UUID getCurrentCustomerId() {
    try {
      return SecurityUtils.getCurrentCustomerId();
    } catch (Exception e) {
      // In development/testing, we need to provide customer ID from request header or session
      log.warn("Cannot get customer ID from security context: {}", e.getMessage());
      throw new IllegalStateException(
          "Customer authentication required. Please ensure customer is authenticated.");
    }
  }
}
