package com.aksi.domain.game.formula;


import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

/**
 * Range-based calculation formula.
 * Each level range has its own FIXED price for the entire range.
 * <p>
 * Example:
 * ranges = [
 *   {from: 1, to: 5, price: 4.0},   // levels 1-5 cost 4.0 total
 *   {from: 6, to: 10, price: 5.0}   // levels 6-10 cost 5.0 total
 * ]
 * For levels 1-8: 4.0 + 5.0 = 9.0 (only ranges that are fully covered)
 */
@Getter
public class RangeFormulaEntity extends CalculationFormulaEntity {

  // Гетери та методи для роботи з діапазонами
  @JsonProperty("ranges")
    private final List<PriceRangeEntity> ranges = new ArrayList<>();

    // Конструктори
    public RangeFormulaEntity() {
        super(TypeEnum.RANGE);
    }

    // REFACTORED: Business logic methods moved to RangeFormulaCalculator service
    // calculate() -> RangeFormulaCalculator.calculate()
    // validate() -> RangeFormulaCalculator.validateFormula()
    // rangesOverlap() -> RangeFormulaCalculator.priceRangesOverlap() (private)


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RangeFormulaEntity that = (RangeFormulaEntity) o;
        return Objects.equals(type, that.type) && Objects.equals(ranges, that.ranges);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, ranges);
    }

    @Override
    public String toString() {
        return String.format("RangeFormula{ranges=%s}", ranges);
    }
}
