package com.aksi.service.game;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aksi.api.game.dto.CalculationRequest;
import com.aksi.api.game.dto.CalculationResult;
import com.aksi.api.game.dto.CalculationStatus;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.api.game.dto.PriceConfiguration.CalculationTypeEnum;
import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.service.game.calculation.CalculatorFacade;
import com.aksi.service.game.calculation.CalculatorFacade.CompleteCalculationResult;
import com.aksi.service.game.calculation.GamePriceCalculationResult;
import com.aksi.service.game.factory.CalculationContextFactory;
import com.aksi.service.game.util.CalculationResultBuilder;
import com.aksi.service.game.util.EntityQueryUtils;

@ExtendWith(MockitoExtension.class)
@DisplayName("CalculatorCommandService E2E Tests")
class CalculatorCommandServiceTest {

  @Mock
  private EntityQueryUtils entityQueryService;

  @Mock
  private CalculationResultBuilder resultBuilder;

  @Mock
  private CalculatorValidationService validationService;

  @Mock
  private GameModifierService modifierService;

  @Mock
  private CalculatorFacade calculatorFacade;

  @Mock
  private CalculationContextFactory contextFactory;

  private CalculatorCommandService commandService;

  @BeforeEach
  void setUp() {
    commandService = new CalculatorCommandService(
        entityQueryService,
        resultBuilder,
        validationService,
        modifierService,
        calculatorFacade,
        contextFactory
    );
  }

  @Test
  @DisplayName("Should calculate boosting price successfully for linear calculation")
  void shouldCalculateBoostingPriceSuccessfullyForLinearCalculation() {
    // Given
    CalculationRequest request = createCalculationRequest("WOW", "BOOSTING", "HARD", 1, 10, List.of());

    GameEntity game = createGame("WOW");
    ServiceTypeEntity serviceType = createServiceType("BOOSTING");
    DifficultyLevelEntity difficultyLevel = createDifficultyLevel("HARD");
    PriceConfigurationEntity priceConfig = createLinearPriceConfig(1000, 50);

    List<GameModifierEntity> applicableModifiers = List.of(createTimingModifier(1500));
    Map<String, Object> context = Map.of("difficulty", "HARD");

    CompleteCalculationResult completeResult = CompleteCalculationResult.success(
        mock(GamePriceCalculationResult.class),
        217, // 15% of 1445 = 216.75 -> 217
        1662  // 1445 + 217 = 1662
    );

    CalculationResult expectedResult = createCalculationResult(1662);

    when(entityQueryService.findGameByCode("WOW")).thenReturn(game);
    when(entityQueryService.findServiceTypeByGameIdAndCode(game.getId(), "BOOSTING")).thenReturn(serviceType);
    when(entityQueryService.findDifficultyLevelByGameIdAndCode(game.getId(), "HARD")).thenReturn(difficultyLevel);
    when(entityQueryService.findPriceConfigurationByCombination(game.getId(), difficultyLevel.getId(), serviceType.getId()))
        .thenReturn(priceConfig);
    when(modifierService.getActiveModifiersForCalculation(game.getId(), serviceType.getId(), request.getModifiers())).thenReturn(applicableModifiers);
    doNothing().when(modifierService).validateModifierCompatibility(applicableModifiers);
    when(contextFactory.createGameBoostingContext(any(), any(), any(), any(), anyInt())).thenReturn(context);
    when(calculatorFacade.calculateCompletePrice(priceConfig, 1, 10, applicableModifiers, context))
        .thenReturn(completeResult);
    when(resultBuilder.build(1662, 0, 100, 100, 9, 217)).thenReturn(expectedResult);

    // When
    CalculationResult result = commandService.calculateBoostingPrice(request);

    // Then
    assertThat(result).isEqualTo(expectedResult);
  }

  @Test
  @DisplayName("Should handle failed calculation gracefully")
  void shouldHandleFailedCalculationGracefully() {
    // Given
    CalculationRequest request = createCalculationRequest("APEX", "RANK_BOOST", "DIAMOND", 1, 5, List.of());

    GameEntity game = createGame("APEX");
    ServiceTypeEntity serviceType = createServiceType("RANK_BOOST");
    DifficultyLevelEntity difficultyLevel = createDifficultyLevel("DIAMOND");
    PriceConfigurationEntity priceConfig = createInvalidPriceConfig();

    List<GameModifierEntity> applicableModifiers = List.of();
    Map<String, Object> context = Map.of();

    CompleteCalculationResult failedResult = CompleteCalculationResult.error(
        "Invalid calculation configuration", 1000);

    CalculationResult expectedResult = createCalculationResult(1000);

    when(entityQueryService.findGameByCode("APEX")).thenReturn(game);
    when(entityQueryService.findServiceTypeByGameIdAndCode(game.getId(), "RANK_BOOST")).thenReturn(serviceType);
    when(entityQueryService.findDifficultyLevelByGameIdAndCode(game.getId(), "DIAMOND")).thenReturn(difficultyLevel);
    when(entityQueryService.findPriceConfigurationByCombination(game.getId(), difficultyLevel.getId(), serviceType.getId()))
        .thenReturn(priceConfig);
    when(modifierService.getActiveModifiersForCalculation(game.getId(), serviceType.getId(), request.getModifiers())).thenReturn(applicableModifiers);
    doNothing().when(modifierService).validateModifierCompatibility(applicableModifiers);
    when(contextFactory.createGameBoostingContext(any(), any(), any(), any(), anyInt())).thenReturn(context);
    when(calculatorFacade.calculateCompletePrice(priceConfig, 1, 5, applicableModifiers, context))
        .thenReturn(failedResult);
    when(resultBuilder.build(1000, 1000, 100, 100, 0, 0)).thenReturn(expectedResult);

    // When
    CalculationResult result = commandService.calculateBoostingPrice(request);

    // Then
    assertThat(result).isEqualTo(expectedResult);
  }

  @Test
  @DisplayName("Should calculate price with range-based configuration")
  void shouldCalculatePriceWithRangeBasedConfiguration() {
    // Given
    CalculationRequest request = createCalculationRequest("WOW", "LEVEL_BOOST", "NORMAL", 5, 25, List.of());

    GameEntity game = createGame("WOW");
    ServiceTypeEntity serviceType = createServiceType("LEVEL_BOOST");
    DifficultyLevelEntity difficultyLevel = createDifficultyLevel("NORMAL");
    PriceConfigurationEntity priceConfig = createRangePriceConfig(500);

    List<GameModifierEntity> applicableModifiers = List.of(createSupportModifier(1000));
    Map<String, Object> context = Map.of("service", "LEVEL_BOOST");

    CompleteCalculationResult completeResult = CompleteCalculationResult.success(
        mock(com.aksi.service.game.calculation.GamePriceCalculationResult.class),
        100,
        2600  // Base 2500 + 100 modifier
    );

    CalculationResult expectedResult = createCalculationResult(2600);

    when(entityQueryService.findGameByCode("WOW")).thenReturn(game);
    when(entityQueryService.findServiceTypeByGameIdAndCode(game.getId(), "LEVEL_BOOST")).thenReturn(serviceType);
    when(entityQueryService.findDifficultyLevelByGameIdAndCode(game.getId(), "NORMAL")).thenReturn(difficultyLevel);
    when(entityQueryService.findPriceConfigurationByCombination(game.getId(), difficultyLevel.getId(), serviceType.getId()))
        .thenReturn(priceConfig);
    when(modifierService.getActiveModifiersForCalculation(game.getId(), serviceType.getId(), request.getModifiers())).thenReturn(applicableModifiers);
    doNothing().when(modifierService).validateModifierCompatibility(applicableModifiers);
    when(contextFactory.createGameBoostingContext(any(), any(), any(), any(), anyInt())).thenReturn(context);
    when(calculatorFacade.calculateCompletePrice(priceConfig, 5, 25, applicableModifiers, context))
        .thenReturn(completeResult);
    when(resultBuilder.build(2600, 0, 100, 100, 20, 100)).thenReturn(expectedResult);

    // When
    CalculationResult result = commandService.calculateBoostingPrice(request);

    // Then
    assertThat(result).isEqualTo(expectedResult);
  }

  @Test
  @DisplayName("Should calculate price with multiple modifiers")
  void shouldCalculatePriceWithMultipleModifiers() {
    // Given
    CalculationRequest request = createCalculationRequest(
        "CS2", "RANK_BOOST", "GLOBAL", 1, 10,
        List.of("VIP_DISCOUNT", "URGENCY_BONUS"));

    GameEntity game = createGame("CS2");
    ServiceTypeEntity serviceType = createServiceType("RANK_BOOST");
    DifficultyLevelEntity difficultyLevel = createDifficultyLevel("GLOBAL");
    PriceConfigurationEntity priceConfig = createLinearPriceConfig(2000, 150);

    List<GameModifierEntity> applicableModifiers = List.of(
        createPromotionalModifier(2000), // VIP discount
        createTimingModifier(5000),     // Urgency bonus
        createSupportModifier(1000)     // Voice support
    );

    Map<String, Object> context = Map.of("vip", true, "urgent", true);

    CompleteCalculationResult completeResult = CompleteCalculationResult.success(
        mock(com.aksi.service.game.calculation.GamePriceCalculationResult.class),
        790, // Total adjustments: -400 (20% of 2000) + 500 - 100 = 0
        3290 // Base 2500 + 790 adjustments
    );

    CalculationResult expectedResult = createCalculationResult(3290);

    when(entityQueryService.findGameByCode("CS2")).thenReturn(game);
    when(entityQueryService.findServiceTypeByGameIdAndCode(game.getId(), "RANK_BOOST")).thenReturn(serviceType);
    when(entityQueryService.findDifficultyLevelByGameIdAndCode(game.getId(), "GLOBAL")).thenReturn(difficultyLevel);
    when(entityQueryService.findPriceConfigurationByCombination(game.getId(), difficultyLevel.getId(), serviceType.getId()))
        .thenReturn(priceConfig);

    doNothing().when(modifierService).validateModifierCompatibility(anyList());
    when(contextFactory.createGameBoostingContext(any(), any(), any(), any(), anyInt())).thenReturn(context);
    when(calculatorFacade.calculateCompletePrice(any(), anyInt(), anyInt(), anyList(), any()))
        .thenReturn(completeResult);
    when(resultBuilder.build(3290, 0, 100, 100, 9, 790)).thenReturn(expectedResult);

    // When
    CalculationResult result = commandService.calculateBoostingPrice(request);

    // Then
    assertThat(result).isEqualTo(expectedResult);
  }

  @Test
  @DisplayName("Should throw exception when game not found")
  void shouldThrowExceptionWhenGameNotFound() {
    // Given
    CalculationRequest request = createCalculationRequest("UNKNOWN_GAME", "BOOSTING", "HARD", 1, 10, List.of());

    when(entityQueryService.findGameByCode("UNKNOWN_GAME")).thenThrow(new NotFoundException("Game not found"));

    // When & Then
    assertThatThrownBy(() -> commandService.calculateBoostingPrice(request))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Game not found");
  }

  @Test
  @DisplayName("Should throw exception when service type not found")
  void shouldThrowExceptionWhenServiceTypeNotFound() {
    // Given
    CalculationRequest request = createCalculationRequest("WOW", "UNKNOWN_SERVICE", "HARD", 1, 10, List.of());

    GameEntity game = createGame("WOW");

    when(entityQueryService.findGameByCode("WOW")).thenReturn(game);
    when(entityQueryService.findServiceTypeByGameIdAndCode(game.getId(), "UNKNOWN_SERVICE")).thenThrow(new NotFoundException("Service type not found"));

    // When & Then
    assertThatThrownBy(() -> commandService.calculateBoostingPrice(request))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Service type not found");
  }

  @Test
  @DisplayName("Should throw exception when difficulty level not found")
  void shouldThrowExceptionWhenDifficultyLevelNotFound() {
    // Given
    CalculationRequest request = createCalculationRequest("WOW", "BOOSTING", "UNKNOWN_DIFFICULTY", 1, 10, List.of());

    GameEntity game = createGame("WOW");
    ServiceTypeEntity serviceType = createServiceType("BOOSTING");

    when(entityQueryService.findGameByCode("WOW")).thenReturn(game);
    when(entityQueryService.findDifficultyLevelByGameIdAndCode(game.getId(), "UNKNOWN_DIFFICULTY")).thenThrow(new NotFoundException("Difficulty level not found"));

    // When & Then
    assertThatThrownBy(() -> commandService.calculateBoostingPrice(request))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Difficulty level not found");
  }

  @Test
  @DisplayName("Should throw exception when price configuration not found")
  void shouldThrowExceptionWhenPriceConfigurationNotFound() {
    // Given
    CalculationRequest request = createCalculationRequest("WOW", "BOOSTING", "HARD", 1, 10, List.of());

    GameEntity game = createGame("WOW");
    ServiceTypeEntity serviceType = createServiceType("BOOSTING");
    DifficultyLevelEntity difficultyLevel = createDifficultyLevel("HARD");

    when(entityQueryService.findGameByCode("WOW")).thenReturn(game);
    when(entityQueryService.findServiceTypeByGameIdAndCode(game.getId(), "BOOSTING")).thenReturn(serviceType);
    when(entityQueryService.findDifficultyLevelByGameIdAndCode(game.getId(), "HARD")).thenReturn(difficultyLevel);
    when(entityQueryService.findPriceConfigurationByCombination(game.getId(), difficultyLevel.getId(), serviceType.getId()))
        .thenThrow(new NotFoundException("Price configuration not found"));

    // When & Then
    assertThatThrownBy(() -> commandService.calculateBoostingPrice(request))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Price configuration not found");
  }

  // Helper methods for creating test data
  private CalculationRequest createCalculationRequest(String gameCode, String serviceCode,
      String difficultyCode, int startLevel, int targetLevel, List<String> modifierCodes) {
    CalculationRequest request = new CalculationRequest();
    request.setGameCode(gameCode);
    request.setServiceTypeCode(serviceCode);
    request.setDifficultyLevelCode(difficultyCode);
    request.setStartLevel(startLevel);
    request.setTargetLevel(targetLevel);
    request.setModifiers(modifierCodes);
    return request;
  }

  private CalculationResult createCalculationResult(int finalPrice) {
    CalculationResult result = new CalculationResult();
    result.setFinalPrice(finalPrice);
    result.setCurrency("USD");
    result.setStatus(CalculationStatus.SUCCESS);
    // Note: Detailed breakdown would be set via CalculationBreakdown object in real implementation
    return result;
  }

  private GameEntity createGame(String code) {
    GameEntity game = new GameEntity();
    game.setId(UUID.randomUUID());
    game.setCode(code);
    game.setName(code + " Game");
    return game;
  }

  private ServiceTypeEntity createServiceType(String code) {
    ServiceTypeEntity serviceType = new ServiceTypeEntity();
    serviceType.setId(UUID.randomUUID());
    serviceType.setCode(code);
    serviceType.setName(code + " Service");
    return serviceType;
  }

  private DifficultyLevelEntity createDifficultyLevel(String code) {
    DifficultyLevelEntity difficultyLevel = new DifficultyLevelEntity();
    difficultyLevel.setId(UUID.randomUUID());
    difficultyLevel.setCode(code);
    difficultyLevel.setName(code + " Level");
    return difficultyLevel;
  }

  private PriceConfigurationEntity createLinearPriceConfig(int basePrice, int pricePerLevel) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(basePrice);
    config.setPricePerLevel(pricePerLevel);
    config.setCalculationType(CalculationTypeEnum.LINEAR);
    return config;
  }

  private PriceConfigurationEntity createRangePriceConfig(int basePrice) {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(basePrice);
    config.setCalculationType(CalculationTypeEnum.RANGE);
    config.setCalculationFormula("{\"ranges\": [{\"from\": 1, \"to\": 10, \"price\": 100}, {\"from\": 11, \"to\": 20, \"price\": 200}]}");
    return config;
  }

  private PriceConfigurationEntity createInvalidPriceConfig() {
    PriceConfigurationEntity config = new PriceConfigurationEntity();
    config.setId(UUID.randomUUID());
    config.setBasePrice(1000); // Fixed fallback value for error testing
    config.setCalculationType(null);
    return config;
  }

  private GameModifierEntity createTimingModifier(int value) {
    GameModifierEntity modifier = new GameModifierEntity();
    modifier.setId(UUID.randomUUID());
    modifier.setCode("TIMING_RUSH");
    modifier.setName("24 Hour Rush");
    modifier.setType(GameModifierType.TIMING);
    modifier.setOperation(GameModifierOperation.ADD);
    modifier.setValue(value);
    modifier.setActive(true);
    modifier.setGameCode("WOW");
    return modifier;
  }

  private GameModifierEntity createSupportModifier(int value) {
    GameModifierEntity modifier = new GameModifierEntity();
    modifier.setId(UUID.randomUUID());
    modifier.setCode("VOICE_SUPPORT");
    modifier.setName("Voice Chat Support");
    modifier.setType(GameModifierType.SUPPORT);
    modifier.setOperation(GameModifierOperation.ADD);
    modifier.setValue(value);
    modifier.setActive(true);
    modifier.setGameCode("WOW");
    return modifier;
  }

  private GameModifierEntity createPromotionalModifier(int value) {
    GameModifierEntity modifier = new GameModifierEntity();
    modifier.setId(UUID.randomUUID());
    modifier.setCode("PROMO_DISCOUNT");
    modifier.setName("Promotional Discount");
    modifier.setType(GameModifierType.PROMOTIONAL);
    modifier.setOperation(GameModifierOperation.SUBTRACT);
    modifier.setValue(value);
    modifier.setActive(true);
    modifier.setGameCode("WOW");
    return modifier;
  }
}
