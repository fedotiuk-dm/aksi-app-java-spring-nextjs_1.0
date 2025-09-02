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

import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.api.game.dto.PriceConfiguration.CalculationTypeEnum;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.domain.game.PriceConfigurationEntity;

/**
 * End-to-End integration tests for the complete calculator system including modifiers.
 * Tests the full calculation pipeline from base price to final result with all modifiers applied.
 */
@DisplayName("Calculator End-to-End Integration Tests")
class CalculatorEndToEndTest {

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
  @DisplayName("E2E: Complete WOW Classic Level Boost with Timing Rush")
  void wowClassicLevelBoostWithTimingRushE2E() {
    // Given: WOW Classic level boost from 20 to 60 with 24-hour rush
    PriceConfigurationEntity wowConfig = createWOWLinearConfig();
    int startLevel = 20;
    int endLevel = 60; // 40 levels

    List<GameModifierEntity> modifiers = List.of(
        createTimingModifier("TIMING_RUSH_24H", 2500), // +25% rush fee
        createSupportModifier("PRIORITY_SUPPORT", 1000) // +$10 priority support
    );

    Map<String, Object> context = Map.of(
        "isWeekend", false,
        "isPrioritySupport", true
    );

    // Mock base calculation: 40 levels * $2.50 = $100 + base $2 = $102
    GamePriceCalculationResult baseResult = createLinearCalculationResult(200, 10000, 10200);
    when(mockPriceCalculator.calculatePrice(wowConfig, startLevel, endLevel)).thenReturn(baseResult);

    // Mock modifier calculation: +25% of $102 = $25.50, +$10 priority = $35.50 total adjustment
    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        new GameModifierCalculator.GameModifierCalculationResult(3550, 13750);
    when(mockModifierCalculator.calculate(eq(modifiers), eq(10200), eq(context))).thenReturn(modifierResult);

    // When
    var result = facade.calculateCompletePrice(wowConfig, startLevel, endLevel, modifiers, context);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.baseResult()).isEqualTo(baseResult);
    assertThat(result.totalAdjustments()).isEqualTo(3550); // $35.50
    assertThat(result.finalPrice()).isEqualTo(13750); // $137.50
  }

  @Test
  @DisplayName("E2E: Apex Rank Boost with Seasonal Discount and Promotional Offer")
  void apexRankBoostWithSeasonalDiscountE2E() {
    // Given: Apex rank boost from Bronze to Diamond with seasonal discount
    PriceConfigurationEntity apexConfig = createApexRangeConfig();
    int startLevel = 25; // Bronze 3
    int endLevel = 75; // Diamond 1

    List<GameModifierEntity> modifiers = List.of(
        createModeModifier("RANKED_MODE", 1500), // +15% for ranked
        createPromotionalModifier("SEASONAL_DISCOUNT", 2000), // -20% discount
        createSeasonalModifier("SUMMER_PROMOTION", -1000) // -10% summer discount
    );

    Map<String, Object> context = Map.of(
        "isRankedMode", true,
        "isHolidaySeason", false,
        "isFirstTimeCustomer", true
    );

    // Mock base calculation: Range pricing for 50 levels through tiers
    GamePriceCalculationResult baseResult = createRangeCalculationResult(5000);
    when(mockPriceCalculator.calculatePrice(apexConfig, startLevel, endLevel)).thenReturn(baseResult);

    // Mock modifier calculation:
    // +15% of $50 = $7.50, -20% of $50 = -$10, -10% of $50 = -$5 = -$7.50 total
    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        new GameModifierCalculator.GameModifierCalculationResult(-750, 4250);
    when(mockModifierCalculator.calculate(eq(modifiers), eq(5000), eq(context))).thenReturn(modifierResult);

    // When
    var result = facade.calculateCompletePrice(apexConfig, startLevel, endLevel, modifiers, context);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.finalPrice()).isEqualTo(4250); // $42.50 after all discounts
    assertThat(result.totalAdjustments()).isEqualTo(-750); // Net discount
  }

  @Test
  @DisplayName("E2E: CS2 Competitive Boost with Multiple Timing and Quality Modifiers")
  void cs2CompetitiveBoostWithMultipleModifiersE2E() {
    // Given: CS2 rank boost with weekend rush and premium quality
    PriceConfigurationEntity cs2Config = createCS2FormulaConfig();
    int startLevel = 5; // Silver 2
    int endLevel = 15; // Gold Nova 1

    List<GameModifierEntity> modifiers = List.of(
        createTimingModifier("WEEKEND_RUSH", 3000), // +30% weekend rush
        createQualityModifier("PREMIUM_QUALITY", 2000), // +20% premium
        createExtraModifier("STREAM_HIGHLIGHTS", 500), // +$5 for streaming
        createSupportModifier("LIVE_CHAT", 1500) // +$15 live chat
    );

    Map<String, Object> context = Map.of(
        "isWeekend", true,
        "isPremiumQuality", true,
        "isCustomRequest", false
    );

    // Mock base calculation: Complex formula for CS2 ranking
    GamePriceCalculationResult baseResult = createFormulaCalculationResult(8000);
    when(mockPriceCalculator.calculatePrice(cs2Config, startLevel, endLevel)).thenReturn(baseResult);

    // Mock modifier calculation with weekend and premium multipliers:
    // Weekend rush: 30% * $80 * 1.25 = $30
    // Premium quality: 20% * $80 * 1.15 = $18.40
    // Stream highlights: $5 = $5
    // Live chat: $15 * 1.2 = $18
    // Total: $71.40 adjustment
    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        new GameModifierCalculator.GameModifierCalculationResult(7140, 15140);
    when(mockModifierCalculator.calculate(eq(modifiers), eq(8000), eq(context))).thenReturn(modifierResult);

    // When
    var result = facade.calculateCompletePrice(cs2Config, startLevel, endLevel, modifiers, context);

    // Then
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.finalPrice()).isEqualTo(15140); // $151.40
    assertThat(result.totalAdjustments()).isEqualTo(7140); // $71.40
  }

  @Test
  @DisplayName("E2E: Business Scenario - Price Comparison with Different Modifier Combinations")
  void businessScenarioPriceComparisonWithDifferentModifiers() {
    // Given: Same service with different modifier combinations
    PriceConfigurationEntity config = createStandardConfig();
    int startLevel = 1;
    int endLevel = 20;

    Map<String, Object> standardContext = Map.of();
    Map<String, Object> premiumContext = Map.of("isWeekend", true, "isPremiumQuality", true);

    List<GameModifierEntity> standardModifiers = List.of(
        createSupportModifier("BASIC_SUPPORT", 500) // +$5 basic
    );

    List<GameModifierEntity> premiumModifiers = List.of(
        createTimingModifier("PREMIUM_RUSH", 4000), // +40% rush
        createQualityModifier("PREMIUM_QUALITY", 3000), // +30% quality
        createSupportModifier("VIP_SUPPORT", 2500), // +$25 VIP support
        createExtraModifier("PRIORITY_QUEUE", 1000) // +$10 priority
    );

    // Mock base price: $100 for 20 levels
    GamePriceCalculationResult baseResult = createLinearCalculationResult(2000, 9800, 10000);
    when(mockPriceCalculator.calculatePrice(config, startLevel, endLevel)).thenReturn(baseResult);

    // Standard package: +$5 = $105
    GameModifierCalculator.GameModifierCalculationResult standardResult =
        new GameModifierCalculator.GameModifierCalculationResult(500, 10500);
    when(mockModifierCalculator.calculate(eq(standardModifiers), eq(10000), eq(standardContext)))
        .thenReturn(standardResult);

    // Premium package with multipliers: Complex calculation = ~$175
    GameModifierCalculator.GameModifierCalculationResult premiumResult =
        new GameModifierCalculator.GameModifierCalculationResult(7500, 17500);
    when(mockModifierCalculator.calculate(eq(premiumModifiers), eq(10000), eq(premiumContext)))
        .thenReturn(premiumResult);

    // When
    var standardPackage = facade.calculateCompletePrice(config, startLevel, endLevel, standardModifiers, standardContext);
    var premiumPackage = facade.calculateCompletePrice(config, startLevel, endLevel, premiumModifiers, premiumContext);

    // Then: Premium package should cost significantly more
    assertThat(standardPackage.finalPrice()).isEqualTo(10500); // $105
    assertThat(premiumPackage.finalPrice()).isEqualTo(17500); // $175
    assertThat(premiumPackage.finalPrice()).isGreaterThan(standardPackage.finalPrice());

    // Premium adjustments should be much higher
    assertThat(premiumPackage.totalAdjustments()).isGreaterThan(standardPackage.totalAdjustments());
  }

  @Test
  @DisplayName("E2E: Edge Case - Zero Base Price with Modifiers")
  void edgeCaseZeroBasePriceWithModifiers() {
    // Given: Free service with paid modifiers
    PriceConfigurationEntity config = createZeroBaseConfig();
    int startLevel = 1;
    int endLevel = 1; // Same level

    List<GameModifierEntity> modifiers = List.of(
        createSupportModifier("DEDICATED_COACH", 5000), // +$50 coaching
        createExtraModifier("CUSTOM_STRATEGY", 2000) // +$20 custom strategy
    );

    Map<String, Object> context = Map.of("isCustomRequest", true);

    // Mock base price: $0 (free service)
    GamePriceCalculationResult baseResult = createLinearCalculationResult(0, 0, 0);
    when(mockPriceCalculator.calculatePrice(config, startLevel, endLevel)).thenReturn(baseResult);

    // Mock modifier calculation: +$50 + $20 * 1.25 = $75 total
    GameModifierCalculator.GameModifierCalculationResult modifierResult =
        new GameModifierCalculator.GameModifierCalculationResult(7500, 7500);
    when(mockModifierCalculator.calculate(eq(modifiers), eq(0), eq(context))).thenReturn(modifierResult);

    // When
    var result = facade.calculateCompletePrice(config, startLevel, endLevel, modifiers, context);

    // Then: Final price should be just the modifier costs
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.finalPrice()).isEqualTo(7500); // $75.00
    assertThat(result.totalAdjustments()).isEqualTo(7500);
  }

  // Helper methods for creating test entities
  private PriceConfigurationEntity createWOWLinearConfig() {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(200); // $2.00
    config.setPricePerLevel(250); // $2.50 per level
    config.setCalculationType(CalculationTypeEnum.LINEAR);
    return config;
  }

  private PriceConfigurationEntity createApexRangeConfig() {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(0);
    config.setCalculationType(CalculationTypeEnum.RANGE);
    return config;
  }

  private PriceConfigurationEntity createCS2FormulaConfig() {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(0);
    config.setCalculationType(CalculationTypeEnum.FORMULA);
    return config;
  }

  private PriceConfigurationEntity createStandardConfig() {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(2000); // $20 base
    config.setPricePerLevel(400); // $4 per level
    config.setCalculationType(CalculationTypeEnum.LINEAR);
    return config;
  }

  private PriceConfigurationEntity createZeroBaseConfig() {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(0);
    config.setPricePerLevel(0);
    config.setCalculationType(CalculationTypeEnum.LINEAR);
    return config;
  }

  private GameModifierEntity createTimingModifier(String code, int value) {
    return createModifier(code, GameModifierType.TIMING, GameModifierOperation.ADD, value);
  }

  private GameModifierEntity createSupportModifier(String code, int value) {
    return createModifier(code, GameModifierType.SUPPORT, GameModifierOperation.ADD, value);
  }

  private GameModifierEntity createModeModifier(String code, int value) {
    return createModifier(code, GameModifierType.MODE, GameModifierOperation.ADD, value);
  }

  private GameModifierEntity createQualityModifier(String code, int value) {
    return createModifier(code, GameModifierType.QUALITY, GameModifierOperation.ADD, value);
  }

  private GameModifierEntity createExtraModifier(String code, int value) {
    return createModifier(code, GameModifierType.EXTRA, GameModifierOperation.ADD, value);
  }

  private GameModifierEntity createPromotionalModifier(String code, int value) {
    return createModifier(code, GameModifierType.PROMOTIONAL, GameModifierOperation.SUBTRACT, value);
  }

  private GameModifierEntity createSeasonalModifier(String code, int value) {
    return createModifier(code, GameModifierType.SEASONAL, GameModifierOperation.ADD, value);
  }

  private GameModifierEntity createModifier(String code, GameModifierType type,
      GameModifierOperation operation, int value) {
    GameModifierEntity modifier = new GameModifierEntity();
    modifier.setId(UUID.randomUUID());
    modifier.setCode(code);
    modifier.setName(code.replace("_", " "));
    modifier.setType(type);
    modifier.setOperation(operation);
    modifier.setValue(value);
    modifier.setActive(true);
    modifier.setGameCode("WOW");
    modifier.setSortOrder(1);
    return modifier;
  }

  // Helper methods for creating calculation results
  private GamePriceCalculationResult createLinearCalculationResult(int basePrice, int levelPrice, int totalPrice) {
    return new GamePriceCalculationResult(
        basePrice,
        totalPrice,
        "LINEAR",
        "basePrice + (levelDiff × pricePerLevel)",
        true,
        String.format("Linear calculation: base=%d, levelPrice=%d", basePrice, levelPrice),
        com.aksi.api.game.dto.CalculationStatus.SUCCESS,
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
        "Range calculation completed",
        com.aksi.api.game.dto.CalculationStatus.SUCCESS,
        Map.of("appliedRanges", List.of())
    );
  }

  private GamePriceCalculationResult createFormulaCalculationResult(int totalPrice) {
    return new GamePriceCalculationResult(
        0,
        totalPrice,
        "FORMULA",
        "Complex formula calculation",
        true,
        "Formula calculation completed",
        com.aksi.api.game.dto.CalculationStatus.SUCCESS,
        Map.of("variables", Map.of())
    );
  }
}
