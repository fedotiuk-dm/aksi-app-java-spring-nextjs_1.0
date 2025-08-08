package com.aksi.service.order;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.DiscountType;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.ItemCharacteristics;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.UrgencyType;
import com.aksi.api.pricing.dto.WearLevel;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemModifierEntity;
import com.aksi.service.order.util.OrderQueryUtils;
import com.aksi.service.pricing.PricingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for calculating order pricing from cart data Extracted from OrderServiceImpl to follow
 * SRP principle
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderPricingCalculator {

  private final PricingService pricingService;
  private final OrderQueryUtils queryUtils;

  @Value("${app.order.default-completion-hours:72}")
  private int defaultCompletionHours;

  /**
   * Calculate pricing for cart items
   *
   * @param cartEntity cart to calculate pricing for
   * @return pricing calculation response
   */
  public PriceCalculationResponse calculateCartPricing(CartEntity cartEntity) {
    log.debug("Calculating pricing for cart with {} items", cartEntity.getItems().size());

    // Step 1: Build pricing request
    PriceCalculationRequest pricingRequest = new PriceCalculationRequest();

    // Step 2: Convert cart items to pricing calculation items
    List<PriceCalculationItem> pricingItems = convertCartItemsToPricingItems(cartEntity.getItems());
    pricingRequest.setItems(pricingItems);

    // Step 3: Set global modifiers
    GlobalPriceModifiers globalModifiers = buildGlobalModifiers(cartEntity);
    pricingRequest.setGlobalModifiers(globalModifiers);

    // Step 4: Calculate pricing
    return pricingService.calculatePrice(pricingRequest);
  }

  /**
   * Calculate expected completion date based on cart urgency
   *
   * @param cartEntity cart to calculate completion date for
   * @return expected completion instant
   */
  public Instant calculateExpectedCompletionDate(CartEntity cartEntity) {
    // Step 1: Convert urgency type from string to enum
    UrgencyType urgencyType = null;
    if (cartEntity.getUrgencyType() != null) {
      try {
        urgencyType = UrgencyType.fromValue(cartEntity.getUrgencyType());
      } catch (IllegalArgumentException e) {
        log.warn(
            "Invalid urgency type: {}, using default completion hours",
            cartEntity.getUrgencyType());
      }
    }

    // Step 2: Calculate completion date using utility
    return queryUtils.calculateCompletionDate(urgencyType, defaultCompletionHours);
  }

  /**
   * Convert cart items to pricing calculation items
   *
   * @param cartItems cart items to convert
   * @return list of pricing calculation items
   */
  private List<PriceCalculationItem> convertCartItemsToPricingItems(List<CartItem> cartItems) {
    List<PriceCalculationItem> pricingItems = new ArrayList<>();

    for (CartItem cartItem : cartItems) {
      // Step 1: Create pricing item
      PriceCalculationItem pricingItem = new PriceCalculationItem();
      pricingItem.setPriceListItemId(cartItem.getPriceListItemEntity().getId());
      pricingItem.setQuantity(cartItem.getQuantity());

      // Step 2: Add characteristics if present
      if (cartItem.getCharacteristics() != null) {
        pricingItem.setCharacteristics(convertCharacteristics(cartItem));
      }

      // Step 3: Add modifiers
      List<String> modifierCodes =
          cartItem.getModifiers().stream().map(CartItemModifierEntity::getCode).toList();
      pricingItem.setModifierCodes(modifierCodes);

      pricingItems.add(pricingItem);
    }

    log.debug("Converted {} cart items to pricing items", pricingItems.size());
    return pricingItems;
  }

  /**
   * Convert cart item characteristics to pricing DTO
   *
   * @param cartItem cart item with characteristics
   * @return pricing characteristics DTO
   */
  private ItemCharacteristics convertCharacteristics(CartItem cartItem) {
    ItemCharacteristics characteristics = new ItemCharacteristics();

    // Step 1: Copy basic characteristics
    characteristics.setMaterial(cartItem.getCharacteristics().getMaterial());
    characteristics.setColor(cartItem.getCharacteristics().getColor());

    // Step 2: Convert wear level from Integer to WearLevel enum
    var wear = cartItem.getCharacteristics().getWearLevel();
    if (wear != null) {
      try {
        WearLevel wearLevel = WearLevel.fromValue(wear);
        characteristics.setWearLevel(wearLevel);
      } catch (IllegalArgumentException e) {
        log.warn("Invalid wear level: {}, skipping", wear);
      }
    }

    return characteristics;
  }

  /**
   * Find calculated price for specific cart item in pricing response
   *
   * @param cartItem cart item to find price for
   * @param pricing pricing calculation response
   * @return calculated price for the cart item
   * @throws IllegalStateException if no pricing found for item
   */
  public CalculatedItemPrice findCalculatedPriceForItem(
      CartItem cartItem, PriceCalculationResponse pricing) {

    // Step 1: Get price list item ID
    UUID priceListItemId = cartItem.getPriceListItemEntity().getId();

    // Step 2: Find matching pricing item
    return pricing.getItems().stream()
        .filter(item -> item.getPriceListItemId().equals(priceListItemId))
        .findFirst()
        .orElseThrow(
            () -> new IllegalStateException("No pricing found for item: " + priceListItemId));
  }

  /**
   * Build global price modifiers from cart
   *
   * @param cartEntity cart to extract modifiers from
   * @return global price modifiers
   */
  private GlobalPriceModifiers buildGlobalModifiers(CartEntity cartEntity) {
    GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();

    // Step 1: Set urgency type
    if (cartEntity.getUrgencyType() != null) {
      try {
        globalModifiers.setUrgencyType(UrgencyType.fromValue(cartEntity.getUrgencyType()));
      } catch (IllegalArgumentException e) {
        log.warn("Invalid urgency type: {}, using NORMAL", cartEntity.getUrgencyType());
        globalModifiers.setUrgencyType(UrgencyType.NORMAL);
      }
    }

    // Step 2: Set discount type and percentage
    if (cartEntity.getDiscountType() != null) {
      try {
        globalModifiers.setDiscountType(DiscountType.fromValue(cartEntity.getDiscountType()));
        globalModifiers.setDiscountPercentage(cartEntity.getDiscountPercentage());
      } catch (IllegalArgumentException e) {
        log.warn("Invalid discount type: {}, using NONE", cartEntity.getDiscountType());
        globalModifiers.setDiscountType(DiscountType.NONE);
      }
    }

    return globalModifiers;
  }
}
