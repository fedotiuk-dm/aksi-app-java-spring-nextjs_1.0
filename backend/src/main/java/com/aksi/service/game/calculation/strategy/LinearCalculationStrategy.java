package com.aksi.service.game.calculation.strategy;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.formula.LinearFormulaEntity;
import com.aksi.service.game.CalculationValidationService;

/**
 * Strategy for LINEAR formula calculations.
 * Handles linear price progression based on level differences.
 * Uses dedicated LinearFormulaCalculator for business logic.
 */
@Component
public class LinearCalculationStrategy extends AbstractCalculationStrategy {

    private final LinearFormulaCalculator calculator;

    public LinearCalculationStrategy(CalculationValidationService validationService,
                                   LinearFormulaCalculator calculator) {
        super(validationService);
        this.calculator = calculator;
    }

    @Override
    protected Integer performCalculation(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        LinearFormulaEntity linearFormula = (LinearFormulaEntity) formula;
        // Delegate to business logic calculator instead of entity method
        return calculator.calculate(linearFormula, basePrice, fromLevel, toLevel);
    }

    @Override
    public boolean supports(String formulaType) {
        return "LINEAR".equalsIgnoreCase(formulaType);
    }

    @Override
    public String getDescription() {
        return "Linear Calculation Strategy";
    }
}
