package com.aksi.domain.game.formula;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.fasterxml.jackson.annotation.JsonProperty;

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
public class RangeFormulaEntity extends CalculationFormulaEntity {

    @JsonProperty("ranges")
    private final List<PriceRangeEntity> ranges = new ArrayList<>();

    // Конструктори
    public RangeFormulaEntity() {
        super(TypeEnum.RANGE);
    }

  @Override
    public BigDecimal calculate(BigDecimal basePrice, int fromLevel, int toLevel) {
        if (basePrice == null) {
            throw new IllegalArgumentException("Base price cannot be null");
        }
        if (ranges.isEmpty()) {
            throw new IllegalArgumentException("Ranges cannot be empty");
        }

        BigDecimal total = BigDecimal.ZERO;

        // Знаходимо всі діапазони, які перекриваються з запитуваним діапазоном рівнів
        for (PriceRangeEntity range : ranges) {
            if (range.getFrom() <= toLevel && range.getTo() >= fromLevel) {
                // Діапазон перекривається - додаємо його фіксовану ціну
                total = total.add(range.getPrice());
            }
        }

                return basePrice.add(total);
    }

    @Override
    public void validate() {
        if (ranges.isEmpty()) {
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

    // Гетери та методи для роботи з діапазонами
    public List<PriceRangeEntity> getRanges() {
        return List.copyOf(ranges);
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
