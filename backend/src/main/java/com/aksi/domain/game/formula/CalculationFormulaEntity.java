package com.aksi.domain.game.formula;



import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import lombok.Getter;
import lombok.Setter;

/**
 * Abstract base class for all calculation formula types.
 * Provides polymorphic structure for JSON serialization and JPA persistence.
 *<p>
 * REFACTORED: Removed business logic methods (calculate, validate).
 * Business logic now handled by dedicated Calculator services.
 */
@Setter
@Getter
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = LinearFormulaEntity.class, name = "LINEAR"),
    @JsonSubTypes.Type(value = RangeFormulaEntity.class, name = "RANGE"),
    @JsonSubTypes.Type(value = TimeBasedFormulaEntity.class, name = "TIME_BASED"),
    @JsonSubTypes.Type(value = FormulaFormulaEntity.class, name = "FORMULA")
})
public abstract class CalculationFormulaEntity {

    /**
     * Type of calculation formula - used for polymorphic strategy selection
     */
    protected TypeEnum type;

    protected CalculationFormulaEntity(TypeEnum type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return String.format("%s{type=%s}", getClass().getSimpleName(), type);
    }
}
