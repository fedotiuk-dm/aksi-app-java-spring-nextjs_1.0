package com.aksi.service.pricing.calculation;

import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.service.dto.PriceListItemInfo;
import com.aksi.service.pricing.util.PricingQueryUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Calculator for base amount following OrderWizard steps 1-2: 1. Base price from price list 2.
 * Color-specific pricing adjustments
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BaseAmountCalculator {

  private final PricingQueryUtils utils;

  /** Calculate base amount with color adjustments. Steps 1-2 of OrderWizard pricing logic. */
  public BaseCalculationResult calculate(
      PriceCalculationItem item, PriceListItemInfo priceListItem) {
    // Step 1 & 2: Determine base price with color adjustments
    String color = item.getCharacteristics() != null ? item.getCharacteristics().getColor() : null;
    int basePrice = utils.determineBasePrice(priceListItem, color);
    int baseAmount = basePrice * item.getQuantity();

    log.debug(
        "Base calculation: price={}, quantity={}, amount={}, color={}",
        basePrice,
        item.getQuantity(),
        baseAmount,
        color);

    return new BaseCalculationResult(basePrice, baseAmount);
  }

  /** Result of base amount calculation. */
  public record BaseCalculationResult(int basePrice, int baseAmount) {}
}
