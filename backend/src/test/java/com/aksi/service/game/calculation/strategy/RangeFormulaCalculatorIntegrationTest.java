package com.aksi.service.game.calculation.strategy;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.aksi.domain.game.formula.PriceRangeEntity;
import com.aksi.domain.game.formula.RangeFormulaEntity;
import com.aksi.integration.BaseIntegrationTest;

/**
 * Integration tests for RangeFormulaCalculator using real WOW DF Per Range pricing data.
 * Tests range-based calculations with fixed prices per level bracket.
 */
@SpringBootTest
@ActiveProfiles("integration-test")
class RangeFormulaCalculatorIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private RangeFormulaCalculator rangeCalculator;

    @Test
    @DisplayName("WOW DF Character Leveling: Should calculate range-based pricing 1-60")
    void shouldCalculateWowDfRangePricing1To60() {
        // Given - Real WOW DF Per Range data from parsed_data
        var formula = new RangeFormulaEntity();

        // WOW DF range structure from parsed_data:
        // 01-05: Per Range = 4.0 ($4.00)
        // 05-10: Per Range = 5.0 ($5.00)
        // 10-15: Per Range = 5.0 ($5.00)
        // 15-20: Per Range = 6.0 ($6.00)
        // 20-25: Per Range = 8.0 ($8.00)
        formula.getRanges().add(new PriceRangeEntity(1, 5, 400));   // $4.00
        formula.getRanges().add(new PriceRangeEntity(5, 10, 500));  // $5.00
        formula.getRanges().add(new PriceRangeEntity(10, 15, 500)); // $5.00
        formula.getRanges().add(new PriceRangeEntity(15, 20, 600)); // $6.00
        formula.getRanges().add(new PriceRangeEntity(20, 25, 800)); // $8.00

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 25; // Covers all ranges

        // When
        Integer result = rangeCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - All overlapping ranges: $4.00 + $5.00 + $5.00 + $6.00 + $8.00 = $28.00 (2800 cents)
        assertEquals(2800, result);
    }

    @Test
    @DisplayName("WOW DF Partial Range: Should calculate overlapping ranges only")
    void shouldCalculatePartialRangeOverlap() {
        // Given - Same WOW DF range structure
        var formula = new RangeFormulaEntity();
        formula.getRanges().add(new PriceRangeEntity(1, 5, 400));   // $4.00
        formula.getRanges().add(new PriceRangeEntity(5, 10, 500));  // $5.00
        formula.getRanges().add(new PriceRangeEntity(10, 15, 500)); // $5.00
        formula.getRanges().add(new PriceRangeEntity(15, 20, 600)); // $6.00

        Integer basePrice = 1000; // $10.00 base cost
        int fromLevel = 3;  // Mid-range start
        int toLevel = 12;   // Mid-range end

        // When
        Integer result = rangeCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Overlapping ranges: 01-05 ($4.00) + 05-10 ($5.00) + 10-15 ($5.00) = $14.00 + $10.00 base = $24.00 (2400 cents)
        assertEquals(2400, result);
    }

    @Test
    @DisplayName("LOL Ranked Tiers: Should calculate tier-based progression")
    void shouldCalculateLolRankedTiers() {
        // Given - LOL Ranked tier pricing structure (simulated from parsed data patterns)
        var formula = new RangeFormulaEntity();

        // LOL tier structure:
        // Iron (1-4): $10.00
        // Bronze (5-8): $15.00
        // Silver (9-12): $25.00
        // Gold (13-16): $40.00
        formula.getRanges().add(new PriceRangeEntity(1, 4, 1000));   // Iron: $10.00
        formula.getRanges().add(new PriceRangeEntity(5, 8, 1500));   // Bronze: $15.00
        formula.getRanges().add(new PriceRangeEntity(9, 12, 2500));  // Silver: $25.00
        formula.getRanges().add(new PriceRangeEntity(13, 16, 4000)); // Gold: $40.00

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 16; // Iron to Gold

        // When
        Integer result = rangeCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - All tiers: $10.00 + $15.00 + $25.00 + $40.00 = $90.00 (9000 cents)
        assertEquals(9000, result);
    }

    @Test
    @DisplayName("FFXIV Job Levels: Should calculate job bracket pricing")
    void shouldCalculateFfxivJobBrackets() {
        // Given - FFXIV job level brackets (based on expansion structure)
        var formula = new RangeFormulaEntity();

        // FFXIV bracket structure:
        // ARR (1-50): $20.00
        // HW (50-60): $15.00
        // SB (60-70): $18.00
        // ShB (70-80): $22.00
        formula.getRanges().add(new PriceRangeEntity(1, 50, 2000));  // ARR: $20.00
        formula.getRanges().add(new PriceRangeEntity(50, 60, 1500)); // HW: $15.00
        formula.getRanges().add(new PriceRangeEntity(60, 70, 1800)); // SB: $18.00
        formula.getRanges().add(new PriceRangeEntity(70, 80, 2200)); // ShB: $22.00

        Integer basePrice = 500; // $5.00 job unlock fee
        int fromLevel = 1;
        int toLevel = 80; // Full job progression

        // When
        Integer result = rangeCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - All expansions: $5.00 + $20.00 + $15.00 + $18.00 + $22.00 = $80.00 (8000 cents)
        assertEquals(8000, result);
    }

    @Test
    @DisplayName("Lost Ark Tier Progression: Should calculate gear tier brackets")
    void shouldCalculateLostArkTierBrackets() {
        // Given - Lost Ark tier structure (T1/T2/T3 progression)
        var formula = new RangeFormulaEntity();

        // Lost Ark tier structure:
        // T1 (1-5): $12.00
        // T2 (6-10): $25.00
        // T3 (11-15): $50.00
        formula.getRanges().add(new PriceRangeEntity(1, 5, 1200));   // T1: $12.00
        formula.getRanges().add(new PriceRangeEntity(6, 10, 2500));  // T2: $25.00
        formula.getRanges().add(new PriceRangeEntity(11, 15, 5000)); // T3: $50.00

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 15; // Full tier progression

        // When
        Integer result = rangeCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - All tiers: $12.00 + $25.00 + $50.00 = $87.00 (8700 cents)
        assertEquals(8700, result);
    }

    @Test
    @DisplayName("Edge Case: Should handle single range overlap")
    void shouldHandleSingleRangeOverlap() {
        // Given
        var formula = new RangeFormulaEntity();
        formula.getRanges().add(new PriceRangeEntity(10, 20, 1500)); // $15.00
        formula.getRanges().add(new PriceRangeEntity(30, 40, 2000)); // $20.00 (no overlap)

        Integer basePrice = 500;
        int fromLevel = 15;
        int toLevel = 18; // Only overlaps first range

        // When
        Integer result = rangeCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Only first range: $5.00 + $15.00 = $20.00 (2000 cents)
        assertEquals(2000, result);
    }

    @Test
    @DisplayName("Edge Case: Should handle no range overlap")
    void shouldHandleNoRangeOverlap() {
        // Given
        var formula = new RangeFormulaEntity();
        formula.getRanges().add(new PriceRangeEntity(10, 20, 1500)); // $15.00
        formula.getRanges().add(new PriceRangeEntity(30, 40, 2000)); // $20.00

        Integer basePrice = 500;
        int fromLevel = 22;
        int toLevel = 25; // No overlap with any range

        // When
        Integer result = rangeCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Only base price: $5.00 (500 cents)
        assertEquals(500, result);
    }

    @Test
    @DisplayName("Edge Case: Should handle exact range boundaries")
    void shouldHandleExactRangeBoundaries() {
        // Given
        var formula = new RangeFormulaEntity();
        formula.getRanges().add(new PriceRangeEntity(1, 5, 400));   // $4.00
        formula.getRanges().add(new PriceRangeEntity(5, 10, 600));  // $6.00

        Integer basePrice = 0;
        int fromLevel = 5;
        int toLevel = 5; // Exact boundary

        // When
        Integer result = rangeCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Both ranges overlap with level 5: $4.00 + $6.00 = $10.00 (1000 cents)
        assertEquals(1000, result);
    }

    @Test
    @DisplayName("Validation: Should reject empty ranges")
    void shouldRejectEmptyRanges() {
        // Given - Empty ranges list
        var formula = new RangeFormulaEntity();
        // No ranges added

        Integer basePrice = 1000;
        int fromLevel = 1;
        int toLevel = 10;

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            rangeCalculator.calculate(formula, basePrice, fromLevel, toLevel));
        assertEquals("At least one price range is required for RangeFormula", exception.getMessage());
    }

    @Test
    @DisplayName("Formula Validation: Should reject overlapping ranges")
    void shouldRejectOverlappingRanges() {
        // Given - Overlapping ranges
        var formula = new RangeFormulaEntity();
        formula.getRanges().add(new PriceRangeEntity(1, 10, 400));   // 1-10
        formula.getRanges().add(new PriceRangeEntity(5, 15, 600));   // 5-15 (overlaps with 1-10)

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            rangeCalculator.validateFormula(formula));
        assert exception.getMessage().contains("Ranges overlap");
    }

    @Test
    @DisplayName("Range Validation: Should reject invalid range bounds")
    void shouldRejectInvalidRangeBounds() {
        // Given - Invalid range (to < from)
        var range = new PriceRangeEntity(10, 5, 400); // Invalid: to < from

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            rangeCalculator.validatePriceRange(range));
        assertEquals("To level must be >= from level", exception.getMessage());
    }

    @Test
    @DisplayName("Range Validation: Should reject negative price")
    void shouldRejectNegativePrice() {
        // Given - Negative price
        var range = new PriceRangeEntity(1, 10, -400); // Negative price

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            rangeCalculator.validatePriceRange(range));
        assertEquals("Price cannot be negative", exception.getMessage());
    }

    @Test
    @DisplayName("Range Validation: Should reject zero or negative from level")
    void shouldRejectInvalidFromLevel() {
        // Given - Invalid from level
        var range = new PriceRangeEntity(0, 10, 400); // from = 0

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            rangeCalculator.validatePriceRange(range));
        assertEquals("From level must be positive", exception.getMessage());
    }

    @Test
    @DisplayName("Performance: Should handle many ranges efficiently")
    void shouldHandleManyRangesEfficiently() {
        // Given - Many ranges (100 ranges)
        var formula = new RangeFormulaEntity();
        for (int i = 0; i < 100; i++) {
            int from = i * 10 + 1;
            int to = from + 9;
            formula.getRanges().add(new PriceRangeEntity(from, to, 100)); // $1.00 each
        }

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 1000; // Covers all ranges

        // When
        long startTime = System.nanoTime();
        Integer result = rangeCalculator.calculate(formula, basePrice, fromLevel, toLevel);
        long endTime = System.nanoTime();

        // Then - All 100 ranges: 100 * $1.00 = $100.00 (10000 cents)
        assertEquals(10000, result);

        // Performance check: should handle many ranges quickly (< 5ms)
        long durationMs = (endTime - startTime) / 1_000_000;
        assert durationMs < 5 : "Calculation with many ranges took too long: " + durationMs + "ms";
    }

    @Test
    @DisplayName("Real Data Integration: Should match WOW DF exact range pricing")
    void shouldMatchWowDfExactRangePricing() {
        // Given - Exact WOW DF parsed_data Per Range structure
        var formula = new RangeFormulaEntity();

        // Real WOW DF data verification:
        // Level "01-05": Per Range = 4.0 = $4.00
        // Level "05-10": Per Range = 5.0 = $5.00
        formula.getRanges().add(new PriceRangeEntity(1, 5, 400));   // $4.00
        formula.getRanges().add(new PriceRangeEntity(5, 10, 500));  // $5.00

        Integer basePrice = 0;

        // Test exact parsed_data scenarios:
        // 01-05 range - overlaps with both (1-5) and (5-10) at level 5
        int result1to5 = rangeCalculator.calculate(formula, basePrice, 1, 5);
        assertEquals(900, result1to5); // Both ranges overlap: $4.00 + $5.00 = $9.00

        // 05-10 range only
        int result5to10 = rangeCalculator.calculate(formula, basePrice, 5, 10);
        assertEquals(900, result5to10); // Both ranges overlap with 5-10: $4.00 + $5.00 = $9.00

        // Combined 01-10 (covers both ranges)
        int result1to10 = rangeCalculator.calculate(formula, basePrice, 1, 10);
        assertEquals(900, result1to10); // Both ranges: $4.00 + $5.00 = $9.00

        // Partial overlap 03-07 (crosses boundary)
        int result3to7 = rangeCalculator.calculate(formula, basePrice, 3, 7);
        assertEquals(900, result3to7); // Both ranges overlap: $4.00 + $5.00 = $9.00
    }
}
