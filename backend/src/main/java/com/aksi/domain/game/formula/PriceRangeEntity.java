package com.aksi.domain.game.formula;

import java.math.BigDecimal;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * Price range for range-based calculations.
 * Defines price per level within from-to levels inclusive.
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
    private BigDecimal price;

  public PriceRangeEntity(int from, int to, BigDecimal price) {
        this.from = from;
        this.to = to;
        this.price = price;
    }

    /**
     * Check if level falls within this range
     */
    public boolean containsLevel(int level) {
        return level >= from && level <= to;
    }

  /**
     * Validate the range
     */
    public void validate() {
        if (from <= 0) {
            throw new IllegalArgumentException("From level must be positive");
        }
        if (to < from) {
            throw new IllegalArgumentException("To level must be >= from level");
        }
        if (price == null) {
            throw new IllegalArgumentException("Price cannot be null");
        }
        if (price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
    }

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
