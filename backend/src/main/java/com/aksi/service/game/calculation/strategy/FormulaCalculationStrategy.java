package com.aksi.service.game.calculation.strategy;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.service.game.CalculationValidationService;

/**
 * Strategy for FORMULA formula calculations.
 * Handles expression-based calculations with variables.
 * Uses dedicated FormulaExpressionCalculator for business logic.
 */
@Component
public class FormulaCalculationStrategy extends AbstractCalculationStrategy {

    private final FormulaExpressionCalculator calculator;

    public FormulaCalculationStrategy(CalculationValidationService validationService,
                                    FormulaExpressionCalculator calculator) {
        super(validationService);
        this.calculator = calculator;
    }

    @Override
    protected Integer performCalculation(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        FormulaFormulaEntity formulaFormula = (FormulaFormulaEntity) formula;
        // Delegate to business logic calculator instead of entity method
        return calculator.calculate(formulaFormula, basePrice, fromLevel, toLevel);
    }

    @Override
    public boolean supports(String formulaType) {
        return "FORMULA".equalsIgnoreCase(formulaType);
    }

    @Override
    public String getDescription() {
        return "Formula Expression Calculation Strategy";
    }
}

