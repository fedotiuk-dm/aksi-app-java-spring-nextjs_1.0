package com.aksi.service.game.calculation.strategy;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.aksi.domain.game.formula.LinearFormulaEntity;
import com.aksi.integration.BaseIntegrationTest;

/**
 * Integration tests for LinearFormulaCalculator using real WOW DF pricing data.
 * Tests the complete Linear calculation flow with realistic scenarios.
 */
@SpringBootTest
@ActiveProfiles("integration-test")
class LinearFormulaCalculatorIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private LinearFormulaCalculator linearCalculator;

    @Test
    @DisplayName("WOW DF Character Leveling: Should calculate 1-60 linear progression")
    void shouldCalculateWowDfCharacterLeveling1To60() {
        // Given - Real WOW DF data: Per Level = 1 ($0.01 per level)
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(100); // $1.00 per level in cents

        Integer basePrice = 0; // No base cost for character leveling
        int fromLevel = 1;
        int toLevel = 60; // Classic WOW DF max level

        // When
        Integer result = linearCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: 59 levels * $1.00 = $59.00 (5900 cents)
        assertEquals(5900, result);
    }

    @Test
    @DisplayName("WOW DF Professional Skills: Should calculate crafting level progression")
    void shouldCalculateWowDfProfessionalSkills() {
        // Given - Real WOW DF Professional data: Per Level = 2 ($0.02 per level)
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(200); // $2.00 per skill point in cents

        Integer basePrice = 1000; // $10.00 base setup cost
        int fromLevel = 1;
        int toLevel = 100; // Max profession level

        // When
        Integer result = linearCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $10.00 base + (99 levels * $2.00) = $208.00 (20800 cents)
        assertEquals(20800, result);
    }

    @Test
    @DisplayName("LOL Account Leveling: Should calculate Summoner level progression")
    void shouldCalculateLolAccountLeveling() {
        // Given - Real LOL data: Per Level varies by bracket
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(50); // $0.50 per level for early levels

        Integer basePrice = 500; // $5.00 account setup
        int fromLevel = 1;
        int toLevel = 30; // Ranked unlock level

        // When
        Integer result = linearCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $5.00 + (29 levels * $0.50) = $19.50 (1950 cents)
        assertEquals(1950, result);
    }

    @Test
    @DisplayName("FFXIV Primary Job: Should calculate Main Story Quest progression")
    void shouldCalculateFfxivPrimaryJob() {
        // Given - Real FFXIV Primary data: Per Level = 3 ($0.03 per level)
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(300); // $3.00 per level in cents

        Integer basePrice = 2000; // $20.00 MSQ completion bonus
        int fromLevel = 1;
        int toLevel = 80; // Shadowbringers max level

        // When
        Integer result = linearCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $20.00 + (79 levels * $3.00) = $257.00 (25700 cents)
        assertEquals(25700, result);
    }

    @Test
    @DisplayName("EFT Character: Should calculate Escape from Tarkov progression")
    void shouldCalculateEftCharacter() {
        // Given - Real EFT data: Linear progression with Per Level = 5 ($0.05 per level)
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(500); // $5.00 per level in cents

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 42; // EFT max PMC level

        // When
        Integer result = linearCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: 41 levels * $5.00 = $205.00 (20500 cents)
        assertEquals(20500, result);
    }

    @Test
    @DisplayName("NW Level Boost: Should calculate New World character leveling")
    void shouldCalculateNewWorldLevelBoost() {
        // Given - Real NW Level data: Per Level = 1 ($0.01 per level)
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(100); // $1.00 per level in cents

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 60; // NW max level

        // When
        Integer result = linearCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: 59 levels * $1.00 = $59.00 (5900 cents)
        assertEquals(5900, result);
    }

    @Test
    @DisplayName("Edge Case: Should handle same start and target level")
    void shouldHandleSameStartAndTargetLevel() {
        // Given
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(100);

        Integer basePrice = 1000;
        int fromLevel = 25;
        int toLevel = 25; // Same level

        // When
        Integer result = linearCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: Only base price (no level difference)
        assertEquals(1000, result);
    }

    @Test
    @DisplayName("Edge Case: Should reject negative level progression")
    void shouldHandleNegativeLevelProgression() {
        // Given
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(100);

        Integer basePrice = 1000;
        int fromLevel = 30;
        int toLevel = 25; // Lower target than start - invalid

        // When & Then - Should throw exception for invalid level range
        var exception = assertThrows(IllegalArgumentException.class, () ->
            linearCalculator.calculate(formula, basePrice, fromLevel, toLevel));
        assertEquals("Invalid level range: from=30, to=25", exception.getMessage());
    }

    @Test
    @DisplayName("Validation: Should reject null formula")
    void shouldRejectNullFormula() {
        // Given
        LinearFormulaEntity formula = null;
        Integer basePrice = 1000;
        int fromLevel = 1;
        int toLevel = 10;

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            linearCalculator.calculate(formula, basePrice, fromLevel, toLevel));
        assertEquals("Formula cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Validation: Should reject null base price")
    void shouldRejectNullBasePrice() {
        // Given
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(100);

        Integer basePrice = null;
        int fromLevel = 1;
        int toLevel = 10;

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            linearCalculator.calculate(formula, basePrice, fromLevel, toLevel));
        assertEquals("Base price cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Formula Validation: Should reject null pricePerLevel")
    void shouldRejectNullPricePerLevel() {
        // Given
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(null);

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            linearCalculator.validateFormula(formula));
        assertEquals("Price per level is required for LinearFormula", exception.getMessage());
    }

    @Test
    @DisplayName("Formula Validation: Should reject negative pricePerLevel")
    void shouldRejectNegativePricePerLevel() {
        // Given
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(-100); // Negative price

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            linearCalculator.validateFormula(formula));
        assertEquals("Price per level cannot be negative", exception.getMessage());
    }

    @Test
    @DisplayName("Performance: Should handle large level differences efficiently")
    void shouldHandleLargeLevelDifferencesEfficiently() {
        // Given - Simulate large MMO progression (1-1000)
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(1); // $0.01 per level

        Integer basePrice = 0;
        int fromLevel = 1;
        int toLevel = 1000;

        // When
        long startTime = System.nanoTime();
        Integer result = linearCalculator.calculate(formula, basePrice, fromLevel, toLevel);
        long endTime = System.nanoTime();

        // Then
        assertEquals(999, result); // 999 levels * $0.01 = $9.99 (999 cents)

        // Performance check: should be very fast (< 1ms)
        long durationMs = (endTime - startTime) / 1_000_000;
        assert durationMs < 1 : "Calculation took too long: " + durationMs + "ms";
    }

    @Test
    @DisplayName("Real Data Integration: Should match exact WOW DF pricing structure")
    void shouldMatchExactWowDfPricingStructure() {
        // Given - Exact WOW DF parsed_data structure
        // Level: "01-05", "Per Level": 1, "Per Range": 4.0
        var formula = new LinearFormulaEntity();
        formula.setPricePerLevel(100); // $1.00 per level (Per Level: 1 = $0.01 * 100)

        Integer basePrice = 0;

        // Test multiple WOW DF brackets
        // 01-05: 4 levels
        int result1to5 = linearCalculator.calculate(formula, basePrice, 1, 5);
        assertEquals(400, result1to5); // 4 levels * $1.00 = $4.00

        // 05-10: 5 levels
        int result5to10 = linearCalculator.calculate(formula, basePrice, 5, 10);
        assertEquals(500, result5to10); // 5 levels * $1.00 = $5.00

        // Combined 01-10: 9 levels
        int result1to10 = linearCalculator.calculate(formula, basePrice, 1, 10);
        assertEquals(900, result1to10); // 9 levels * $1.00 = $9.00
    }
}
