package com.aksi.domain.item.validation;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.jexl3.JexlEngine;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.aksi.domain.item.calculation.JexlCalculator;
import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.enums.ModifierType;
import com.aksi.domain.item.exception.InvalidModifierException;
import com.aksi.domain.item.util.ItemConstantsValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Validation service for price modifiers including JEXL formula validation. */
@Slf4j
@Service
@RequiredArgsConstructor
public class PriceModifierValidationService {

  private final JexlEngine jexlEngine;
  private final ItemConstantsValidator constantsValidator;

  /**
   * Validate price modifier entity.
   *
   * @param modifier modifier to validate
   * @throws InvalidModifierException if validation fails
   */
  public void validateModifier(PriceModifierEntity modifier) {
    List<String> errors = new ArrayList<>();

    // Validate basic fields
    if (!StringUtils.hasText(modifier.getCode())) {
      errors.add("Modifier code is required");
    } else if (!constantsValidator.validateStringLength(
        modifier.getCode(), ItemConstantsValidator.FieldType.CODE)) {
      errors.add("Modifier code length is invalid");
    }

    if (!StringUtils.hasText(modifier.getName())) {
      errors.add("Modifier name is required");
    } else if (!constantsValidator.validateStringLength(
        modifier.getName(), ItemConstantsValidator.FieldType.NAME)) {
      errors.add("Modifier name length is invalid");
    }

    if (modifier.getType() == null) {
      errors.add("Modifier type is required");
    }

    if (modifier.getPriority() == null) {
      errors.add("Modifier priority is required");
    } else if (!constantsValidator.validatePriorityRange(modifier.getPriority())) {
      errors.add("Modifier priority is out of valid range");
    }

    // Validate modifier value or JEXL formula
    boolean hasValue = modifier.getValue() != null;
    boolean hasFormula = StringUtils.hasText(modifier.getJexlFormula());

    if (!hasValue && !hasFormula) {
      errors.add("Either value or JEXL formula must be provided");
    }

    if (hasValue && hasFormula) {
      errors.add("Cannot have both value and JEXL formula");
    }

    // Validate value if present
    if (hasValue && modifier.getType() == ModifierType.PERCENTAGE) {
      if (modifier.getValue().compareTo(BigDecimal.ZERO) < 0) {
        errors.add("Percentage value cannot be negative");
      }
      if (modifier.getValue().compareTo(new BigDecimal("100")) > 0) {
        errors.add("Percentage value cannot exceed 100");
      }
    }

    // Validate JEXL formula if present
    if (hasFormula) {
      if (!constantsValidator.validateFormulaLength(modifier.getJexlFormula())) {
        errors.add("JEXL formula exceeds maximum length");
      } else {
        validateJexlFormula(modifier.getJexlFormula(), errors);
      }
    }

    // Check for errors
    if (!errors.isEmpty()) {
      String errorMessage = String.join(", ", errors);
      log.error("Validation failed for modifier {}: {}", modifier.getCode(), errorMessage);
      throw new InvalidModifierException(errorMessage);
    }
  }

  /**
   * Validate JEXL formula syntax and safety.
   *
   * @param formula formula to validate
   * @param errors error list to add errors to
   */
  private void validateJexlFormula(String formula, List<String> errors) {
    // Check syntax
    if (!JexlCalculator.isValidFormula(jexlEngine, formula)) {
      errors.add("Invalid JEXL formula syntax");
      return;
    }

    // Check for dangerous operations
    if (containsDangerousOperations(formula)) {
      errors.add("JEXL formula contains forbidden operations");
      return;
    }

    // Try to evaluate with test context
    try {
      testFormulaExecution(formula);
    } catch (Exception e) {
      errors.add("JEXL formula test execution failed: " + e.getMessage());
    }
  }

  /**
   * Check if formula contains dangerous operations.
   *
   * @param formula formula to check
   * @return true if dangerous operations found
   */
  private boolean containsDangerousOperations(String formula) {
    String lowerFormula = formula.toLowerCase();

    // List of dangerous patterns
    String[] dangerousPatterns = {
      "system.",
      "runtime.",
      "process.",
      "file.",
      "exec(",
      "eval(",
      "classloader",
      "reflection",
      "invoke",
      "method",
      "constructor",
      "field",
      "class."
    };

    for (String pattern : dangerousPatterns) {
      if (lowerFormula.contains(pattern)) {
        log.warn("Dangerous pattern '{}' found in formula: {}", pattern, formula);
        return true;
      }
    }

    return false;
  }

  /**
   * Test formula execution with sample context.
   *
   * @param formula formula to test
   * @throws Exception if execution fails
   */
  private void testFormulaExecution(String formula) throws Exception {
    // Create test context with all expected variables
    Map<String, Object> testContext = new HashMap<>();
    testContext.put("price", new BigDecimal("100.00"));
    testContext.put("basePrice", new BigDecimal("100.00"));
    testContext.put("quantity", new BigDecimal("1"));
    testContext.put("color", "BASE");
    testContext.put("modifierValue", new BigDecimal("10"));
    testContext.put("itemName", "Test Item");
    testContext.put("categoryCode", "TEST_CAT");
    testContext.put("unitOfMeasure", "PIECE");
    testContext.put("blackPrice", new BigDecimal("120.00"));
    testContext.put("colorPrice", new BigDecimal("150.00"));
    testContext.put("material", "COTTON");
    testContext.put("urgency", "NORMAL");
    testContext.put("urgencyMultiplier", BigDecimal.ONE);
    testContext.put("HUNDRED", new BigDecimal("100"));

    // Try to calculate with test context
    JexlCalculator calculator = new JexlCalculator(jexlEngine, formula);
    BigDecimal result = calculator.calculate(testContext);

    // Validate result
    if (result == null) {
      throw new IllegalStateException("Formula returned null");
    }

    if (result.compareTo(BigDecimal.ZERO) < 0) {
      log.warn("Formula returned negative value: {}", result);
    }
  }

  /**
   * Validate JEXL formula for a specific context.
   *
   * @param formula formula to validate
   * @param context context to use for validation
   * @return validation result with any errors
   */
  public ValidationResult validateFormulaWithContext(String formula, Map<String, Object> context) {
    ValidationResult result = new ValidationResult();

    try {
      // Check syntax
      if (!JexlCalculator.isValidFormula(jexlEngine, formula)) {
        result.addError("Invalid JEXL formula syntax");
        return result;
      }

      // Check for dangerous operations
      if (containsDangerousOperations(formula)) {
        result.addError("Formula contains forbidden operations");
        return result;
      }

      // Try to evaluate with provided context
      JexlCalculator calculator = new JexlCalculator(jexlEngine, formula);
      BigDecimal calculationResult = calculator.calculate(context);

      if (calculationResult == null) {
        result.addError("Formula returned null for provided context");
      } else if (calculationResult.compareTo(BigDecimal.ZERO) < 0) {
        result.addWarning("Formula returned negative value: " + calculationResult);
      }

      result.setValid(result.getErrors().isEmpty());
      result.setCalculatedValue(calculationResult);

    } catch (Exception e) {
      result.addError("Formula execution failed: " + e.getMessage());
      result.setValid(false);
    }

    return result;
  }

  /** Validation result container. */
  public static class ValidationResult {
    private boolean valid = true;
    private List<String> errors = new ArrayList<>();
    private List<String> warnings = new ArrayList<>();
    private BigDecimal calculatedValue;

    public boolean isValid() {
      return valid;
    }

    public void setValid(boolean valid) {
      this.valid = valid;
    }

    public List<String> getErrors() {
      return errors;
    }

    public void addError(String error) {
      this.errors.add(error);
      this.valid = false;
    }

    public List<String> getWarnings() {
      return warnings;
    }

    public void addWarning(String warning) {
      this.warnings.add(warning);
    }

    public BigDecimal getCalculatedValue() {
      return calculatedValue;
    }

    public void setCalculatedValue(BigDecimal calculatedValue) {
      this.calculatedValue = calculatedValue;
    }
  }
}
