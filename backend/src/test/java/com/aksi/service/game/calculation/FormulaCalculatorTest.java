package com.aksi.service.game.calculation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.aksi.api.game.dto.PriceConfiguration.CalculationTypeEnum;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.service.game.factory.GameCalculationFactory;
import com.aksi.service.game.util.GameCalculationUtils;
import com.aksi.service.game.util.SharedJsonUtils;

@DisplayName("FormulaCalculator Tests")
class FormulaCalculatorTest {

  private FormulaCalculator calculator;

  @BeforeEach
  void setUp() {
    SharedJsonUtils jsonUtils = new SharedJsonUtils();
    GameCalculationUtils utils = new GameCalculationUtils();
    GameCalculationFactory factory = new GameCalculationFactory(utils);
    calculator = new FormulaCalculator(utils, factory, jsonUtils);
  }

  @Test
  @DisplayName("Should calculate simple arithmetic formula")
  void shouldCalculateSimpleArithmeticFormula() {
    // Given
    String formulaJson = """
        {
          "expression": "basePrice + (levelDiff * pricePerLevel)",
          "variables": {
            "basePrice": 1000,
            "pricePerLevel": 50
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(formulaJson);
    int startLevel = 1;
    int targetLevel = 10;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(1450); // 1000 + (9 * 50)
    assertThat(result.calculationType()).isEqualTo("FORMULA");
    assertThat(result.notes()).contains("Formula calculation completed");
  }

  @Test
  @DisplayName("Should calculate complex formula with multiple operations")
  void shouldCalculateComplexFormulaWithMultipleOperations() {
    // Given
    String formulaJson = """
        {
          "expression": "(basePrice + (levelDiff * pricePerLevel)) * difficultyMultiplier + urgencyBonus",
          "variables": {
            "basePrice": 1000,
            "pricePerLevel": 25,
            "difficultyMultiplier": 1.5,
            "urgencyBonus": 200
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(formulaJson);
    int startLevel = 1;
    int targetLevel = 20;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    // Calculation: (1000 + (19 * 25)) * 1.5 + 200 = (1000 + 475) * 1.5 + 200 = 1475 * 1.5 + 200 = 2212.5 + 200 = 2412
    assertThat(result.totalPrice()).isEqualTo(2412);
  }

  @Test
  @DisplayName("Should handle formula with built-in levelDiff variable")
  void shouldHandleFormulaWithBuiltInLevelDiffVariable() {
    // Given
    String formulaJson = """
        {
          "expression": "1000 + levelDiff * 30",
          "variables": {}
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(formulaJson);
    int startLevel = 5;
    int targetLevel = 15;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(1300); // 1000 + (10 * 30)
  }

  @Test
  @DisplayName("Should handle formula with decimal results")
  void shouldHandleFormulaWithDecimalResults() {
    // Given
    String formulaJson = """
        {
          "expression": "basePrice * multiplier + levelDiff",
          "variables": {
            "basePrice": 1000,
            "multiplier": 1.25
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(formulaJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(1254); // 1000 * 1.25 + 4 = 1250 + 4
  }

  @Test
  @DisplayName("Should handle formula with zero level difference")
  void shouldHandleFormulaWithZeroLevelDifference() {
    // Given
    String formulaJson = """
        {
          "expression": "basePrice + levelDiff * pricePerLevel",
          "variables": {
            "basePrice": 500,
            "pricePerLevel": 100
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(formulaJson);
    int startLevel = 10;
    int targetLevel = 10; // Same level

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(500); // Only base price
  }

  @Test
  @DisplayName("Should throw exception for invalid formula syntax")
  void shouldThrowExceptionForInvalidFormulaSyntax() {
    // Given
    String invalidFormulaJson = """
        {
          "expression": "basePrice + (invalid syntax",
          "variables": {
            "basePrice": 1000
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(invalidFormulaJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When & Then
    assertThatThrownBy(() -> calculator.calculate(config, startLevel, targetLevel))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Formula evaluation failed");
  }

  @Test
  @DisplayName("Should throw exception for missing variables")
  void shouldThrowExceptionForMissingVariables() {
    // Given
    String formulaJson = """
        {
          "expression": "basePrice + undefinedVariable",
          "variables": {
            "basePrice": 1000
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(formulaJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When & Then
    assertThatThrownBy(() -> calculator.calculate(config, startLevel, targetLevel))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Formula evaluation failed");
  }

  @Test
  @DisplayName("Should throw exception for invalid JSON format")
  void shouldThrowExceptionForInvalidJsonFormat() {
    // Given
    String invalidJson = "{ invalid json format }";
    PriceConfigurationEntity config = createFormulaConfig(invalidJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When & Then
    assertThatThrownBy(() -> calculator.calculate(config, startLevel, targetLevel))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Failed to parse formula configuration");
  }

  @Test
  @DisplayName("Should handle formula with mathematical functions")
  void shouldHandleFormulaWithMathematicalFunctions() {
    // Given
    String formulaJson = """
        {
          "expression": "Math.max(basePrice, levelDiff * pricePerLevel) + Math.round(complexityBonus)",
          "variables": {
            "basePrice": 500,
            "pricePerLevel": 30,
            "complexityBonus": 15.7
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(formulaJson);
    int startLevel = 1;
    int targetLevel = 25;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    // Calculation: max(500, 24*30) + round(15.7) = max(500, 720) + 16 = 720 + 16 = 736
    assertThat(result.totalPrice()).isEqualTo(736);
  }

  @Test
  @DisplayName("Should handle formula with negative results appropriately")
  void shouldHandleFormulaWithNegativeResultsAppropriately() {
    // Given
    String formulaJson = """
        {
          "expression": "basePrice - discount + levelDiff * pricePerLevel",
          "variables": {
            "basePrice": 1000,
            "discount": 1500,
            "pricePerLevel": 50
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(formulaJson);
    int startLevel = 1;
    int targetLevel = 10;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(0); // Negative results are handled (likely floored to 0)
  }

  private PriceConfigurationEntity createFormulaConfig(String formulaJson) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setBasePrice(0); // Not used in formula calculations
    config.setCalculationFormula(formulaJson);
    config.setCalculationType(CalculationTypeEnum.FORMULA);
    return config;
  }
}
