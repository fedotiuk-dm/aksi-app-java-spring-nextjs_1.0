package com.aksi.service.game.calculation.strategy;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

/**
 * Factory for managing calculation strategies.
 * Uses Strategy Pattern with Factory Pattern for strategy selection.
 */
@Component
@RequiredArgsConstructor
public class CalculationStrategyFactory {

    private final List<CalculationStrategy> strategies;

    /**
     * Get strategy for the specified formula type.
     * Uses functional approach to find matching strategy.
     *
     * @param formulaType Formula type to find strategy for
     * @return Calculation strategy
     * @throws IllegalArgumentException if no strategy found for the formula type
     */
    public CalculationStrategy getStrategy(String formulaType) {
        return Optional.ofNullable(formulaType)
                .flatMap(type -> strategies.stream()
                        .filter(strategy -> strategy.supports(type))
                        .findFirst())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No calculation strategy found for formula type: " + formulaType));
    }

    /**
     * Check if strategy exists for the given formula type.
     *
     * @param formulaType Formula type to check
     * @return true if strategy exists, false otherwise
     */
    public boolean hasStrategy(String formulaType) {
        return Optional.ofNullable(formulaType)
                .map(type -> strategies.stream()
                        .anyMatch(strategy -> strategy.supports(type)))
                .orElse(false);
    }

    /**
     * Get all supported formula types.
     *
     * @return List of supported formula type names
     */
    public List<String> getSupportedFormulaTypes() {
        return strategies.stream()
                .map(CalculationStrategy::getDescription)
                .toList();
    }
}
