package com.aksi.service.game.calculation;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.aksi.domain.pricing.PriceModifierEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * Calculator for game-specific modifiers (similar to ModifierCalculator in pricing).
 * Handles percentage, fixed, formula, multiplier, and discount modifiers
 * for game boosting services.
 */
@Component
@Slf4j
public class GameModifierCalculator {

  /**
   * Apply all game-specific modifiers to base price.
   *
   * @param applicableModifiers List of modifiers to apply
   * @param basePrice Base price before modifiers
   * @param context Calculation context with game/service/level information
   * @return Modifier calculation result
   */
  public GameModifierCalculationResult calculate(
      List<PriceModifierEntity> applicableModifiers, int basePrice, Map<String, Object> context) {

    if (applicableModifiers.isEmpty()) {
      log.debug("No modifiers to apply");
      return new GameModifierCalculationResult(0, basePrice);
    }

    int totalAdjustments = 0;

    for (PriceModifierEntity modifier : applicableModifiers) {
      int adjustment = calculateModifierAdjustment(modifier, basePrice, context);
      totalAdjustments += adjustment;

      log.debug("Applied modifier '{}': type={}, adjustment={}",
          modifier.getCode(), modifier.getType(), adjustment);
    }

    int finalPrice = basePrice + totalAdjustments;

    log.debug("Total modifier adjustments: {} modifiers applied, total adjustment: {}, final: {}",
        applicableModifiers.size(), totalAdjustments, finalPrice);

    return new GameModifierCalculationResult(totalAdjustments, finalPrice);
  }

  /**
   * Calculate adjustment for a single modifier based on its type.
   *
   * @param modifier The modifier to apply
   * @param basePrice Base price for calculation
   * @param context Calculation context
   * @return Adjustment amount in kopiykas
   */
  private int calculateModifierAdjustment(
      PriceModifierEntity modifier, int basePrice, Map<String, Object> context) {

    return switch (modifier.getType()) {
      case PERCENTAGE -> calculatePercentageAdjustment(modifier, basePrice);
      case FIXED -> calculateFixedAdjustment(modifier, context);
      case FORMULA -> calculateFormulaAdjustment(modifier, context);
      case MULTIPLIER -> calculateMultiplierAdjustment(modifier, basePrice);
      case DISCOUNT -> calculateDiscountAdjustment(modifier, basePrice);
    };
  }

  /**
   * Calculate percentage-based adjustment using integer arithmetic.
   * Value is stored as basis points (e.g., 1550 = 15.5%).
   */
  private int calculatePercentageAdjustment(PriceModifierEntity modifier, int basePrice) {
    // Calculate: (basePrice * modifierValue) / 10000 to handle basis points
    // Using long to avoid overflow during multiplication
    long result = (long) basePrice * modifier.getValue() / 10000;

    log.debug("Percentage adjustment: {}% of {} = {}",
        modifier.getValue() / 100.0, basePrice, (int) result);

    return (int) result;
  }

  /**
   * Calculate fixed adjustment based on context (e.g., per level).
   * For level-based services, multiplies by level difference.
   */
  private int calculateFixedAdjustment(PriceModifierEntity modifier, Map<String, Object> context) {
    // Extract level difference from context with null safety
    Object levelDiffObj = context.get("levelDifference");
    if (!(levelDiffObj instanceof Integer)) {
      log.warn("Invalid levelDifference in context: {} (type: {})",
          levelDiffObj, levelDiffObj != null ? levelDiffObj.getClass() : "null");
      return modifier.getValue(); // fallback to single unit
    }

    int levelDifference = (Integer) levelDiffObj;
    int adjustment = modifier.getValue() * Math.max(1, levelDifference);

    log.debug("Fixed adjustment: {} per level × {} levels = {}",
        modifier.getValue(), levelDifference, adjustment);

    return adjustment;
  }

  /**
   * Calculate formula-based adjustment using context values.
   * Simple implementation - for production, use proper formula evaluator.
   */
  private int calculateFormulaAdjustment(PriceModifierEntity modifier, Map<String, Object> context) {
    // Extract level difference from context with null safety
    Object levelDiffObj = context.get("levelDifference");
    if (!(levelDiffObj instanceof Integer)) {
      log.warn("Invalid levelDifference in context for formula: {} (type: {})",
          levelDiffObj, levelDiffObj != null ? levelDiffObj.getClass() : "null");
      return modifier.getValue(); // fallback
    }

    int levelDifference = (Integer) levelDiffObj;
    int adjustment = modifier.getValue() * Math.max(1, levelDifference);

    log.debug("Formula adjustment: {} × {} levels = {} (simplified implementation)",
        modifier.getValue(), levelDifference, adjustment);

    return adjustment;
  }

  /**
   * Calculate multiplier-based adjustment (e.g., 1.5x = +50%).
   * Multiplier is stored as basis points (e.g., 150 = 1.5x).
   */
  private int calculateMultiplierAdjustment(PriceModifierEntity modifier, int basePrice) {
    // Calculate additional amount: (basePrice * (multiplier - 100)) / 100
    if (modifier.getValue() <= 100) {
      log.debug("Multiplier {} <= 1.0, no adjustment", modifier.getValue() / 100.0);
      return 0; // No adjustment for multipliers <= 1.0
    }

    long additionalAmount = (long) basePrice * (modifier.getValue() - 100) / 100;

    log.debug("Multiplier adjustment: {}x of {} = additional {}",
        modifier.getValue() / 100.0, basePrice, (int) additionalAmount);

    return (int) additionalAmount;
  }

  /**
   * Calculate discount adjustment (reduces price).
   * Discount is stored as basis points (e.g., 500 = 5% discount).
   */
  private int calculateDiscountAdjustment(PriceModifierEntity modifier, int basePrice) {
    // Calculate discount amount: (basePrice * discountValue) / 10000
    long discountAmount = (long) basePrice * modifier.getValue() / 10000;
    int adjustment = -(int) discountAmount; // Negative because it's a discount

    log.debug("Discount adjustment: {}% of {} = {}",
        modifier.getValue() / 100.0, basePrice, adjustment);

    return adjustment;
  }

  /**
   * Result of game modifier calculation.
   *
   * @param totalAdjustment Total adjustment amount from all modifiers
   * @param finalPrice Final price after applying all modifiers
   */
  public record GameModifierCalculationResult(
      int totalAdjustment,
      int finalPrice) {}


}
