package com.aksi.service.game;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CalculationRequest;
import com.aksi.api.game.dto.CalculationResult;
import com.aksi.domain.game.DifficultyLevelEntity;
import com.aksi.domain.game.GameEntity;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.ServiceTypeEntity;
import com.aksi.domain.pricing.PriceModifierEntity;
import com.aksi.service.game.factory.CalculationContextFactory;
import com.aksi.service.game.util.CalculationResultBuilder;
import com.aksi.service.game.util.GameEntityQueryService;

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

  private final GameEntityQueryService entityQueryService;
  private final CalculationResultBuilder resultBuilder;
  private final CalculatorValidationService validationService;
  private final ModifierService modifierService;

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
    GameEntity game = entityQueryService.findGameByCode(request.getGameCode());
    DifficultyLevelEntity difficultyLevel =
        entityQueryService.findDifficultyLevelByGameIdAndCode(
            game.getId(), request.getDifficultyLevelCode());
    ServiceTypeEntity serviceType =
        entityQueryService.findServiceTypeByGameIdAndCode(
            game.getId(), request.getServiceTypeCode());

    // Find price configuration
    PriceConfigurationEntity priceConfig =
        entityQueryService.findPriceConfigurationByCombination(
            game.getId(), difficultyLevel.getId(), serviceType.getId());

    // Calculate base price using start and target levels from request
    int basePrice =
        calculateBasePrice(priceConfig, request.getStartLevel(), request.getTargetLevel());

    // Get and apply modifiers
    List<PriceModifierEntity> applicableModifiers =
        modifierService.getActiveModifiersForCalculation(
            game.getId(), serviceType.getId(), request.getModifiers());

    // Validate modifier compatibility
    modifierService.validateModifierCompatibility(applicableModifiers);

    // Create calculation context for formula modifiers using factory
    var context =
        contextFactory.createGameBoostingContext(
            game, serviceType, difficultyLevel, difficultyLevel, basePrice);

    // Apply modifiers using the calculation context
    int modifierAdjustments = calculateModifierAdjustments(applicableModifiers, basePrice, context);

    // Calculate total price
    int totalPrice = basePrice + modifierAdjustments;

    // Build result using utility
    return resultBuilder.build(
        totalPrice,
        basePrice,
        100, // difficulty multiplier
        100, // service multiplier
        Math.max(0, request.getTargetLevel() - request.getStartLevel()),
        modifierAdjustments,
        game);
  }

  /**
   * Calculate total adjustments from all applicable modifiers using the calculation context.
   *
   * @param applicableModifiers List of modifiers to apply
   * @param basePrice Base price before modifiers
   * @param context Calculation context with game/service/level information
   * @return Total adjustment amount
   */
  private int calculateModifierAdjustments(
      List<PriceModifierEntity> applicableModifiers, int basePrice, Map<String, Object> context) {

    // basePrice is passed to individual modifier calculations but not used directly here

    if (applicableModifiers.isEmpty()) {
      log.debug("No modifiers to apply");
      return 0;
    }

    int totalAdjustments = 0;

    for (PriceModifierEntity modifier : applicableModifiers) {
      int adjustment = calculateModifierAdjustment(modifier, basePrice, context);
      totalAdjustments += adjustment;

      log.debug(
          "Applied modifier '{}': {} (adjustment: {})",
          modifier.getCode(),
          modifier.getType(),
          adjustment);
    }

    log.debug("Total modifier adjustments: {}", totalAdjustments);
    return totalAdjustments;
  }

  /**
   * Calculate adjustment for a single modifier based on its type and the calculation context.
   *
   * @param modifier The modifier to apply
   * @param basePrice Base price for calculation
   * @param context Calculation context
   * @return Adjustment amount
   */
  private int calculateModifierAdjustment(
      PriceModifierEntity modifier, int basePrice, Map<String, Object> context) {

    return switch (modifier.getType()) {
      case PERCENTAGE -> calculatePercentageAdjustment(modifier, basePrice);
      case FIXED -> calculateFixedAdjustment(modifier, context);
      case FORMULA -> calculateFormulaAdjustment(modifier, context);
      case MULTIPLIER -> calculateMultiplierAdjustment(modifier, basePrice);
      case DISCOUNT -> calculateDiscountAdjustment(modifier, basePrice);
    };
  }

  /** Calculate percentage-based adjustment using integer arithmetic. */
  private int calculatePercentageAdjustment(PriceModifierEntity modifier, int basePrice) {
    // Value is stored as basis points (e.g., 1550 = 15.5%)
    // Calculate: (basePrice * modifierValue) / 10000 to handle basis points
    // Using long to avoid overflow during multiplication
    long result = (long) basePrice * modifier.getValue() / 10000;
    return (int) result;
  }

  /** Calculate fixed adjustment based on context (e.g., per level). */
  private int calculateFixedAdjustment(PriceModifierEntity modifier, Map<String, Object> context) {
    // Extract level difference from context with null safety
    Object levelDiffObj = context.get("levelDifference");
    if (!(levelDiffObj instanceof Integer)) {
      log.warn(
          "Invalid levelDifference in context: {} (type: {})",
          levelDiffObj,
          levelDiffObj != null ? levelDiffObj.getClass() : "null");
      return modifier.getValue(); // fallback to single unit
    }

    int levelDifference = (Integer) levelDiffObj;
    return modifier.getValue() * Math.max(1, levelDifference);
  }

  /** Calculate formula-based adjustment using context values. */
  private int calculateFormulaAdjustment(
      PriceModifierEntity modifier, Map<String, Object> context) {
    // For formula modifiers, use the value as a direct override or complex calculation
    // This is a simplified implementation - in production you might use a proper formula evaluator

    // Extract level difference from context with null safety
    Object levelDiffObj = context.get("levelDifference");
    if (!(levelDiffObj instanceof Integer)) {
      log.warn(
          "Invalid levelDifference in context for formula: {} (type: {})",
          levelDiffObj,
          levelDiffObj != null ? levelDiffObj.getClass() : "null");
      return modifier.getValue(); // fallback
    }

    int levelDifference = (Integer) levelDiffObj;

    // Example: formula could be a multiplier based on levels
    return modifier.getValue() * Math.max(1, levelDifference);
  }

  /** Calculate multiplier-based adjustment (e.g., 1.5x = +50%). */
  private int calculateMultiplierAdjustment(PriceModifierEntity modifier, int basePrice) {
    // Multiplier is stored as basis points (e.g., 150 = 1.5x)
    // Calculate additional amount: (basePrice * (multiplier - 100)) / 100
    if (modifier.getValue() <= 100) {
      return 0; // No adjustment for multipliers <= 1.0
    }

    long additionalAmount = (long) basePrice * (modifier.getValue() - 100) / 100;
    return (int) additionalAmount;
  }

  /** Calculate discount adjustment (reduces price). */
  private int calculateDiscountAdjustment(PriceModifierEntity modifier, int basePrice) {
    // Discount is stored as basis points (e.g., 500 = 5% discount)
    // Calculate discount amount: (basePrice * discountValue) / 10000
    long discountAmount = (long) basePrice * modifier.getValue() / 10000;
    return -(int) discountAmount; // Negative because it's a discount
  }

  private int calculateBasePrice(PriceConfigurationEntity config, int fromLevel, int toLevel) {
    int levelDifference = toLevel - fromLevel;
    if (levelDifference <= 0) {
      return config.getBasePrice();
    }
    return config.getBasePrice() + (levelDifference * config.getPricePerLevel());
  }
}
