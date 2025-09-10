package com.aksi.service.game.calculation.strategy;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.formula.TimeBasedFormulaEntity;
import com.aksi.service.game.calculation.util.CalculationConstants;
import com.aksi.service.game.calculation.util.CalculationUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * Business logic calculator for Time-Based Formula calculations.
 * Extracted from TimeBasedFormulaEntity to follow DDD principles.
 */
@Component
@Slf4j
public class TimeBasedFormulaCalculator {

    /**
     * Calculate price using time-based formula: hourlyRate × estimatedHours × complexityMultiplier.
     * Moved from TimeBasedFormulaEntity.calculate() method.
     *
     * @param formula Time-based formula configuration
     * @param basePrice Base price in cents
     * @param fromLevel Starting level
     * @param toLevel Target level
     * @return Calculated price in cents
     */
    public Integer calculate(TimeBasedFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        validateInputs(formula, basePrice, fromLevel, toLevel);

        int estimatedHours = calculateEstimatedHours(formula, fromLevel, toLevel);

        // Calculate time cost with integer arithmetic
        // complexityMultiplier is in percentage (100 = 1.0x)
        long timeCost = (long) formula.getHourlyRate() * estimatedHours * formula.getComplexityMultiplier() / CalculationConstants.Modifier.PERCENTAGE_BASE;

        int result = CalculationUtils.safeAdd(basePrice, (int) timeCost);

        if (log.isDebugEnabled()) {
            log.debug("Time-based calculation: basePrice={}, hourlyRate={}, estimatedHours={}, complexity={}%, timeCost={}, result={}",
                    basePrice, formula.getHourlyRate(), estimatedHours, formula.getComplexityMultiplier(), timeCost, result);
        }

        return result;
    }

    /**
     * Calculate estimated hours based on level difference and configuration.
     * Moved from TimeBasedFormulaEntity.calculateEstimatedHours() method.
     *
     * @param formula Time-based formula configuration
     * @param fromLevel Starting level
     * @param toLevel Target level
     * @return Final estimated hours after applying minimum hours and rounding
     */
    public int calculateEstimatedHours(TimeBasedFormulaEntity formula, int fromLevel, int toLevel) {
        int levelDiff = CalculationUtils.calculateLevelDifference(fromLevel, toLevel);
        int rawEstimatedHours = formula.getBaseHours() + (levelDiff * formula.getHoursPerLevel());

        // Apply minimum hours constraint
        int minHours = Optional.ofNullable(formula.getMinimumHours()).orElse(1);
        int finalEstimatedHours = Math.max(minHours, rawEstimatedHours);

        // Apply rounding if needed
        if (formula.isRoundToHours()) {
            finalEstimatedHours = Math.max(minHours, finalEstimatedHours);
        }

        if (log.isDebugEnabled()) {
            log.debug("Hours calculation: baseHours={}, hoursPerLevel={}, levelDiff={}, raw={}, final={}",
                    formula.getBaseHours(), formula.getHoursPerLevel(), levelDiff, rawEstimatedHours, finalEstimatedHours);
        }

        return finalEstimatedHours;
    }

    /**
     * Validate time-based formula configuration.
     * Moved from TimeBasedFormulaEntity.validate() method.
     *
     * @param formula Time-based formula configuration
     * @throws IllegalArgumentException if validation fails
     */
    public void validateFormula(TimeBasedFormulaEntity formula) {
        if (formula.getHourlyRate() == null) {
            throw new IllegalArgumentException("Hourly rate is required for TimeBasedFormula");
        }
        if (formula.getHourlyRate() <= 0) {
            throw new IllegalArgumentException("Hourly rate must be positive");
        }
        if (formula.getBaseHours() < 0) {
            throw new IllegalArgumentException("Base hours cannot be negative");
        }
        if (formula.getHoursPerLevel() < 0) {
            throw new IllegalArgumentException("Hours per level cannot be negative");
        }
        if (formula.getComplexityMultiplier() == null || formula.getComplexityMultiplier() <= 0) {
            throw new IllegalArgumentException("Complexity multiplier must be positive");
        }
        if (formula.getMinimumHours() != null && formula.getMinimumHours() <= 0) {
            throw new IllegalArgumentException("Minimum hours must be positive");
        }
    }

    /**
     * Validate all inputs for calculation.
     */
    private void validateInputs(TimeBasedFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
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
     * Get description of time-based calculation for logging.
     */
    public String getDescription(TimeBasedFormulaEntity formula) {
        return String.format("TimeBased(hourlyRate=%s, baseHours=%d, complexity=%s%%)",
                formula.getHourlyRate(), formula.getBaseHours(), formula.getComplexityMultiplier());
    }
}
