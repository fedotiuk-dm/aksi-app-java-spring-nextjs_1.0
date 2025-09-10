package com.aksi.service.game.calculation.strategy;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.aksi.domain.game.formula.TimeBasedFormulaEntity;
import com.aksi.integration.BaseIntegrationTest;

/**
 * Integration tests for TimeBasedFormulaCalculator using real Apex and other games' time-based data.
 * Tests time-based calculations with hourly rates, complexity multipliers, and minimum hours.
 */
@SpringBootTest
@ActiveProfiles("integration-test")
class TimeBasedFormulaCalculatorIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private TimeBasedFormulaCalculator timeBasedCalculator;

    @Test
    @DisplayName("Apex Bronze IV Division: Should calculate ranked boost with perDiv time data")
    void shouldCalculateApexBronzeIvDivision() {
        // Given - Real Apex data: Bronze IV, perDiv = 8 hours
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(2500);         // $25.00 per hour (typical gaming service rate)
        formula.setBaseHours(0);             // No base time for ranked divisions
        formula.setHoursPerLevel(8);         // 8 hours per division (from perDiv data)
        formula.setComplexityMultiplier(120); // 20% complexity bonus for ranked
        formula.setMinimumHours(4);          // Minimum 4 hours per division

        Integer basePrice = 0;
        int fromLevel = 1; // Bronze IV
        int toLevel = 4;   // Bronze I (3 divisions)

        // When
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected calculation:
        // Estimated hours: 0 + (3 divisions * 8 hours) = 24 hours
        // Time cost: 24 * $25.00 * 120/100 = $720.00 (72000 cents)
        assertEquals(72000, result);
    }

    @Test
    @DisplayName("Apex Silver Rank: Should calculate with higher complexity")
    void shouldCalculateApexSilverRank() {
        // Given - Apex Silver rank (higher difficulty)
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(3000);         // $30.00 per hour (higher rate for Silver)
        formula.setBaseHours(2);             // 2 hours setup/warm-up
        formula.setHoursPerLevel(10);        // 10 hours per Silver division (harder)
        formula.setComplexityMultiplier(150); // 50% complexity bonus
        formula.setMinimumHours(8);          // Minimum 8 hours

        Integer basePrice = 500; // $5.00 account verification fee
        int fromLevel = 1;
        int toLevel = 2; // 1 division boost

        // When
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected calculation:
        // Estimated hours: 2 + (1 division * 10 hours) = 12 hours
        // Time cost: 12 * $30.00 * 150/100 = $540.00 (54000 cents)
        // Total: $5.00 + $540.00 = $545.00 (54500 cents)
        assertEquals(54500, result);
    }

    @Test
    @DisplayName("WOW DF Mythic+ Dungeon: Should calculate dungeon completion time")
    void shouldCalculateWowDfMythicPlus() {
        // Given - WOW DF Mythic+ dungeon time estimates
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(4000);         // $40.00 per hour (premium dungeon service)
        formula.setBaseHours(1);             // 1 hour preparation/group forming
        formula.setHoursPerLevel(2);         // 2 hours per keystone level increase
        formula.setComplexityMultiplier(200); // 100% complexity bonus (very challenging)
        formula.setMinimumHours(3);          // Minimum 3 hours per run

        Integer basePrice = 1000; // $10.00 carry fee
        int fromLevel = 15; // +15 key
        int toLevel = 20;   // +20 key (5 levels increase)

        // When
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected calculation:
        // Estimated hours: 1 + (5 levels * 2 hours) = 11 hours
        // Time cost: 11 * $40.00 * 200/100 = $880.00 (88000 cents)
        // Total: $10.00 + $880.00 = $890.00 (89000 cents)
        assertEquals(89000, result);
    }

    @Test
    @DisplayName("FFXIV Ultimate Raid: Should calculate extreme time commitment")
    void shouldCalculateFfxivUltimateRaid() {
        // Given - FFXIV Ultimate raid clear (extreme time commitment)
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(6000);         // $60.00 per hour (ultimate raid premium)
        formula.setBaseHours(10);            // 10 hours learning/preparation
        formula.setHoursPerLevel(20);        // 20 hours per phase/checkpoint
        formula.setComplexityMultiplier(300); // 200% complexity bonus (extreme difficulty)
        formula.setMinimumHours(40);         // Minimum 40 hours total

        Integer basePrice = 5000; // $50.00 raid team coordination fee
        int fromLevel = 1;
        int toLevel = 4; // 3 major phases

        // When
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected calculation:
        // Estimated hours: 10 + (3 phases * 20 hours) = 70 hours
        // Time cost: 70 * $60.00 * 300/100 = $12,600.00 (1260000 cents)
        // Total: $50.00 + $12,600.00 = $12,650.00 (1265000 cents)
        assertEquals(1265000, result);
    }

    @Test
    @DisplayName("EFT Quest Line: Should calculate quest completion with time constraints")
    void shouldCalculateEftQuestLine() {
        // Given - EFT quest line completion (time-sensitive tasks)
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(3500);         // $35.00 per hour (skilled EFT player)
        formula.setBaseHours(3);             // 3 hours initial setup/inventory prep
        formula.setHoursPerLevel(5);         // 5 hours per major quest
        formula.setComplexityMultiplier(180); // 80% complexity bonus (RNG dependency)
        formula.setMinimumHours(15);         // Minimum 15 hours (account for RNG)

        Integer basePrice = 2000; // $20.00 quest planning fee
        int fromLevel = 1;
        int toLevel = 6; // 5 major quests

        // When
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected calculation:
        // Estimated hours: 3 + (5 quests * 5 hours) = 28 hours
        // Time cost: 28 * $35.00 * 180/100 = $1,764.00 (176400 cents)
        // Total: $20.00 + $1,764.00 = $1,784.00 (178400 cents)
        assertEquals(178400, result);
    }

    @Test
    @DisplayName("New World Territory Wars: Should calculate PvP campaign time")
    void shouldCalculateNewWorldTerritoryWars() {
        // Given - New World territory war campaign
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(2800);         // $28.00 per hour (organized PvP)
        formula.setBaseHours(5);             // 5 hours preparation/coordination
        formula.setHoursPerLevel(12);        // 12 hours per territory campaign
        formula.setComplexityMultiplier(160); // 60% complexity bonus (coordination needed)
        formula.setMinimumHours(20);         // Minimum 20 hours campaign

        Integer basePrice = 1500; // $15.00 company coordination fee
        int fromLevel = 1;
        int toLevel = 3; // 2 territory campaigns

        // When
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected calculation:
        // Estimated hours: 5 + (2 campaigns * 12 hours) = 29 hours
        // Time cost: 29 * $28.00 * 160/100 = $1,299.20 (129920 cents)
        // Total: $15.00 + $1,299.20 = $1,314.20 (131420 cents)
        assertEquals(131420, result);
    }

    @Test
    @DisplayName("Edge Case: Should apply minimum hours when calculated time is too low")
    void shouldApplyMinimumHours() {
        // Given - Low calculated time but high minimum
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(2000);         // $20.00 per hour
        formula.setBaseHours(1);             // 1 hour base
        formula.setHoursPerLevel(1);         // 1 hour per level
        formula.setComplexityMultiplier(100); // No complexity bonus
        formula.setMinimumHours(10);         // High minimum: 10 hours

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 2; // Only 1 level = 2 hours total, but minimum is 10

        // When
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Should use minimum hours: 10 * $20.00 = $200.00 (20000 cents)
        assertEquals(20000, result);
    }

    @Test
    @DisplayName("Edge Case: Should handle roundToHours setting")
    void shouldHandleRoundToHours() {
        // Given - Formula with rounding enabled
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(3000);         // $30.00 per hour
        formula.setBaseHours(2);             // 2 hours base
        formula.setHoursPerLevel(3);         // 3 hours per level
        formula.setComplexityMultiplier(100); // No complexity bonus
        formula.setMinimumHours(1);          // Low minimum
        formula.setRoundToHours(true);       // Enable rounding

        Integer basePrice = 500; // $5.00
        int fromLevel = 1;
        int toLevel = 2; // 1 level = 5 hours total

        // When
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - 5 hours * $30.00 = $150.00 + $5.00 = $155.00 (15500 cents)
        assertEquals(15500, result);
    }

    @Test
    @DisplayName("Edge Case: Should handle null minimumHours gracefully")
    void shouldHandleNullMinimumHours() {
        // Given - Formula with null minimum hours
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(2000);         // $20.00 per hour
        formula.setBaseHours(2);             // 2 hours base
        formula.setHoursPerLevel(3);         // 3 hours per level
        formula.setComplexityMultiplier(100); // No complexity bonus
        formula.setMinimumHours(null);       // Null minimum (should default to 1)

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 2; // 1 level = 5 hours total

        // When
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - 5 hours * $20.00 = $100.00 (10000 cents)
        assertEquals(10000, result);
    }

    @Test
    @DisplayName("Validation: Should reject null hourlyRate")
    void shouldRejectNullHourlyRate() {
        // Given
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(null); // Null hourly rate
        formula.setComplexityMultiplier(100);

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            timeBasedCalculator.validateFormula(formula));
        assertEquals("Hourly rate is required for TimeBasedFormula", exception.getMessage());
    }

    @Test
    @DisplayName("Validation: Should reject negative hourlyRate")
    void shouldRejectNegativeHourlyRate() {
        // Given
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(-1000); // Negative hourly rate
        formula.setComplexityMultiplier(100);

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            timeBasedCalculator.validateFormula(formula));
        assertEquals("Hourly rate must be positive", exception.getMessage());
    }

    @Test
    @DisplayName("Validation: Should reject negative baseHours")
    void shouldRejectNegativeBaseHours() {
        // Given
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(2000);
        formula.setBaseHours(-5); // Negative base hours
        formula.setComplexityMultiplier(100);

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            timeBasedCalculator.validateFormula(formula));
        assertEquals("Base hours cannot be negative", exception.getMessage());
    }

    @Test
    @DisplayName("Validation: Should reject negative hoursPerLevel")
    void shouldRejectNegativeHoursPerLevel() {
        // Given
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(2000);
        formula.setBaseHours(1);
        formula.setHoursPerLevel(-2); // Negative hours per level
        formula.setComplexityMultiplier(100);

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            timeBasedCalculator.validateFormula(formula));
        assertEquals("Hours per level cannot be negative", exception.getMessage());
    }

    @Test
    @DisplayName("Validation: Should reject invalid complexityMultiplier")
    void shouldRejectInvalidComplexityMultiplier() {
        // Given
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(2000);
        formula.setComplexityMultiplier(0); // Invalid multiplier

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            timeBasedCalculator.validateFormula(formula));
        assertEquals("Complexity multiplier must be positive", exception.getMessage());
    }

    @Test
    @DisplayName("Validation: Should reject negative minimumHours")
    void shouldRejectNegativeMinimumHours() {
        // Given
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(2000);
        formula.setComplexityMultiplier(100);
        formula.setMinimumHours(-5); // Negative minimum hours

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            timeBasedCalculator.validateFormula(formula));
        assertEquals("Minimum hours must be positive", exception.getMessage());
    }

    @Test
    @DisplayName("Performance: Should handle large time calculations efficiently")
    void shouldHandleLargeTimeCalculationsEfficiently() {
        // Given - Large time calculation (long campaign)
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(100);          // $1.00 per hour (low rate for performance test)
        formula.setBaseHours(100);           // 100 hours base
        formula.setHoursPerLevel(50);        // 50 hours per level
        formula.setComplexityMultiplier(100); // No complexity bonus
        formula.setMinimumHours(1);

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 100; // 99 levels = 4950 hours + 100 base = 5050 hours

        // When
        long startTime = System.nanoTime();
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);
        long endTime = System.nanoTime();

        // Then - 5050 hours * $1.00 = $5050.00 (505000 cents)
        assertEquals(505000, result);

        // Performance check: should be very fast (< 1ms)
        long durationMs = (endTime - startTime) / 1_000_000;
        assert durationMs < 1 : "Large time calculation took too long: " + durationMs + "ms";
    }

    @Test
    @DisplayName("Real Data Integration: Should match Apex perDiv calculation pattern")
    void shouldMatchApexPerDivCalculationPattern() {
        // Given - Exact Apex parsed_data pattern
        // Bronze IV: perDiv = 8, perPoint = 0.02675585284, RPMin = ?, RPDiff = 299
        var formula = new TimeBasedFormulaEntity();
        formula.setHourlyRate(2675);         // Derived from perPoint * 100000 for integer math
        formula.setBaseHours(8);             // perDiv value
        formula.setHoursPerLevel(0);         // No additional per-level time
        formula.setComplexityMultiplier(100); // Base multiplier
        formula.setMinimumHours(8);          // Minimum perDiv value

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 1; // Single division (no level difference)

        // When
        Integer result = timeBasedCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: 8 hours (minimum) * $26.75 = $214.00 (21400 cents)
        assertEquals(21400, result);
    }
}
