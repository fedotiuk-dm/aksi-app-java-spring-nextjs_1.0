package com.aksi.service.game.calculation;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.CalculationBreakdown;
import com.aksi.api.game.dto.CalculationMetadata;
import com.aksi.api.game.dto.UniversalCalculationResponse;
import com.aksi.api.game.dto.UniversalCalculationResponse.FormulaTypeEnum;
import com.aksi.api.game.dto.UniversalCalculationResponse.StatusEnum;

import lombok.RequiredArgsConstructor;

/**
 * Builder for UniversalCalculationResponse objects.
 * Uses Builder Pattern with Fluent API for clean response construction.
 * Handles different response scenarios with appropriate default values.
 */
@Component
@RequiredArgsConstructor
public class GameCalculationResponseBuilder {

    private static final String DEFAULT_CURRENCY = "USD";

    /**
     * Build successful calculation response from calculation result.
     *
     * @param calculationResult Price calculation result
     * @param formulaType Original formula type from request
     * @return Fully constructed UniversalCalculationResponse
     */
    public UniversalCalculationResponse buildSuccessResponse(GamePriceCalculationResult calculationResult, String formulaType) {
        return Optional.of(calculationResult)
                .filter(GamePriceCalculationResult::isSuccessful)
                .map(result -> createSuccessResponse(result, formulaType))
                .orElseGet(() -> buildErrorResponse("Calculation failed: negative or zero final price"));
    }

    /**
     * Build error response with appropriate status and message.
     *
     * @param errorMessage Error message to include
     * @return Error response
     */
    public UniversalCalculationResponse buildErrorResponse(String errorMessage) {
        var response = new UniversalCalculationResponse();
        response.setFinalPrice(0);
        response.setCurrency(DEFAULT_CURRENCY);
        response.setStatus(StatusEnum.FAILED);
        response.setFormulaType(FormulaTypeEnum.LINEAR); // Default fallback

        // Create minimal breakdown
        response.setBreakdown(createEmptyBreakdown());

        // Create error metadata
        response.setMetadata(createErrorMetadata());

        return response;
    }

    /**
     * Create successful response from calculation result.
     */
    private UniversalCalculationResponse createSuccessResponse(GamePriceCalculationResult result, String formulaType) {
        var response = new UniversalCalculationResponse();

        // Basic response fields
        response.setFinalPrice(result.getFinalPrice());
        response.setCurrency(DEFAULT_CURRENCY);
        response.setStatus(StatusEnum.SUCCESS);
        response.setFormulaType(resolveFormulaTypeEnum(formulaType));

        // Build calculation breakdown
        response.setBreakdown(buildCalculationBreakdown(result));

        // Build metadata
        response.setMetadata(buildCalculationMetadata(result));

        return response;
    }

    /**
     * Build calculation breakdown from result.
     */
    private CalculationBreakdown buildCalculationBreakdown(GamePriceCalculationResult result) {
        var breakdown = new CalculationBreakdown();
        breakdown.setBaseCalculation(result.getBasePrice());
        breakdown.setModifierAdjustments(result.getModifierAdjustments());
        breakdown.setTotalAdjustment(result.getTotalModifierAdjustment());
        breakdown.setFinalPrice(result.getFinalPrice());
        return breakdown;
    }

    /**
     * Build calculation metadata from result.
     */
    private CalculationMetadata buildCalculationMetadata(GamePriceCalculationResult result) {
        var metadata = new CalculationMetadata();
        metadata.setCalculationTimeMs(result.getExecutionTimeMs());
        metadata.setFormulaVersion(result.getFormulaType());
        metadata.setAppliedModifiersCount(result.getAppliedModifiersCount());
        metadata.setLevelDifference(result.getLevelDifference());
        return metadata;
    }

    /**
     * Create empty breakdown for error responses.
     */
    private CalculationBreakdown createEmptyBreakdown() {
        var breakdown = new CalculationBreakdown();
        breakdown.setBaseCalculation(0);
        breakdown.setModifierAdjustments(java.util.List.of());
        breakdown.setTotalAdjustment(0);
        breakdown.setFinalPrice(0);
        return breakdown;
    }

    /**
     * Create error metadata.
     */
    private CalculationMetadata createErrorMetadata() {
        var metadata = new CalculationMetadata();
        metadata.setCalculationTimeMs(0);
        metadata.setFormulaVersion("ERROR");
        metadata.setAppliedModifiersCount(0);
        metadata.setLevelDifference(0);
        return metadata;
    }

    /**
     * Resolve FormulaTypeEnum from string, handling special cases.
     */
    private FormulaTypeEnum resolveFormulaTypeEnum(String formulaType) {
        return Optional.ofNullable(formulaType)
                .map(type -> "UNIVERSAL".equals(type) ? FormulaTypeEnum.FORMULA : FormulaTypeEnum.fromValue(type))
                .orElse(FormulaTypeEnum.LINEAR); // Default fallback
    }

    /**
     * Build response for validation errors (before calculation).
     *
     * @param validationError Validation error message
     * @return Validation error response
     */
    public UniversalCalculationResponse buildValidationErrorResponse(String validationError) {
        var response = buildErrorResponse(validationError);
        response.setStatus(StatusEnum.FAILED); // Use FAILED since INVALID_INPUT not available
        return response;
    }

    /**
     * Build response for configuration errors (missing game/service type).
     *
     * @param configError Configuration error message
     * @return Configuration error response
     */
    public UniversalCalculationResponse buildConfigurationErrorResponse(String configError) {
        var response = buildErrorResponse(configError);
        response.setStatus(StatusEnum.FALLBACK); // Use FALLBACK for configuration issues
        return response;
    }
}
