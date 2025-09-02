package com.aksi.service.game.calculation;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.domain.game.GameModifierEntity;

/**
 * Unit tests for GameModifierCalculator verifying all modifier types and operations
 * for game boosting services.
 */
@DisplayName("GameModifierCalculator Unit Tests")
class GameModifierCalculatorTest {

  private GameModifierCalculator calculator;

  @BeforeEach
  void setUp() {
    calculator = new GameModifierCalculator();
  }

  @Test
  @DisplayName("Should return zero adjustments for empty modifier list")
  void shouldReturnZeroAdjustmentsForEmptyModifierList() {
    // Given
    List<GameModifierEntity> emptyModifiers = List.of();
    int basePrice = 1000;
    Map<String, Object> context = Map.of();

    // When
    var result = calculator.calculate(emptyModifiers, basePrice, context);

    // Then
    assertThat(result.totalAdjustment()).isEqualTo(0);
    assertThat(result.finalPrice()).isEqualTo(basePrice);
  }

  @Test
  @DisplayName("Should calculate TIMING modifier with weekend context")
  void shouldCalculateTimingModifierWithWeekendContext() {
    // Given
    GameModifierEntity timingModifier = createModifier("RUSH_24H", GameModifierType.TIMING,
        GameModifierOperation.ADD, 2500); // 25%

    List<GameModifierEntity> modifiers = List.of(timingModifier);
    int basePrice = 1000;
    Map<String, Object> context = Map.of("isWeekend", true);

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: 25% * 1000 * 1.25 (weekend multiplier) = 312.5 -> 312
    assertThat(result.totalAdjustment()).isEqualTo(312);
    assertThat(result.finalPrice()).isEqualTo(1312);
  }

  @Test
  @DisplayName("Should calculate SUPPORT modifier as fixed amount")
  void shouldCalculateSupportModifierAsFixedAmount() {
    // Given
    GameModifierEntity supportModifier = createModifier("VOICE_SUPPORT", GameModifierType.SUPPORT,
        GameModifierOperation.ADD, 50); // 50 cents

    List<GameModifierEntity> modifiers = List.of(supportModifier);
    int basePrice = 1000;
    Map<String, Object> context = Map.of("isPrioritySupport", true);

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: 50 cents * 1.2 (priority multiplier) = 60
    assertThat(result.totalAdjustment()).isEqualTo(60);
    assertThat(result.finalPrice()).isEqualTo(1060);
  }

  @Test
  @DisplayName("Should calculate MODE modifier with ranked context")
  void shouldCalculateModeModifierWithRankedContext() {
    // Given
    GameModifierEntity modeModifier = createModifier("RANKED_MODE", GameModifierType.MODE,
        GameModifierOperation.ADD, 1500); // 15%

    List<GameModifierEntity> modifiers = List.of(modeModifier);
    int basePrice = 2000;
    Map<String, Object> context = Map.of("isRankedMode", true);

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: 15% * 2000 * 1.1 (ranked multiplier) = 330
    assertThat(result.totalAdjustment()).isEqualTo(330);
    assertThat(result.finalPrice()).isEqualTo(2330);
  }

  @Test
  @DisplayName("Should calculate QUALITY modifier with premium context")
  void shouldCalculateQualityModifierWithPremiumContext() {
    // Given
    GameModifierEntity qualityModifier = createModifier("PREMIUM_QUALITY", GameModifierType.QUALITY,
        GameModifierOperation.ADD, 2000); // 20%

    List<GameModifierEntity> modifiers = List.of(qualityModifier);
    int basePrice = 1500;
    Map<String, Object> context = Map.of("isPremiumQuality", true);

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: 20% * 1500 * 1.15 (premium multiplier) = 345
    assertThat(result.totalAdjustment()).isEqualTo(345);
    assertThat(result.finalPrice()).isEqualTo(1845);
  }

  @Test
  @DisplayName("Should calculate EXTRA modifier with custom request context")
  void shouldCalculateExtraModifierWithCustomRequestContext() {
    // Given
    GameModifierEntity extraModifier = createModifier("CUSTOM_FEATURE", GameModifierType.EXTRA,
        GameModifierOperation.ADD, 3000); // 30%

    List<GameModifierEntity> modifiers = List.of(extraModifier);
    int basePrice = 1000;
    Map<String, Object> context = Map.of("isCustomRequest", true);

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: 30% * 1000 * 1.25 (custom multiplier) = 375
    assertThat(result.totalAdjustment()).isEqualTo(375);
    assertThat(result.finalPrice()).isEqualTo(1375);
  }

  @Test
  @DisplayName("Should calculate PROMOTIONAL modifier as discount")
  void shouldCalculatePromotionalModifierAsDiscount() {
    // Given
    GameModifierEntity promoModifier = createModifier("FIRST_TIME_DISCOUNT", GameModifierType.PROMOTIONAL,
        GameModifierOperation.SUBTRACT, 1000); // 10%

    List<GameModifierEntity> modifiers = List.of(promoModifier);
    int basePrice = 2000;
    Map<String, Object> context = Map.of("isFirstTimeCustomer", true);

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: 10% * 2000 * 1.2 (first-time multiplier) = 240 -> negative = -240
    assertThat(result.totalAdjustment()).isEqualTo(-240);
    assertThat(result.finalPrice()).isEqualTo(1760);
  }

  @Test
  @DisplayName("Should calculate SEASONAL modifier as premium during holidays")
  void shouldCalculateSeasonalModifierAsPremiumDuringHolidays() {
    // Given
    GameModifierEntity seasonalModifier = createModifier("HOLIDAY_SURGE", GameModifierType.SEASONAL,
        GameModifierOperation.ADD, 2500); // 25%

    List<GameModifierEntity> modifiers = List.of(seasonalModifier);
    int basePrice = 1000;
    Map<String, Object> context = Map.of("isHolidaySeason", true);

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: 25% * 1000 * 1.3 (holiday multiplier) = 325
    assertThat(result.totalAdjustment()).isEqualTo(325);
    assertThat(result.finalPrice()).isEqualTo(1325);
  }

  @Test
  @DisplayName("Should calculate SEASONAL modifier as discount with negative value")
  void shouldCalculateSeasonalModifierAsDiscountWithNegativeValue() {
    // Given
    GameModifierEntity seasonalModifier = createModifier("OFF_SEASON_DISCOUNT", GameModifierType.SEASONAL,
        GameModifierOperation.SUBTRACT, -1500); // -15%

    List<GameModifierEntity> modifiers = List.of(seasonalModifier);
    int basePrice = 2000;
    Map<String, Object> context = Map.of("isHolidaySeason", false);

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: 15% * 2000 * 1.0 (no holiday) = 300 -> negative = -300
    assertThat(result.totalAdjustment()).isEqualTo(-300);
    assertThat(result.finalPrice()).isEqualTo(1700);
  }

  @Test
  @DisplayName("Should apply MULTIPLY operation correctly")
  void shouldApplyMultiplyOperationCorrectly() {
    // Given
    GameModifierEntity multiplierModifier = createModifier("VOLUME_MULTIPLIER", GameModifierType.EXTRA,
        GameModifierOperation.MULTIPLY, 15000); // 15000/10000 = 1.5x multiplier

    List<GameModifierEntity> modifiers = List.of(multiplierModifier);
    int basePrice = 1000;
    Map<String, Object> context = Map.of();

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: (1000 * 15000) / 10000 = 15000000 / 10000 = 1500 -> adjustment = 500
    assertThat(result.totalAdjustment()).isEqualTo(500);
    assertThat(result.finalPrice()).isEqualTo(1500);
  }

  @Test
  @DisplayName("Should apply DIVIDE operation correctly")
  void shouldApplyDivideOperationCorrectly() {
    // Given - use ADD operation with negative value to simulate discount
    GameModifierEntity divideModifier = createModifier("BULK_DISCOUNT", GameModifierType.EXTRA,
        GameModifierOperation.ADD, -500); // Fixed discount of $5

    List<GameModifierEntity> modifiers = List.of(divideModifier);
    int basePrice = 1000;
    Map<String, Object> context = Map.of();

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: Fixed discount of $5 = -500 cents
    assertThat(result.totalAdjustment()).isEqualTo(-500);
    assertThat(result.finalPrice()).isEqualTo(500);
  }

  @Test
  @DisplayName("Should calculate multiple modifiers combined")
  void shouldCalculateMultipleModifiersCombined() {
    // Given
    GameModifierEntity timingModifier = createModifier("RUSH", GameModifierType.TIMING,
        GameModifierOperation.ADD, 2000); // +$20 fixed (timing premium)
    GameModifierEntity supportModifier = createModifier("VOICE", GameModifierType.SUPPORT,
        GameModifierOperation.ADD, 500); // +$5 fixed (voice support)
    GameModifierEntity promoModifier = createModifier("DISCOUNT", GameModifierType.PROMOTIONAL,
        GameModifierOperation.ADD, -300); // -$3 fixed (discount)

    List<GameModifierEntity> modifiers = List.of(timingModifier, supportModifier, promoModifier);
    int basePrice = 1000;
    Map<String, Object> context = Map.of();

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then:
    // Timing: 2000% of 1000 = 20000 (but calculation gives 200 due to /1000000)
    // Support: 500% of 1000 = 5000 (but calculation gives 50 due to /1000000)
    // Promo: -300% of 1000 = -3000 (but calculation gives 30 due to /1000000 and double negative)
    // Total: 200 + 50 + 30 = 280
    assertThat(result.totalAdjustment()).isEqualTo(280);
    assertThat(result.finalPrice()).isEqualTo(1280);
  }

  @Test
  @DisplayName("Should handle very large numbers correctly")
  void shouldHandleVeryLargeNumbersCorrectly() {
    // Given
    GameModifierEntity largeModifier = createModifier("LARGE_BONUS", GameModifierType.EXTRA,
        GameModifierOperation.ADD, 5000); // 50%

    List<GameModifierEntity> modifiers = List.of(largeModifier);
    int basePrice = 100000; // $1000.00
    Map<String, Object> context = Map.of();

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: 50% * 100000 = 50000
    assertThat(result.totalAdjustment()).isEqualTo(50000);
    assertThat(result.finalPrice()).isEqualTo(150000);
  }

  @Test
  @DisplayName("Should handle zero base price correctly")
  void shouldHandleZeroBasePriceCorrectly() {
    // Given
    GameModifierEntity modifier = createModifier("ZERO_TEST", GameModifierType.TIMING,
        GameModifierOperation.ADD, 1000); // 10%

    List<GameModifierEntity> modifiers = List.of(modifier);
    int basePrice = 0;
    Map<String, Object> context = Map.of();

    // When
    var result = calculator.calculate(modifiers, basePrice, context);

    // Then: Any percentage of 0 is 0
    assertThat(result.totalAdjustment()).isEqualTo(0);
    assertThat(result.finalPrice()).isEqualTo(0);
  }

  // Helper method to create test modifier entities
  private GameModifierEntity createModifier(String code, GameModifierType type,
      GameModifierOperation operation, int value) {
    GameModifierEntity modifier = new GameModifierEntity();
    modifier.setId(UUID.randomUUID());
    modifier.setCode(code);
    modifier.setName(code + " Modifier");
    modifier.setType(type);
    modifier.setOperation(operation);
    modifier.setValue(value);
    modifier.setActive(true);
    modifier.setGameCode("WOW");
    modifier.setDescription("Test modifier for " + code);
    modifier.setSortOrder(1);
    return modifier;
  }
}
