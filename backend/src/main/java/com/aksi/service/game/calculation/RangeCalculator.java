package com.aksi.service.game.calculation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.service.game.factory.GameCalculationFactory;
import com.aksi.service.game.util.GameCalculationUtils;
import com.aksi.service.game.util.SharedJsonUtils;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.extern.slf4j.Slf4j;

/**
 * Calculator for RANGE pricing: different prices for different level ranges.
 * Example: Apex Legends Bronze IV ($8), Bronze III ($8), Bronze I ($10)
 * JSON format: {"ranges": [{"from": 1, "to": 5, "price": 800}, {"from": 6, "to": 10, "price": 1000}]}
 */
@Component
@Slf4j
public class RangeCalculator extends BaseCalculator {

  public RangeCalculator(GameCalculationUtils utils, GameCalculationFactory factory, SharedJsonUtils jsonUtils) {
    super(utils, factory, jsonUtils);
  }

  @Override
  protected GamePriceCalculationResult performCalculation(PriceConfigurationEntity config, int fromLevel, int toLevel) {
    JsonNode formulaNode = parseFormula(config);
    if (formulaNode == null) {
      return createErrorResult("Range parsing", "No formula provided", config.getBasePrice());
    }

    JsonNode rangesNode = formulaNode.get("ranges");
    if (rangesNode == null || !rangesNode.isArray()) {
      return createErrorResult("Range structure", "Invalid range format", config.getBasePrice());
    }

    List<RangeApplication> appliedRanges = new ArrayList<>();
    int totalPrice = calculateRangePrices(fromLevel, toLevel, rangesNode, config, appliedRanges);

    log.debug("Range calculation: {} ranges applied, total={}",
        appliedRanges.size(), utils.formatPrice(totalPrice));

    // Use the first applied range for the result (simplified)
    int levelDifference = utils.calculateLevelDifference(fromLevel, toLevel);
    RangeApplication firstRange = appliedRanges.isEmpty() ?
        new RangeApplication(fromLevel, toLevel, config.getPricePerLevel(), levelDifference) :
        appliedRanges.getFirst();

    return createRangeSuccessResult(config.getBasePrice(), firstRange, totalPrice);
  }

  private int calculateRangePrices(int fromLevel, int toLevel, JsonNode rangesNode,
      PriceConfigurationEntity config, List<RangeApplication> appliedRanges) {

    int totalPrice = config.getBasePrice();

    for (int level = fromLevel; level < toLevel; level++) {
      int levelPrice = findPriceForLevel(level, rangesNode, config.getPricePerLevel());
      totalPrice += levelPrice;
      updateAppliedRanges(appliedRanges, level, levelPrice);
    }

    return totalPrice;
  }

  private int findPriceForLevel(int level, JsonNode rangesNode, int fallbackPrice) {
    for (JsonNode rangeNode : rangesNode) {
      int rangeFrom = rangeNode.get("from").asInt();
      int rangeTo = rangeNode.get("to").asInt();
      int rangePrice = rangeNode.get("price").asInt();

      if (level >= rangeFrom && level <= rangeTo) {
        return rangePrice;
      }
    }
    return fallbackPrice;
  }

  private void updateAppliedRanges(List<RangeApplication> appliedRanges, int level, int price) {
    appliedRanges.add(new RangeApplication(level, level, price, 1));
  }

  /**
   * Result of range calculation with detailed breakdown.
   *
   * @param basePrice Base price from configuration
   * @param appliedRanges List of ranges that were applied
   * @param totalPrice Final calculated price
   * @param calculationNote Note about the calculation process
   */
  public record RangeCalculationResult(
      int basePrice,
      List<RangeApplication> appliedRanges,
      int totalPrice,
      String calculationNote) {}

  /**
   * Single range application in the calculation.
   *
   * @param from Starting level of range
   * @param to Ending level of range
   * @param pricePerLevel Price per level in this range
   * @param levelsApplied Number of levels this range was applied to
   */
  public record RangeApplication(int from, int to, int pricePerLevel, int levelsApplied) {}
}
