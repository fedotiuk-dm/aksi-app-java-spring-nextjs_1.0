package com.aksi.service.game.calculation.strategy;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.formula.LinearFormulaEntity;
import com.aksi.service.game.calculation.util.CalculationConstants;
import com.aksi.service.game.calculation.util.CalculationUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * Business logic calculator for Linear Formula calculations.
 * Extracted from LinearFormulaEntity to follow DDD principles.
 * Entity should contain only data, business logic belongs in services.
 */
@Component
@Slf4j
public class LinearFormulaCalculator {

    /**
     * Calculate price using linear formula: basePrice + (levelDiff × pricePerLevel).
     * Moved from LinearFormulaEntity.calculate() method.
     *
     * @param formula Linear formula configuration
     * @param basePrice Base price in cents
     * @param fromLevel Starting level
     * @param toLevel Target level
     * @return Calculated price in cents
     */
    public Integer calculate(LinearFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        validateInputs(formula, basePrice, fromLevel, toLevel);

        int levelDiff = CalculationUtils.calculateLevelDifference(fromLevel, toLevel);
        long levelPrice = (long) formula.getPricePerLevel() * levelDiff;

        // Use safe addition to prevent overflow
        int result = CalculationUtils.safeAdd(basePrice, (int) levelPrice);

        if (log.isDebugEnabled()) {
            log.debug("Linear calculation: basePrice={}, pricePerLevel={}, levelDiff={}, result={}",
                    basePrice, formula.getPricePerLevel(), levelDiff, result);
        }

        return result;
    }

    /**
     * Validate linear formula configuration and parameters.
     * Moved from LinearFormulaEntity.validate() method.
     *
     * @param formula Linear formula configuration
     * @throws IllegalArgumentException if validation fails
     */
    public void validateFormula(LinearFormulaEntity formula) {
        if (formula.getPricePerLevel() == null) {
            throw new IllegalArgumentException("Price per level is required for LinearFormula");
        }
        if (formula.getPricePerLevel() < 0) {
            throw new IllegalArgumentException("Price per level cannot be negative");
        }
    }

    /**
     * Validate all inputs for calculation.
     */
    private void validateInputs(LinearFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        if (formula == null) {
            throw new IllegalArgumentException(CalculationConstants.ErrorMessages.FORMULA_NULL);
        }
        if (basePrice == null) {
            throw new IllegalArgumentException(CalculationConstants.ErrorMessages.BASE_PRICE_NULL);
        }
        if (CalculationUtils.isValidLevelRange(fromLevel, toLevel)) {
            throw new IllegalArgumentException("Invalid level range: from=" + fromLevel + ", to=" + toLevel);
        }

        validateFormula(formula);
    }

    /**
     * Get description of linear calculation for logging.
     */
    public String getDescription(LinearFormulaEntity formula) {
        return String.format("Linear(pricePerLevel=%s)", formula.getPricePerLevel());
    }
}
