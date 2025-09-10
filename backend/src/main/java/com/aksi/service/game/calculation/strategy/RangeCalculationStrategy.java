package com.aksi.service.game.calculation.strategy;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.formula.RangeFormulaEntity;
import com.aksi.service.game.CalculationValidationService;

/**
 * Strategy for RANGE formula calculations.
 * Handles range-based pricing with different rates for level ranges.
 * Uses dedicated RangeFormulaCalculator for business logic.
 */
@Component
public class RangeCalculationStrategy extends AbstractCalculationStrategy {

    private final RangeFormulaCalculator calculator;

    public RangeCalculationStrategy(CalculationValidationService validationService,
                                  RangeFormulaCalculator calculator) {
        super(validationService);
        this.calculator = calculator;
    }

    @Override
    protected Integer performCalculation(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        RangeFormulaEntity rangeFormula = (RangeFormulaEntity) formula;
        // Delegate to business logic calculator instead of entity method
        return calculator.calculate(rangeFormula, basePrice, fromLevel, toLevel);
    }

    @Override
    public boolean supports(String formulaType) {
        return "RANGE".equalsIgnoreCase(formulaType);
    }

    @Override
    public String getDescription() {
        return "Range Calculation Strategy";
    }
}

