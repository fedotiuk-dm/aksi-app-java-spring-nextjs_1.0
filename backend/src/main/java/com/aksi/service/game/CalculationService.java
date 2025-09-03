package com.aksi.service.game;

import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;

/**
 * Service for price calculations based on formulas.
 * Uses CalculationFormula polymorphism for different calculation types.
 */
public interface CalculationService {

    /**
     * Calculate price with formula using UniversalCalculationRequest/Response DTOs
     *
     * @param formulaType type of formula
     * @param request universal calculation request
     * @return universal calculation response
     */
    UniversalCalculationResponse calculateWithFormula(String formulaType, UniversalCalculationRequest request);
}
