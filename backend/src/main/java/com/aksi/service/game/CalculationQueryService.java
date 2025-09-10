package com.aksi.service.game;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.game.dto.UniversalCalculationRequest;
import com.aksi.api.game.dto.UniversalCalculationResponse;
import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.service.game.calculation.GameCalculationResponseBuilder;
import com.aksi.service.game.calculation.GamePriceCalculationRequest;
import com.aksi.service.game.calculation.GamePriceCalculationResult;
import com.aksi.service.game.calculation.GamePriceCalculationService;
import com.aksi.service.game.calculation.strategy.CalculationStrategyFactory;
import com.aksi.service.game.calculation.util.CalculationConstants;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


/**
 * Thin coordinator for calculation operations following CQRS pattern.
 * Delegates all complex logic to specialized services and uses Strategy pattern.
 * Refactored from 482 lines to ~100 lines with improved maintainability.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class CalculationQueryService {

    private final GamePriceCalculationService gamePriceCalculationService;
    private final GameCalculationResponseBuilder responseBuilder;
    private final CalculationStrategyFactory strategyFactory;


    /**
     * Calculate price based on formula using Strategy pattern.
     * Refactored method that delegates to appropriate calculation strategy.
   *
   * @param formula Calculation formula
   * @param basePrice Base price
   * @param fromLevel Starting level
   * @param toLevel Target level
   * @return Calculated price in cents
   */
  public Integer calculatePrice(CalculationFormulaEntity formula, Integer basePrice, int fromLevel, int toLevel) {
        return Optional.ofNullable(formula)
                .map(f -> {
                    var strategy = strategyFactory.getStrategy(f.getType().getValue());
                    return strategy.calculatePrice(f, basePrice, fromLevel, toLevel);
                })
                .orElseThrow(() -> new IllegalArgumentException(CalculationConstants.ErrorMessages.FORMULA_NULL));
    }


    /**
     * Main calculation method with comprehensive request/response handling.
     * Refactored from 218 lines to clean delegation pattern.
     *
     * @param formulaType Type of formula to use
     * @param request Universal calculation request
     * @return Universal calculation response
   */
      public UniversalCalculationResponse calculateWithFormula(String formulaType, UniversalCalculationRequest request) {
        log.info(CalculationConstants.LogMessages.CALCULATION_START, formulaType,
                request.getContext().getStartLevel(), request.getContext().getTargetLevel());

        try {
            // Step 1: Build calculation request
            GamePriceCalculationRequest calculationRequest = buildCalculationRequest(formulaType, request);

            // Step 2: Perform calculation
            GamePriceCalculationResult result = gamePriceCalculationService.calculatePrice(calculationRequest);

            // Step 3: Build response
            UniversalCalculationResponse response = responseBuilder.buildSuccessResponse(result, formulaType);

            log.info(CalculationConstants.LogMessages.CALCULATION_SUCCESS,
                    result.getBasePrice(), result.getAppliedModifiersCount(),
                    result.getFinalPrice(), result.getExecutionTimeMs());

            return response;

        } catch (IllegalArgumentException e) {
            log.warn("Validation error in calculation: {}", e.getMessage());
            return responseBuilder.buildValidationErrorResponse(e.getMessage());

      } catch (Exception e) {
            log.error(CalculationConstants.LogMessages.CALCULATION_ERROR, e.getMessage(), e);
            return responseBuilder.buildErrorResponse(e.getMessage());
        }
    }

    /**
     * Build calculation request from universal request and formula type.
     * Helper method for request preparation.
     */
    private GamePriceCalculationRequest buildCalculationRequest(String formulaType, UniversalCalculationRequest request) {
        return Optional.ofNullable(request)
                .map(req -> {
                    if (req.getFormula().isPresent()) {
                        return GamePriceCalculationRequest.forFormulaCalculation(
                                formulaType, req.getFormula().get(), req.getContext());
    } else {
                        return GamePriceCalculationRequest.forUniversalCalculation(req.getContext());
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException(CalculationConstants.ErrorMessages.CONTEXT_NULL));
    }

}
