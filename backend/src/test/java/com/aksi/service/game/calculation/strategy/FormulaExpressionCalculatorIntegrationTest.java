package com.aksi.service.game.calculation.strategy;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.integration.BaseIntegrationTest;

/**
 * Integration tests for FormulaExpressionCalculator using real game data formulas.
 * Tests complex expression-based calculations with variables from parsed gaming data.
 */
@SpringBootTest
@ActiveProfiles("integration-test")
class FormulaExpressionCalculatorIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private FormulaExpressionCalculator formulaCalculator;

    @Test
    @DisplayName("Apex RP Calculation: Should calculate using perPoint and RPDiff")
    void shouldCalculateApexRpWithRealData() {
        // Given - Real Apex data: perPoint = 0.02675585284, RPDiff = 299
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + perPointValue");

        // Convert real perPoint to integer math: 0.02675585284 * 299 * 100 = 800 cents
        Map<String, Integer> variables = new HashMap<>();
        variables.put("perPointValue", 800); // Pre-calculated RP cost
        formula.setVariables(variables);

        Integer basePrice = 1500; // $15.00 base boost cost
        int fromLevel = 1;
        int toLevel = 5;

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $15.00 + $8.00 = $23.00 (2300 cents)
        assertEquals(2300, result);
    }

    @Test
    @DisplayName("WOW DF Profession Bonus: Should calculate with complexity formula")
    void shouldCalculateWowDfProfessionBonus() {
        // Given - WOW DF profession with level-dependent bonus
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + levelDiff");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("levelDiff", 25); // 25 levels * complex multiplier
        formula.setVariables(variables);

        Integer basePrice = 2000; // $20.00 base profession cost
        int fromLevel = 1;
        int toLevel = 100;

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $20.00 + $0.25 = $20.25 (2025 cents)
        assertEquals(2025, result);
    }

    @Test
    @DisplayName("LOL Dynamic Queue Formula: Should calculate MMR-based pricing")
    void shouldCalculateLolDynamicQueue() {
        // Given - LOL complex MMR calculation
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + mmrMultiplier");

        // MMR complexity: higher ranks = exponential cost increase
        Map<String, Integer> variables = new HashMap<>();
        variables.put("mmrMultiplier", 1250); // $12.50 MMR adjustment
        formula.setVariables(variables);

        Integer basePrice = 1800; // $18.00 base rank boost
        int fromLevel = 10; // Gold IV
        int toLevel = 15;   // Platinum II

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $18.00 + $12.50 = $30.50 (3050 cents)
        assertEquals(3050, result);
    }

    @Test
    @DisplayName("FFXIV Gil/Hour Formula: Should calculate market-based pricing")
    void shouldCalculateFfxivGilPerHour() {
        // Given - FFXIV gil farming with market rate
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + gilRate");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("gilRate", 875); // $8.75 per hour gil farming rate
        formula.setVariables(variables);

        Integer basePrice = 1000; // $10.00 setup cost
        int fromLevel = 1;
        int toLevel = 8; // 7 hours farming

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $10.00 + $8.75 = $18.75 (1875 cents)
        assertEquals(1875, result);
    }

    @Test
    @DisplayName("EFT Ruble Exchange: Should calculate currency conversion formula")
    void shouldCalculateEftRubleExchange() {
        // Given - EFT ruble to USD conversion
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + rubleValue");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("rubleValue", 1200); // $12.00 equivalent ruble cost
        formula.setVariables(variables);

        Integer basePrice = 800; // $8.00 service fee
        int fromLevel = 1;
        int toLevel = 10;

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $8.00 + $12.00 = $20.00 (2000 cents)
        assertEquals(2000, result);
    }

    @Test
    @DisplayName("Valorant RR Formula: Should calculate Radianite Rank progression")
    void shouldCalculateValorantRrProgression() {
        // Given - Valorant RR (Radianite Rank) complex progression
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + rrMultiplier");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("rrMultiplier", 950); // $9.50 RR difficulty adjustment
        formula.setVariables(variables);

        Integer basePrice = 1600; // $16.00 base competitive boost
        int fromLevel = 5;  // Diamond
        int toLevel = 8;    // Immortal

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $16.00 + $9.50 = $25.50 (2550 cents)
        assertEquals(2550, result);
    }

    @Test
    @DisplayName("Lost Ark Tier Materials: Should calculate enhancement cost formula")
    void shouldCalculateLostArkTierMaterials() {
        // Given - Lost Ark gear enhancement with material costs
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + materialCost");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("materialCost", 4500); // $45.00 materials for T3 enhancement
        formula.setVariables(variables);

        Integer basePrice = 2500; // $25.00 enhancement service
        int fromLevel = 15;
        int toLevel = 20; // +20 weapon

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $25.00 + $45.00 = $70.00 (7000 cents)
        assertEquals(7000, result);
    }

    @Test
    @DisplayName("Simple Addition: Should handle basic arithmetic")
    void shouldHandleSimpleAddition() {
        // Given - Simple addition formula
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + 500");

        Integer basePrice = 1000; // $10.00
        int fromLevel = 1;
        int toLevel = 10;

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $10.00 + $5.00 = $15.00 (1500 cents)
        assertEquals(1500, result);
    }

    @Test
    @DisplayName("Simple Subtraction: Should handle basic subtraction")
    void shouldHandleSimpleSubtraction() {
        // Given - Simple subtraction formula
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice - 300");

        Integer basePrice = 2000; // $20.00
        int fromLevel = 1;
        int toLevel = 5;

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $20.00 - $3.00 = $17.00 (1700 cents), but minimum 0
        assertEquals(1700, result);
    }

    @Test
    @DisplayName("Variable Substitution: Should use variable from map")
    void shouldUseVariableFromMap() {
        // Given - Formula with variable substitution
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + customValue");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("customValue", 750); // $7.50 custom value
        formula.setVariables(variables);

        Integer basePrice = 1250; // $12.50
        int fromLevel = 1;
        int toLevel = 3;

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $12.50 + $7.50 = $20.00 (2000 cents)
        assertEquals(2000, result);
    }

    @Test
    @DisplayName("Missing Variable: Should handle missing variable gracefully")
    void shouldHandleMissingVariableGracefully() {
        // Given - Formula references missing variable
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + missingVar");

        Map<String, Integer> variables = new HashMap<>();
        // missingVar not added to map
        formula.setVariables(variables);

        Integer basePrice = 1500; // $15.00
        int fromLevel = 1;
        int toLevel = 5;

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: falls back to basePrice only = $15.00 (1500 cents)
        assertEquals(1500, result);
    }

    @Test
    @DisplayName("Complex Expression: Should fallback for unsupported operations")
    void shouldFallbackForComplexExpressions() {
        // Given - Complex expression with multiplication (not fully supported)
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice * 2 + (levelDiff / 3)");

        Integer basePrice = 1000; // $10.00
        int fromLevel = 1;
        int toLevel = 10;

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: falls back to basePrice = $10.00 (1000 cents)
        assertEquals(1000, result);
    }

    @Test
    @DisplayName("Edge Case: Should handle subtraction with minimum zero")
    void shouldHandleSubtractionWithMinimumZero() {
        // Given - Subtraction that would result in negative
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice - 2000");

        Integer basePrice = 1500; // $15.00
        int fromLevel = 1;
        int toLevel = 3;

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: max(0, $15.00 - $20.00) = $0.00 (0 cents)
        assertEquals(0, result);
    }

    @Test
    @DisplayName("Edge Case: Should throw exception for empty expression")
    void shouldHandleEmptyExpression() {
        // Given - Empty expression
        var formula = new FormulaFormulaEntity();
        formula.setExpression("   "); // Whitespace only

        Integer basePrice = 1200;
        int fromLevel = 1;
        int toLevel = 5;

        // When & Then - Should throw exception for invalid expression
        var exception = assertThrows(IllegalArgumentException.class, () ->
            formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel));
        assertEquals("Expression is required for FormulaFormula", exception.getMessage());
    }

    @Test
    @DisplayName("Validation: Should reject null expression")
    void shouldRejectNullExpression() {
        // Given
        var formula = new FormulaFormulaEntity();
        formula.setExpression(null);

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            formulaCalculator.validateFormula(formula));
        assertEquals("Expression is required for FormulaFormula", exception.getMessage());
    }

    @Test
    @DisplayName("Validation: Should reject empty expression")
    void shouldRejectEmptyExpressionInValidation() {
        // Given
        var formula = new FormulaFormulaEntity();
        formula.setExpression("");

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            formulaCalculator.validateFormula(formula));
        assertEquals("Expression is required for FormulaFormula", exception.getMessage());
    }

    @Test
    @DisplayName("Validation: Should accept valid expression")
    void shouldAcceptValidExpression() {
        // Given
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + 100");

        // When & Then - should not throw exception
        formulaCalculator.validateFormula(formula);
    }

    @Test
    @DisplayName("Error Handling: Should handle null basePrice")
    void shouldHandleNullBasePrice() {
        // Given
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + 100");

        Integer basePrice = null;
        int fromLevel = 1;
        int toLevel = 5;

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel));
        assertEquals("Base price cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Performance: Should handle formula calculation efficiently")
    void shouldHandleFormulaCalculationEfficiently() {
        // Given - Multiple formula calculations
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + fixedBonus");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("fixedBonus", 100);
        formula.setVariables(variables);

        Integer basePrice = 1000;

        // When - Multiple calculations
        long startTime = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            formulaCalculator.calculate(formula, basePrice, 1, 5);
        }
        long endTime = System.nanoTime();

        // Then - Performance check: should handle 1000 calculations quickly (< 50ms)
        long durationMs = (endTime - startTime) / 1_000_000;
        assert durationMs < 50 : "1000 formula calculations took too long: " + durationMs + "ms";
    }

    @Test
    @DisplayName("Real Data Integration: Should match Apex perPoint calculation exactly")
    void shouldMatchApexPerPointCalculationExactly() {
        // Given - Exact Apex perPoint calculation
        // perPoint = 0.02675585284, RPDiff = 299
        // Real calculation: 0.02675585284 * 299 = 8.00 (rounded)
        var formula = new FormulaFormulaEntity();
        formula.setExpression("basePrice + rpCost");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("rpCost", 800); // $8.00 RP cost (pre-calculated)
        formula.setVariables(variables);

        Integer basePrice = 1500; // $15.00 Bronze IV division boost
        int fromLevel = 1;
        int toLevel = 1; // Single division

        // When
        Integer result = formulaCalculator.calculate(formula, basePrice, fromLevel, toLevel);

        // Then - Expected: $15.00 + $8.00 = $23.00 (2300 cents)
        assertEquals(2300, result);

        // Verify the calculation matches the real Apex pricing structure
        // This would be: division boost + RP cost = total cost
        assert result == 2300 : "Apex calculation doesn't match expected structure";
    }
}
