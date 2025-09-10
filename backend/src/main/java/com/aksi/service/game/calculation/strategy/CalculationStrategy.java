package com.aksi.service.game.calculation.strategy;

import com.aksi.domain.game.formula.CalculationFormulaEntity;

/**
 * Strategy interface for different calculation types.
 * Follows Strategy Pattern for polymorphic calculation behavior.
 */
public interface CalculationStrategy {

    /**
     * Calculate price based on formula and parameters.
     *
     * @param formula Calculation formula entity
     * @param basePrice Base price in cents
     * @param fromLevel Starting level
     * @param toLevel Target level
     * @return Calculated price in cents
     */
    Integer calculatePrice(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel);

    /**
     * Check if this strategy supports the given formula type.
     *
     * @param formulaType Formula type to check
     * @return true if supported, false otherwise
     */
    boolean supports(String formulaType);

    /**
     * Get description of this calculation strategy for logging.
     *
     * @return Strategy description
     */
    String getDescription();
}
