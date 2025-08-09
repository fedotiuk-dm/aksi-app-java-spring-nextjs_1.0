package com.aksi.service.cart;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.cart.dto.AddCartItemRequest;
import com.aksi.api.cart.dto.DiscountType;
import com.aksi.api.cart.dto.ItemCharacteristics;
import com.aksi.api.cart.dto.UpdateCartItemRequest;
import com.aksi.api.cart.dto.UpdateCartModifiersRequest;
import com.aksi.api.cart.dto.UrgencyType;
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
  private CartEntity createCart(UUID customerId) {
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
   * Check if cart is active (not expired).
   *
   * @param cart cart entity
   * @return true if cart is active
   */
  private boolean isCartActive(CartEntity cart) {
    return Instant.now().isBefore(cart.getExpiresAt());
  }

  /**
   * Get or create cart for customer, extending TTL if cart exists.
   *
   * @param customerId customer ID
   * @return cart entity (existing or newly created)
   */
  public CartEntity getOrCreateCart(UUID customerId) {
    // Find or create cart
    CartEntity cartEntity =
        cartRepository
            .findActiveByCustomerId(customerId, Instant.now())
            .filter(this::isCartActive)
            .orElseGet(() -> createCart(customerId));

    // Extend TTL on access to keep cart alive
    if (isCartActive(cartEntity)) {
      extendCartTtl(cartEntity);
    }

    return cartEntity;
  }

  /**
   * Extend cart TTL.
   *
   * @param cartEntity cart to extend
   */
  public void extendCartTtl(CartEntity cartEntity) {
    cartEntity.setExpiresAt(Instant.now().plus(cartTtlHours, ChronoUnit.HOURS));
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
    updateItemCharacteristics(cartItem, request.getCharacteristics());

    // Add modifiers if provided
    updateItemModifiers(cartItem, request.getModifierCodes());

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
    // Basic field updates
    cartItemMapper.updateEntityFromRequest(request, cartItem);

    // Update characteristics if provided
    updateItemCharacteristics(cartItem, request.getCharacteristics());

    // Update modifiers if provided
    updateItemModifiers(cartItem, request.getModifierCodes());
  }

  /**
   * Update cart item characteristics.
   *
   * @param cartItem cart item to update
   * @param characteristics new characteristics data
   */
  private void updateItemCharacteristics(CartItem cartItem, ItemCharacteristics characteristics) {
    if (characteristics == null) return;

    if (cartItem.getCharacteristics() == null) {
      CartItemCharacteristicsEntity entity = cartItemMapper.toEntity(characteristics);
      entity.setCartItem(cartItem);
      cartItem.setCharacteristics(entity);
    } else {
      cartItemMapper.updateCharacteristicsFromRequest(
          characteristics, cartItem.getCharacteristics());
    }
  }

  /**
   * Update cart item modifiers.
   *
   * @param cartItem cart item to update
   * @param modifierCodes new modifier codes
   */
  private void updateItemModifiers(CartItem cartItem, Iterable<String> modifierCodes) {
    if (modifierCodes == null) return;

    cartItem.getModifiers().clear();
    addModifiersToItem(cartItem, modifierCodes);
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
    Optional.ofNullable(request.getUrgencyType())
        .map(UrgencyType::getValue)
        .ifPresent(cartEntity::setUrgencyType);

    Optional.ofNullable(request.getDiscountType())
        .map(DiscountType::getValue)
        .ifPresent(cartEntity::setDiscountType);

    Optional.ofNullable(request.getDiscountPercentage())
        .ifPresent(cartEntity::setDiscountPercentage);

    Optional.ofNullable(request.getExpectedCompletionDate())
        .ifPresent(cartEntity::setExpectedCompletionDate);
  }

  /**
   * Add item to cart or update quantity if item already exists.
   *
   * @param cartEntity cart entity
   * @param request add item request
   * @return cart item (new or updated)
   */
  public CartItem addOrUpdateItem(CartEntity cartEntity, AddCartItemRequest request) {
    // Check if item already exists in cart
    Optional<CartItem> existingItem =
        cartEntity.getItems().stream()
            .filter(
                item -> item.getPriceListItemEntity().getId().equals(request.getPriceListItemId()))
            .findFirst();

    if (existingItem.isPresent()) {
      updateItemQuantity(existingItem.get(), request.getQuantity());
      return existingItem.get();
    } else {
      return addNewItem(cartEntity, request);
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
    modifierCodes.forEach(
        code ->
            priceModifierRepository
                .findByCode(code)
                .filter(PriceModifierEntity::isActive)
                .map(this::createCartItemModifier)
                .ifPresentOrElse(
                    modifier -> {
                      modifier.setCartItem(cartItem);
                      cartItem.getModifiers().add(modifier);
                    },
                    () -> log.warn("Unknown or inactive modifier code: {}", code)));
  }

  /**
   * Create cart item modifier from price modifier entity.
   *
   * @param priceModifier price modifier entity
   * @return cart item modifier entity
   */
  private CartItemModifierEntity createCartItemModifier(PriceModifierEntity priceModifier) {
    CartItemModifierEntity modifier = new CartItemModifierEntity();
    modifier.setCode(priceModifier.getCode());
    modifier.setName(priceModifier.getName());
    modifier.setType(priceModifier.getType().name());
    modifier.setValue(priceModifier.getValue());
    return modifier;
  }
}
