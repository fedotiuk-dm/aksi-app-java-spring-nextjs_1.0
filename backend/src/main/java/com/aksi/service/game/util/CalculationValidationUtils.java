package com.aksi.service.game.util;

import org.springframework.stereotype.Component;

import com.aksi.exception.ConflictException;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for calculation formula validations. Provides reusable validation patterns for
 * calculation formulas across game services.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CalculationValidationUtils {

  private final SharedJsonUtils jsonUtils;

  /**
   * Validate calculation formula JSON structure.
   *
   * @param calculationFormula JSON calculation formula
   * @throws ConflictException if formula is invalid
   */
  public void validateCalculationFormula(String calculationFormula) {
    if (calculationFormula == null || calculationFormula.trim().isEmpty()) {
      return; // Empty formula is allowed
    }

    try {
      JsonNode rootNode = jsonUtils.parseJsonOrThrow(calculationFormula, "calculation formula");
      jsonUtils.validateObject(rootNode, "Calculation formula");

      // Validate required fields
      validateRequiredFields(rootNode);

    } catch (Exception e) {
      log.error("Invalid calculation formula JSON: {} - {}", calculationFormula, e.getMessage());
      throw new ConflictException("Invalid calculation formula format: " + e.getMessage());
    }
  }

  /**
   * Validate required fields in calculation formula.
   * Simplified validation based on actual calculator usage patterns.
   *
   * @param rootNode Root JSON node
   * @throws ConflictException if required fields are missing
   */
  private void validateRequiredFields(JsonNode rootNode) {
    // Check for fields actually used by our calculators
    boolean hasRanges = jsonUtils.hasField(rootNode, "ranges");
    boolean hasExpression = jsonUtils.hasField(rootNode, "expression");
    boolean hasHourlyRate = jsonUtils.hasField(rootNode, "hourlyRate");

    if (!hasRanges && !hasExpression && !hasHourlyRate) {
      throw new ConflictException(
          "Calculation formula must contain at least one of: 'ranges', 'expression', or 'hourlyRate'");
    }

    // Validate specific fields if present
    if (hasRanges) {
      jsonUtils.validateArray(rootNode.get("ranges"), "Formula ranges");
    }

    if (hasExpression) {
      String expression = jsonUtils.getTextField(rootNode, "expression", "");
      if (expression.trim().isEmpty()) {
        throw new ConflictException("Formula expression cannot be empty");
      }
    }
  }

}
