package com.aksi.service.order;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemModifierEntity;
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

    PriceCalculationRequest pricingRequest = new PriceCalculationRequest();

    // Convert cart items to pricing calculation items
    List<PriceCalculationItem> pricingItems = convertCartItemsToPricingItems(cartEntity.getItems());
    pricingRequest.setItems(pricingItems);

    // Set global modifiers
    GlobalPriceModifiers globalModifiers = buildGlobalModifiers(cartEntity);
    pricingRequest.setGlobalModifiers(globalModifiers);

    return pricingService.calculatePrice(pricingRequest);
  }

  /**
   * Calculate expected completion date based on cart urgency
   *
   * @param cartEntity cart to calculate completion date for
   * @return expected completion instant
   */
  public Instant calculateExpectedCompletionDate(CartEntity cartEntity) {
    Instant baseDate = Instant.now().plusSeconds((long) defaultCompletionHours * 3600);

    // Adjust based on urgency
    if ("EXPRESS_24H".equals(cartEntity.getUrgencyType())) {
      return Instant.now().plusSeconds(24 * 3600);
    } else if ("EXPRESS_48H".equals(cartEntity.getUrgencyType())) {
      return Instant.now().plusSeconds(48 * 3600);
    }

    return baseDate;
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
      PriceCalculationItem pricingItem = new PriceCalculationItem();
      pricingItem.setPriceListItemId(cartItem.getPriceListItemEntity().getId());
      pricingItem.setQuantity(cartItem.getQuantity());

      // Add characteristics if present
      if (cartItem.getCharacteristics() != null) {
        pricingItem.setCharacteristics(convertCharacteristics(cartItem));
      }

      // Add modifiers
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
  private com.aksi.api.pricing.dto.ItemCharacteristics convertCharacteristics(CartItem cartItem) {
    com.aksi.api.pricing.dto.ItemCharacteristics characteristics =
        new com.aksi.api.pricing.dto.ItemCharacteristics();

    characteristics.setMaterial(cartItem.getCharacteristics().getMaterial());
    characteristics.setColor(cartItem.getCharacteristics().getColor());

    // Note: filler and fillerCondition not supported in pricing DTO
    if (cartItem.getCharacteristics().getWearLevel() != null) {
      try {
        characteristics.setWearLevel(
            com.aksi.api.pricing.dto.ItemCharacteristics.WearLevelEnum.fromValue(
                cartItem.getCharacteristics().getWearLevel()));
      } catch (IllegalArgumentException e) {
        log.warn("Invalid wear level: {}", cartItem.getCharacteristics().getWearLevel());
      }
    }

    return characteristics;
  }

  /**
   * Build global price modifiers from cart
   *
   * @param cartEntity cart to extract modifiers from
   * @return global price modifiers
   */
  private GlobalPriceModifiers buildGlobalModifiers(CartEntity cartEntity) {
    GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();

    // Set urgency type
    if (cartEntity.getUrgencyType() != null) {
      try {
        globalModifiers.setUrgencyType(
            GlobalPriceModifiers.UrgencyTypeEnum.fromValue(cartEntity.getUrgencyType()));
      } catch (IllegalArgumentException e) {
        log.warn("Invalid urgency type: {}, using NORMAL", cartEntity.getUrgencyType());
        globalModifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.NORMAL);
      }
    }

    // Set discount type
    if (cartEntity.getDiscountType() != null) {
      try {
        globalModifiers.setDiscountType(
            GlobalPriceModifiers.DiscountTypeEnum.fromValue(cartEntity.getDiscountType()));
        globalModifiers.setDiscountPercentage(cartEntity.getDiscountPercentage());
      } catch (IllegalArgumentException e) {
        log.warn("Invalid discount type: {}, using NONE", cartEntity.getDiscountType());
        globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.NONE);
      }
    }

    return globalModifiers;
  }
}
