package com.aksi.service.game.calculation;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.pricing.PriceModifierEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade for all calculator operations. Provides unified interface for price calculations
 * and modifiers following CQRS pattern.
 * This is the SINGLE ENTRY POINT for all calculator operations in the application.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CalculatorFacade {

  private final GamePriceCalculator gamePriceCalculator;
  private final GameModifierCalculator gameModifierCalculator;

  /**
   * Calculate complete price including base calculation and all applicable modifiers.
   *
   * @param config Price configuration
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @param applicableModifiers List of modifiers to apply
   * @param context Calculation context for modifier formulas
   * @return Complete calculation result with modifiers applied
   */
  public CompleteCalculationResult calculateCompletePrice(
      PriceConfigurationEntity config,
      int fromLevel,
      int toLevel,
      List<PriceModifierEntity> applicableModifiers,
      Map<String, Object> context) {

    log.debug("Starting complete price calculation: config={}, levels={}→{}, modifiers={}",
        config.getId(), fromLevel, toLevel, applicableModifiers.size());

    // 1. Calculate base price using appropriate calculator
    GamePriceCalculationResult baseResult = gamePriceCalculator.calculatePrice(config, fromLevel, toLevel);

    if (!baseResult.isSuccessful()) {
      log.warn("Base price calculation failed: {}", baseResult.notes());
      return CompleteCalculationResult.error(baseResult.notes(), config.getBasePrice());
    }

    int basePrice = baseResult.totalPrice();

    // 2. Apply modifiers
    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        gameModifierCalculator.calculate(applicableModifiers, basePrice, context);

    int finalPrice = modifierResult.finalPrice();
    int totalAdjustments = modifierResult.totalAdjustment();

    log.info("Complete calculation finished: base=${}, adjustments=${}, final=${}",
        basePrice / 100.0, totalAdjustments / 100.0, finalPrice / 100.0);

    return CompleteCalculationResult.success(
        baseResult, modifierResult.totalAdjustment(), finalPrice);
  }

  /**
   * Complete calculation result including base price and modifiers.
   *
   * @param baseResult Base price calculation result
   * @param totalAdjustments Total adjustments from modifiers
   * @param finalPrice Final price after all calculations
   */
  public record CompleteCalculationResult(
      boolean isSuccessful,
      String notes,
      GamePriceCalculationResult baseResult,
      int totalAdjustments,
      int finalPrice) {

    public static CompleteCalculationResult success(
        GamePriceCalculationResult baseResult,
        int totalAdjustments,
        int finalPrice) {

      return new CompleteCalculationResult(
          true,
          "Calculation completed successfully",
          baseResult,
          totalAdjustments,
          finalPrice);
    }

    public static CompleteCalculationResult error(String notes, int fallbackPrice) {
      return new CompleteCalculationResult(
          false,
          notes,
          GamePriceCalculationResult.error(notes, fallbackPrice),
          0,
          fallbackPrice);
    }
  }
}
