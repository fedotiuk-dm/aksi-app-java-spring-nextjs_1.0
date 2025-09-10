package com.aksi.service.game.calculation.strategy;

import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.game.formula.PriceRangeEntity;
import com.aksi.domain.game.formula.RangeFormulaEntity;
import com.aksi.service.game.calculation.util.CalculationConstants;
import com.aksi.service.game.calculation.util.CalculationUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * Business logic calculator for Range Formula calculations.
 * Extracted from RangeFormulaEntity to follow DDD principles.
 */
@Component
@Slf4j
public class RangeFormulaCalculator {

    /**
     * Calculate price using range formula: sum of all overlapping range prices.
     * Moved from RangeFormulaEntity.calculate() method.
     *
     * @param formula Range formula configuration
     * @param basePrice Base price in cents
     * @param fromLevel Starting level
     * @param toLevel Target level
     * @return Calculated price in cents
     */
    public Integer calculate(RangeFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        validateInputs(formula, basePrice, fromLevel, toLevel);

        int total = 0;
        int applicableRanges = 0;

        // Find all ranges that overlap with requested level range
        for (PriceRangeEntity range : formula.getRanges()) {
            if (rangeOverlaps(range, fromLevel, toLevel)) {
                total = CalculationUtils.safeAdd(total, range.getPrice());
                applicableRanges++;

                if (log.isDebugEnabled()) {
                    log.debug("Applied range {}-{} with price {}", range.getFrom(), range.getTo(), range.getPrice());
                }
            }
        }

        int result = CalculationUtils.safeAdd(basePrice, total);

        if (log.isDebugEnabled()) {
            log.debug("Range calculation: basePrice={}, applicableRanges={}, total={}, result={}",
                    basePrice, applicableRanges, total, result);
        }

        return result;
    }

    /**
     * Validate range formula configuration.
     * Moved from RangeFormulaEntity.validate() method.
     *
     * @param formula Range formula configuration
     * @throws IllegalArgumentException if validation fails
     */
    public void validateFormula(RangeFormulaEntity formula) {
        List<PriceRangeEntity> ranges = formula.getRanges();

        if (ranges.isEmpty()) {
            throw new IllegalArgumentException("At least one price range is required for RangeFormula");
        }

        for (int i = 0; i < ranges.size(); i++) {
            PriceRangeEntity range = ranges.get(i);
            if (range == null) {
                throw new IllegalArgumentException("Range at index " + i + " cannot be null");
            }
            validatePriceRange(range);

            // Check for range overlaps
            for (int j = i + 1; j < ranges.size(); j++) {
                PriceRangeEntity other = ranges.get(j);
                if (priceRangesOverlap(range, other)) {
                    throw new IllegalArgumentException(
                        String.format("Ranges overlap: %s and %s", range, other));
                }
            }
        }
    }

    /**
     * Validate individual price range.
     * Moved from PriceRangeEntity.validate() method.
     */
    public void validatePriceRange(PriceRangeEntity range) {
        if (range.getFrom() <= 0) {
            throw new IllegalArgumentException("From level must be positive");
        }
        if (range.getTo() < range.getFrom()) {
            throw new IllegalArgumentException("To level must be >= from level");
        }
        if (range.getPrice() == null) {
            throw new IllegalArgumentException("Price cannot be null");
        }
        if (range.getPrice() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
    }

    /**
     * Check if range overlaps with level range.
     *<p>
     * Business Logic: Any overlap between range and request applies the range price.
     * This matches the original Excel-based logic where overlapping ranges are cumulative.
     *<p>
     * Examples:
     * - Request 1-5, Range (1-5): overlap -> true
     * - Request 1-5, Range (5-10): overlap at level 5 -> true
     * - Request 3-12, Range (1-5): overlap at levels 3-5 -> true
     * - Request 3-12, Range (15-20): no overlap -> false
     */
    private boolean rangeOverlaps(PriceRangeEntity range, int fromLevel, int toLevel) {
        return range.getFrom() <= toLevel && range.getTo() >= fromLevel;
    }

    /**
     * Check if two price ranges have true overlap (not just touching at boundaries).
     * Moved from RangeFormulaEntity.rangesOverlap() method.
     *<p>
     * Examples:
     * - (1-5) and (5-10): touching at level 5 -> false (allowed)
     * - (1-5) and (4-8): overlapping at levels 4,5 -> true (forbidden)
     */
    private boolean priceRangesOverlap(PriceRangeEntity r1, PriceRangeEntity r2) {
        // Allow touching at boundaries, forbid true overlaps
        return r1.getFrom() < r2.getTo() && r2.getFrom() < r1.getTo();
    }

    /**
     * Validate all inputs for calculation.
     */
    private void validateInputs(RangeFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        if (formula == null) {
            throw new IllegalArgumentException(CalculationConstants.ErrorMessages.FORMULA_NULL);
        }
        if (basePrice == null) {
            throw new IllegalArgumentException(CalculationConstants.ErrorMessages.BASE_PRICE_NULL);
        }
        if (CalculationUtils.isValidLevelRange(fromLevel, toLevel)) {
            throw new IllegalArgumentException("Invalid level range: from=" + fromLevel + ", to=" + toLevel);
        }

        validateFormula(formula);
    }

    /**
     * Get description of range calculation for logging.
     */
    public String getDescription(RangeFormulaEntity formula) {
        return String.format("Range(%d ranges)", formula.getRanges().size());
    }
}
