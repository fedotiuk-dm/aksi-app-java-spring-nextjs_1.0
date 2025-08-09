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
  private final CartContextService cartContextService;

  @Override
  public CartInfo getOrCreateCart(UUID customerId) {
    CartEntity cartEntity = commandService.getOrCreateCart(customerId);
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
    CartItem cartItem = commandService.addOrUpdateItem(cartEntity, request);
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
  @Transactional
  public CartPricingInfo calculateCart(UUID customerId) {
    // Get or create cart to avoid NotFoundException when cart doesn't exist
    commandService.getOrCreateCart(customerId);
    return queryService.getCartPricing(customerId);
  }

  @Override
  public int cleanupExpiredCarts() {
    return commandService.cleanupExpiredCarts();
  }

  @Override
  public void activateCustomerForCart(UUID customerId) {
    cartContextService.setActiveCustomerId(customerId);
  }

  @Override
  public UUID getCurrentCustomerId() {
    return queryService.getCurrentCustomerId();
  }
}
