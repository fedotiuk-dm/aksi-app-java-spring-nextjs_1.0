package com.aksi.service.game;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CalculationBreakdown;
import com.aksi.api.game.dto.CalculationFormula;
import com.aksi.api.game.dto.CalculationMetadata;
import com.aksi.api.game.dto.FormulaFormula;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.ModifierAdjustment;
import com.aksi.api.game.dto.UniversalCalculationContext;
import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;
import com.aksi.api.game.dto.UniversalCalculationResponse.FormulaTypeEnum;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.domain.game.formula.LinearFormulaEntity;
import com.aksi.domain.game.formula.RangeFormulaEntity;
import com.aksi.domain.game.formula.TimeBasedFormulaEntity;
import com.aksi.mapper.FormulaConversionUtil;
import com.aksi.repository.GameRepository;
import com.aksi.repository.ServiceTypeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


/**
 * Query service for calculation-related read operations. Handles all calculation logic
 * and price computations following CQRS pattern.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class CalculationQueryService {

  private final CalculationValidationService validationService;
  private final FormulaConversionUtil formulaConversionUtil;
  private final GameModifierService gameModifierService;
  private final GameRepository gameRepository;
  private final ServiceTypeRepository serviceTypeRepository;


  /**
   * Calculate price based on formula.
   *
   * @param formula Calculation formula
   * @param basePrice Base price
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @return Calculated price in cents
   */
  public Integer calculatePrice(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
    if (formula == null) {
      throw new IllegalArgumentException("Formula cannot be null");
    }
    if (basePrice == null) {
      throw new IllegalArgumentException("Base price cannot be null");
    }

    // Validate parameters
    validationService.validateCalculationParameters(basePrice, fromLevel, toLevel);

    // Validate formula
    validationService.validateFormula(formula);

    try {
      // Perform polymorphic calculation
      Integer result = formula.calculate(basePrice, fromLevel, toLevel);

      log.debug("Calculated price using {}: basePrice={}, fromLevel={}, toLevel={}, result={}",
               getFormulaDescription(formula), basePrice, fromLevel, toLevel, result);

      return result;

    } catch (Exception e) {
      log.error("Failed to calculate price with formula {}: {}", getFormulaDescription(formula), e.getMessage(), e);
      throw new RuntimeException("Price calculation failed: " + e.getMessage(), e);
    }
  }


  /**
   * Get formula description for internal logging.
   *
   * @param formula Formula
   * @return Text description of formula
   */
  private String getFormulaDescription(CalculationFormulaEntity formula) {
    if (formula == null) {
      return "null";
    }

    return switch (formula.getType()) {
      case LINEAR -> {
        var linear = (LinearFormulaEntity) formula;
        yield String.format("Linear(pricePerLevel=%s)", linear.getPricePerLevel());
      }
      case RANGE -> {
        var range = (RangeFormulaEntity) formula;
        yield String.format("Range(%d ranges)", range.getRanges().size());
      }
      case TIME_BASED -> {
        var timeBased = (TimeBasedFormulaEntity) formula;
        yield String.format("TimeBased(hourlyRate=%s, baseHours=%d)",
                           timeBased.getHourlyRate(), timeBased.getBaseHours());
      }
      case FORMULA -> {
        var formulaExpr = (FormulaFormulaEntity) formula;
        yield String.format("Formula(expression='%s', %d variables)",
                           formulaExpr.getExpression(), formulaExpr.getVariables().size());
      }
    };
  }

  /**
   * Calculate price with formula using UniversalCalculationRequest/Response DTOs
   *
   * @param formulaType type of formula
   * @param request universal calculation request
   * @return universal calculation response
   */
      public UniversalCalculationResponse calculateWithFormula(String formulaType, UniversalCalculationRequest request) {
    log.info("🎬 calculateWithFormula called with formulaType={}, request not null: {}", formulaType, request != null);

    if (request == null) {
      log.error("❌ Request is null!");
      throw new IllegalArgumentException("Calculation request cannot be null");
    }

    log.info("🎬 Request context: {}", request.getContext());

    var context = request.getContext();
    if (context == null) {
      throw new IllegalArgumentException("Calculation context is required");
    }

    // Validate that the game exists
    if (context.getGameCode() != null) {
      log.info("🔍 Validating game exists: {}", context.getGameCode());
      var gameExists = gameRepository.findByCode(context.getGameCode()).isPresent();
      if (!gameExists) {
        log.error("❌ Game not found: {}", context.getGameCode());
        throw new IllegalArgumentException("Game not found: " + context.getGameCode());
      }
      log.info("✅ Game validation passed for: {}", context.getGameCode());
    }

    if (context.getServiceTypeCode() != null) {
      log.info("🔍 Validating service type exists: {}", context.getServiceTypeCode());
      var gameEntity = gameRepository.findByCode(context.getGameCode())
          .orElseThrow(() -> new IllegalArgumentException("Game not found: " + context.getGameCode()));
      var serviceTypeExists = serviceTypeRepository.findByGameIdAndCode(gameEntity.getId(), context.getServiceTypeCode()).isPresent();
      if (!serviceTypeExists) {
        log.error("❌ Service type not found: {} for game: {}", context.getServiceTypeCode(), context.getGameCode());
        throw new IllegalArgumentException("Service type not found: " + context.getServiceTypeCode() + " for game: " + context.getGameCode());
      }
      log.info("✅ Service type validation passed for: {} in game: {}", context.getServiceTypeCode(), context.getGameCode());
    }

    var apiFormulaNullable = request.getFormula();
    CalculationFormula apiFormula;

    // Handle universal calculator case - when formula is null but we have context
    if (apiFormulaNullable == null || !apiFormulaNullable.isPresent()) {
      // Check if we have sufficient context for universal calculation
      if (context.getAdditionalParameters() != null &&
          context.getAdditionalParameters().containsKey("basePrice") &&
          context.getAdditionalParameters().containsKey("levelDiff")) {

        // Create a default formula for universal calculation
        apiFormula = createDefaultFormulaForUniversalCalculation(context);
      } else {
        throw new IllegalArgumentException("Formula is required when additional parameters are insufficient");
      }
    } else {
      // Use the provided formula
      apiFormula = apiFormulaNullable.get();
    }

    Integer startLevel = context.getStartLevel();
    Integer targetLevel = context.getTargetLevel();

    if (startLevel == null || targetLevel == null) {
      throw new IllegalArgumentException("Start level and target level are required");
    }

    // Start timing the calculation
    long startTime = System.nanoTime();

    // Convert API formula to domain entity
    log.info("🔧 Converting API formula to domain entity: {}", apiFormula);
    CalculationFormulaEntity domainFormula = formulaConversionUtil.toDomainFormula(apiFormula);
    log.info("✅ Formula converted successfully: {}", domainFormula);

    // Validate formula
    log.info("🔍 Validating formula...");
    validationService.validateFormula(domainFormula);
    log.info("✅ Formula validation passed");

    // Determine base price for calculation
    Integer basePrice = 0;
    if ("UNIVERSAL".equals(formulaType) && context.getAdditionalParameters() != null &&
        context.getAdditionalParameters().containsKey("basePrice")) {
        // For universal calculator, use basePrice from additionalParameters
        basePrice = context.getAdditionalParameters().get("basePrice");
    }

    log.info("🧮 Calculating price with basePrice={}, startLevel={}, targetLevel={}", basePrice, startLevel, targetLevel);
    Integer calculatedPrice = calculatePrice(domainFormula, basePrice, startLevel, targetLevel);
    log.info("💰 Price calculated: {}", calculatedPrice);

    // Apply modifiers if specified
    var modifierAdjustments = new ArrayList<ModifierAdjustment>();
    Integer totalModifierAdjustment = 0;

    var modifiers = context.getModifiers();
    log.info("🎯 Processing modifiers: {}", modifiers);
    if (modifiers != null && !modifiers.isEmpty()) {
      log.info("🔄 Starting modifier processing for {} modifiers", modifiers.size());
      try {
        // Get game and service type IDs
        log.info("🔍 Looking for game with code: {}", context.getGameCode());
        var gameEntity = gameRepository.findByCode(context.getGameCode())
            .orElseThrow(() -> new IllegalArgumentException("Game not found: " + context.getGameCode()));
        log.info("✅ Found game entity: id={}, code={}", gameEntity.getId(), gameEntity.getCode());

        log.info("🔍 Looking for service type with code: {} for game: {}", context.getServiceTypeCode(), context.getGameCode());
        var serviceTypeEntity = serviceTypeRepository.findByGameIdAndCode(gameEntity.getId(), context.getServiceTypeCode())
            .orElseThrow(() -> new IllegalArgumentException("Service type not found: " + context.getServiceTypeCode() + " for game: " + context.getGameCode()));
        log.info("✅ Found service type entity: id={}, code={} for game: {}", serviceTypeEntity.getId(), serviceTypeEntity.getCode(), context.getGameCode());

        // Get active modifiers for calculation with validation
        log.info("🚀 Getting modifiers for calculation: gameId={}, serviceTypeId={}, modifiers={}",
            gameEntity.getId(), serviceTypeEntity.getId(), modifiers);
        var modifierEntities = gameModifierService.getActiveModifiersForCalculation(
            gameEntity.getId(), serviceTypeEntity.getId(), modifiers);
        log.info("✅ Retrieved {} modifier entities", modifierEntities.size());

        // Validate modifier compatibility
        gameModifierService.validateModifierCompatibility(modifierEntities);

        // Apply each modifier to the price
        for (var modifierEntity : modifierEntities) {
          Integer adjustment = calculateModifierAdjustment(modifierEntity, calculatedPrice, startLevel, targetLevel);

          if (adjustment != 0) {
            var adjustmentDto = new ModifierAdjustment();
            adjustmentDto.setModifierCode(modifierEntity.getCode());
            adjustmentDto.setAdjustment(adjustment);
            adjustmentDto.setType(mapOperationToTypeEnum(GameModifierOperation.fromValue(modifierEntity.getOperation().getValue())));

            modifierAdjustments.add(adjustmentDto);
            totalModifierAdjustment += adjustment;
          }
        }

        // Add modifier adjustments to final price
        calculatedPrice += totalModifierAdjustment;

      } catch (IncorrectResultSizeDataAccessException e) {
        // Specific handling for database query returning multiple results
        log.error("❌ Database query error for modifiers {}: {} (type: {})", modifiers, e.getMessage(), e.getClass().getName());
        throw new IncorrectResultSizeDataAccessException("Multiple modifier records found for the same code", e.getActualSize(), e.getExpectedSize(), e);
      } catch (Exception e) {
        // Provide more specific error messages for common issues
        String userMessage;
        if (e.getMessage() != null && e.getMessage().contains("No enum constant")) {
          userMessage = "Configuration error: Invalid modifier type. Please contact support.";
        } else if (e.getMessage() != null && e.getMessage().contains("Game not found")) {
          userMessage = "Configuration error: Invalid game code. Please check game selection.";
        } else if (e.getMessage() != null && e.getMessage().contains("Service type not found")) {
          userMessage = "Configuration error: Invalid service type. Please check service selection.";
        } else {
          userMessage = "Failed to apply modifiers. Please try again or contact support.";
        }

        log.error("❌ Failed to apply modifiers {}: {} (type: {})", modifiers, e.getMessage(), e.getClass().getName(), e);

        // Re-throw with more specific message for GlobalExceptionHandler
        throw new RuntimeException(userMessage, e);
      }
    }

    // End timing
    long endTime = System.nanoTime();
    long executionTimeMs = (endTime - startTime) / 1_000_000; // Convert nanoseconds to milliseconds

    // Build response
    var response = new UniversalCalculationResponse();
    response.setFinalPrice(calculatedPrice);
    response.setCurrency("USD");
    response.setStatus(UniversalCalculationResponse.StatusEnum.SUCCESS);

    // Handle formula type - for universal calculator, use FORMULA as default
    if ("UNIVERSAL".equals(formulaType)) {
        response.setFormulaType(FormulaTypeEnum.FORMULA);
    } else {
        response.setFormulaType(FormulaTypeEnum.fromValue(formulaType));
    }

    // Add breakdown
    var breakdown = new CalculationBreakdown();
    breakdown.setBaseCalculation(calculatedPrice - totalModifierAdjustment);
    breakdown.setModifierAdjustments(modifierAdjustments);
    breakdown.setTotalAdjustment(totalModifierAdjustment);
    breakdown.setFinalPrice(calculatedPrice);
    response.setBreakdown(breakdown);

    // Add metadata
    var metadata = new CalculationMetadata();

    // Set real execution time
    metadata.setCalculationTimeMs((int) executionTimeMs);

    // Get formula version from domain entity
    metadata.setFormulaVersion(domainFormula.getType().getValue());

    // Count applied modifiers
    metadata.setAppliedModifiersCount(modifierAdjustments.size());

    // Calculate level difference
    metadata.setLevelDifference(targetLevel - startLevel);

    response.setMetadata(metadata);

    return response;
  }

  /**
   * Calculate adjustment amount for a specific modifier.
   *
   * @param modifier the modifier entity
   * @param basePrice the base price before modifier
   * @param startLevel starting level for level-based calculations
   * @param targetLevel target level for level-based calculations
   * @return adjustment amount to add to the price
   */
  private Integer calculateModifierAdjustment(
      GameModifierEntity modifier,
      Integer basePrice,
      int startLevel,
      int targetLevel) {

    if (modifier == null || modifier.getValue() == null) {
      return 0;
    }

    // Get modifier value (already an integer, represents percentage for MULTIPLY/DIVIDE)
    int modifierValue = modifier.getValue(); // 50 represents 50%

    return switch (modifier.getOperation()) {
      case ADD -> {
        // Check if this is a fixed cost modifier (ranked/PvP) or level-dependent
        if (modifier.getCode() != null &&
            (modifier.getCode().contains("RANKED") ||
             modifier.getCode().contains("PVP") ||
             modifier.getCode().contains("RP"))) {
          // Fixed addition for ranked/PvP systems (independent of levels)
          yield modifierValue;
        } else {
          // Level-dependent addition for regular boosts
          int levelDiff = Math.max(0, targetLevel - startLevel);
          yield modifierValue * Math.max(1, levelDiff);
        }
      }
      case SUBTRACT -> -modifierValue;
      case MULTIPLY -> {
        // Apply multiplier (e.g., 50 = +50% = multiply by 1.5)
        long multiplier = 100 + modifierValue; // 50 becomes 150 (1.5x)
        long adjustment = (long) basePrice * multiplier / 100 - basePrice;
        yield (int) adjustment;
      }
      case DIVIDE -> {
        // Apply division (reduce price)
        long adjustment = basePrice - (basePrice * 100 / Math.max(1, modifierValue));
        yield (int) adjustment;
      }
    };
  }

  /**
   * Maps GameModifierOperation to ModifierAdjustment.TypeEnum for DTO compatibility
   */
  private ModifierAdjustment.TypeEnum mapOperationToTypeEnum(GameModifierOperation operation) {
    return switch (operation) {
      case ADD, SUBTRACT -> ModifierAdjustment.TypeEnum.FIXED;
      case MULTIPLY -> ModifierAdjustment.TypeEnum.MULTIPLIER;
      case DIVIDE -> ModifierAdjustment.TypeEnum.PERCENTAGE;
    };
  }

  /**
   * Creates a default formula for universal calculation based on context parameters.
   * This is used when no explicit formula is provided but we have sufficient context.
   */
  private CalculationFormula createDefaultFormulaForUniversalCalculation(UniversalCalculationContext context) {
    // Create a simple formula formula that uses basePrice + levelDiff
    var formulaFormula = new FormulaFormula("basePrice + levelDiff", CalculationFormula.TypeEnum.FORMULA);

    // Set variables if available
    Map<String, Integer> variables = new HashMap<>();
    var additionalParams = context.getAdditionalParameters();
    if (additionalParams != null) {
      // Extract basePrice and levelDiff as variables
      if (additionalParams.containsKey("basePrice")) {
        variables.put("basePrice", additionalParams.get("basePrice"));
      }
      if (additionalParams.containsKey("levelDiff")) {
        variables.put("levelDiff", additionalParams.get("levelDiff"));
      }
    }
    formulaFormula.setVariables(variables);

    return formulaFormula;
  }
}
