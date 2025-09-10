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

    // REFACTORED: Business logic methods moved to FormulaExpressionCalculator service
    // calculate() -> FormulaExpressionCalculator.calculate()

    /**
     * Get variables map (simplified for Integer arithmetic)
     */
    public Map<String, Integer> getVariables() {
        return new HashMap<>(variables);
    }

    /**
     * Set variables map
     */
    public void setVariables(Map<String, Integer> variables) {
        if (variables != null) {
            this.variables.clear();
            this.variables.putAll(variables);
        }
    }



    // REFACTORED: validate() -> FormulaExpressionCalculator.validateFormula()


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FormulaFormulaEntity that = (FormulaFormulaEntity) o;
        return Objects.equals(type, that.type) &&
               Objects.equals(expression, that.expression) &&
               Objects.equals(variables, that.variables);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, expression, variables);
    }

    @Override
    public String toString() {
        return String.format("FormulaFormula{expression='%s', variables=%s}", expression, variables);
    }
}
