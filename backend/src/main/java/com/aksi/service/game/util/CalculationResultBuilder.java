package com.aksi.service.game.util;

import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.CalculationBreakdown;
import com.aksi.api.game.dto.CalculationResult;

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
   * @return Built CalculationResult
   */
  public CalculationResult build(
      int totalPrice,
      int basePrice,
      int difficultyMultiplier,
      int serviceMultiplier,
      int levelAdjustment,
      int totalAdjustment) {

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
}
