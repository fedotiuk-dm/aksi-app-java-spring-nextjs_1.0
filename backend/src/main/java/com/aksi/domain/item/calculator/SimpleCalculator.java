package com.aksi.domain.item.calculator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.api.item.dto.CalculationStep;
import com.aksi.domain.item.entity.PriceModifierEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * Простий калькулятор для 90% випадків використання Обробляє PERCENTAGE та FIXED_AMOUNT
 * модифікатори ВИКОРИСТОВУЄ DTO CalculationStep (OpenAPI First!).
 */
@Component
@Slf4j
public class SimpleCalculator {

  /** Розрахувати ціну з простими модифікаторами. */
  public CalculationResult calculate(Double basePrice, List<PriceModifierEntity> modifiers) {
    log.debug(
        "Simple calculation for base price: {} with {} modifiers", basePrice, modifiers.size());

    List<CalculationStep> steps = new ArrayList<>();
    Double currentPrice = basePrice;

    // Застосувати кожен модифікатор послідовно
    for (PriceModifierEntity modifier : modifiers) {
      Double previousPrice = currentPrice;
      currentPrice = applyModifier(currentPrice, modifier);

      // Створити крок розрахунку (DTO!)
      CalculationStep step = new CalculationStep();
      step.setStep(modifier.getCode());
      step.setDescription(formatDescription(modifier, currentPrice - previousPrice));
      step.setAmount(currentPrice - previousPrice);
      step.setRunningTotal(currentPrice);

      steps.add(step);
      log.debug("Applied modifier {}: {} -> {}", modifier.getCode(), previousPrice, currentPrice);
    }

    return CalculationResult.builder()
        .basePrice(basePrice)
        .finalPrice(currentPrice)
        .totalModification(currentPrice - basePrice)
        .steps(steps)
        .success(true)
        .build();
  }

  /** Застосувати один модифікатор. */
  private Double applyModifier(Double currentPrice, PriceModifierEntity modifier) {
    // Використовуємо готовий метод з Entity
    return modifier.applyToPrice(currentPrice);
  }

  /** Сформатувати опис кроку. */
  private String formatDescription(PriceModifierEntity modifier, Double changeAmount) {
    String sign = changeAmount >= 0 ? "+" : "";
    return String.format("%s: %s%.2f грн", modifier.getName(), sign, changeAmount);
  }

  /** Перевірити чи може обробити модифікатор. */
  public boolean canHandle(PriceModifierEntity modifier) {
    return modifier.isPercentageModifier() || modifier.isFixedAmountModifier();
  }

  /** Перевірити чи може обробити всі модифікатори. */
  public boolean canHandleAll(List<PriceModifierEntity> modifiers) {
    return modifiers.stream().allMatch(this::canHandle);
  }
}
