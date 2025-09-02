package com.aksi.service.pricing.calculation;

import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.DiscountType;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricelist.dto.PriceListItemInfo;
import com.aksi.service.pricing.PriceCalculationService;
import com.aksi.service.pricing.factory.PricingFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Calculator for discounts following OrderWizard step 7: 7. Discounts (if applicable and allowed
 * for category)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DiscountCalculator {

  private final PriceCalculationService priceCalculationService;
  private final PricingFactory factory;

  /** Calculate discount amount. Step 7 of OrderWizard pricing logic. */
  public DiscountCalculationResult calculate(
      int subtotal,
      int urgencyAmount,
      GlobalPriceModifiers globalModifiers,
      PriceListItemInfo priceListItem) {

    if (globalModifiers == null || !shouldApplyDiscount(globalModifiers.getDiscountType())) {
      log.debug("No discount applied");
      return new DiscountCalculationResult(null, 0, false);
    }

    DiscountType discountType = globalModifiers.getDiscountType();

    // Check if discount is eligible for this category
    boolean discountEligible = checkDiscountEligibility(priceListItem);
    if (!discountEligible) {
      log.debug(
          "Discount {} not eligible for category {}",
          discountType.getValue(),
          priceListItem.getCategoryCode().getValue());
      return new DiscountCalculationResult(null, 0, false);
    }

    // Check discount percentage
    Integer discountPercentage = globalModifiers.getDiscountPercentage();
    if (discountPercentage == null || discountPercentage <= 0) {
      log.debug("Invalid discount percentage: {}", discountPercentage);
      return new DiscountCalculationResult(null, 0, true);
    }

    // Calculate discount on (subtotal + urgency)
    int discountableAmount = subtotal + urgencyAmount;
    int discountAmount =
        priceCalculationService.calculateDiscountAmount(
            discountableAmount, discountType, discountPercentage);

    if (discountAmount <= 0) {
      log.debug("Discount amount is zero or negative");
      return new DiscountCalculationResult(null, 0, true);
    }

    AppliedModifier discountModifier =
        factory.createDiscountModifier(discountType, discountAmount, discountPercentage);

    log.debug(
        "Applied discount: {} ({}%) on {} = {}",
        discountType.getValue(), discountPercentage, discountableAmount, discountAmount);

    return new DiscountCalculationResult(discountModifier, discountAmount, true);
  }

  private boolean shouldApplyDiscount(DiscountType discountType) {
    return discountType != null && discountType != DiscountType.NONE;
  }

  private boolean checkDiscountEligibility(PriceListItemInfo priceListItem) {
    String categoryCodeValue = priceListItem.getCategoryCode().getValue();
    return priceCalculationService.isDiscountApplicableToCategory(categoryCodeValue);
  }

  /** Result of discount calculation. */
  public record DiscountCalculationResult(
      AppliedModifier discountModifier, int discountAmount, boolean discountEligible) {}
}
