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

  /**
   * Create calculation success message for logging.
   *
   * @param calculationType Type of calculation performed
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @param result Final calculation result
   * @return Formatted success message
   */
  public String createCalculationSuccessMessage(
      String calculationType, int fromLevel, int toLevel, int result) {

    return String.format("%s calculation successful: levels %d→%d = %s",
        calculationType, fromLevel, toLevel, utils.formatPrice(result));
  }

  /**
   * Create calculation breakdown message for detailed logging.
   *
   * @param basePrice Base price before adjustments
   * @param adjustments Total adjustments applied
   * @param finalPrice Final price after adjustments
   * @return Formatted breakdown message
   */
  public String createCalculationBreakdownMessage(int basePrice, int adjustments, int finalPrice) {
    return String.format("Calculation breakdown: base=%s + adjustments=%s = final=%s",
        utils.formatPrice(basePrice),
        utils.formatPrice(adjustments),
        utils.formatPrice(finalPrice));
  }
}
