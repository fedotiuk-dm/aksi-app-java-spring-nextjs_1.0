package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.cart.CartApi;
import com.aksi.api.cart.dto.ActivateCustomerRequest;
import com.aksi.api.cart.dto.AddCartItemRequest;
import com.aksi.api.cart.dto.CartInfo;
import com.aksi.api.cart.dto.CartItemInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.api.cart.dto.UpdateCartItemRequest;
import com.aksi.api.cart.dto.UpdateCartModifiersRequest;
import com.aksi.service.cart.CartService;

import lombok.RequiredArgsConstructor;

/** REST controller for shopping cart operations. Thin HTTP layer between OpenAPI and service. */
@RestController
@RequiredArgsConstructor
public class CartController implements CartApi {

  private final CartService cartService;

  @Override
  public ResponseEntity<CartInfo> getCart() {
    UUID customerId = cartService.getCurrentCustomerId();
    CartInfo cart = cartService.getOrCreateCart(customerId);
    return ResponseEntity.ok(cart);
  }

  @Override
  public ResponseEntity<Void> clearCart() {
    UUID customerId = cartService.getCurrentCustomerId();
    cartService.clearCart(customerId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<CartItemInfo> addCartItem(AddCartItemRequest addCartItemRequest) {
    UUID customerId = cartService.getCurrentCustomerId();
    CartItemInfo cartItem = cartService.addItemToCart(customerId, addCartItemRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(cartItem);
  }

  @Override
  public ResponseEntity<CartItemInfo> updateCartItem(
      UUID itemId, UpdateCartItemRequest updateCartItemRequest) {
    UUID customerId = cartService.getCurrentCustomerId();
    CartItemInfo cartItem = cartService.updateCartItem(customerId, itemId, updateCartItemRequest);
    return ResponseEntity.ok(cartItem);
  }

  @Override
  public ResponseEntity<Void> removeCartItem(UUID itemId) {
    UUID customerId = cartService.getCurrentCustomerId();
    cartService.removeItemFromCart(customerId, itemId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<CartInfo> updateCartModifiers(
      UpdateCartModifiersRequest updateCartModifiersRequest) {
    UUID customerId = cartService.getCurrentCustomerId();
    CartInfo cart = cartService.updateCartModifiers(customerId, updateCartModifiersRequest);
    return ResponseEntity.ok(cart);
  }

  @Override
  public ResponseEntity<CartPricingInfo> calculateCart() {
    UUID customerId = cartService.getCurrentCustomerId();
    CartPricingInfo pricing = cartService.calculateCart(customerId);
    return ResponseEntity.ok(pricing);
  }

  @Override
  public ResponseEntity<Void> activateCustomerForCart(ActivateCustomerRequest request) {
    cartService.activateCustomerForCart(request.getCustomerId());
    return ResponseEntity.noContent().build();
  }
}
