package com.aksi.service.pricing;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.cart.dto.CartItemPricingInfo;
import com.aksi.api.cart.dto.CartPricingInfo;
import com.aksi.api.pricing.dto.DiscountType;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.api.pricing.dto.UrgencyType;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemModifierEntity;
import com.aksi.service.pricing.factory.PricingFactory;
import com.aksi.service.pricing.validator.PricingValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for cart pricing calculations. Handles conversion between cart entities and pricing
 * calculations. Follows OrderQueryService pattern with structured steps.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class CartPricingQueryService {

  private final PricingService pricingService;
  private final PricingValidator validator;
  private final PricingFactory factory;

  /**
   * Get pricing for entire cart. Structured approach: conversion -> calculation -> response mapping
   */
  public CartPricingInfo getCartPricing(CartEntity cartEntity) {
    log.debug("Calculating pricing for cart with {} items", cartEntity.getItems().size());

    // Step 1: Convert cart to price calculation request
    PriceCalculationRequest request = buildPriceCalculationRequest(cartEntity);

    // Step 2: Use PricingService to calculate
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    // Step 3: Convert response to CartPricingInfo
    CartPricingInfo pricing = new CartPricingInfo();
    pricing.setItemsSubtotal(response.getTotals().getItemsSubtotal());
    pricing.setUrgencyAmount(response.getTotals().getUrgencyAmount());
    pricing.setDiscountAmount(response.getTotals().getDiscountAmount());
    pricing.setDiscountApplicableAmount(response.getTotals().getDiscountApplicableAmount());
    pricing.setTotal(response.getTotals().getTotal());

    log.debug("Cart pricing calculated: total = {}", pricing.getTotal());
    return pricing;
  }

  /**
   * Get pricing for individual cart item. Structured approach: validation -> conversion ->
   * calculation -> response mapping
   */
  public CartItemPricingInfo getItemPricing(
      CartItem cartItem, String urgencyType, String discountType, Integer discountPercentage) {

    log.debug("Calculating pricing for cart item: {}", cartItem.getPriceListItemEntity().getId());

    // Step 1: Convert String to enum types
    UrgencyType validatedUrgencyType =
        urgencyType != null ? UrgencyType.fromValue(urgencyType) : UrgencyType.NORMAL;
    DiscountType validatedDiscountType =
        discountType != null ? DiscountType.fromValue(discountType) : DiscountType.NONE;

    // Step 2: Build single item request
    PriceCalculationRequest request = new PriceCalculationRequest();
    request.setItems(List.of(convertCartItemToPriceCalculationItem(cartItem)));
    request.setGlobalModifiers(
        factory.createGlobalModifiers(
            validatedUrgencyType, validatedDiscountType, discountPercentage));

    // Step 3: Validate complete request
    validator.validatePriceCalculationRequest(request);

    // Step 4: Calculate using PricingService
    PriceCalculationResponse response = pricingService.calculatePrice(request);

    if (response.getItems().isEmpty()) {
      throw new IllegalStateException("Failed to calculate price for cart item");
    }

    var calculatedItem = response.getItems().getFirst();

    // Step 5: Convert to CartItemPricingInfo
    CartItemPricingInfo pricing = convertToCartItemPricingInfo(calculatedItem);

    log.debug(
        "Item pricing calculated - base: {}, total: {}",
        pricing.getBasePrice(),
        pricing.getTotal());

    return pricing;
  }

  // ===== PRIVATE HELPER METHODS =====

  /** Build price calculation request from cart entity. */
  private PriceCalculationRequest buildPriceCalculationRequest(CartEntity cartEntity) {
    log.debug(
        "Building price calculation request for cart with {} items", cartEntity.getItems().size());

    PriceCalculationRequest request = new PriceCalculationRequest();

    // Step 1: Convert cart enums to pricing enums
    UrgencyType urgencyType =
        cartEntity.getUrgencyType() != null
            ? UrgencyType.fromValue(cartEntity.getUrgencyType().getValue())
            : UrgencyType.NORMAL;
    DiscountType discountType =
        cartEntity.getDiscountType() != null
            ? DiscountType.fromValue(cartEntity.getDiscountType().getValue())
            : DiscountType.NONE;

    // Step 2: Convert cart items to price calculation items
    List<PriceCalculationItem> items =
        cartEntity.getItems().stream().map(this::convertCartItemToPriceCalculationItem).toList();

    request.setItems(items);
    request.setGlobalModifiers(
        factory.createGlobalModifiers(
            urgencyType, discountType, cartEntity.getDiscountPercentage()));

    // Step 3: Validate complete request
    validator.validatePriceCalculationRequest(request);

    return request;
  }

  /** Convert cart item to price calculation item. */
  private PriceCalculationItem convertCartItemToPriceCalculationItem(CartItem cartItem) {
    PriceCalculationItem item = new PriceCalculationItem();
    item.setPriceListItemId(cartItem.getPriceListItemEntity().getId());
    item.setQuantity(cartItem.getQuantity());

    if (cartItem.getCharacteristics() != null) {
      var characteristics = new com.aksi.api.pricing.dto.PricingItemCharacteristics();
      characteristics.setColor(cartItem.getCharacteristics().getColor());
      characteristics.setMaterial(cartItem.getCharacteristics().getMaterial());
      // Note: pricing PricingItemCharacteristics doesn't have 'filler' field, only
      // material/color/wearLevel
      item.setCharacteristics(characteristics);
    }

    // Modifiers are handled through CartItemModifierEntity relationship
    if (cartItem.getModifiers() != null && !cartItem.getModifiers().isEmpty()) {
      List<String> modifierCodes =
          cartItem.getModifiers().stream().map(CartItemModifierEntity::getCode).toList();
      item.setModifierCodes(modifierCodes);
    }

    return item;
  }

  /** Convert calculated item price to cart item pricing info. */
  private CartItemPricingInfo convertToCartItemPricingInfo(
      com.aksi.api.pricing.dto.CalculatedItemPrice calculatedItem) {

    CartItemPricingInfo pricing = new CartItemPricingInfo();
    pricing.setBasePrice(calculatedItem.getBasePrice());
    pricing.setTotal(calculatedItem.getTotal());
    pricing.setSubtotal(calculatedItem.getCalculations().getSubtotal());
    pricing.setModifiersTotalAmount(calculatedItem.getCalculations().getModifiersTotal());

    return pricing;
  }
}
