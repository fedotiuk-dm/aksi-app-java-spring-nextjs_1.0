package com.aksi.service.game;

import org.springframework.stereotype.Service;

import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.domain.game.formula.LinearFormulaEntity;
import com.aksi.domain.game.formula.RangeFormulaEntity;
import com.aksi.domain.game.formula.TimeBasedFormulaEntity;
import com.aksi.service.game.calculation.strategy.FormulaExpressionCalculator;
import com.aksi.service.game.calculation.strategy.LinearFormulaCalculator;
import com.aksi.service.game.calculation.strategy.RangeFormulaCalculator;
import com.aksi.service.game.calculation.strategy.TimeBasedFormulaCalculator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validation service for calculation-related business rules and constraints.
 * REFACTORED: Uses Calculator services instead of Entity.validate() methods.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CalculationValidationService {

    private final LinearFormulaCalculator linearCalculator;
    private final RangeFormulaCalculator rangeCalculator;
    private final TimeBasedFormulaCalculator timeBasedCalculator;
    private final FormulaExpressionCalculator formulaCalculator;

    /**
     * Validate calculation formula using appropriate Calculator service.
     * REFACTORED: Delegates to Calculator.validateFormula() instead of Entity.validate()
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
            // Delegate to appropriate calculator based on formula type
            switch (formula.getType()) {
                case LINEAR -> {
                    LinearFormulaEntity linear = (LinearFormulaEntity) formula;
                    linearCalculator.validateFormula(linear);
                }
                case RANGE -> {
                    RangeFormulaEntity range = (RangeFormulaEntity) formula;
                    rangeCalculator.validateFormula(range);
                }
                case TIME_BASED -> {
                    TimeBasedFormulaEntity timeBased = (TimeBasedFormulaEntity) formula;
                    timeBasedCalculator.validateFormula(timeBased);
                }
                case FORMULA -> {
                    FormulaFormulaEntity formulaFormula = (FormulaFormulaEntity) formula;
                    formulaCalculator.validateFormula(formulaFormula);
                }
            }

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
  public void validateCalculationParameters(Integer basePrice, int fromLevel, int toLevel) {
    log.debug("Validating calculation parameters: basePrice={}, fromLevel={}, toLevel={}",
              basePrice, fromLevel, toLevel);

    if (basePrice == null) {
      throw new IllegalArgumentException("Base price cannot be null");
    }

    if (basePrice < 0) {
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

}
