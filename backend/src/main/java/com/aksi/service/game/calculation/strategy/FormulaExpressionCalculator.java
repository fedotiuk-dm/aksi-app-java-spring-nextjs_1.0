package com.aksi.service.game.calculation.strategy;

import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.service.game.calculation.util.CalculationConstants;
import com.aksi.service.game.calculation.util.CalculationUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * Business logic calculator for Formula Expression calculations.
 * Extracted from FormulaFormulaEntity to follow DDD principles.
 * Handles mathematical expressions with variables.
 */
@Component
@Slf4j
public class FormulaExpressionCalculator {

    /**
     * Calculate price using formula expression with variables.
     * Moved from FormulaFormulaEntity.calculate() method.
     *
     * @param formula Formula expression configuration
     * @param basePrice Base price in cents
     * @param fromLevel Starting level
     * @param toLevel Target level
     * @return Calculated price in cents
     */
    public Integer calculate(FormulaFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        validateInputs(formula, basePrice, fromLevel, toLevel);

        String expression = formula.getExpression().trim();
        Map<String, Integer> variables = formula.getVariables();

        // For complex expressions, return base price (placeholder for full expression engine)
        if (isComplexExpression(expression)) {
            log.debug("Complex expression detected, returning basePrice: {}", expression);
            return basePrice;
        }

        // Handle simple expressions
        Integer result = evaluateSimpleExpression(expression, basePrice, variables);

        if (log.isDebugEnabled()) {
            log.debug("Formula expression calculation: expression='{}', variables={}, basePrice={}, result={}",
                    expression, variables, basePrice, result);
        }

        return result;
    }

    /**
     * Evaluate simple mathematical expressions.
     * Supports basic addition and subtraction with variables.
     */
    private Integer evaluateSimpleExpression(String expression, Integer basePrice, Map<String, Integer> variables) {
        // Simple addition: "basePrice + variable" or "basePrice + number"
        if (expression.startsWith("basePrice + ")) {
            String operand = expression.substring("basePrice + ".length()).trim();
            Integer value = parseOperand(operand, variables);
            return CalculationUtils.safeAdd(basePrice, value);
        }

        // Simple subtraction: "basePrice - number"
        if (expression.startsWith("basePrice - ")) {
            String operand = expression.substring("basePrice - ".length()).trim();
            Integer value = parseOperand(operand, variables);
            return Math.max(0, basePrice - value);
        }

        // Direct variable or number
        Integer value = parseOperand(expression, variables);
        return value != null ? value : basePrice;
    }

    /**
     * Parse operand as either number or variable.
     */
    private Integer parseOperand(String operand, Map<String, Integer> variables) {
        // Try to parse as number first
        try {
            return Integer.valueOf(operand);
        } catch (NumberFormatException e) {
            // Try to find in variables
            return Optional.ofNullable(variables)
                    .filter(vars -> vars.containsKey(operand))
                    .map(vars -> vars.get(operand))
                    .orElse(0);
        }
    }

    /**
     * Check if expression is too complex for simple evaluation.
     */
    private boolean isComplexExpression(String expression) {
        return expression.contains("*") ||
               expression.contains("/") ||
               (expression.contains("(") && !expression.equals("basePrice + levelDiff"));
    }

    /**
     * Validate formula expression configuration.
     * Moved from FormulaFormulaEntity.validate() method.
     *
     * @param formula Formula expression configuration
     * @throws IllegalArgumentException if validation fails
     */
    public void validateFormula(FormulaFormulaEntity formula) {
        String expression = formula.getExpression();

        if (expression == null || expression.trim().isEmpty()) {
            throw new IllegalArgumentException("Expression is required for FormulaFormula");
        }

        // Basic safety checks for expression
        if (expression.length() > 1000) {
            throw new IllegalArgumentException("Expression too long (max 1000 characters)");
        }

        // Check for potentially dangerous patterns
        if (expression.contains("System") || expression.contains("Runtime") || expression.contains("Class")) {
            throw new IllegalArgumentException("Expression contains forbidden keywords");
        }
    }

    /**
     * Validate all inputs for calculation.
     */
    private void validateInputs(FormulaFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        if (formula == null) {
            throw new IllegalArgumentException(CalculationConstants.ErrorMessages.FORMULA_NULL);
        }
        if (basePrice == null) {
            throw new IllegalArgumentException(CalculationConstants.ErrorMessages.BASE_PRICE_NULL);
        }
        if (CalculationUtils.isValidLevelRange(fromLevel, toLevel)) {
            throw new IllegalArgumentException("Invalid level range: from=" + fromLevel + ", to=" + toLevel);
        }

        validateFormula(formula);
    }

    /**
     * Get description of formula expression for logging.
     */
    public String getDescription(FormulaFormulaEntity formula) {
        return String.format("Formula(expression='%s', %d variables)",
                formula.getExpression(), formula.getVariables().size());
    }

    /**
     * Create formula context with common variables.
     * Helper method for setting up calculation context.
     *
     * @param basePrice Base price value
     * @param fromLevel Starting level
     * @param toLevel Target level
     * @return Variable context map
     */
    public Map<String, Integer> createFormulaContext(Integer basePrice, int fromLevel, int toLevel) {
        return Map.of(
                CalculationConstants.Universal.BASE_PRICE_PARAM, basePrice,
                CalculationConstants.Universal.LEVEL_DIFF_PARAM, CalculationUtils.calculateLevelDifference(fromLevel, toLevel),
                "fromLevel", fromLevel,
                "toLevel", toLevel
        );
    }
}
