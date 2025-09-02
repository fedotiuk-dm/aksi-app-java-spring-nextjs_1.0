package com.aksi.service.game.calculation;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.PriceConfigurationEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Core game price calculator coordinating different calculation types.
 * Similar to PricingCalculator, this component delegates to specialized calculators
 * based on the configuration type.
 * Supports all calculation types from documentation:
 * - LINEAR: Simple price per level (WOW Classic, EFT)
 * - RANGE: Different prices for level ranges (Apex Legends)
 * - FORMULA: Custom mathematical expressions (Excel formulas)
 * - TIME_BASED: Hourly rates with complexity (Professional services)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class GamePriceCalculator {

  // Specialized calculation components
  private final LinearCalculator linearCalculator;
  private final RangeCalculator rangeCalculator;
  private final FormulaCalculator formulaCalculator;
  private final TimeBasedCalculator timeBasedCalculator;

  /**
   * Calculate game service price using appropriate calculator based on configuration type.
   *
   * @param config Price configuration with calculation type and parameters
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @return Calculated price result with breakdown
   */
  public GamePriceCalculationResult calculatePrice(
      PriceConfigurationEntity config, int fromLevel, int toLevel) {

    log.debug("Calculating game price: type={}, from={}, to={}, config={}",
        config.getCalculationType(), fromLevel, toLevel, config.getId());

    // Validate input levels
    if (toLevel <= fromLevel) {
      log.warn("Invalid level range: {} to {} (difference: {})", fromLevel, toLevel, toLevel - fromLevel);
      return GamePriceCalculationResult.error(
          "Invalid level range: target level must be greater than start level",
          config.getBasePrice());
    }

    // Delegate to appropriate calculator based on type
    GamePriceCalculationResult result = switch (config.getCalculationType()) {
      case LINEAR -> linearCalculator.calculate(config, fromLevel, toLevel);
      case RANGE -> rangeCalculator.calculate(config, fromLevel, toLevel);
      case FORMULA -> formulaCalculator.calculate(config, fromLevel, toLevel);
      case TIME_BASED -> timeBasedCalculator.calculate(config, fromLevel, toLevel);
    };

    log.info("Game price calculated: type={}, total=${}, method={}",
        config.getCalculationType(), result.totalPrice() / 100.0, result.calculationMethod());

    return result;
  }

}
