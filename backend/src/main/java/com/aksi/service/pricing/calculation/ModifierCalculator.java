package com.aksi.service.pricing.calculation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.api.pricing.dto.AppliedModifier;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PricingModifierType;
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
    int effectiveBaseAmount = baseAmount;

    if (item.getModifierCodes() == null || item.getModifierCodes().isEmpty()) {
      int subtotal = baseAmount + modifiersTotal;
      log.debug("No modifiers applied, subtotal = {}", subtotal);
      return new ModifierCalculationResult(appliedModifiers, modifiersTotal, subtotal);
    }

    // Load active modifiers
    List<PriceModifierEntity> modifiers = guard.loadActiveModifiers(item.getModifierCodes());

    // Pass 1: handle FORMULA (base override) if present
    for (PriceModifierEntity modifier : modifiers) {
      if (modifier.getType() == PricingModifierType.FORMULA) {
        // Interpret value as absolute per-unit price override (in kopiykas)
        int overridePerUnit = modifier.getValue() != null ? modifier.getValue() : 0;
        int overrideAmount = overridePerUnit * item.getQuantity();
        int delta = overrideAmount - baseAmount; // adjust to reach new base

        AppliedModifier applied = factory.createAppliedModifier(modifier, delta);
        appliedModifiers.add(applied);
        modifiersTotal += delta;
        effectiveBaseAmount = baseAmount + delta;

        log.debug(
            "Applied base override (FORMULA): perUnit={}, qty={}, delta={}, effectiveBaseAmount={}",
            overridePerUnit,
            item.getQuantity(),
            delta,
            effectiveBaseAmount);
        break; // only first FORMULA considered
      }
    }

    // Pass 2: handle other modifiers based on effective base
    for (PriceModifierEntity modifier : modifiers) {
      if (modifier.getType() == PricingModifierType.FORMULA) {
        continue;
      }
      int modifierAmount =
          priceCalculationService.calculateModifierAmount(
              modifier, effectiveBaseAmount, item.getQuantity());

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
