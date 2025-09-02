package com.aksi.service.game.calculation;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.aksi.api.game.dto.CalculationStatus;
import com.aksi.api.game.dto.PriceConfiguration.CalculationTypeEnum;
import com.aksi.api.pricing.dto.ModifierType;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.pricing.PriceModifierEntity;

@DisplayName("CalculatorFacade Integration Tests")
class CalculatorFacadeTest {

  private CalculatorFacade facade;
  private GamePriceCalculator mockPriceCalculator;
  private GameModifierCalculator mockModifierCalculator;

  @BeforeEach
  void setUp() {
    mockPriceCalculator = mock(GamePriceCalculator.class);
    mockModifierCalculator = mock(GameModifierCalculator.class);
    facade = new CalculatorFacade(mockPriceCalculator, mockModifierCalculator);
  }

  @Test
  @DisplayName("Should calculate complete price with successful base calculation and modifiers")
  void shouldCalculateCompletePriceWithSuccessfulBaseAndModifiers() {
    // Given
    PriceConfigurationEntity config = createLinearConfig(1000, 50);
    int fromLevel = 1;
    int toLevel = 10;
    List<PriceModifierEntity> modifiers = List.of(createPercentageModifier(10)); // 10% increase
    Map<String, Object> context = Map.of("difficulty", "HARD");

    GamePriceCalculationResult baseResult = createLinearCalculationResult(1000, 450, 1450);

    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        new GameModifierCalculator.GameModifierCalculationResult(145, 1595); // 10% of 1450 = 145

    when(mockPriceCalculator.calculatePrice(config, fromLevel, toLevel)).thenReturn(baseResult);
    when(mockModifierCalculator.calculate(eq(modifiers), eq(1450), eq(context))).thenReturn(modifierResult);

    // When
    var result = facade.calculateCompletePrice(config, fromLevel, toLevel, modifiers, context);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.notes()).isEqualTo("Calculation completed successfully");
    assertThat(result.baseResult()).isEqualTo(baseResult);
    assertThat(result.totalAdjustments()).isEqualTo(145);
    assertThat(result.finalPrice()).isEqualTo(1595);
  }

  @Test
  @DisplayName("Should handle failed base calculation gracefully")
  void shouldHandleFailedBaseCalculationGracefully() {
    // Given
    PriceConfigurationEntity config = createInvalidConfig();
    int fromLevel = 1;
    int toLevel = 5;
    List<PriceModifierEntity> modifiers = List.of();
    Map<String, Object> context = Map.of();

    GamePriceCalculationResult failedBaseResult = GamePriceCalculationResult.error(
        "Invalid configuration", config.getBasePrice());

    when(mockPriceCalculator.calculatePrice(config, fromLevel, toLevel)).thenReturn(failedBaseResult);

    // When
    var result = facade.calculateCompletePrice(config, fromLevel, toLevel, modifiers, context);

    // Then
    assertThat(result.isSuccessful()).isFalse();
    assertThat(result.notes()).isEqualTo("Invalid configuration");
    assertThat(result.finalPrice()).isEqualTo(config.getBasePrice()); // Fallback price
    assertThat(result.totalAdjustments()).isEqualTo(0);
  }

  @Test
  @DisplayName("Should calculate price with no modifiers applied")
  void shouldCalculatePriceWithNoModifiersApplied() {
    // Given
    PriceConfigurationEntity config = createLinearConfig(500, 25);
    int fromLevel = 1;
    int toLevel = 5;
    List<PriceModifierEntity> modifiers = List.of(); // Empty list
    Map<String, Object> context = Map.of();

    GamePriceCalculationResult baseResult = createLinearCalculationResult(500, 100, 600);

    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        new GameModifierCalculator.GameModifierCalculationResult(0, 600); // No adjustments

    when(mockPriceCalculator.calculatePrice(config, fromLevel, toLevel)).thenReturn(baseResult);
    when(mockModifierCalculator.calculate(eq(modifiers), eq(600), eq(context))).thenReturn(modifierResult);

    // When
    var result = facade.calculateCompletePrice(config, fromLevel, toLevel, modifiers, context);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.baseResult()).isEqualTo(baseResult);
    assertThat(result.totalAdjustments()).isEqualTo(0);
    assertThat(result.finalPrice()).isEqualTo(600);
  }

  @Test
  @DisplayName("Should calculate price with multiple modifiers")
  void shouldCalculatePriceWithMultipleModifiers() {
    // Given
    PriceConfigurationEntity config = createRangeConfig(1000);
    int fromLevel = 1;
    int toLevel = 3;
    List<PriceModifierEntity> modifiers = List.of(
        createPercentageModifier(15), // +15%
        createFixedModifier(200),     // +200 cents
        createDiscountModifier(50)    // -50 cents
    );
    Map<String, Object> context = Map.of("vip", true);

    GamePriceCalculationResult baseResult = createRangeCalculationResult(1000);

    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        new GameModifierCalculator.GameModifierCalculationResult(315, 1315);
        // 15% of 1000 = 150, +200 fixed, -50 discount = 150 + 200 - 50 = 300 total adjustment

    when(mockPriceCalculator.calculatePrice(config, fromLevel, toLevel)).thenReturn(baseResult);
    when(mockModifierCalculator.calculate(eq(modifiers), eq(1000), eq(context))).thenReturn(modifierResult);

    // When
    var result = facade.calculateCompletePrice(config, fromLevel, toLevel, modifiers, context);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.finalPrice()).isEqualTo(1315);
    assertThat(result.totalAdjustments()).isEqualTo(315);
  }

  @Test
  @DisplayName("Should handle zero base price correctly")
  void shouldHandleZeroBasePriceCorrectly() {
    // Given
    PriceConfigurationEntity config = createLinearConfig(0, 100);
    int fromLevel = 1;
    int toLevel = 5;
    List<PriceModifierEntity> modifiers = List.of(createFixedModifier(500));
    Map<String, Object> context = Map.of();

    GamePriceCalculationResult baseResult = createLinearCalculationResult(0, 400, 400);

    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        new GameModifierCalculator.GameModifierCalculationResult(500, 900);

    when(mockPriceCalculator.calculatePrice(config, fromLevel, toLevel)).thenReturn(baseResult);
    when(mockModifierCalculator.calculate(eq(modifiers), eq(400), eq(context))).thenReturn(modifierResult);

    // When
    var result = facade.calculateCompletePrice(config, fromLevel, toLevel, modifiers, context);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.finalPrice()).isEqualTo(900);
  }

  @Test
  @DisplayName("Should handle negative adjustments correctly")
  void shouldHandleNegativeAdjustmentsCorrectly() {
    // Given
    PriceConfigurationEntity config = createLinearConfig(2000, 0);
    int fromLevel = 1;
    int toLevel = 1;
    List<PriceModifierEntity> modifiers = List.of(createDiscountModifier(500));
    Map<String, Object> context = Map.of();

    GamePriceCalculationResult baseResult = createLinearCalculationResult(2000, 0, 2000);

    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        new GameModifierCalculator.GameModifierCalculationResult(-500, 1500);

    when(mockPriceCalculator.calculatePrice(config, fromLevel, toLevel)).thenReturn(baseResult);
    when(mockModifierCalculator.calculate(eq(modifiers), eq(2000), eq(context))).thenReturn(modifierResult);

    // When
    var result = facade.calculateCompletePrice(config, fromLevel, toLevel, modifiers, context);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.finalPrice()).isEqualTo(1500);
    assertThat(result.totalAdjustments()).isEqualTo(-500);
  }

  @Test
  @DisplayName("Should handle very large numbers correctly")
  void shouldHandleVeryLargeNumbersCorrectly() {
    // Given
    PriceConfigurationEntity config = createLinearConfig(100000, 1000);
    int fromLevel = 1;
    int toLevel = 100;
    List<PriceModifierEntity> modifiers = List.of(createPercentageModifier(50));
    Map<String, Object> context = Map.of();

    GamePriceCalculationResult baseResult = createLinearCalculationResult(100000, 99000, 199000);

    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        new GameModifierCalculator.GameModifierCalculationResult(99500, 298500); // 50% of 199000

    when(mockPriceCalculator.calculatePrice(config, fromLevel, toLevel)).thenReturn(baseResult);
    when(mockModifierCalculator.calculate(eq(modifiers), eq(199000), eq(context))).thenReturn(modifierResult);

    // When
    var result = facade.calculateCompletePrice(config, fromLevel, toLevel, modifiers, context);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.finalPrice()).isEqualTo(298500);
    assertThat(result.totalAdjustments()).isEqualTo(99500);
  }

  // Helper methods for creating test data
  private PriceConfigurationEntity createLinearConfig(int basePrice, int pricePerLevel) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(basePrice);
    config.setPricePerLevel(pricePerLevel);
    config.setCalculationType(CalculationTypeEnum.LINEAR);
    return config;
  }

  private PriceConfigurationEntity createRangeConfig(int basePrice) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(basePrice);
    config.setCalculationType(CalculationTypeEnum.RANGE);
    return config;
  }

  private PriceConfigurationEntity createInvalidConfig() {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(1000);
    // Using LINEAR as default since INVALID doesn't exist in enum
    config.setCalculationType(CalculationTypeEnum.LINEAR);
    return config;
  }

  private PriceModifierEntity createPercentageModifier(int percentage) {
    PriceModifierEntity modifier = new PriceModifierEntity();
    modifier.setId(UUID.randomUUID());
    modifier.setCode("PERCENTAGE_MOD");
    modifier.setName("Percentage Modifier");
    modifier.setType(ModifierType.PERCENTAGE);
    modifier.setValue(percentage);
    modifier.setActive(true);
    return modifier;
  }

  private PriceModifierEntity createFixedModifier(int amount) {
    PriceModifierEntity modifier = new PriceModifierEntity();
    modifier.setId(UUID.randomUUID());
    modifier.setCode("FIXED_MOD");
    modifier.setName("Fixed Modifier");
    modifier.setType(ModifierType.FIXED);
    modifier.setValue(amount);
    modifier.setActive(true);
    return modifier;
  }

  private PriceModifierEntity createDiscountModifier(int amount) {
    PriceModifierEntity modifier = new PriceModifierEntity();
    modifier.setId(UUID.randomUUID());
    modifier.setCode("DISCOUNT_MOD");
    modifier.setName("Discount Modifier");
    modifier.setType(ModifierType.DISCOUNT);
    modifier.setValue(amount);
    modifier.setActive(true);
    return modifier;
  }

  // Helper methods for creating GamePriceCalculationResult
  private GamePriceCalculationResult createLinearCalculationResult(int basePrice, int levelPrice, int totalPrice) {
    return new GamePriceCalculationResult(
        basePrice,
        totalPrice,
        "LINEAR",
        "basePrice + (levelDiff × pricePerLevel)",
        true,
        String.format("Linear calculation: base=%d, levelPrice=%d", basePrice, levelPrice),
        CalculationStatus.SUCCESS,
        Map.of("levelPrice", levelPrice)
    );
  }

  private GamePriceCalculationResult createRangeCalculationResult(int totalPrice) {
    return new GamePriceCalculationResult(
        0,
        totalPrice,
        "RANGE",
        "basePrice + sum(rangePrice × levelsInRange)",
        true,
        String.format("Range calculation: %d ranges applied", 2),
        CalculationStatus.SUCCESS,
        Map.of("appliedRanges", List.of())
    );
  }

}
