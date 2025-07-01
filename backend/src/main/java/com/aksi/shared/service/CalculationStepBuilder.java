package com.aksi.shared.service;

import com.aksi.api.item.dto.CalculationStep;
import com.aksi.domain.item.entity.PriceModifierEntity;

/**
 * Утилітарний клас для створення CalculationStep. Усуває дублювання коду між різними
 * калькуляторами.
 */
public final class CalculationStepBuilder {

  private CalculationStepBuilder() {
    // Утилітарний клас
  }

  /**
   * Створює крок розрахунку для модифікатора.
   *
   * @param modifier модифікатор ціни
   * @param changeAmount зміна ціни
   * @param currentPrice поточна ціна після застосування
   * @param isJexl чи це JEXL модифікатор
   * @return створений CalculationStep
   */
  public static CalculationStep createStep(
      PriceModifierEntity modifier, Double changeAmount, Double currentPrice, boolean isJexl) {

    CalculationStep step = new CalculationStep();
    step.setStep(modifier.getCode());
    step.setDescription(formatDescription(modifier, changeAmount, isJexl));
    step.setAmount(changeAmount);
    step.setRunningTotal(currentPrice);

    return step;
  }

  /** Створює крок розрахунку для простого модифікатора. */
  public static CalculationStep createStep(
      PriceModifierEntity modifier, Double changeAmount, Double currentPrice) {
    return createStep(modifier, changeAmount, currentPrice, false);
  }

  /** Створює крок розрахунку для JEXL модифікатора. */
  public static CalculationStep createJexlStep(
      PriceModifierEntity modifier, Double changeAmount, Double currentPrice) {
    return createStep(modifier, changeAmount, currentPrice, true);
  }

  /** Форматує опис кроку розрахунку. */
  private static String formatDescription(
      PriceModifierEntity modifier, Double changeAmount, boolean isJexl) {
    String sign = changeAmount >= 0 ? "+" : "";
    String suffix = isJexl ? " (JEXL)" : "";
    return String.format("%s: %s%.2f грн%s", modifier.getName(), sign, changeAmount, suffix);
  }
}
