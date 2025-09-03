package com.aksi.domain.game.formula;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Range-based calculation formula.
 * Each level range has its own price.
 * <p>
 * Example:
 * ranges = [
 *   {from: 1, to: 5, price: 100},  // levels 1-5 at 100 cents each
 *   {from: 6, to: 10, price: 200}  // levels 6-10 at 200 cents each
 * ]
 * For levels 1-8: (5 × 100) + (3 × 200) = 1100 cents
 */
public class RangeFormulaEntity extends CalculationFormulaEntity {

    @JsonProperty("ranges")
    private List<PriceRangeEntity> ranges = new ArrayList<>();

    // Конструктори
    public RangeFormulaEntity() {
        super(TypeEnum.RANGE);
    }

  @Override
    public BigDecimal calculate(BigDecimal basePrice, int fromLevel, int toLevel) {
        if (basePrice == null) {
            throw new IllegalArgumentException("Base price cannot be null");
        }
        if (ranges == null || ranges.isEmpty()) {
            throw new IllegalArgumentException("Ranges cannot be null or empty");
        }

        BigDecimal total = BigDecimal.ZERO;

        // Проходимо по всіх рівнях від fromLevel до toLevel
        for (int level = fromLevel; level <= toLevel; level++) {
            BigDecimal levelPrice = findPriceForLevel(level);
            total = total.add(levelPrice);
        }

        return basePrice.add(total);
    }

    /**
     * Знайти ціну для конкретного рівня
     */
    private BigDecimal findPriceForLevel(int level) {
        for (PriceRangeEntity range : ranges) {
            if (range.containsLevel(level)) {
                return range.getPrice();
            }
        }
        // If level doesn't fit in any range, return 0
        return BigDecimal.ZERO;
    }

    @Override
    public void validate() {
        if (ranges == null || ranges.isEmpty()) {
            throw new IllegalArgumentException("At least one price range is required for RangeFormula");
        }

        for (int i = 0; i < ranges.size(); i++) {
            PriceRangeEntity range = ranges.get(i);
            if (range == null) {
                throw new IllegalArgumentException("Range at index " + i + " cannot be null");
            }
            range.validate();

            // Check for range overlaps
            for (int j = i + 1; j < ranges.size(); j++) {
                PriceRangeEntity other = ranges.get(j);
                if (rangesOverlap(range, other)) {
                    throw new IllegalArgumentException(
                        String.format("Ranges overlap: %s and %s", range, other));
                }
            }
        }
    }

    /**
     * Check if two ranges overlap
     */
    private boolean rangesOverlap(PriceRangeEntity r1, PriceRangeEntity r2) {
        return r1.getFrom() <= r2.getTo() && r2.getFrom() <= r1.getTo();
    }

    // Гетери та сетери
    public List<PriceRangeEntity> getRanges() {
        return new ArrayList<>(ranges);
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        RangeFormulaEntity that = (RangeFormulaEntity) o;
        return Objects.equals(ranges, that.ranges);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), ranges);
    }

    @Override
    public String toString() {
        return String.format("RangeFormula{ranges=%s}", ranges);
    }
}
