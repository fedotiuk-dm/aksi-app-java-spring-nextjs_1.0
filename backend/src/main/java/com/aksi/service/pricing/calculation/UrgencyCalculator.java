package com.aksi.service.pricing.calculation;

import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.UrgencyType;
import com.aksi.api.pricelist.dto.PriceListItemInfo;
import com.aksi.service.pricing.PriceCalculationService;
import com.aksi.service.pricing.factory.PricingFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Calculator for urgency surcharge following OrderWizard step 6: 6. Urgency (if selected): +50% or
 * +100% to intermediate sum
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UrgencyCalculator {

  private final PriceCalculationService priceCalculationService;
  private final PricingFactory factory;

  /** Calculate urgency surcharge. Step 6 of OrderWizard pricing logic. */
  public UrgencyCalculationResult calculate(
      int subtotal, GlobalPriceModifiers globalModifiers, PriceListItemInfo priceListItem) {
    if (globalModifiers == null || !shouldApplyUrgency(globalModifiers.getUrgencyType())) {
      log.debug("No urgency applied");
      return new UrgencyCalculationResult(null, 0);
    }

    // If express is not available for this item, ignore urgency
    if (priceListItem != null && Boolean.FALSE.equals(priceListItem.getExpressAvailable())) {
      log.debug("Express not available for item {}, ignoring urgency", priceListItem.getId());
      return new UrgencyCalculationResult(null, 0);
    }

    UrgencyType urgencyType = globalModifiers.getUrgencyType();
    int urgencyAmount = priceCalculationService.calculateUrgencyAmount(subtotal, urgencyType);

    if (urgencyAmount <= 0) {
      log.debug("Urgency amount is zero or negative");
      return new UrgencyCalculationResult(null, 0);
    }

    int urgencyPercentage = priceCalculationService.getUrgencyPercentage(urgencyType);
    AppliedModifier urgencyModifier =
        factory.createUrgencyModifier(urgencyType, urgencyAmount, urgencyPercentage);

    log.debug(
        "Applied urgency: {} ({}%) on {} = {}",
        urgencyType.getValue(), urgencyPercentage, subtotal, urgencyAmount);

    return new UrgencyCalculationResult(urgencyModifier, urgencyAmount);
  }

  // Backward-compatible overload (used in existing tests); delegates to new signature
  public UrgencyCalculationResult calculate(int subtotal, GlobalPriceModifiers globalModifiers) {
    return calculate(subtotal, globalModifiers, null);
  }

  private boolean shouldApplyUrgency(UrgencyType urgencyType) {
    return urgencyType != null && urgencyType != UrgencyType.NORMAL;
  }

  /** Result of urgency calculation. */
  public record UrgencyCalculationResult(AppliedModifier urgencyModifier, int urgencyAmount) {}
}
