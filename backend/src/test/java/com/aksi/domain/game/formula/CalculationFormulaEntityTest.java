package com.aksi.domain.game.formula;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for all CalculationFormulaEntity implementations using real data from parsed_data.
 * Tests the core calculation logic for each formula type with realistic WOW DF pricing.
 */
class CalculationFormulaEntityTest {

    @Test
    @DisplayName("Should calculate LINEAR formula with WOW DF real data")
    void shouldCalculateLinearFormulaWithRealData() {
        // Given - WOW DF Character Leveling data
        var linearFormula = new LinearFormulaEntity();
        linearFormula.setPricePerLevel(100); // $1.00 per level (from WOW DF data)

        Integer basePrice = 0; // Base price for leveling (0 cents)
        int fromLevel = 1;
        int toLevel = 10; // 9 levels to boost

        // When
        Integer result = linearFormula.calculate(basePrice, fromLevel, toLevel);

        // Then - Expected: 9 levels * $1.00 = $9.00 (900 cents)
        assertEquals(900, result);
    }

    @Test
    @DisplayName("Should calculate RANGE formula with WOW DF real data")
    void shouldCalculateRangeFormulaWithRealData() {
        // Given - WOW DF Character Leveling ranges
        var rangeFormula = new RangeFormulaEntity();

        // Add real ranges from WOW DF data
        rangeFormula.getRanges().add(new PriceRangeEntity(1, 5, 400));   // 01-05: $4.00
        rangeFormula.getRanges().add(new PriceRangeEntity(5, 10, 500));  // 05-10: $5.00
        rangeFormula.getRanges().add(new PriceRangeEntity(10, 15, 500)); // 10-15: $5.00

        Integer basePrice = 0; // Base price for leveling
        int fromLevel = 1;
        int toLevel = 12; // Covers 01-05 + 05-10 + part of 10-15

        // When
        Integer result = rangeFormula.calculate(basePrice, fromLevel, toLevel);

        // Then - Expected: $4.00 (01-05) + $5.00 (05-10) + $5.00 (10-15) = $14.00 (1400 cents)
        // All ranges that overlap with 1-12 get their full fixed price
        assertEquals(1400, result);
    }

    @Test
    @DisplayName("Should calculate TIME_BASED formula with Apex real data")
    void shouldCalculateTimeBasedFormulaWithRealData() {
        // Given - Apex Ranked data (Bronze IV division)
        var timeBasedFormula = new TimeBasedFormulaEntity();
        timeBasedFormula.setHourlyRate(2000); // $20.00 per hour (typical gaming service rate)
        timeBasedFormula.setBaseHours(8);     // 8 hours base time (from Apex perDiv data)
        timeBasedFormula.setHoursPerLevel(1); // 1 hour per level
        timeBasedFormula.setComplexityMultiplier(1.5f); // 50% complexity bonus

        Integer basePrice = 0; // Base price for ranked boost
        int fromLevel = 1;
        int toLevel = 5; // 4 levels to boost

        // When
        Integer result = timeBasedFormula.calculate(basePrice, fromLevel, toLevel);

        // Then - Expected calculation:
        // Estimated hours: 8 + (4 * 1) = 12 hours
        // Time cost: 12 * $20.00 * 1.5 = $360.00 (36000 cents)
        assertEquals(36000, result);
    }

    @Test
    @DisplayName("Should throw exception when basePrice is null")
    void shouldThrowExceptionWhenBasePriceIsNull() {
        // Given
        var linearFormula = new LinearFormulaEntity();
        linearFormula.setPricePerLevel(100); // Set price per level first
        Integer basePrice = null;
        int fromLevel = 1;
        int toLevel = 5;

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            linearFormula.calculate(basePrice, fromLevel, toLevel));
        assertEquals("Base price cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should handle edge case with same start and target level")
    void shouldHandleEdgeCaseWithSameStartAndTargetLevel() {
        // Given
        var linearFormula = new LinearFormulaEntity();
        linearFormula.setPricePerLevel(100); // $1.00 per level
        Integer basePrice = 1000; // $10.00 in cents
        int fromLevel = 5;
        int toLevel = 5; // Same level

        // When
        Integer result = linearFormula.calculate(basePrice, fromLevel, toLevel);

        // Then - Expected: $10.00 (no additional cost for same level)
        assertEquals(1000, result);
    }



    @Test
    @DisplayName("Should calculate FORMULA with simple expression")
    void shouldCalculateFormulaWithSimpleExpression() {
        // Given - Simple formula from WOW DF data
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice + 500"); // Add $5.00 fixed amount

        Integer basePrice = 1000; // $10.00 in cents
        int fromLevel = 1;
        int toLevel = 5;

        // When
        Integer result = formulaEntity.calculate(basePrice, fromLevel, toLevel);

        // Then - Expected: $10.00 + $5.00 = $15.00 (1500 cents)
        assertEquals(1500, result);
    }

    @Test
    @DisplayName("Should validate LINEAR formula")
    void shouldValidateLinearFormula() {
        // Given
        var linearFormula = new LinearFormulaEntity();
        linearFormula.setPricePerLevel(100); // Set required field for validation

        // When & Then - should not throw exception
        linearFormula.validate();
    }

    @Test
    @DisplayName("Should validate RANGE formula")
    void shouldValidateRangeFormula() {
        // Given
        var rangeFormula = new RangeFormulaEntity();
        rangeFormula.getRanges().add(new PriceRangeEntity(1, 5, 400)); // Add required range for validation

        // When & Then - should not throw exception
        rangeFormula.validate();
    }

    @Test
    @DisplayName("Should validate TIME_BASED formula")
    void shouldValidateTimeBasedFormula() {
        // Given
        var timeFormula = new TimeBasedFormulaEntity();
        timeFormula.setHourlyRate(2000); // Set required field for validation

        // When & Then - should not throw exception
        timeFormula.validate();
    }
}
