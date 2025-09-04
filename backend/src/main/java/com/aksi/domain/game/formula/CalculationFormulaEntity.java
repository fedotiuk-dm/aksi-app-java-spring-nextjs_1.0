package com.aksi.domain.game.formula;



import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import lombok.Getter;
import lombok.Setter;

/**
 * Abstract class for all calculation formula types.
 * Provides polymorphism through Jackson annotations and common interface for calculations.
 */
@Setter
@Getter
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = LinearFormulaEntity.class, name = "LINEAR"),
    @JsonSubTypes.Type(value = RangeFormulaEntity.class, name = "RANGE"),
    @JsonSubTypes.Type(value = TimeBasedFormulaEntity.class, name = "TIME_BASED"),
    @JsonSubTypes.Type(value = FormulaFormulaEntity.class, name = "FORMULA")
})
public abstract class CalculationFormulaEntity {

    /**
     * Type of calculation formula
     */
    protected TypeEnum type;

    protected CalculationFormulaEntity(TypeEnum type) {
        this.type = type;
    }

    /**
     * Calculate price based on base price and levels
     *
     * @param basePrice base price in cents
     * @param fromLevel starting level
     * @param toLevel target level
     * @return calculated price in cents
     */
    public abstract Integer calculate(Integer basePrice, int fromLevel, int toLevel);

    /**
     * Validate formula parameters
     *
     * @throws IllegalArgumentException if parameters are invalid
     */
    public abstract void validate();

  @Override
    public String toString() {
        return String.format("%s{type=%s}", getClass().getSimpleName(), type);
    }
}
