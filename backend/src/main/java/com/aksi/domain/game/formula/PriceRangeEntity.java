package com.aksi.domain.game.formula;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

/**
 * Price range for range-based calculations.
 * Defines FIXED price for the entire range from-to levels inclusive.
 * <p>
 * Example: {from: 1, to: 5, price: 4.0} means levels 1-5 cost 4.0 total
 */
@Setter
@Getter
public class PriceRangeEntity {

  // Гетери та сетери
  @JsonProperty("from")
    private int from;

    @JsonProperty("to")
    private int to;

    @JsonProperty("price")
    private Integer price;

    // Required for Jackson JSON deserialization
    public PriceRangeEntity() {}

    public PriceRangeEntity(int from, int to, Integer price) {
        this.from = from;
        this.to = to;
        this.price = price;
    }

    // REFACTORED: Business logic moved to RangeFormulaCalculator service
    // validate() -> RangeFormulaCalculator.validatePriceRange()

  @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PriceRangeEntity that = (PriceRangeEntity) o;
        return from == that.from && to == that.to && Objects.equals(price, that.price);
    }

    @Override
    public int hashCode() {
        return Objects.hash(from, to, price);
    }

    @Override
    public String toString() {
        return String.format("PriceRange{from=%d, to=%d, price=%s}", from, to, price);
    }
}
