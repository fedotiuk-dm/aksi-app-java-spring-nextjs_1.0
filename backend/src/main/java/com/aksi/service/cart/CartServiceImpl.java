package com.aksi.service.cart;

import java.util.UUID;

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
import com.aksi.exception.NotFoundException;
import com.aksi.service.customer.CustomerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade implementation of CartService. Provides a unified API while delegating to specialized
 * Query and Command services.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

  private final CartQueryService queryService;
  private final CartCommandService commandService;
  private final CustomerService customerService;

  @Override
  public CartInfo getOrCreateCart(UUID customerId) {
    // Check if customer exists
    if (!customerService.existsById(customerId)) {
      throw new NotFoundException("Customer not found: " + customerId);
    }

    CartEntity cartEntity =
        queryService
            .findActiveCart(customerId)
            .orElseGet(() -> commandService.createCart(customerId));

    // Extend TTL on access to keep cart alive
    if (!cartEntity.isExpired()) {
      commandService.extendCartTtl(cartEntity);
    }

    return queryService.getCartInfo(cartEntity);
  }

  @Override
  public void clearCart(UUID customerId) {
    CartEntity cartEntity = queryService.getActiveCartOrThrow(customerId);
    commandService.clearCart(cartEntity);
  }

  @Override
  public CartItemInfo addItemToCart(UUID customerId, AddCartItemRequest request) {
    CartEntity cartEntity = queryService.getActiveCartOrThrow(customerId);

    // Check if item already exists in cart
    CartItem cartItem =
        queryService
            .findCartItemByPriceListItemId(cartEntity, request.getPriceListItemId())
            .map(
                existingItem -> {
                  commandService.updateItemQuantity(existingItem, request.getQuantity());
                  return existingItem;
                })
            .orElseGet(() -> commandService.addNewItem(cartEntity, request));

    commandService.save(cartEntity);
    return queryService.getCartItemInfo(cartItem, cartEntity);
  }

  @Override
  public CartItemInfo updateCartItem(UUID customerId, UUID itemId, UpdateCartItemRequest request) {
    CartEntity cartEntity = queryService.getActiveCartOrThrow(customerId);
    CartItem cartItem = queryService.findCartItemOrThrow(cartEntity, itemId);

    commandService.updateItem(cartItem, request);
    commandService.save(cartEntity);

    return queryService.getCartItemInfo(cartItem, cartEntity);
  }

  @Override
  public void removeItemFromCart(UUID customerId, UUID itemId) {
    CartEntity cartEntity = queryService.getActiveCartOrThrow(customerId);
    CartItem cartItem = queryService.findCartItemOrThrow(cartEntity, itemId);

    commandService.removeItem(cartEntity, cartItem);
    commandService.save(cartEntity);
  }

  @Override
  public CartInfo updateCartModifiers(UUID customerId, UpdateCartModifiersRequest request) {
    CartEntity cartEntity = queryService.getActiveCartOrThrow(customerId);

    commandService.updateCartModifiers(cartEntity, request);
    commandService.save(cartEntity);

    return queryService.getCartInfo(cartEntity);
  }

  @Override
  @Transactional(readOnly = true)
  public CartPricingInfo calculateCart(UUID customerId) {
    return queryService.calculateCartPricing(customerId);
  }

  @Override
  public int cleanupExpiredCarts() {
    return commandService.cleanupExpiredCarts();
  }
}
