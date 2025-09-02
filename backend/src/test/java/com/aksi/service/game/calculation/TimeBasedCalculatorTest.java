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

@DisplayName("TimeBasedCalculator Tests")
class TimeBasedCalculatorTest {

  private TimeBasedCalculator calculator;

  @BeforeEach
  void setUp() {
    SharedJsonUtils jsonUtils = new SharedJsonUtils();
    GameCalculationUtils utils = new GameCalculationUtils();
    GameCalculationFactory factory = new GameCalculationFactory(utils);
    calculator = new TimeBasedCalculator(utils, factory, jsonUtils);
  }

  @Test
  @DisplayName("Should calculate time-based price correctly")
  void shouldCalculateTimeBasedPriceCorrectly() {
    // Given
    String timeConfigJson = """
        {
          "hourlyRate": 2000,
          "baseHours": 5,
          "hoursPerLevel": 2,
          "complexityMultiplier": 1.5
        }
        """;
    PriceConfigurationEntity config = createTimeBasedConfig(timeConfigJson);
    int startLevel = 1;
    int targetLevel = 10;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    // Calculation: (5 + (9 * 2)) * 2000 * 1.5 = 23 * 2000 * 1.5 = 46000 * 1.5 = 69000
    assertThat(result.totalPrice()).isEqualTo(69000);
    assertThat(result.calculationType()).isEqualTo("TIME_BASED");
    assertThat(result.notes()).contains("Time-based calculation completed");
  }

  @Test
  @DisplayName("Should handle zero level difference")
  void shouldHandleZeroLevelDifference() {
    // Given
    String timeConfigJson = """
        {
          "hourlyRate": 1500,
          "baseHours": 3,
          "hoursPerLevel": 1,
          "complexityMultiplier": 1.0
        }
        """;
    PriceConfigurationEntity config = createTimeBasedConfig(timeConfigJson);
    int startLevel = 5;
    int targetLevel = 5; // Same level

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(4500); // 3 * 1500 * 1.0 = 4500
  }

  @Test
  @DisplayName("Should calculate with different complexity multipliers")
  void shouldCalculateWithDifferentComplexityMultipliers() {
    // Given
    String timeConfigJson = """
        {
          "hourlyRate": 1000,
          "baseHours": 4,
          "hoursPerLevel": 1,
          "complexityMultiplier": 2.0
        }
        """;
    PriceConfigurationEntity config = createTimeBasedConfig(timeConfigJson);
    int startLevel = 1;
    int targetLevel = 6;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    // Calculation: (4 + (5 * 1)) * 1000 * 2.0 = 9 * 1000 * 2.0 = 18000
    assertThat(result.totalPrice()).isEqualTo(18000);
  }

  @Test
  @DisplayName("Should handle fractional hours correctly")
  void shouldHandleFractionalHoursCorrectly() {
    // Given
    String timeConfigJson = """
        {
          "hourlyRate": 800,
          "baseHours": 2.5,
          "hoursPerLevel": 0.5,
          "complexityMultiplier": 1.0
        }
        """;
    PriceConfigurationEntity config = createTimeBasedConfig(timeConfigJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    // Calculation: (2.5 + (4 * 0.5)) * 800 * 1.0 = 4.5 * 800 = 3600
    assertThat(result.totalPrice()).isEqualTo(3600);
  }

  @Test
  @DisplayName("Should handle large level differences")
  void shouldHandleLargeLevelDifferences() {
    // Given
    String timeConfigJson = """
        {
          "hourlyRate": 500,
          "baseHours": 10,
          "hoursPerLevel": 3,
          "complexityMultiplier": 1.2
        }
        """;
    PriceConfigurationEntity config = createTimeBasedConfig(timeConfigJson);
    int startLevel = 1;
    int targetLevel = 50;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    // Calculation: (10 + (49 * 3)) * 500 * 1.2 = 157 * 500 * 1.2 = 78500 * 1.2 = 94200
    assertThat(result.totalPrice()).isEqualTo(94200);
  }

  @Test
  @DisplayName("Should handle minimum configuration")
  void shouldHandleMinimumConfiguration() {
    // Given
    String timeConfigJson = """
        {
          "hourlyRate": 100,
          "baseHours": 1,
          "hoursPerLevel": 0,
          "complexityMultiplier": 1.0
        }
        """;
    PriceConfigurationEntity config = createTimeBasedConfig(timeConfigJson);
    int startLevel = 1;
    int targetLevel = 1;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(100); // 1 * 100 * 1.0 = 100
  }

  @Test
  @DisplayName("Should throw exception for invalid JSON format")
  void shouldThrowExceptionForInvalidJsonFormat() {
    // Given
    String invalidJson = "{ invalid json format }";
    PriceConfigurationEntity config = createTimeBasedConfig(invalidJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When & Then
    assertThatThrownBy(() -> calculator.calculate(config, startLevel, targetLevel))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Failed to parse time configuration");
  }

  @Test
  @DisplayName("Should throw exception for missing required fields")
  void shouldThrowExceptionForMissingRequiredFields() {
    // Given
    String incompleteJson = """
        {
          "hourlyRate": 1000,
          "baseHours": 5
        }
        """;
    PriceConfigurationEntity config = createTimeBasedConfig(incompleteJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When & Then
    assertThatThrownBy(() -> calculator.calculate(config, startLevel, targetLevel))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Missing required field");
  }

  @Test
  @DisplayName("Should handle very high hourly rates")
  void shouldHandleVeryHighHourlyRates() {
    // Given
    String timeConfigJson = """
        {
          "hourlyRate": 10000,
          "baseHours": 2,
          "hoursPerLevel": 1,
          "complexityMultiplier": 1.5
        }
        """;
    PriceConfigurationEntity config = createTimeBasedConfig(timeConfigJson);
    int startLevel = 1;
    int targetLevel = 3;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    // Calculation: (2 + (2 * 1)) * 10000 * 1.5 = 4 * 10000 * 1.5 = 60000
    assertThat(result.totalPrice()).isEqualTo(60000);
  }

  @Test
  @DisplayName("Should handle decimal complexity multipliers")
  void shouldHandleDecimalComplexityMultipliers() {
    // Given
    String timeConfigJson = """
        {
          "hourlyRate": 1200,
          "baseHours": 3,
          "hoursPerLevel": 1,
          "complexityMultiplier": 0.8
        }
        """;
    PriceConfigurationEntity config = createTimeBasedConfig(timeConfigJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    // Calculation: (3 + (4 * 1)) * 1200 * 0.8 = 7 * 1200 * 0.8 = 6720
    assertThat(result.totalPrice()).isEqualTo(6720);
  }

  private PriceConfigurationEntity createTimeBasedConfig(String timeConfigJson) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setBasePrice(0); // Not used in time-based calculations
    config.setCalculationFormula(timeConfigJson);
    config.setCalculationType(CalculationTypeEnum.TIME_BASED);
    return config;
  }
}
