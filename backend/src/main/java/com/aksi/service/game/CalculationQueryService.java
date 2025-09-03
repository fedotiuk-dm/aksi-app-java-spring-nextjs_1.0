package com.aksi.service.game;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CalculationBreakdown;
import com.aksi.api.game.dto.CalculationMetadata;
import com.aksi.api.game.dto.ModifierAdjustment;
import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.UniversalCalculationResponse.FormulaTypeEnum;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.formula.FormulaFormulaEntity;
import com.aksi.domain.game.formula.LinearFormulaEntity;
import com.aksi.domain.game.formula.RangeFormulaEntity;
import com.aksi.domain.game.formula.TimeBasedFormulaEntity;
import com.aksi.mapper.PriceConfigurationMapper;
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
  private final PriceConfigurationMapper priceConfigurationMapper;
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
  public BigDecimal calculatePrice(CalculationFormulaEntity formula, BigDecimal basePrice, int fromLevel, int toLevel) {
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
      BigDecimal result = formula.calculate(basePrice, fromLevel, toLevel);

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
    if (request == null) {
      throw new IllegalArgumentException("Calculation request cannot be null");
    }

    var apiFormula = request.getFormula();
    if (apiFormula == null) {
      throw new IllegalArgumentException("Formula is required");
    }

    var context = request.getContext();
    if (context == null) {
      throw new IllegalArgumentException("Calculation context is required");
    }

    Integer startLevel = context.getStartLevel();
    Integer targetLevel = context.getTargetLevel();

    if (startLevel == null || targetLevel == null) {
      throw new IllegalArgumentException("Start level and target level are required");
    }

    // Start timing the calculation
    long startTime = System.nanoTime();

    // Convert API formula to domain entity
    CalculationFormulaEntity domainFormula = priceConfigurationMapper.toDomainFormula(apiFormula);

    // Validate formula
    validationService.validateFormula(domainFormula);

    // Perform calculation with default base price
    BigDecimal basePrice = BigDecimal.ZERO;
    BigDecimal calculatedPrice = calculatePrice(domainFormula, basePrice, startLevel, targetLevel);

    // Apply modifiers if specified
    var modifierAdjustments = new ArrayList<ModifierAdjustment>();
    BigDecimal totalModifierAdjustment = BigDecimal.ZERO;

    var modifiers = context.getModifiers();
    if (modifiers != null && !modifiers.isEmpty()) {
      try {
        // Get game and service type IDs
        var gameEntity = gameRepository.findByCode(context.getGameCode())
            .orElseThrow(() -> new IllegalArgumentException("Game not found: " + context.getGameCode()));
        var serviceTypeEntity = serviceTypeRepository.findByCode(context.getServiceTypeCode())
            .orElseThrow(() -> new IllegalArgumentException("Service type not found: " + context.getServiceTypeCode()));

        // Get active modifiers for calculation with validation
        var modifierEntities = gameModifierService.getActiveModifiersForCalculation(
            gameEntity.getId(), serviceTypeEntity.getId(), modifiers);

        // Validate modifier compatibility
        gameModifierService.validateModifierCompatibility(modifierEntities);

        // Apply each modifier to the price
        for (var modifierEntity : modifierEntities) {
          BigDecimal adjustment = calculateModifierAdjustment(modifierEntity, calculatedPrice, startLevel, targetLevel);

          if (adjustment.compareTo(BigDecimal.ZERO) != 0) {
            var adjustmentDto = new ModifierAdjustment();
            adjustmentDto.setModifierCode(modifierEntity.getCode());
            adjustmentDto.setAdjustment(adjustment.intValue());
            adjustmentDto.setType(mapOperationToTypeEnum(GameModifierOperation.fromValue(modifierEntity.getOperation().getValue())));

            modifierAdjustments.add(adjustmentDto);
            totalModifierAdjustment = totalModifierAdjustment.add(adjustment);
          }
        }

        // Add modifier adjustments to final price
        calculatedPrice = calculatedPrice.add(totalModifierAdjustment);

      } catch (Exception e) {
        log.warn("Failed to apply modifiers {}: {}", modifiers, e.getMessage());
        // Continue with calculation without modifiers
      }
    }

    // End timing
    long endTime = System.nanoTime();
    long executionTimeMs = (endTime - startTime) / 1_000_000; // Convert nanoseconds to milliseconds

    // Build response
    var response = new UniversalCalculationResponse();
    response.setFinalPrice(calculatedPrice.intValue());
    response.setCurrency("USD");
    response.setStatus(UniversalCalculationResponse.StatusEnum.SUCCESS);
    response.setFormulaType(FormulaTypeEnum.fromValue(formulaType));

    // Add breakdown
    var breakdown = new CalculationBreakdown();
    breakdown.setBaseCalculation(calculatedPrice.intValue() - totalModifierAdjustment.intValue());
    breakdown.setModifierAdjustments(modifierAdjustments);
    breakdown.setTotalAdjustment(totalModifierAdjustment.intValue());
    breakdown.setFinalPrice(calculatedPrice.intValue());
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
  private BigDecimal calculateModifierAdjustment(
      GameModifierEntity modifier,
      BigDecimal basePrice,
      int startLevel,
      int targetLevel) {

    if (modifier == null || modifier.getValue() == null) {
      return BigDecimal.ZERO;
    }

    BigDecimal modifierValue = BigDecimal.valueOf(modifier.getValue());

    return switch (modifier.getOperation()) {
      case ADD -> {
        // Basic addition - can be enhanced with level multiplier
        int levelDiff = Math.max(0, targetLevel - startLevel);
        BigDecimal levelMultiplier = levelDiff > 0 ? BigDecimal.valueOf(levelDiff) : BigDecimal.ONE;
        yield modifierValue.multiply(levelMultiplier);
      }
      case SUBTRACT -> modifierValue.negate();
      case MULTIPLY -> {
        // Apply multiplier (e.g., 1.5 = +50%)
        BigDecimal multiplier = BigDecimal.ONE.add(modifierValue);
        yield basePrice.multiply(multiplier).subtract(basePrice);
      }
      case DIVIDE -> {
        // Apply division (reduce price)
        BigDecimal divisor = BigDecimal.ONE.add(modifierValue);
        yield basePrice.divide(divisor, RoundingMode.HALF_UP).negate().add(basePrice);
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
}
