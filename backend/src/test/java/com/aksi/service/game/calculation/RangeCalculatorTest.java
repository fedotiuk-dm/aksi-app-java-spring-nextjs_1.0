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

@DisplayName("RangeCalculator Tests")
class RangeCalculatorTest {

  private RangeCalculator calculator;

  @BeforeEach
  void setUp() {
    SharedJsonUtils jsonUtils = new SharedJsonUtils();
    GameCalculationUtils utils = new GameCalculationUtils();
    GameCalculationFactory factory = new GameCalculationFactory(utils);
    calculator = new RangeCalculator(utils, factory, jsonUtils);
  }

  @Test
  @DisplayName("Should calculate range price for single range")
  void shouldCalculateRangePriceForSingleRange() {
    // Given
    String rangeJson = """
        {
          "ranges": [
            {"from": 1, "to": 10, "price": 500}
          ]
        }
        """;
    PriceConfigurationEntity config = createRangeConfig(1000, rangeJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(1000); // basePrice + range price
    assertThat(result.calculationType()).isEqualTo("RANGE");
    assertThat(result.notes()).contains("Range calculation completed");
  }

  @Test
  @DisplayName("Should calculate range price spanning multiple ranges")
  void shouldCalculateRangePriceSpanningMultipleRanges() {
    // Given
    String rangeJson = """
        {
          "ranges": [
            {"from": 1, "to": 5, "price": 200},
            {"from": 6, "to": 10, "price": 300},
            {"from": 11, "to": 15, "price": 400}
          ]
        }
        """;
    PriceConfigurationEntity config = createRangeConfig(500, rangeJson);
    int startLevel = 3;
    int targetLevel = 12; // Spans ranges: 3-5, 6-10, 11-12

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    // Calculation: 500 + (200*3) + (300*5) + (400*2) = 500 + 600 + 1500 + 800 = 3400
    assertThat(result.totalPrice()).isEqualTo(3400);
    assertThat(result.notes()).contains("Range calculation completed");
  }

  @Test
  @DisplayName("Should handle exact range boundaries")
  void shouldHandleExactRangeBoundaries() {
    // Given
    String rangeJson = """
        {
          "ranges": [
            {"from": 1, "to": 10, "price": 100},
            {"from": 11, "to": 20, "price": 200}
          ]
        }
        """;
    PriceConfigurationEntity config = createRangeConfig(0, rangeJson);
    int startLevel = 10;
    int targetLevel = 11; // Exactly at boundary

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(300); // 100 + 200
  }

  @Test
  @DisplayName("Should throw exception for level outside any range")
  void shouldThrowExceptionForLevelOutsideAnyRange() {
    // Given
    String rangeJson = """
        {
          "ranges": [
            {"from": 1, "to": 10, "price": 100}
          ]
        }
        """;
    PriceConfigurationEntity config = createRangeConfig(500, rangeJson);
    int startLevel = 15; // Outside defined ranges
    int targetLevel = 20;

    // When & Then
    assertThatThrownBy(() -> calculator.calculate(config, startLevel, targetLevel))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("No price range found");
  }

  @Test
  @DisplayName("Should throw exception for invalid JSON format")
  void shouldThrowExceptionForInvalidJsonFormat() {
    // Given
    String invalidJson = "{ invalid json }";
    PriceConfigurationEntity config = createRangeConfig(500, invalidJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When & Then
    assertThatThrownBy(() -> calculator.calculate(config, startLevel, targetLevel))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Failed to parse range configuration");
  }

  @Test
  @DisplayName("Should handle empty range configuration")
  void shouldHandleEmptyRangeConfiguration() {
    // Given
    String emptyJson = "{ \"ranges\": [] }";
    PriceConfigurationEntity config = createRangeConfig(1000, emptyJson);
    int startLevel = 1;
    int targetLevel = 5;

    // When & Then
    assertThatThrownBy(() -> calculator.calculate(config, startLevel, targetLevel))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("No price range found");
  }

  @Test
  @DisplayName("Should handle overlapping ranges correctly")
  void shouldHandleOverlappingRangesCorrectly() {
    // Given - overlapping ranges (edge case)
    String rangeJson = """
        {
          "ranges": [
            {"from": 1, "to": 10, "price": 100},
            {"from": 5, "to": 15, "price": 200}
          ]
        }
        """;
    PriceConfigurationEntity config = createRangeConfig(0, rangeJson);
    int startLevel = 3;
    int targetLevel = 8;

    // When
    var result = calculator.calculate(config, startLevel, targetLevel);

    // Then
    // This test documents current behavior - overlapping ranges are not handled specially
    // The calculator will use the first matching range it finds
    assertThat(result.isSuccessful()).isTrue();
  }

  private PriceConfigurationEntity createRangeConfig(int basePrice, String rangeJson) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setBasePrice(basePrice);
    config.setCalculationFormula(rangeJson);
    config.setCalculationType(CalculationTypeEnum.RANGE);
    return config;
  }
}
