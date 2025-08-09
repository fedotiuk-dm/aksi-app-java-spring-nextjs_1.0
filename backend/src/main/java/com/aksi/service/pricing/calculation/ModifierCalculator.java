package com.aksi.service.pricing.calculation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.service.pricing.PriceCalculationService;
import com.aksi.service.pricing.factory.PricingFactory;
import com.aksi.service.pricing.guard.PricingGuard;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Calculator for item-specific modifiers following OrderWizard steps 3-5: 3. Special modifiers (may
 * replace base price) 4. Multiplier modifiers (coefficients for material, condition, additional
 * services) 5. Fixed services (e.g., button sewing)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ModifierCalculator {

  private final PriceCalculationService priceCalculationService;
  private final PricingGuard guard;
  private final PricingFactory factory;

  /** Apply all item-specific modifiers. Steps 3-5 of OrderWizard pricing logic. */
  public ModifierCalculationResult calculate(PriceCalculationItem item, int baseAmount) {
    List<AppliedModifier> appliedModifiers = new ArrayList<>();
    int modifiersTotal = 0;

    if (item.getModifierCodes() == null || item.getModifierCodes().isEmpty()) {
      int subtotal = baseAmount + modifiersTotal;
      log.debug("No modifiers applied, subtotal = {}", subtotal);
      return new ModifierCalculationResult(appliedModifiers, modifiersTotal, subtotal);
    }

    // Load active modifiers
    List<PriceModifierEntity> modifiers = guard.loadActiveModifiers(item.getModifierCodes());

    for (PriceModifierEntity modifier : modifiers) {
      // Calculate modifier amount based on type (percentage/fixed)
      int modifierAmount =
          priceCalculationService.calculateModifierAmount(modifier, baseAmount, item.getQuantity());

      AppliedModifier applied = factory.createAppliedModifier(modifier, modifierAmount);
      appliedModifiers.add(applied);
      modifiersTotal += modifierAmount;

      log.debug("Applied modifier: {} = {}", modifier.getCode(), modifierAmount);
    }

    int subtotal = baseAmount + modifiersTotal;
    log.debug("Subtotal after modifiers: {} + {} = {}", baseAmount, modifiersTotal, subtotal);

    return new ModifierCalculationResult(appliedModifiers, modifiersTotal, subtotal);
  }

  /** Result of modifier calculation. */
  public record ModifierCalculationResult(
      List<AppliedModifier> appliedModifiers, int modifiersTotal, int subtotal) {}
}
