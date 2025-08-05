package com.aksi.service.pricing.calculation;

import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.CalculationTotals;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;

import lombok.RequiredArgsConstructor;

/** Component for calculating order totals */
@Component
@RequiredArgsConstructor
public class TotalsCalculator {

  private final PriceCalculationService priceCalculationService;

  /**
   * Calculate totals from list of calculated items
   *
   * @param items List of calculated item prices
   * @param globalModifiers Global modifiers (urgency, discount)
   * @return Calculation totals
   */
  public CalculationTotals calculate(
      List<CalculatedItemPrice> items, GlobalPriceModifiers globalModifiers) {

    // Calculate base totals
    int itemsSubtotal = items.stream().mapToInt(item -> item.getCalculations().getSubtotal()).sum();

    // Calculate urgency amount
    int urgencyAmount =
        items.stream()
            .mapToInt(
                item ->
                    item.getCalculations().getUrgencyModifier() != null
                        ? item.getCalculations().getUrgencyModifier().getAmount()
                        : 0)
            .sum();

    // Calculate discount amount
    int discountAmount =
        items.stream()
            .mapToInt(
                item ->
                    item.getCalculations().getDiscountModifier() != null
                        ? item.getCalculations().getDiscountModifier().getAmount()
                        : 0)
            .sum();

    // Calculate amount eligible for discount
    int discountApplicableAmount =
        items.stream()
            .mapToInt(
                item ->
                    Boolean.TRUE.equals(item.getCalculations().getDiscountEligible())
                        ? item.getCalculations().getSubtotal()
                        : 0)
            .sum();

    // Calculate total
    int total = items.stream().mapToInt(CalculatedItemPrice::getTotal).sum();

    // Build totals object
    CalculationTotals totals = new CalculationTotals();
    totals.setItemsSubtotal(itemsSubtotal);
    totals.setUrgencyAmount(urgencyAmount);
    totals.setDiscountAmount(discountAmount);
    totals.setDiscountApplicableAmount(discountApplicableAmount);
    totals.setTotal(total);

    // Set percentages from global modifiers
    if (globalModifiers != null) {
      if (globalModifiers.getUrgencyType() != null) {
        totals.setUrgencyPercentage(
            priceCalculationService.getUrgencyPercentage(globalModifiers.getUrgencyType()));
      }

      if (globalModifiers.getDiscountType() != null) {
        totals.setDiscountPercentage(
            priceCalculationService.getDiscountPercentage(
                globalModifiers.getDiscountType(), globalModifiers.getDiscountPercentage()));
      }
    }

    return totals;
  }
}
