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

@DisplayName("LinearCalculator Tests")
class LinearCalculatorTest {

  private LinearCalculator calculator;

  @BeforeEach
  void setUp() {
    SharedJsonUtils jsonUtils = new SharedJsonUtils();
    GameCalculationUtils utils = new GameCalculationUtils();
    GameCalculationFactory factory = new GameCalculationFactory(utils);
    calculator = new LinearCalculator(utils, factory, jsonUtils);
  }

  @Test
  @DisplayName("Should calculate linear price correctly")
  void shouldCalculateLinearPriceCorrectly() {
    // Given
    PriceConfigurationEntity config = createLinearConfig(1000, 50); // basePrice=1000, pricePerLevel=50
    int startLevel = 1;
    int targetLevel = 10;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(1450); // 1000 + (9 * 50) = 1450
    assertThat(result.calculationType()).isEqualTo("LINEAR");
    assertThat(result.notes()).contains("Linear calculation completed");
  }

  @Test
  @DisplayName("Should handle zero level difference")
  void shouldHandleZeroLevelDifference() {
    // Given
    PriceConfigurationEntity config = createLinearConfig(500, 25);
    int startLevel = 5;
    int targetLevel = 5; // Same level

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(500); // Only base price
    assertThat(result.notes()).contains("Linear calculation completed");
  }

  @Test
  @DisplayName("Should calculate large level differences")
  void shouldCalculateLargeLevelDifferences() {
    // Given
    PriceConfigurationEntity config = createLinearConfig(2000, 100);
    int startLevel = 1;
    int targetLevel = 50;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(6900); // 2000 + (49 * 100) = 6900
    assertThat(result.notes()).contains("Linear calculation completed");
  }

  @Test
  @DisplayName("Should handle minimum valid levels")
  void shouldHandleMinimumValidLevels() {
    // Given
    PriceConfigurationEntity config = createLinearConfig(100, 10);
    int startLevel = 1;
    int targetLevel = 2;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(110); // 100 + 10 = 110
  }

  @Test
  @DisplayName("Should throw exception for invalid level range")
  void shouldThrowExceptionForInvalidLevelRange() {
    // Given
    PriceConfigurationEntity config = createLinearConfig(500, 25); // Different values to test robustness
    int startLevel = 10;
    int targetLevel = 5; // Invalid: target < start

    // When & Then
    assertThatThrownBy(() -> calculator.calculate(config, startLevel, targetLevel))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Invalid level range");
  }

  private PriceConfigurationEntity createLinearConfig(int basePrice, int pricePerLevel) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setBasePrice(basePrice);
    config.setPricePerLevel(pricePerLevel);
    config.setCalculationType(CalculationTypeEnum.LINEAR);
    return config;
  }
}
