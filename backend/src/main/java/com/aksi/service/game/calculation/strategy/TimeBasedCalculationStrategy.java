package com.aksi.service.game.calculation.strategy;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.formula.TimeBasedFormulaEntity;
import com.aksi.service.game.CalculationValidationService;

/**
 * Strategy for TIME_BASED formula calculations.
 * Handles time-based pricing with hourly rates and base hours.
 * Uses dedicated TimeBasedFormulaCalculator for business logic.
 */
@Component
public class TimeBasedCalculationStrategy extends AbstractCalculationStrategy {

    private final TimeBasedFormulaCalculator calculator;

    public TimeBasedCalculationStrategy(CalculationValidationService validationService,
                                      TimeBasedFormulaCalculator calculator) {
        super(validationService);
        this.calculator = calculator;
    }

    @Override
    protected Integer performCalculation(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        TimeBasedFormulaEntity timeBasedFormula = (TimeBasedFormulaEntity) formula;
        // Delegate to business logic calculator instead of entity method
        return calculator.calculate(timeBasedFormula, basePrice, fromLevel, toLevel);
    }

    @Override
    public boolean supports(String formulaType) {
        return "TIME_BASED".equalsIgnoreCase(formulaType);
    }

    @Override
    public String getDescription() {
        return "Time-Based Calculation Strategy";
    }
}

