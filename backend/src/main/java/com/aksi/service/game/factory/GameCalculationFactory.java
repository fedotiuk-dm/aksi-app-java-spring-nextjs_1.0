package com.aksi.service.game.factory;

import org.springframework.stereotype.Component;

import com.aksi.service.game.util.GameCalculationUtils;

import lombok.RequiredArgsConstructor;

/**
 * Factory for creating game calculation-related objects.
 * Similar to PricingFactory, provides consistent object creation
 * and reduces code duplication.
 */
@Component
@RequiredArgsConstructor
public class GameCalculationFactory {

  private final GameCalculationUtils utils;

  /**
   * Create error message for calculation failures.
   *
   * @param operation Operation that failed
   * @param reason Reason for failure
   * @param fallbackValue Fallback value used
   * @return Formatted error message
   */
  public String createCalculationErrorMessage(String operation, String reason, int fallbackValue) {
    return String.format("%s failed: %s. Using fallback value: %s",
        operation, reason, utils.formatPrice(fallbackValue));
  }

}
