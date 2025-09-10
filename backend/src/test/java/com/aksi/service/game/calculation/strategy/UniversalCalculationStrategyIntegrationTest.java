package com.aksi.service.game.calculation.strategy;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.aksi.api.game.dto.CalculationFormula.TypeEnum;
import com.aksi.api.game.dto.UniversalCalculationContext;
import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.integration.BaseIntegrationTest;

/**
 * Integration tests for UniversalCalculationStrategy using combined scenarios from real game data.
 * Tests universal calculations that can handle multiple calculation types and create default formulas.
 */
@SpringBootTest
@ActiveProfiles("integration-test")
class UniversalCalculationStrategyIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private UniversalCalculationStrategy universalStrategy;

    @Autowired
    private FormulaExpressionCalculator formulaCalculator;

    @Test
    @DisplayName("Universal WOW DF: Should create default formula for character leveling")
    void shouldCreateDefaultFormulaForWowDfCharacterLeveling() {
        // Given - WOW DF context without explicit formula
        var context = new UniversalCalculationContext();
        context.setGameCode("WOW_DF");
        context.setServiceTypeCode("CHARACTER_LEVELING");
        context.setStartLevel(1);
        context.setTargetLevel(60);

        Map<String, Integer> additionalParams = new HashMap<>();
        additionalParams.put("basePrice", 0);      // No base cost
        additionalParams.put("levelDiff", 5900);   // 59 levels * $1.00 = $59.00 (5900 cents)
        context.setAdditionalParameters(additionalParams);

        // When - Create default formula
        var defaultFormula = universalStrategy.createDefaultFormula(context);

        // Then - Should create FormulaFormulaEntity with basePrice + levelDiff
        assertNotNull(defaultFormula);
      assertInstanceOf(FormulaFormulaEntity.class, defaultFormula);

        FormulaFormulaEntity formulaEntity = (FormulaFormulaEntity) defaultFormula;
        assertEquals("basePrice + levelDiff", formulaEntity.getExpression());
        assertEquals(TypeEnum.FORMULA, formulaEntity.getType());

        // Verify variables are set correctly
        Map<String, Integer> variables = formulaEntity.getVariables();
        assertEquals(0, variables.get("basePrice"));
        assertEquals(5900, variables.get("levelDiff"));
    }

    @Test
    @DisplayName("Universal Apex Ranked: Should calculate complex multi-component boost")
    void shouldCalculateApexRankedMultiComponent() {
        // Given - Complex Apex ranked boost combining multiple elements
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice + levelDiff");

        // Real Apex data integration:
        // - Division boost: $15.00 per division
        // - RP cost: $8.00 (from perPoint * RPDiff)
        // - Total per division: $23.00
        Map<String, Integer> variables = new HashMap<>();
        variables.put("basePrice", 1500);  // $15.00 division boost
        variables.put("levelDiff", 800);   // $8.00 RP cost
        formulaEntity.setVariables(variables);

        // When - Calculate using universal strategy
        Integer result = universalStrategy.calculatePrice(formulaEntity, 1500, 1, 4);

        // Then - Expected: $15.00 + $8.00 = $23.00 (2300 cents)
        assertEquals(2300, result);
    }

    @Test
    @DisplayName("Universal LOL Combined: Should handle combined rank + level boost")
    void shouldHandleLolCombinedBoost() {
        // Given - LOL account with both rank and level progression
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice + levelDiff");

        // Combined LOL pricing:
        // - Rank boost (Iron to Gold): $90.00
        // - Account level (1-30): $19.50
        // - Total combined discount: -$10.00 (bundle discount)
        Map<String, Integer> variables = new HashMap<>();
        variables.put("basePrice", 9000);   // $90.00 rank boost
        variables.put("levelDiff", 950);    // $19.50 - $10.00 = $9.50 net level cost
        formulaEntity.setVariables(variables);

        // When
        Integer result = universalStrategy.calculatePrice(formulaEntity, 9000, 1, 30);

        // Then - Expected: $90.00 + $9.50 = $99.50 (9950 cents)
        assertEquals(9950, result);
    }

    @Test
    @DisplayName("Universal FFXIV Ultimate: Should handle extreme complexity calculation")
    void shouldHandleFfxivUltimateComplexity() {
        // Given - FFXIV Ultimate raid clear with multiple components
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice + levelDiff");

        // FFXIV Ultimate complexity:
        // - Base raid clear: $500.00
        // - Preparation time: $200.00 (10 hours * $20/hour)
        // - Gear optimization: $150.00
        // - Multiple attempts factor: $100.00
        Map<String, Integer> variables = new HashMap<>();
        variables.put("basePrice", 50000);  // $500.00 base clear
        variables.put("levelDiff", 45000);  // $450.00 additional components
        formulaEntity.setVariables(variables);

        // When
        Integer result = universalStrategy.calculatePrice(formulaEntity, 50000, 1, 4);

        // Then - Expected: $500.00 + $450.00 = $950.00 (95000 cents)
        assertEquals(95000, result);
    }

    @Test
    @DisplayName("Universal EFT Quest Chain: Should handle multi-quest progression")
    void shouldHandleEftQuestChain() {
        // Given - EFT complex quest chain with multiple dependencies
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice + levelDiff");

        // EFT quest chain complexity:
        // - Base quest completion: $100.00
        // - Item farming costs: $75.00
        // - RNG retry buffer: $50.00
        // - Skill leveling: $25.00
        Map<String, Integer> variables = new HashMap<>();
        variables.put("basePrice", 10000);  // $100.00 base quests
        variables.put("levelDiff", 15000);  // $150.00 additional complexity
        formulaEntity.setVariables(variables);

        // When
        Integer result = universalStrategy.calculatePrice(formulaEntity, 10000, 1, 15);

        // Then - Expected: $100.00 + $150.00 = $250.00 (25000 cents)
        assertEquals(25000, result);
    }

    @Test
    @DisplayName("Universal New World Territory: Should handle PvP campaign complexity")
    void shouldHandleNewWorldTerritoryComplexity() {
        // Given - New World territory war campaign
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice + levelDiff");

        // NW territory complexity:
        // - Company coordination: $50.00
        // - War participation: $200.00
        // - Territory management: $100.00
        // - PvP expertise premium: $80.00
        Map<String, Integer> variables = new HashMap<>();
        variables.put("basePrice", 5000);   // $50.00 coordination
        variables.put("levelDiff", 38000);  // $380.00 war/management/premium
        formulaEntity.setVariables(variables);

        // When
        Integer result = universalStrategy.calculatePrice(formulaEntity, 5000, 1, 5);

        // Then - Expected: $50.00 + $380.00 = $430.00 (43000 cents)
        assertEquals(43000, result);
    }

    @Test
    @DisplayName("Universal Lost Ark Progression: Should handle multi-tier advancement")
    void shouldHandleLostArkMultiTierProgression() {
        // Given - Lost Ark T1 -> T3 full progression
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice + levelDiff");

        // Lost Ark progression complexity:
        // - T1 gear: $50.00
        // - T2 gear: $125.00
        // - T3 gear: $300.00
        // - Enhancement materials: $200.00
        // - Time investment: $150.00
        Map<String, Integer> variables = new HashMap<>();
        variables.put("basePrice", 47500);  // $475.00 gear progression
        variables.put("levelDiff", 35000);  // $350.00 materials + time
        formulaEntity.setVariables(variables);

        // When
        Integer result = universalStrategy.calculatePrice(formulaEntity, 47500, 1, 15);

        // Then - Expected: $475.00 + $350.00 = $825.00 (82500 cents)
        assertEquals(82500, result);
    }

    @Test
    @DisplayName("Universal Default Creation: Should create formula with missing parameters")
    void shouldCreateFormulaWithMissingParameters() {
        // Given - Context with minimal information
        var context = new UniversalCalculationContext();
        context.setGameCode("GENERIC_GAME");
        context.setServiceTypeCode("LEVEL_BOOST");
        context.setStartLevel(10);
        context.setTargetLevel(20);
        // No additionalParameters provided

        // When
        var defaultFormula = universalStrategy.createDefaultFormula(context);

        // Then - Should still create valid formula with defaults
        assertNotNull(defaultFormula);
      assertInstanceOf(FormulaFormulaEntity.class, defaultFormula);

        FormulaFormulaEntity formulaEntity = (FormulaFormulaEntity) defaultFormula;
        assertEquals("basePrice + levelDiff", formulaEntity.getExpression());

        // Variables should be empty when no additional parameters
        Map<String, Integer> variables = formulaEntity.getVariables();
        assertTrue(variables.isEmpty());
    }

    @Test
    @DisplayName("Universal Edge Case: Should handle zero level difference")
    void shouldHandleZeroLevelDifference() {
        // Given - Same start and target level
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice + levelDiff");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("basePrice", 1000);  // $10.00 base
        variables.put("levelDiff", 0);     // No level difference
        formulaEntity.setVariables(variables);

        // When
        Integer result = universalStrategy.calculatePrice(formulaEntity, 1000, 25, 25);

        // Then - Expected: Only base price = $10.00 (1000 cents)
        assertEquals(1000, result);
    }

    @Test
    @DisplayName("Universal Edge Case: Should handle negative calculations gracefully")
    void shouldHandleNegativeCalculationsGracefully() {
        // Given - Formula that might result in negative
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice - 2000");

        // When
        Integer result = universalStrategy.calculatePrice(formulaEntity, 1000, 1, 5);

        // Then - Expected: max(0, $10.00 - $20.00) = $0.00 (0 cents)
        assertEquals(0, result);
    }

    @Test
    @DisplayName("Strategy Support: Should support UNIVERSAL formula type")
    void shouldSupportUniversalFormulaType() {
        // When & Then
        assertTrue(universalStrategy.supports("UNIVERSAL"));
        assertTrue(universalStrategy.supports("universal"));
        assertTrue(universalStrategy.supports("Universal"));
    }

    @Test
    @DisplayName("Strategy Support: Should not support other formula types")
    void shouldNotSupportOtherFormulaTypes() {
        // When & Then
        assert !universalStrategy.supports("LINEAR");
        assert !universalStrategy.supports("RANGE");
        assert !universalStrategy.supports("TIME_BASED");
        assert !universalStrategy.supports("FORMULA");
        assert !universalStrategy.supports("INVALID");
    }

    @Test
    @DisplayName("Strategy Description: Should provide clear description")
    void shouldProvideDescription() {
        // When
        String description = universalStrategy.getDescription();

        // Then
        assertEquals("Universal Calculation Strategy", description);
    }

    @Test
    @DisplayName("Error Handling: Should handle null formula gracefully")
    void shouldHandleNullFormulaGracefully() {
        // Given
        FormulaFormulaEntity formula = null;
        Integer basePrice = 1000;
        int fromLevel = 1;
        int toLevel = 5;

        // When & Then
        var exception = assertThrows(IllegalArgumentException.class, () ->
            universalStrategy.calculatePrice(formula, basePrice, fromLevel, toLevel));

        // Should delegate to FormulaExpressionCalculator error handling
        assertEquals("Formula cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Performance: Should handle complex universal calculations efficiently")
    void shouldHandleComplexCalculationsEfficiently() {
        // Given - Complex universal calculation
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice + levelDiff");

        Map<String, Integer> variables = new HashMap<>();
        variables.put("basePrice", 50000);   // $500.00
        variables.put("levelDiff", 100000);  // $1000.00
        formulaEntity.setVariables(variables);

        // When - Multiple calculations
        long startTime = System.nanoTime();
        for (int i = 0; i < 500; i++) {
            universalStrategy.calculatePrice(formulaEntity, 50000, 1, 100);
        }
        long endTime = System.nanoTime();

        // Then - Should handle 500 universal calculations quickly (< 50ms)
        long durationMs = (endTime - startTime) / 1_000_000;
        assert durationMs < 50 : "500 universal calculations took too long: " + durationMs + "ms";
    }

    @Test
    @DisplayName("Real Data Integration: Should create realistic default for parsed data scenarios")
    void shouldCreateRealisticDefaultForParsedDataScenarios() {
        // Given - Scenario based on real WOW DF parsed data
        var context = new UniversalCalculationContext();
        context.setGameCode("WOW_DF_PARSED");
        context.setServiceTypeCode("CHARACTER_LEVELING_01_05");
        context.setStartLevel(1);
        context.setTargetLevel(5);

        // Real WOW DF data: Level "01-05", Per Level = 1, Per Range = 4.0
        Map<String, Integer> additionalParams = new HashMap<>();
        additionalParams.put("basePrice", 0);      // No base cost
        additionalParams.put("levelDiff", 400);    // Per Range = 4.0 = $4.00 (400 cents)
        context.setAdditionalParameters(additionalParams);

        // When
        var defaultFormula = universalStrategy.createDefaultFormula(context);
        Integer result = universalStrategy.calculatePrice(defaultFormula, 0, 1, 5);

        // Then - Should match exactly with parsed data Per Range value
        assertEquals(400, result); // $4.00 (400 cents)

        // Verify formula structure matches expected pattern
        FormulaFormulaEntity formulaEntity = (FormulaFormulaEntity) defaultFormula;
        assertEquals("basePrice + levelDiff", formulaEntity.getExpression());
        assertEquals(0, formulaEntity.getVariables().get("basePrice").intValue());
        assertEquals(400, formulaEntity.getVariables().get("levelDiff").intValue());
    }

    @Test
    @DisplayName("Integration Verification: Should work with all calculator dependencies")
    void shouldWorkWithAllCalculatorDependencies() {
        // Given - Verify all dependencies are properly injected
        assertNotNull(universalStrategy, "UniversalCalculationStrategy should be injected");
        assertNotNull(formulaCalculator, "FormulaExpressionCalculator should be injected");

        // Test that the strategy properly delegates to FormulaExpressionCalculator
        var formulaEntity = new FormulaFormulaEntity();
        formulaEntity.setExpression("basePrice + 100");

        // When
        Integer result = universalStrategy.calculatePrice(formulaEntity, 1000, 1, 5);

        // Then - Should properly delegate calculation
        assertEquals(1100, result);

        // Verify the calculation went through the proper chain:
        // UniversalCalculationStrategy -> FormulaExpressionCalculator
        assertTrue(result > 1000, "Result should include the +100 from expression");
    }
}
