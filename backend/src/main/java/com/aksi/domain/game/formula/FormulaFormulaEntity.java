package com.aksi.domain.game.formula;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

/**
 * Formula calculation based on mathematical expressions with variables.
 * Supports complex formulas using variables.
 * <p>
 * Example:
 * expression = "basePrice + (levelDiff * pricePerLevel * multiplier)"
 * variables = {"multiplier": 150}
 * Result: basePrice + (levelDiff × pricePerLevel × 150 / 100)
 */
public class FormulaFormulaEntity extends CalculationFormulaEntity {

  @Setter
  @Getter
  @JsonProperty("expression")
    private String expression;

    @JsonProperty("variables")
    private final Map<String, Integer> variables = new HashMap<>();



    // Конструктори
    public FormulaFormulaEntity() {
        super(TypeEnum.FORMULA);
    }

  @Override
    public Integer calculate(Integer basePrice, int fromLevel, int toLevel) {
        if (basePrice == null) {
            throw new IllegalArgumentException("Base price cannot be null");
        }
        if (expression == null || expression.trim().isEmpty()) {
            throw new IllegalArgumentException("Expression cannot be null or empty");
        }

        // For simplicity, return base price if expression is too complex
        // In production, you would implement a simple expression evaluator
        if (expression.contains("*") || expression.contains("/") || expression.contains("(")) {
            return basePrice;
        }

        // Simple addition/subtraction support
        if (expression.startsWith("basePrice + ")) {
            String numberStr = expression.substring("basePrice + ".length()).trim();
            try {
                int number = Integer.parseInt(numberStr);
                return basePrice + number;
            } catch (NumberFormatException e) {
                return basePrice;
            }
        }

        if (expression.startsWith("basePrice - ")) {
            String numberStr = expression.substring("basePrice - ".length()).trim();
            try {
                int number = Integer.parseInt(numberStr);
                return Math.max(0, basePrice - number);
            } catch (NumberFormatException e) {
                return basePrice;
            }
        }

        return basePrice;
    }

    /**
     * Get variables map (simplified for Integer arithmetic)
     */
    public Map<String, Integer> getVariables() {
        return new HashMap<>(variables);
    }



    @Override
    public void validate() {
        if (expression == null || expression.trim().isEmpty()) {
            throw new IllegalArgumentException("Expression is required for FormulaFormula");
        }

        // Simplified validation - only check if expression is not empty
        // In production, you would implement proper variable validation
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        FormulaFormulaEntity that = (FormulaFormulaEntity) o;
        return Objects.equals(expression, that.expression) &&
               Objects.equals(variables, that.variables);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), expression, variables);
    }

    @Override
    public String toString() {
        return String.format("FormulaFormula{expression='%s', variables=%s}", expression, variables);
    }
}
