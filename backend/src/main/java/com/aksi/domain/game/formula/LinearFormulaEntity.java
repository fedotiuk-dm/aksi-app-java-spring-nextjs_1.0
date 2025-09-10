package com.aksi.domain.game.formula;

import java.util.Objects;

import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

/**
 * Linear calculation formula: basePrice + (levelDiff × pricePerLevel)
 * Simplest calculation type with fixed price per level.
 * <p>
 * Example: For levels from 1 to 10 with 500 cents per level:
 * basePrice = 1000, levelDiff = 9, pricePerLevel = 500
 * Result: 1000 + (9 × 500) = 5500 cents
 */
@Setter
@Getter
public class LinearFormulaEntity extends CalculationFormulaEntity {

  // Гетери та сетери
  @JsonProperty("pricePerLevel")
    private Integer pricePerLevel;

    // Конструктори
    public LinearFormulaEntity() {
        super(TypeEnum.LINEAR);
    }

    // REFACTORED: Business logic methods moved to LinearFormulaCalculator service
    // calculate() -> LinearFormulaCalculator.calculate()
    // validate() -> LinearFormulaCalculator.validateFormula()

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LinearFormulaEntity that = (LinearFormulaEntity) o;
        return Objects.equals(type, that.type) && Objects.equals(pricePerLevel, that.pricePerLevel);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, pricePerLevel);
    }

    @Override
    public String toString() {
        return String.format("LinearFormula{pricePerLevel=%s}", pricePerLevel);
    }
}
