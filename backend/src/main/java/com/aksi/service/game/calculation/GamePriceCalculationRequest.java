package com.aksi.service.game.calculation;

import com.aksi.api.game.dto.CalculationFormula;
import com.aksi.api.game.dto.UniversalCalculationContext;

import lombok.Builder;
import lombok.Data;

/**
 * Request object for price calculations.
 * Encapsulates all parameters needed for price calculation.
 */
@Data
@Builder
public class GamePriceCalculationRequest {

    private String formulaType;
    private CalculationFormula formula;
    private UniversalCalculationContext context;
    private Integer startLevel;
    private Integer targetLevel;

    /**
     * Create request for universal calculation.
     */
    public static GamePriceCalculationRequest forUniversalCalculation(UniversalCalculationContext context) {
        return GamePriceCalculationRequest.builder()
                .formulaType("UNIVERSAL")
                .context(context)
                .startLevel(context.getStartLevel())
                .targetLevel(context.getTargetLevel())
                .build();
    }

    /**
     * Create request for specific formula calculation.
     */
    public static GamePriceCalculationRequest forFormulaCalculation(String formulaType,
                                                               CalculationFormula formula,
                                                               UniversalCalculationContext context) {
        return GamePriceCalculationRequest.builder()
                .formulaType(formulaType)
                .formula(formula)
                .context(context)
                .startLevel(context.getStartLevel())
                .targetLevel(context.getTargetLevel())
                .build();
    }
}
