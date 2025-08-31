package com.aksi.service.game.util;

import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.CalculationBreakdown;
import com.aksi.api.game.dto.CalculationResult;
import com.aksi.domain.game.GameEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * Builder utility for creating CalculationResult objects with consistent structure. Eliminates
 * duplicate result building code across services.
 */
@Component
@Slf4j
public class CalculationResultBuilder {

  /**
   * Build calculation result with all required fields.
   *
   * @param totalPrice Total calculated price in kopiykas
   * @param basePrice Base price in kopiykas
   * @param modifiers List of applied modifiers
   * @param modifiersTotal Total amount from modifiers in kopiykas
   * @param levelDifference Number of levels/ranks to boost
   * @param pricePerLevel Price per level/rank in kopiykas
   * @param game Game entity for context
   * @return Built CalculationResult
   */
  public CalculationResult build(
      int totalPrice,
      int basePrice,
      int difficultyMultiplier,
      int serviceMultiplier,
      int levelAdjustment,
      int totalAdjustment,
      GameEntity game) {

    // Build breakdown
    CalculationBreakdown breakdown = new CalculationBreakdown();
    breakdown.setBasePrice(basePrice);
    breakdown.setDifficultyMultiplier(difficultyMultiplier);
    breakdown.setServiceMultiplier(serviceMultiplier);
    breakdown.setLevelAdjustment(levelAdjustment);
    breakdown.setTotalAdjustment(totalAdjustment);

    // Build result
    CalculationResult result = new CalculationResult();
    result.setFinalPrice(totalPrice);
    result.setCurrency("USD");
    result.setBreakdown(breakdown);

    log.debug("Built calculation result: finalPrice={}, basePrice={}", totalPrice, basePrice);

    return result;
  }

  /**
   * Build calculation result with error information.
   *
   * @param game Game entity for context
   * @return CalculationResult with errors
   */
  public CalculationResult buildWithErrors(GameEntity game) {
    CalculationBreakdown breakdown = new CalculationBreakdown();
    breakdown.setBasePrice(0);
    breakdown.setDifficultyMultiplier(100);
    breakdown.setServiceMultiplier(100);
    breakdown.setTotalAdjustment(0);

    CalculationResult result = new CalculationResult();
    result.setFinalPrice(0);
    result.setCurrency("USD");
    result.setBreakdown(breakdown);

    log.debug("Built calculation result with errors for game: {}", game.getName());

    return result;
  }
}
