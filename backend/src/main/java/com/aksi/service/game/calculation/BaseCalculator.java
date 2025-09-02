package com.aksi.service.game.calculation;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.service.game.factory.GameCalculationFactory;
import com.aksi.service.game.util.GameCalculationUtils;
import com.aksi.service.game.util.SharedJsonUtils;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Base calculator class providing common functionality for all calculation types.
 * Reduces code duplication and ensures consistent behavior across calculators.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public abstract class BaseCalculator implements Calculator {

  protected final GameCalculationUtils utils;
  protected final GameCalculationFactory factory;
  protected final SharedJsonUtils jsonUtils;

  /**
   * Abstract method for calculation logic specific to each calculator type.
   */
  protected abstract GamePriceCalculationResult performCalculation(
      PriceConfigurationEntity config, int fromLevel, int toLevel);

  /**
   * Template method providing consistent calculation flow for all calculators.
   */
  @Override
  public GamePriceCalculationResult calculate(PriceConfigurationEntity config, int fromLevel, int toLevel) {
    try {
      // 1. Validate level range using utils
      if (utils.isInvalidLevelRange(fromLevel, toLevel)) {
        log.warn("Invalid level range: {} to {}", fromLevel, toLevel);
        return GamePriceCalculationResult.error(
            factory.createCalculationErrorMessage("Level range validation", "Invalid range", 0),
            config.getBasePrice());
      }

      // 2. Delegate to specific calculation logic
      return performCalculation(config, fromLevel, toLevel);

    } catch (Exception e) {
      log.error("Calculation failed for config {}: {}", config.getId(), e.getMessage(), e);
      return GamePriceCalculationResult.error(
          factory.createCalculationErrorMessage("Calculation", e.getMessage(), config.getBasePrice()),
          config.getBasePrice());
    }
  }

  /**
   * Parse formula JSON with consistent error handling using SharedJsonUtils.
   */
  protected JsonNode parseFormula(PriceConfigurationEntity config) {
    if (config.getCalculationFormula() == null || config.getCalculationFormula().trim().isEmpty()) {
      return null;
    }
    return jsonUtils.parseJson(config.getCalculationFormula());
  }

  /**
   * Create success result for linear calculations.
   */
  protected GamePriceCalculationResult createLinearSuccessResult(
      int basePrice, int levelPrice, int totalPrice) {

    return GamePriceCalculationResult.fromLinear(
        new LinearCalculator.LinearCalculationResult(basePrice, levelPrice, totalPrice));
  }

  /**
   * Create success result for range calculations.
   */
  protected GamePriceCalculationResult createRangeSuccessResult(
      int basePrice, RangeCalculator.RangeApplication rangeApp, int totalPrice) {

    return GamePriceCalculationResult.fromRange(
        new RangeCalculator.RangeCalculationResult(basePrice, List.of(rangeApp), totalPrice, "Success"));
  }

  /**
   * Create success result for formula calculations.
   */
  protected GamePriceCalculationResult createFormulaSuccessResult(
      int basePrice, String expression, String processedExpression,
      Map<String, Object> variables, int totalPrice) {

    return GamePriceCalculationResult.fromFormula(
        new FormulaCalculator.FormulaCalculationResult(basePrice, expression,
            processedExpression, variables, totalPrice, "Success"));
  }

  /**
   * Create success result for time-based calculations.
   */
  protected GamePriceCalculationResult createTimeBasedSuccessResult(
      int basePrice, int hourlyRate, int estimatedHours, double complexityMultiplier,
      int baseTimePrice, int complexityAdjustment, int totalPrice) {

    return GamePriceCalculationResult.fromTimeBased(
        new TimeBasedCalculator.TimeBasedCalculationResult(basePrice, hourlyRate, 8, 1,
            estimatedHours, complexityMultiplier, baseTimePrice, complexityAdjustment, totalPrice, "Success"));
  }

  /**
   * Create error result using factory.
   */
  protected GamePriceCalculationResult createErrorResult(String operation, String reason, int fallbackPrice) {
    return GamePriceCalculationResult.error(
        factory.createCalculationErrorMessage(operation, reason, fallbackPrice),
        fallbackPrice);
  }

}
