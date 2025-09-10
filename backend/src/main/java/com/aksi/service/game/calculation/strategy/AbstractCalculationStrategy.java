package com.aksi.service.game.calculation.strategy;

import java.util.Optional;

import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.service.game.CalculationValidationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Base implementation for calculation strategies with common validation logic.
 * Uses Guard Clauses pattern for early validation and clean code flow.
 */
@Slf4j
@RequiredArgsConstructor
public abstract class AbstractCalculationStrategy implements CalculationStrategy {

    private final CalculationValidationService validationService;

    @Override
    public final Integer calculatePrice(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        // Guard clauses for early validation
        validateInputs(formula, basePrice);

        // Delegate validation to specialized service
        validationService.validateCalculationParameters(basePrice, fromLevel, toLevel);
        validationService.validateFormula(formula);

        try {
            Integer result = performCalculation(formula, basePrice, fromLevel, toLevel);

            logCalculationResult(formula, basePrice, fromLevel, toLevel, result);

            return result;

        } catch (Exception e) {
            handleCalculationError(formula, e);
            throw new RuntimeException("Price calculation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Perform the actual calculation logic - implemented by concrete strategies.
     */
    protected abstract Integer performCalculation(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel);

    /**
     * Validate inputs using Guard Clauses pattern.
     */
    private void validateInputs(CalculationFormulaEntity formula, Integer basePrice) {
        Optional.ofNullable(formula)
                .orElseThrow(() -> new IllegalArgumentException("Formula cannot be null"));

        Optional.ofNullable(basePrice)
                .orElseThrow(() -> new IllegalArgumentException("Base price cannot be null"));
    }

    /**
     * Log calculation result for debugging.
     */
    private void logCalculationResult(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel, Integer result) {
        Optional.of(formula)
                .filter(f -> log.isDebugEnabled())
                .ifPresent(f -> log.debug(
                        "Calculated price using {} for formula {}: basePrice={}, fromLevel={}, toLevel={}, result={}",
                        getDescription(), f.getType(), basePrice, fromLevel, toLevel, result));
    }

    /**
     * Handle calculation errors with proper logging.
     */
    private void handleCalculationError(CalculationFormulaEntity formula, Exception e) {
        Optional.of(formula)
                .ifPresent(f -> log.error("Failed to calculate price with strategy {} for formula {}: {}",
                        getDescription(), f.getType(), e.getMessage(), e));
    }
}
