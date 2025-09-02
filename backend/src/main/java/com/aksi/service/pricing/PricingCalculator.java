package com.aksi.service.pricing;

import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricelist.dto.PriceListItemInfo;
import com.aksi.service.pricing.calculation.BaseAmountCalculator;
import com.aksi.service.pricing.calculation.DiscountCalculator;
import com.aksi.service.pricing.calculation.ModifierCalculator;
import com.aksi.service.pricing.calculation.UrgencyCalculator;
import com.aksi.service.pricing.factory.PricingFactory;
import com.aksi.service.pricing.guard.PricingGuard;
import com.aksi.service.pricing.util.PricingQueryUtils;
import com.aksi.service.pricing.validator.PricingValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Core calculator component implementing OrderWizard pricing logic. Handles individual item price
 * calculations following the 8-step process: 1. Base price (from price list + color adjustments) 2.
 * Color-specific pricing (black/colored items) 3. Special modifiers (may replace base price) 4.
 * Multiplier modifiers (coefficients for material, condition, additional services) 5. Fixed
 * services (e.g., button sewing) 6. Urgency (if selected): +50% or +100% to intermediate sum 7.
 * Discounts (if applicable and allowed for category) 8. Rounding to kopiykas (2 decimal places)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PricingCalculator {

  // New specialized calculation components
  private final BaseAmountCalculator baseAmountCalculator;
  private final ModifierCalculator modifierCalculator;
  private final UrgencyCalculator urgencyCalculator;
  private final DiscountCalculator discountCalculator;

  // Supporting components
  private final PricingValidator validator;
  private final PricingGuard guard;
  private final PricingFactory factory;
  private final PricingQueryUtils utils;

  /** Calculate price for a single item following OrderWizard 8-step process. */
  public CalculatedItemPrice calculateItemPrice(
      PriceCalculationItem item,
      PriceListItemInfo priceListItem,
      GlobalPriceModifiers globalModifiers) {

    log.debug(
        "Calculating price for item: {} (ID: {})", priceListItem.getName(), priceListItem.getId());

    // Validate inputs
    validator.validateQuantity(item.getQuantity(), "Item quantity");
    guard.ensureQuantityValid(item.getQuantity());
    guard.ensurePriceListItemValid(priceListItem);

    if (item.getModifierCodes() != null) {
      validator.validateModifierCodes(item.getModifierCodes());
    }

    // Step 1-2: Base amount calculation
    var baseResult = baseAmountCalculator.calculate(item, priceListItem);

    // Step 3-5: Modifier calculation
    var modifierResult = modifierCalculator.calculate(item, baseResult.baseAmount());

    // Step 6: Urgency calculation (only if express available for item or NORMAL)
    var urgencyResult =
        urgencyCalculator.calculate(modifierResult.subtotal(), globalModifiers, priceListItem);

    // Step 7: Discount calculation
    var discountResult =
        discountCalculator.calculate(
            modifierResult.subtotal(),
            urgencyResult.urgencyAmount(),
            globalModifiers,
            priceListItem);

    // Step 8: Calculate final amount
    int finalAmount =
        utils.calculateFinalAmount(
            baseResult.baseAmount(),
            modifierResult.modifiersTotal(),
            urgencyResult.urgencyAmount(),
            discountResult.discountAmount());

    // Build complete result using factory
    CalculatedItemPrice result =
        factory.createCompleteCalculatedItemPrice(
            item,
            priceListItem,
            baseResult.basePrice(),
            modifierResult.appliedModifiers(),
            modifierResult.modifiersTotal(),
            modifierResult.subtotal(),
            urgencyResult.urgencyModifier(),
            discountResult.discountModifier(),
            discountResult.discountEligible(),
            finalAmount);

    log.debug(
        "Item price calculated: base={}, modifiers={}, urgency={}, discount={}, final={}",
        baseResult.baseAmount(),
        modifierResult.modifiersTotal(),
        urgencyResult.urgencyAmount(),
        discountResult.discountAmount(),
        finalAmount);

    return result;
  }

  // All calculation logic has been moved to specialized components:
  // - BaseAmountCalculator: handles steps 1-2 (base price + color)
  // - ModifierCalculator: handles steps 3-5 (item-specific modifiers)
  // - UrgencyCalculator: handles step 6 (urgency surcharge)
  // - DiscountCalculator: handles step 7 (discount calculation)
  // - PricingQueryUtils: handles step 8 (final amount calculation)
}
