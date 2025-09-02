package com.aksi.service.game.calculation;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.aksi.api.game.dto.PriceConfiguration.CalculationTypeEnum;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.service.game.factory.GameCalculationFactory;
import com.aksi.service.game.util.GameCalculationUtils;
import com.aksi.service.game.util.SharedJsonUtils;

@DisplayName("Calculator Scenarios Tests - Real Game Examples")
class CalculatorScenariosTest {

  private LinearCalculator linearCalculator;
  private RangeCalculator rangeCalculator;
  private FormulaCalculator formulaCalculator;
  private TimeBasedCalculator timeBasedCalculator;

  @BeforeEach
  void setUp() {
    SharedJsonUtils jsonUtils = new SharedJsonUtils();
    GameCalculationUtils utils = new GameCalculationUtils();
    GameCalculationFactory factory = new GameCalculationFactory(utils);
    linearCalculator = new LinearCalculator(utils, factory, jsonUtils);
    rangeCalculator = new RangeCalculator(utils, factory, jsonUtils);
    formulaCalculator = new FormulaCalculator(utils, factory, jsonUtils);
    timeBasedCalculator = new TimeBasedCalculator(utils, factory, jsonUtils);
  }

  @Test
  @DisplayName("WOW Classic Level Boost: Linear calculation with level ranges")
  void wowClassicLevelBoostScenario() {
    // Given: WOW Classic level boost from 1 to 60
    PriceConfigurationEntity config = createWOWLinearConfig();
    int startLevel = 1;
    int targetLevel = 60;

    // When
    var result = linearCalculator.calculate(config, startLevel, targetLevel);

    // Then: 59 levels * $2.50 = $147.50, total $149.50 (including base $2)
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(14950); // $149.50 in cents
    assertThat(result.calculationType()).isEqualTo("LINEAR");
    assertThat(result.notes()).contains("Linear calculation completed");
  }

  @Test
  @DisplayName("Apex Legends Rank Boost: Range-based pricing")
  void apexRankBoostScenario() {
    // Given: Apex rank boost through tiers
    String rangeJson = """
        {
          "ranges": [
            {"from": 1, "to": 25, "price": 500},
            {"from": 26, "to": 50, "price": 800},
            {"from": 51, "to": 75, "price": 1200},
            {"from": 76, "to": 100, "price": 1800}
          ]
        }
        """;
    PriceConfigurationEntity config = createRangeConfig(0, rangeJson);
    int startLevel = 25;
    int targetLevel = 75; // From Bronze to Diamond

    // When
    var result = rangeCalculator.calculate(config, startLevel, targetLevel);

    // Then: 25 levels Bronze ($500) + 25 levels Gold ($800) + 25 levels Platinum ($1200) = $62.50
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(6250); // $62.50
  }

  @Test
  @DisplayName("CS2 Competitive Rank Boost: Formula with diminishing returns")
  void cs2RankBoostScenario() {
    // Given: CS2 rank boost with exponential difficulty
    String formulaJson = """
        {
          "expression": "basePrice + (levelDiff * pricePerLevel * Math.pow(1.1, Math.floor(levelDiff/10)))",
          "variables": {
            "basePrice": 2000,
            "pricePerLevel": 100
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(formulaJson);
    int startLevel = 1;
    int targetLevel = 25; // From Silver 1 to Global

    // When
    var result = formulaCalculator.calculate(config, startLevel, targetLevel);

    // Then: Complex calculation with exponential growth for higher ranks
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isGreaterThan(4000); // Base + exponential growth
    assertThat(result.calculationType()).isEqualTo("FORMULA");
  }

  @Test
  @DisplayName("EFT Level Boost: Complex formula with multiple variables")
  void eftLevelBoostScenario() {
    // Given: EFT leveling with complex mechanics
    String formulaJson = """
        {
          "expression": "(basePrice + (levelDiff * pricePerLevel)) * difficultyMultiplier + equipmentBonus",
          "variables": {
            "basePrice": 5000,
            "pricePerLevel": 150,
            "difficultyMultiplier": 1.3,
            "equipmentBonus": 1000
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(formulaJson);
    int startLevel = 1;
    int targetLevel = 40;

    // When
    var result = formulaCalculator.calculate(config, startLevel, targetLevel);

    // Then: (5000 + 39*150) * 1.3 + 1000 = (5000 + 5850) * 1.3 + 1000 = 14045
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(14045);
  }

  @Test
  @DisplayName("Professional Coaching: Time-based pricing")
  void professionalCoachingScenario() {
    // Given: Professional coaching service
    String timeConfigJson = """
        {
          "hourlyRate": 3000,
          "baseHours": 2,
          "hoursPerLevel": 0.5,
          "complexityMultiplier": 1.5
        }
        """;
    PriceConfigurationEntity config = createTimeBasedConfig(timeConfigJson);
    int startLevel = 1;
    int targetLevel = 10;

    // When
    var result = timeBasedCalculator.calculate(config, startLevel, targetLevel);

    // Then: (2 + 9*0.5) * 3000 * 1.5 = 6.5 * 3000 * 1.5 = 29250
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(29250); // $292.50
    assertThat(result.calculationType()).isEqualTo("TIME_BASED");
  }

  @Test
  @DisplayName("Multi-game comparison: Same service across different games")
  void multiGameComparisonScenario() {
    // Given: Same level boost service across different games with different pricing models

    // WOW - Linear
    PriceConfigurationEntity wowConfig = createWOWLinearConfig();
    var wowResult = linearCalculator.calculate(wowConfig, 1, 20);

    // Apex - Range
    String apexJson = """
        {
          "ranges": [
            {"from": 1, "to": 25, "price": 600},
            {"from": 26, "to": 50, "price": 900}
          ]
        }
        """;
    PriceConfigurationEntity apexConfig = createRangeConfig(0, apexJson);
    var apexResult = rangeCalculator.calculate(apexConfig, 1, 20);

    // EFT - Formula
    String eftJson = """
        {
          "expression": "basePrice + (levelDiff * pricePerLevel * 1.2)",
          "variables": {
            "basePrice": 3000,
            "pricePerLevel": 200
          }
        }
        """;
    PriceConfigurationEntity eftConfig = createFormulaConfig(eftJson);
    var eftResult = formulaCalculator.calculate(eftConfig, 1, 20);

    // Then: All calculations should be successful with different pricing
    assertThat(wowResult.isSuccessful()).isTrue();
    assertThat(apexResult.isSuccessful()).isTrue();
    assertThat(eftResult.isSuccessful()).isTrue();

    // WOW: 19 * 250 = 4750 + 200 = 4950
    assertThat(wowResult.totalPrice()).isEqualTo(4950);

    // Apex: 20 * 600 = 12000
    assertThat(apexResult.totalPrice()).isEqualTo(12000);

    // EFT: 3000 + 19 * 200 * 1.2 = 3000 + 4560 = 7560
    assertThat(eftResult.totalPrice()).isEqualTo(7560);
  }

  @Test
  @DisplayName("Edge case: Maximum level calculations")
  void maximumLevelCalculationsScenario() {
    // Given: Very high level calculations (end-game content)
    PriceConfigurationEntity config = createWOWLinearConfig();
    int startLevel = 50;
    int targetLevel = 120; // Max level in some games

    // When
    var result = linearCalculator.calculate(config, startLevel, targetLevel);

    // Then: 70 levels * $2.50 = $175, total $177 (including base $2)
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(17700); // $177.00
  }

  @Test
  @DisplayName("Edge case: Minimum level difference")
  void minimumLevelDifferenceScenario() {
    // Given: Only 1 level difference
    PriceConfigurationEntity config = createWOWLinearConfig();
    int startLevel = 10;
    int targetLevel = 11;

    // When
    var result = linearCalculator.calculate(config, startLevel, targetLevel);

    // Then: Only $2.50 for 1 level + base $2 = $4.50
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(450); // $4.50
  }

  @Test
  @DisplayName("Business scenario: Price comparison for different service tiers")
  void businessScenarioPriceComparison() {
    // Given: Different service tiers for the same game
    PriceConfigurationEntity standardConfig = createWOWLinearConfig();
    PriceConfigurationEntity premiumConfig = createWOWLinearConfig();
    premiumConfig.setPricePerLevel(300); // Premium costs more per level

    int startLevel = 1;
    int targetLevel = 30;

    var standardResult = linearCalculator.calculate(standardConfig, startLevel, targetLevel);
    var premiumResult = linearCalculator.calculate(premiumConfig, startLevel, targetLevel);

    // Then: Premium should cost more
    assertThat(standardResult.totalPrice()).isLessThan(premiumResult.totalPrice());
    assertThat(premiumResult.totalPrice() - standardResult.totalPrice()).isEqualTo(8700); // 29 * 300 difference
  }

  @Test
  @DisplayName("Seasonal promotion scenario: Discounted pricing")
  void seasonalPromotionScenario() {
    // Given: Base price with seasonal discount
    String promotionFormula = """
        {
          "expression": "basePrice + (levelDiff * pricePerLevel) * 0.8",
          "variables": {
            "basePrice": 2000,
            "pricePerLevel": 250
          }
        }
        """;
    PriceConfigurationEntity config = createFormulaConfig(promotionFormula);
    int startLevel = 1;
    int targetLevel = 25;

    // When
    var result = formulaCalculator.calculate(config, startLevel, targetLevel);

    // Then: 20% discount applied to per-level pricing
    // Normal: 2000 + 24*250 = 8000
    // Discounted: 2000 + 24*200 = 6800 (20% off per-level)
    assertThat(result.isSuccessful()).isTrue();
    assertThat(result.totalPrice()).isEqualTo(6800);
  }

  // Helper methods for creating realistic game configurations
  private PriceConfigurationEntity createWOWLinearConfig() {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setBasePrice(200); // $2.00 base price
    config.setPricePerLevel(250); // $2.50 per level
    config.setCalculationType(CalculationTypeEnum.LINEAR);
    return config;
  }

  private PriceConfigurationEntity createRangeConfig(int basePrice, String rangeJson) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setBasePrice(basePrice);
    config.setCalculationFormula(rangeJson);
    config.setCalculationType(CalculationTypeEnum.RANGE);
    return config;
  }

  private PriceConfigurationEntity createFormulaConfig(String formulaJson) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setBasePrice(0); // Not used in formula calculations
    config.setCalculationFormula(formulaJson);
    config.setCalculationType(CalculationTypeEnum.FORMULA);
    return config;
  }

  private PriceConfigurationEntity createTimeBasedConfig(String timeConfigJson) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setBasePrice(0); // Not used in time-based calculations
    config.setCalculationFormula(timeConfigJson);
    config.setCalculationType(CalculationTypeEnum.TIME_BASED);
    return config;
  }
}
