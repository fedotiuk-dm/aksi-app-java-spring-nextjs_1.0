package com.aksi.service.game;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.aksi.domain.game.formula.CalculationFormulaEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for calculation-related business rules and constraints. Handles validation
 * logic separate from command services.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CalculationValidationService {

  /**
   * Validate calculation formula.
   *
   * @param formula Formula to validate
   * @throws IllegalArgumentException if formula is invalid
   */
  public void validateFormula(CalculationFormulaEntity formula) {
    log.debug("Validating calculation formula: {}", formula);

    if (formula == null) {
      throw new IllegalArgumentException("Formula cannot be null");
    }

    try {
      formula.validate();
      log.debug("Formula validation passed for type: {}", formula.getType());
    } catch (Exception e) {
      log.error("Formula validation failed for {}: {}", formula.getType(), e.getMessage());
      throw new IllegalArgumentException("Invalid formula: " + e.getMessage(), e);
    }
  }

  /**
   * Validate calculation parameters.
   *
   * @param basePrice Base price
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @throws IllegalArgumentException if parameters are invalid
   */
  public void validateCalculationParameters(BigDecimal basePrice, int fromLevel, int toLevel) {
    log.debug("Validating calculation parameters: basePrice={}, fromLevel={}, toLevel={}",
              basePrice, fromLevel, toLevel);

    if (basePrice == null) {
      throw new IllegalArgumentException("Base price cannot be null");
    }

    if (basePrice.compareTo(BigDecimal.ZERO) < 0) {
      throw new IllegalArgumentException("Base price cannot be negative");
    }

    if (fromLevel < 1 || toLevel < 1) {
      throw new IllegalArgumentException("Levels must be positive");
    }

    if (toLevel < fromLevel) {
      throw new IllegalArgumentException("Target level must be >= start level");
    }

    log.debug("Calculation parameters validation passed");
  }

  /**
   * Validate calculation formula as JSON string.
   *
   * @param calculationFormula JSON string representation of formula
   * @throws IllegalArgumentException if formula is invalid
   */
  public void validateCalculationFormula(String calculationFormula) {
    log.debug("Validating calculation formula string: {}", calculationFormula);

    if (calculationFormula == null || calculationFormula.trim().isEmpty()) {
      throw new IllegalArgumentException("Calculation formula cannot be null or empty");
    }

    // Basic JSON structure validation
    if (!calculationFormula.trim().startsWith("{")) {
      throw new IllegalArgumentException("Calculation formula must be a valid JSON object");
    }

    // TODO: Add more sophisticated JSON validation for formula structure
    // For now, just check that it's not obviously malformed

    log.debug("Calculation formula string validation passed");
  }
}
