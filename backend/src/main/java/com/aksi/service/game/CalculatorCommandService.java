package com.aksi.service.game;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CalculationRequest;
import com.aksi.api.game.dto.CalculationResult;
import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.service.game.calculation.CalculatorFacade;
import com.aksi.service.game.factory.CalculationContextFactory;
import com.aksi.service.game.util.CalculationResultBuilder;
import com.aksi.service.game.util.EntityQueryUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for calculator-related write operations. Handles price calculations and business
 * logic.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CalculatorCommandService {

  private final EntityQueryUtils entityQueryUtils;
  private final CalculationResultBuilder resultBuilder;
  private final CalculatorValidationService validationService;
  private final GameModifierService gameModifierService;
  private final CalculatorFacade calculatorFacade;

  private final CalculationContextFactory contextFactory;

  /**
   * Calculate boosting price for game service.
   *
   * @param request Calculation request
   * @return Calculation result
   */
  public CalculationResult calculateBoostingPrice(CalculationRequest request) {
    log.info(
        "Calculating boosting price for game: {}, from: {}, to: {}, service: {}",
        request.getGameCode(),
        request.getStartLevel(),
        request.getTargetLevel(),
        request.getServiceTypeCode());

    // Validate request
    validationService.validateCalculationRequest(request);

    // Find required entities
    GameEntity game = entityQueryUtils.findGameByCode(request.getGameCode());
    DifficultyLevelEntity difficultyLevel =
        entityQueryUtils.findDifficultyLevelByGameIdAndCode(
            game.getId(), request.getDifficultyLevelCode());
    ServiceTypeEntity serviceType =
        entityQueryUtils.findServiceTypeByGameIdAndCode(
            game.getId(), request.getServiceTypeCode());

    // Find price configuration
    PriceConfigurationEntity priceConfig =
        entityQueryUtils.findPriceConfigurationByCombination(
            game.getId(), difficultyLevel.getId(), serviceType.getId());

    // Get and apply modifiers
    List<GameModifierEntity> applicableModifiers =
        gameModifierService.getActiveModifiersForCalculation(
            game.getId(), serviceType.getId(), request.getModifiers());

    // Validate modifier compatibility
    gameModifierService.validateModifierCompatibility(applicableModifiers);

    // Create calculation context for formula modifiers using factory
    var context =
        contextFactory.createGameBoostingContext(
            game, serviceType, difficultyLevel, difficultyLevel, priceConfig.getBasePrice());

    // Calculate complete price using CalculatorFacade (CQRS approach)
    var completeResult = calculatorFacade.calculateCompletePrice(
        priceConfig, request.getStartLevel(), request.getTargetLevel(),
        applicableModifiers, context);

    // Check if calculation was successful
    if (!completeResult.isSuccessful()) {
      log.error("Complete price calculation failed: {}", completeResult.notes());
      return resultBuilder.build(
          completeResult.finalPrice(),
          priceConfig.getBasePrice(),
          100, 100, 0, 0);
    }

    int finalTotalPrice = completeResult.finalPrice();
    int modifierAdjustments = completeResult.totalAdjustments();

    log.info("Price calculation completed: base=${} (via {}), modifiers=${}, final=${}",
        completeResult.baseResult().totalPrice() / 100.0,
        completeResult.baseResult().calculationType(),
        modifierAdjustments / 100.0,
        finalTotalPrice / 100.0);

    // Build result using utility with enhanced information
    return resultBuilder.build(
        finalTotalPrice,
        completeResult.baseResult().basePrice(),  // Original base price from config
        100, // difficulty multiplier
        100, // service multiplier
        Math.max(0, request.getTargetLevel() - request.getStartLevel()),
        modifierAdjustments);
  }

}
