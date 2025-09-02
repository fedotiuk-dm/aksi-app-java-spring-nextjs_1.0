package com.aksi.service.game.calculation;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.service.game.factory.GameCalculationFactory;
import com.aksi.service.game.util.GameCalculationUtils;
import com.aksi.service.game.util.SharedJsonUtils;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.extern.slf4j.Slf4j;

/**
 * Calculator for TIME_BASED pricing: hourlyRate × estimatedHours × complexity.
 * Example: Professional services, mentoring, coaching
 * JSON format: {
 *   "hourlyRate": 2000, // Rate in kopiykas ($20.00/hour)
 *   "baseHours": 8, // Base time estimate
 *   "hoursPerLevel": 1, // Additional hours per level
 *   "complexityMultiplier": 1.5, // Complexity adjustment
 *   "minimumHours": 1, // Minimum billable time
 *   "roundToHours": true // Round up to full hours
 * }
 */
@Component
@Slf4j
public class TimeBasedCalculator extends BaseCalculator {

  public TimeBasedCalculator(GameCalculationUtils utils, GameCalculationFactory factory, SharedJsonUtils jsonUtils) {
    super(utils, factory, jsonUtils);
  }

  /**
   * Calculate time-based price using hourly rates and time estimates.
   *
   * @param config Price configuration with calculationFormula containing time parameters
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @return Calculated price in kopiykas (cents)
   */
  @Override
  protected GamePriceCalculationResult performCalculation(PriceConfigurationEntity config, int fromLevel, int toLevel) {
    JsonNode formulaNode = parseFormula(config);
    if (formulaNode == null) {
      return createErrorResult("Time parsing", "No time configuration provided", config.getBasePrice());
    }

    // Extract time-based parameters with defaults
    int hourlyRate = formulaNode.path("hourlyRate").asInt(2000);
    int baseHours = formulaNode.path("baseHours").asInt(8);
    int hoursPerLevel = formulaNode.path("hoursPerLevel").asInt(1);
    double complexityMultiplier = formulaNode.path("complexityMultiplier").asDouble(1.0);
    int minimumHours = formulaNode.path("minimumHours").asInt(1);
    boolean roundToHours = formulaNode.path("roundToHours").asBoolean(true);

    // Calculate time estimates
    int levelDifference = utils.calculateLevelDifference(fromLevel, toLevel);
    int rawEstimatedHours = baseHours + (levelDifference * hoursPerLevel);
    int finalEstimatedHours = Math.max(minimumHours, rawEstimatedHours);

    // Apply rounding if requested
    if (roundToHours && finalEstimatedHours != rawEstimatedHours) {
      finalEstimatedHours = (int) (double) rawEstimatedHours;
      finalEstimatedHours = Math.max(minimumHours, finalEstimatedHours);
    }

    // Calculate pricing
    int baseTimePrice = hourlyRate * finalEstimatedHours;
    int complexityAdjustment = (int) (baseTimePrice * (complexityMultiplier - 1.0));
    int totalPrice = config.getBasePrice() + baseTimePrice + complexityAdjustment;

    log.debug("Time-based: {}h × ${}/h × {} = ${}",
        finalEstimatedHours, hourlyRate/100.0, complexityMultiplier, totalPrice/100.0);

    return createTimeBasedSuccessResult(config.getBasePrice(), hourlyRate, finalEstimatedHours,
        complexityMultiplier, baseTimePrice, complexityAdjustment, totalPrice);
  }

  /**
   * Result of time-based calculation with detailed breakdown.
   *
   * @param basePrice Base price from configuration
   * @param hourlyRate Rate per hour in kopiykas
   * @param baseHours Base time estimate in hours
   * @param hoursPerLevel Additional hours per level
   * @param estimatedHours Final estimated hours (after minimums and rounding)
   * @param complexityMultiplier Complexity adjustment factor
   * @param baseTimePrice Price before complexity adjustment (hours × rate)
   * @param complexityAdjustment Additional price due to complexity
   * @param totalPrice Final calculated price
   * @param calculationNote Note about the calculation process
   */
  public record TimeBasedCalculationResult(
      int basePrice,
      int hourlyRate,
      int baseHours,
      int hoursPerLevel,
      int estimatedHours,
      double complexityMultiplier,
      int baseTimePrice,
      int complexityAdjustment,
      int totalPrice,
      String calculationNote) {}
}
