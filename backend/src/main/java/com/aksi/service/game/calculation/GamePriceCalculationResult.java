package com.aksi.service.game.calculation;

import java.util.Map;

import com.aksi.api.game.dto.CalculationStatus;
import com.aksi.service.game.calculation.FormulaCalculator.FormulaCalculationResult;
import com.aksi.service.game.calculation.LinearCalculator.LinearCalculationResult;
import com.aksi.service.game.calculation.RangeCalculator.RangeCalculationResult;
import com.aksi.service.game.calculation.TimeBasedCalculator.TimeBasedCalculationResult;

/**
 * Unified result for all game price calculation types.
 * Provides common interface while preserving specific calculation details.
 * Similar to CalculatedItemPrice in pricing system.
 */
public record GamePriceCalculationResult(
    int basePrice,
    int totalPrice,
    String calculationType,
    String calculationMethod,
    boolean isSuccessful,
    String notes,
    CalculationStatus status,
    Map<String, Object> calculationDetails) {

  /**
   * Create result from LINEAR calculation.
   */
  public static GamePriceCalculationResult fromLinear(LinearCalculationResult linearResult) {
    return new GamePriceCalculationResult(
        linearResult.basePrice(),
        linearResult.totalPrice(),
        "LINEAR",
        "basePrice + (levelDiff × pricePerLevel)",
        true,
        String.format("Linear calculation: base=%d, levelPrice=%d",
            linearResult.basePrice(), linearResult.levelPrice()),
        CalculationStatus.SUCCESS,
        Map.of(
            "levelPrice", linearResult.levelPrice(),
            "calculationBreakdown", linearResult)
    );
  }

  /**
   * Create result from RANGE calculation.
   */
  public static GamePriceCalculationResult fromRange(RangeCalculationResult rangeResult) {
    return new GamePriceCalculationResult(
        rangeResult.basePrice(),
        rangeResult.totalPrice(),
        "RANGE",
        "basePrice + sum(rangePrice × levelsInRange)",
        true,
        String.format("Range calculation: %d ranges applied - %s",
            rangeResult.appliedRanges().size(), rangeResult.calculationNote()),
        CalculationStatus.SUCCESS,
        Map.of(
            "appliedRanges", rangeResult.appliedRanges(),
            "calculationNote", rangeResult.calculationNote(),
            "calculationBreakdown", rangeResult)
    );
  }

  /**
   * Create result from FORMULA calculation.
   */
  public static GamePriceCalculationResult fromFormula(FormulaCalculationResult formulaResult) {
    return new GamePriceCalculationResult(
        formulaResult.basePrice(),
        formulaResult.totalPrice(),
        "FORMULA",
        String.format("Custom formula: %s", formulaResult.originalExpression()),
        true,
        String.format("Formula calculation: '%s' → '%s' = %d",
            formulaResult.originalExpression(),
            formulaResult.processedExpression(),
            formulaResult.totalPrice()),
        CalculationStatus.SUCCESS,
        Map.of(
            "originalExpression", formulaResult.originalExpression(),
            "processedExpression", formulaResult.processedExpression(),
            "variables", formulaResult.variables(),
            "calculationNote", formulaResult.calculationNote(),
            "calculationBreakdown", formulaResult)
    );
  }

  /**
   * Create result from TIME_BASED calculation.
   */
  public static GamePriceCalculationResult fromTimeBased(TimeBasedCalculationResult timeResult) {
    return new GamePriceCalculationResult(
        timeResult.basePrice(),
        timeResult.totalPrice(),
        "TIME_BASED",
        String.format("%dh × $%.2f/h × %.1fx complexity",
            timeResult.estimatedHours(),
            timeResult.hourlyRate() / 100.0,
            timeResult.complexityMultiplier()),
        true,
        String.format("Time-based calculation: %d hours at $%.2f/hour with %.1fx complexity adjustment",
            timeResult.estimatedHours(),
            timeResult.hourlyRate() / 100.0,
            timeResult.complexityMultiplier()),
        CalculationStatus.SUCCESS,
        Map.of(
            "hourlyRate", timeResult.hourlyRate(),
            "estimatedHours", timeResult.estimatedHours(),
            "baseTimePrice", timeResult.baseTimePrice(),
            "complexityMultiplier", timeResult.complexityMultiplier(),
            "complexityAdjustment", timeResult.complexityAdjustment(),
            "calculationNote", timeResult.calculationNote(),
            "calculationBreakdown", timeResult)
    );
  }

  /**
   * Create error result when calculation fails.
   */
  public static GamePriceCalculationResult error(String errorMessage, int fallbackPrice) {
    return new GamePriceCalculationResult(
        fallbackPrice,
        fallbackPrice,
        "ERROR",
        "Error fallback",
        false,
        errorMessage,
        CalculationStatus.FAILED,
        Map.of("error", errorMessage)
    );
  }

  /**
   * Get formatted price as currency string.
   */
  public String getFormattedPrice() {
    return String.format("$%.2f", totalPrice / 100.0);
  }

  /**
   * Get calculation summary for logging/debugging.
   */
  public String getSummary() {
    return String.format("[%s] %s → %s (%s)",
        calculationType, calculationMethod, getFormattedPrice(),
        isSuccessful ? "SUCCESS" : "ERROR");
  }

  /**
   * Check if this is a fallback calculation (when original method failed).
   */
  public boolean isFallback() {
    return notes != null && notes.contains("Fallback to linear");
  }

}
