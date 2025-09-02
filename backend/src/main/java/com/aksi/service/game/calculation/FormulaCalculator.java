package com.aksi.service.game.calculation;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.service.game.factory.GameCalculationFactory;
import com.aksi.service.game.util.GameCalculationUtils;
import com.aksi.service.game.util.SharedJsonUtils;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.extern.slf4j.Slf4j;

/**
 * Calculator for FORMULA pricing: custom mathematical expressions.
 * Example: Excel formulas like SUM(basePrice × levelDiff × complexity)
 * JSON format: {
 *   "expression": "basePrice + (levelDiff * pricePerLevel * multiplier)",
 *   "variables": {"multiplier": 1.5}
 * }
 */
@Component
@Slf4j
public class FormulaCalculator extends BaseCalculator {

  public FormulaCalculator(GameCalculationUtils utils, GameCalculationFactory factory, SharedJsonUtils jsonUtils) {
    super(utils, factory, jsonUtils);
  }

  @Override
  protected GamePriceCalculationResult performCalculation(PriceConfigurationEntity config, int fromLevel, int toLevel) {
    JsonNode formulaNode = parseFormula(config);
    if (formulaNode == null) {
      return createErrorResult("Formula parsing", "No formula provided", config.getBasePrice());
    }

    String expression = formulaNode.path("expression").asText();
    if (expression == null || expression.trim().isEmpty()) {
      return createErrorResult("Formula expression", "Empty expression", config.getBasePrice());
    }

    var variables = utils.buildStandardVariableContext(config, fromLevel, toLevel);
    utils.addCustomVariables(variables, formulaNode.get("variables"));

    String processedExpression = utils.replaceVariables(expression, variables);
    int result = utils.evaluateExpression(processedExpression);

    log.debug("Formula calculation: '{}' → '{}' = {}", expression, processedExpression, result);

    return createFormulaSuccessResult(config.getBasePrice(), expression, processedExpression, variables, result);
  }

  /**
   * Result of formula calculation with detailed breakdown.
   *
   * @param basePrice Base price from configuration
   * @param originalExpression Original formula expression
   * @param processedExpression Expression after variable substitution
   * @param variables All variables used in calculation
   * @param totalPrice Final calculated price
   * @param calculationNote Note about the calculation process
   */
  public record FormulaCalculationResult(
      int basePrice,
      String originalExpression,
      String processedExpression,
      Map<String, Object> variables,
      int totalPrice,
      String calculationNote) {}
}
