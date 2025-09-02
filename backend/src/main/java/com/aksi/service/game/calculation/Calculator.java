package com.aksi.service.game.calculation;

import com.aksi.domain.game.PriceConfigurationEntity;

/**
 * Common interface for all game price calculators.
 * Ensures consistent API across all calculation types.
 */
public interface Calculator {

  /**
   * Calculate price for game service using this calculator's logic.
   *
   * @param config Price configuration containing calculation parameters
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @return Calculation result with breakdown
   */
  GamePriceCalculationResult calculate(PriceConfigurationEntity config, int fromLevel, int toLevel);

  /**
   * Get the calculation type this calculator handles.
   *
   * @return Calculation type enum value
   */
  default String getCalculationType() {
    return this.getClass().getSimpleName().replace("Calculator", "").toUpperCase();
  }
}
