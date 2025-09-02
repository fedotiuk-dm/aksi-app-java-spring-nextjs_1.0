package com.aksi.service.game.util;

import java.util.HashMap;
import java.util.Map;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.PriceConfigurationEntity;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Utility class for common game calculation operations.
 * Reduces code duplication across different calculators.
 * Similar to PricingQueryUtils in pricing system.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class GameCalculationUtils {

  // Cache script engine for better performance
  private final ScriptEngineManager scriptManager = new ScriptEngineManager();

  /**
   * Build standard variable context for formula calculations.
   *
   * @param config Price configuration
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @return Map of variables for formula substitution
   */
  public Map<String, Object> buildStandardVariableContext(
      PriceConfigurationEntity config, int fromLevel, int toLevel) {

    Map<String, Object> variables = new HashMap<>();

    int levelDiff = toLevel - fromLevel;
    variables.put("basePrice", config.getBasePrice());
    variables.put("pricePerLevel", config.getPricePerLevel());
    variables.put("levelDiff", levelDiff);
    variables.put("fromLevel", fromLevel);
    variables.put("toLevel", toLevel);

    return variables;
  }

  /**
   * Add custom variables from JSON configuration to context.
   *
   * @param variables Existing variable map to extend
   * @param variablesNode JSON node containing custom variables
   */
  public void addCustomVariables(Map<String, Object> variables, JsonNode variablesNode) {
    if (variablesNode == null || !variablesNode.isObject()) {
      return;
    }

    variablesNode.fieldNames().forEachRemaining(fieldName -> {
      JsonNode valueNode = variablesNode.get(fieldName);
      Object value = convertJsonNodeToValue(valueNode);
      variables.put(fieldName, value);
    });
  }

  /**
   * Convert JsonNode to appropriate Java type.
   *
   * @param valueNode JSON node to convert
   * @return Converted value (Integer, Double, Boolean, or String)
   */
  private Object convertJsonNodeToValue(JsonNode valueNode) {
    if (valueNode.isInt()) {
      return valueNode.asInt();
    } else if (valueNode.isDouble()) {
      return valueNode.asDouble();
    } else if (valueNode.isBoolean()) {
      return valueNode.asBoolean();
    } else {
      return valueNode.asText();
    }
  }

  /**
   * Replace variables in expression with their string values.
   *
   * @param expression Original expression
   * @param variables Map of variables to substitute
   * @return Expression with variables replaced
   */
  public String replaceVariables(String expression, Map<String, Object> variables) {
    String result = expression;

    for (Map.Entry<String, Object> entry : variables.entrySet()) {
      String placeholder = entry.getKey();
      String value = entry.getValue().toString();
      result = result.replace(placeholder, value);
    }

    return result;
  }

  /**
   * Evaluate mathematical expression using JavaScript engine.
   * For production, consider using SpEL (Spring Expression Language).
   *
   * @param expression Mathematical expression to evaluate
   * @return Evaluation result as integer
   * @throws IllegalArgumentException if evaluation fails
   */
  public int evaluateExpression(String expression) {
    try {
      // Remove spaces for cleaner processing
      expression = expression.replaceAll("\\s+", "");

      // Use JavaScript engine for mathematical evaluation
      ScriptEngine engine = scriptManager.getEngineByName("javascript");
      if (engine != null) {
        Object result = engine.eval(expression);
        return ((Number) result).intValue();
      }

      // Fallback: try to parse as simple number
      return Integer.parseInt(expression);

    } catch (ScriptException | NumberFormatException e) {
      log.error("Error evaluating expression: {}", expression, e);
      throw new IllegalArgumentException("Expression evaluation failed: " + e.getMessage(), e);
    }
  }

  /**
   * Check if level range is invalid (toLevel <= fromLevel).
   *
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @return true if invalid, false otherwise
   */
  public boolean isInvalidLevelRange(int fromLevel, int toLevel) {
    return toLevel <= fromLevel;
  }

  /**
   * Calculate level difference with validation.
   *
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @return Level difference
   * @throws IllegalArgumentException if range is invalid
   */
  public int calculateLevelDifference(int fromLevel, int toLevel) {
    if (isInvalidLevelRange(fromLevel, toLevel)) {
      throw new IllegalArgumentException(
          String.format("Invalid level range: %d to %d", fromLevel, toLevel));
    }
    return toLevel - fromLevel;
  }

  /**
   * Format price as currency string for logging/debugging.
   *
   * @param priceInCents Price in kopiykas/cents
   * @return Formatted currency string
   */
  public String formatPrice(int priceInCents) {
    return String.format("$%.2f", priceInCents / 100.0);
  }


}
