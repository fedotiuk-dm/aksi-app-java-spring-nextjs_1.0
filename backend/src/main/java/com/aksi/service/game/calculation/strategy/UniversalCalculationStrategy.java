package com.aksi.service.game.calculation.strategy;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.CalculationFormula;
import com.aksi.api.game.dto.FormulaFormula;
import com.aksi.api.game.dto.UniversalCalculationContext;
import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.mapper.FormulaConversionUtil;
import com.aksi.service.game.CalculationValidationService;

/**
 * Strategy for UNIVERSAL calculations.
 * Creates default formulas based on context when no explicit formula provided.
 * REFACTORED: Uses FormulaExpressionCalculator instead of Entity.calculate()
 */
@Component
public class UniversalCalculationStrategy extends AbstractCalculationStrategy {

    private final FormulaConversionUtil formulaConversionUtil;
    private final FormulaExpressionCalculator formulaCalculator;

    public UniversalCalculationStrategy(CalculationValidationService validationService,
                                      FormulaConversionUtil formulaConversionUtil,
                                      FormulaExpressionCalculator formulaCalculator) {
        super(validationService);
        this.formulaConversionUtil = formulaConversionUtil;
        this.formulaCalculator = formulaCalculator;
    }

    @Override
    protected Integer performCalculation(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        // Universal calculations always use FORMULA type (expression-based)
        // Cast to FormulaFormulaEntity and delegate to calculator
        FormulaFormulaEntity formulaEntity = (FormulaFormulaEntity) formula;
        return formulaCalculator.calculate(formulaEntity, basePrice, fromLevel, toLevel);
    }

    @Override
    public boolean supports(String formulaType) {
        return "UNIVERSAL".equalsIgnoreCase(formulaType);
    }

    @Override
    public String getDescription() {
        return "Universal Calculation Strategy";
    }

    /**
     * Creates a default formula for universal calculation based on context parameters.
     * This is used when no explicit formula is provided but we have sufficient context.
     *
     * @param context Universal calculation context
     * @return Default calculation formula
     */
    public CalculationFormulaEntity createDefaultFormula(UniversalCalculationContext context) {
        CalculationFormula apiFormula = createDefaultApiFormula(context);
        return formulaConversionUtil.toDomainFormula(apiFormula);
    }

    private CalculationFormula createDefaultApiFormula(UniversalCalculationContext context) {
        // Create a simple formula formula that uses basePrice + levelDiff
        var formulaFormula = new FormulaFormula("basePrice + levelDiff", CalculationFormula.TypeEnum.FORMULA);

        // Set variables if available
        Map<String, Integer> variables = new HashMap<>();
        var additionalParams = context.getAdditionalParameters();
        if (additionalParams != null) {
            // Extract basePrice and levelDiff as variables
            if (additionalParams.containsKey("basePrice")) {
                variables.put("basePrice", additionalParams.get("basePrice"));
            }
            if (additionalParams.containsKey("levelDiff")) {
                variables.put("levelDiff", additionalParams.get("levelDiff"));
            }
        }
        formulaFormula.setVariables(variables);

        return formulaFormula;
    }
}

