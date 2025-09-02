package com.aksi.service.game.calculation;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.service.game.factory.GameCalculationFactory;
import com.aksi.service.game.util.GameCalculationUtils;
import com.aksi.service.game.util.SharedJsonUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * Calculator for LINEAR pricing: basePrice + (levelDiff × pricePerLevel)
 * Example: WOW Classic $1.00 per level, EFT $8.00-$13.00 per level
 * This is the simplest and most common calculation type.
 */
@Component
@Slf4j
public class LinearCalculator extends BaseCalculator {

  public LinearCalculator(GameCalculationUtils utils, GameCalculationFactory factory, SharedJsonUtils jsonUtils) {
    super(utils, factory, jsonUtils);
  }

  @Override
  protected GamePriceCalculationResult performCalculation(PriceConfigurationEntity config, int fromLevel, int toLevel) {
    int levelDifference = utils.calculateLevelDifference(fromLevel, toLevel);
    int levelPrice = levelDifference * config.getPricePerLevel();
    int totalPrice = config.getBasePrice() + levelPrice;

    log.debug("Linear calculation: base={}, levels={} × {}/level = total={}",
        utils.formatPrice(config.getBasePrice()), levelDifference,
        utils.formatPrice(config.getPricePerLevel()), utils.formatPrice(totalPrice));

    return createLinearSuccessResult(config.getBasePrice(), levelPrice, totalPrice);
  }

  /**
   * Result of linear calculation with breakdown.
   *
   * @param basePrice Base price from configuration
   * @param levelPrice Price for all levels (levelDiff × pricePerLevel)
   * @param totalPrice Final calculated price (basePrice + levelPrice)
   */
  public record LinearCalculationResult(int basePrice, int levelPrice, int totalPrice) {}
}
