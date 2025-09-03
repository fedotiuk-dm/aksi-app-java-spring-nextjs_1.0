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

  @Override
    public Integer calculate(Integer basePrice, int fromLevel, int toLevel) {
        if (basePrice == null) {
            throw new IllegalArgumentException("Base price cannot be null");
        }
        if (pricePerLevel == null) {
            throw new IllegalArgumentException("Price per level cannot be null");
        }

        int levelDiff = Math.max(0, toLevel - fromLevel);
        int levelPrice = pricePerLevel * levelDiff;

        return basePrice + levelPrice;
    }

    @Override
    public void validate() {
        if (pricePerLevel == null) {
            throw new IllegalArgumentException("Price per level is required for LinearFormula");
        }
        if (pricePerLevel < 0) {
            throw new IllegalArgumentException("Price per level cannot be negative");
        }
    }

  @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        LinearFormulaEntity that = (LinearFormulaEntity) o;
        return Objects.equals(pricePerLevel, that.pricePerLevel);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), pricePerLevel);
    }

    @Override
    public String toString() {
        return String.format("LinearFormula{pricePerLevel=%s}", pricePerLevel);
    }
}
