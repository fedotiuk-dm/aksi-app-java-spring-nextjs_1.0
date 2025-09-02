package com.aksi.service.game.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.aksi.exception.ConflictException;

import lombok.extern.slf4j.Slf4j;

/**
 * Utility class for calculation formula validations. Provides reusable validation patterns for
 * calculation formulas across game services.
 */
@Slf4j
public final class CalculationValidationUtils {

  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

  private CalculationValidationUtils() {
    // Utility class
  }

  /**
   * Validate calculation formula JSON structure.
   *
   * @param calculationFormula JSON calculation formula
   * @throws ConflictException if formula is invalid
   */
  public static void validateCalculationFormula(String calculationFormula) {
    if (calculationFormula == null || calculationFormula.trim().isEmpty()) {
      return; // Empty formula is allowed
    }

    try {
      JsonNode rootNode = OBJECT_MAPPER.readTree(calculationFormula);

      // Validate it's an object
      if (!rootNode.isObject()) {
        log.error("Calculation formula must be a JSON object, got: {}", calculationFormula);
        throw new ConflictException("Calculation formula must be a valid JSON object");
      }

      // Validate required fields
      validateRequiredFields(rootNode);

      // Validate formula type
      validateFormulaType(rootNode);

    } catch (Exception e) {
      log.error("Invalid calculation formula JSON: {} - {}", calculationFormula, e.getMessage());
      throw new ConflictException("Invalid calculation formula format: " + e.getMessage());
    }
  }

  /**
   * Validate required fields in calculation formula.
   *
   * @param rootNode Root JSON node
   * @throws ConflictException if required fields are missing
   */
  private static void validateRequiredFields(JsonNode rootNode) {
    if (!rootNode.has("type")) {
      throw new ConflictException("Calculation formula must contain 'type' field");
    }

    JsonNode typeNode = rootNode.get("type");
    if (!typeNode.isTextual()) {
      throw new ConflictException("Calculation formula 'type' field must be a string");
    }

    String type = typeNode.asText();
    switch (type) {
      case "linear" -> validateLinearFormulaFields(rootNode);
      case "range" -> validateRangeFormulaFields(rootNode);
      case "formula" -> validateFormulaFields(rootNode);
      default -> throw new ConflictException("Unsupported calculation formula type: " + type);
    }
  }

  /**
   * Validate linear formula specific fields.
   *
   * @param rootNode Root JSON node
   * @throws ConflictException if required fields are missing or invalid
   */
  private static void validateLinearFormulaFields(JsonNode rootNode) {
    if (!rootNode.has("basePrice")) {
      throw new ConflictException("Linear formula must contain 'basePrice' field");
    }
    if (!rootNode.has("pricePerLevel")) {
      throw new ConflictException("Linear formula must contain 'pricePerLevel' field");
    }

    validateNumericField(rootNode, "basePrice");
    validateNumericField(rootNode, "pricePerLevel");
  }

  /**
   * Validate range formula specific fields.
   *
   * @param rootNode Root JSON node
   * @throws ConflictException if required fields are missing or invalid
   */
  private static void validateRangeFormulaFields(JsonNode rootNode) {
    if (!rootNode.has("ranges")) {
      throw new ConflictException("Range formula must contain 'ranges' field");
    }

    JsonNode rangesNode = rootNode.get("ranges");
    if (!rangesNode.isArray()) {
      throw new ConflictException("Range formula 'ranges' field must be an array");
    }

    if (rangesNode.isEmpty()) {
      throw new ConflictException("Range formula must contain at least one range");
    }

    // Validate each range
    for (JsonNode range : rangesNode) {
      validateRangeObject(range);
    }
  }

  /**
   * Validate formula type specific fields.
   *
   * @param rootNode Root JSON node
   * @throws ConflictException if required fields are missing or invalid
   */
  private static void validateFormulaFields(JsonNode rootNode) {
    if (!rootNode.has("expression")) {
      throw new ConflictException("Formula must contain 'expression' field");
    }

    JsonNode expressionNode = rootNode.get("expression");
    if (!expressionNode.isTextual()) {
      throw new ConflictException("Formula 'expression' field must be a string");
    }

    String expression = expressionNode.asText();
    if (expression.trim().isEmpty()) {
      throw new ConflictException("Formula 'expression' field cannot be empty");
    }
  }

  /**
   * Validate individual range object.
   *
   * @param range Range JSON node
   * @throws ConflictException if range is invalid
   */
  private static void validateRangeObject(JsonNode range) {
    if (!range.isObject()) {
      throw new ConflictException("Each range must be a JSON object");
    }

    if (!range.has("minLevel") || !range.has("maxLevel") || !range.has("price")) {
      throw new ConflictException("Range must contain 'minLevel', 'maxLevel', and 'price' fields");
    }

    validateNumericField(range, "minLevel");
    validateNumericField(range, "maxLevel");
    validateNumericField(range, "price");

    int minLevel = range.get("minLevel").asInt();
    int maxLevel = range.get("maxLevel").asInt();

    if (minLevel > maxLevel) {
      throw new ConflictException("Range minLevel must be less than or equal to maxLevel");
    }
  }

  /**
   * Validate formula type.
   *
   * @param rootNode Root JSON node
   * @throws ConflictException if type is unsupported
   */
  private static void validateFormulaType(JsonNode rootNode) {
    String type = rootNode.get("type").asText();
    if (!isSupportedFormulaType(type)) {
      throw new ConflictException("Unsupported calculation formula type: " + type);
    }
  }

  /**
   * Check if formula type is supported.
   *
   * @param type Formula type
   * @return true if supported, false otherwise
   */
  private static boolean isSupportedFormulaType(String type) {
    return "linear".equals(type) || "range".equals(type) || "formula".equals(type);
  }

  /**
   * Validate numeric field.
   *
   * @param node JSON node containing the field
   * @param fieldName Field name
   * @throws ConflictException if field is not numeric
   */
  private static void validateNumericField(JsonNode node, String fieldName) {
    JsonNode fieldNode = node.get(fieldName);
    if (!fieldNode.isNumber()) {
      throw new ConflictException(fieldName + " must be a number");
    }
  }
}
