package com.aksi.service.game;

import java.math.BigDecimal;
import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.CalculationBreakdown;
import com.aksi.api.game.dto.CalculationMetadata;
import com.aksi.api.game.dto.ModifierAdjustment;
import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;
import com.aksi.api.game.dto.UniversalCalculationResponse.FormulaTypeEnum;
import com.aksi.domain.game.PriceConfigurationEntity;
import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.mapper.PriceConfigurationMapper;

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

  /**
   * Calculate price based on configuration and levels.
   *
   * @param config Price configuration with formula
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @return Calculated price in cents
   */
  public BigDecimal calculatePrice(PriceConfigurationEntity config, int fromLevel, int toLevel) {
    if (config == null) {
      throw new IllegalArgumentException("Price configuration cannot be null");
    }

    CalculationFormulaEntity formula = config.getCalculationFormula();
    if (formula == null) {
      // If no formula, return base price
      log.debug("No formula found for config {}, using base price {}", config.getId(), config.getBasePrice());
      return BigDecimal.valueOf(config.getBasePrice());
    }

    return calculatePrice(formula, BigDecimal.valueOf(config.getBasePrice()), fromLevel, toLevel);
  }

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
   * Validate formula.
   *
   * @param formula Formula to validate
   * @throws IllegalArgumentException if formula is invalid
   */
  public void validateFormula(CalculationFormulaEntity formula) {
    validationService.validateFormula(formula);
  }

  /**
   * Get formula description for logging.
   *
   * @param formula Formula
   * @return Text description of formula
   */
  public String getFormulaDescription(CalculationFormulaEntity formula) {
    if (formula == null) {
      return "null";
    }

    return switch (formula.getType()) {
      case LINEAR -> {
        var linear = (com.aksi.domain.game.formula.LinearFormulaEntity) formula;
        yield String.format("Linear(pricePerLevel=%s)", linear.getPricePerLevel());
      }
      case RANGE -> {
        var range = (com.aksi.domain.game.formula.RangeFormulaEntity) formula;
        yield String.format("Range(%d ranges)", range.getRanges().size());
      }
      case TIME_BASED -> {
        var timeBased = (com.aksi.domain.game.formula.TimeBasedFormulaEntity) formula;
        yield String.format("TimeBased(hourlyRate=%s, baseHours=%d)",
                           timeBased.getHourlyRate(), timeBased.getBaseHours());
      }
      case FORMULA -> {
        var formulaExpr = (com.aksi.domain.game.formula.FormulaFormulaEntity) formula;
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
    breakdown.setBaseCalculation(calculatedPrice.intValue());
    breakdown.setModifierAdjustments(new ArrayList<ModifierAdjustment>());
    breakdown.setTotalAdjustment(0);
    breakdown.setFinalPrice(calculatedPrice.intValue());
    response.setBreakdown(breakdown);

    // Add metadata
    var metadata = new CalculationMetadata();

    // Set real execution time
    metadata.setCalculationTimeMs((int) executionTimeMs);

    // Get formula version from domain entity
    metadata.setFormulaVersion(domainFormula.getType().getValue());

    // Count applied modifiers (currently 0, will be implemented with real modifiers)
    metadata.setAppliedModifiersCount(0);

    // Calculate level difference
    metadata.setLevelDifference(targetLevel - startLevel);

    response.setMetadata(metadata);

    return response;
  }
}
