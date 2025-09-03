package com.aksi.service.game;

import java.math.BigDecimal;

import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.formula.CalculationFormulaEntity;

/**
 * Service for price calculations based on formulas.
 * Uses CalculationFormula polymorphism for different calculation types.
 */
public interface CalculationService {

    /**
     * Calculate price based on configuration and levels
     *
     * @param config price configuration with formula
     * @param fromLevel starting level
     * @param toLevel target level
     * @return calculated price in cents
     */
    BigDecimal calculatePrice(PriceConfigurationEntity config, int fromLevel, int toLevel);

    /**
     * Calculate price based on formula
     *
     * @param formula calculation formula
     * @param basePrice base price
     * @param fromLevel starting level
     * @param toLevel target level
     * @return calculated price in cents
     */
    BigDecimal calculatePrice(CalculationFormulaEntity formula, BigDecimal basePrice, int fromLevel, int toLevel);

    /**
     * Validate formula
     *
     * @param formula formula to validate
     * @throws IllegalArgumentException if formula is invalid
     */
    void validateFormula(CalculationFormulaEntity formula);

    /**
     * Get formula description for logging
     *
     * @param formula formula
     * @return text description of formula
     */
    String getFormulaDescription(CalculationFormulaEntity formula);

    /**
     * Calculate price with formula using UniversalCalculationRequest/Response DTOs
     *
     * @param formulaType type of formula
     * @param request universal calculation request
     * @return universal calculation response
     */
    UniversalCalculationResponse calculateWithFormula(String formulaType, UniversalCalculationRequest request);
}
