package com.aksi.service.game.calculation;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import com.aksi.api.game.dto.UniversalCalculationContext;
import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.mapper.FormulaConversionUtil;
import com.aksi.repository.GameRepository;
import com.aksi.repository.ServiceTypeRepository;
import com.aksi.service.game.calculation.GameModifierCalculationService.ModifierCalculationResult;
import com.aksi.service.game.calculation.strategy.CalculationStrategyFactory;
import com.aksi.service.game.calculation.strategy.UniversalCalculationStrategy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Core service for price calculations.
 * Orchestrates calculation strategies and modifier applications.
 * Uses functional approach with Guard Clauses for clean code flow.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GamePriceCalculationService {

    private final CalculationStrategyFactory strategyFactory;
    private final GameModifierCalculationService modifierCalculationService;
    private final FormulaConversionUtil formulaConversionUtil;
    private final GameRepository gameRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final UniversalCalculationStrategy universalCalculationStrategy;

    /**
     * Calculate price with formula and modifiers using functional approach.
     *
     * @param calculationRequest Price calculation request
     * @return Price calculation result with breakdown
     */
    public GamePriceCalculationResult calculatePrice(GamePriceCalculationRequest calculationRequest) {

        // Start timing
        long startTime = System.nanoTime();

        try {
            // Step 1: Prepare formula
            CalculationFormulaEntity formula = prepareFormula(calculationRequest);

            // Step 2: Calculate base price using appropriate strategy
            Integer basePrice = calculateBasePrice(formula, calculationRequest);

            // Step 3: Apply modifiers if specified
            ModifierCalculationResult modifierResult = applyModifiersIfPresent(calculationRequest, basePrice);

            // Step 4: Build result
            long executionTime = (System.nanoTime() - startTime) / 1_000_000;

            return GamePriceCalculationResult.builder()
                    .basePrice(basePrice)
                    .modifierAdjustments(modifierResult.adjustments())
                    .totalModifierAdjustment(modifierResult.totalAdjustment())
                    .finalPrice(modifierResult.finalPrice())
                    .executionTimeMs((int) executionTime)
                    .formulaType(formula.getType().getValue())
                    .levelDifference(calculationRequest.getTargetLevel() - calculationRequest.getStartLevel())
                    .build();

        } catch (Exception e) {
            handleCalculationError(calculationRequest, e);
            throw new RuntimeException("Price calculation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Prepare formula from request - handle both explicit and universal cases.
     */
    private CalculationFormulaEntity prepareFormula(GamePriceCalculationRequest request) {
        return Optional.ofNullable(request.getFormula())
                .map(formulaConversionUtil::toDomainFormula)
                .orElseGet(() -> createUniversalFormula(request.getContext()));
    }

    /**
     * Create universal formula when no explicit formula provided.
     */
    private CalculationFormulaEntity createUniversalFormula(UniversalCalculationContext context) {
        return Optional.ofNullable(context)
                .filter(this::hasUniversalCalculationParameters)
                .map(universalCalculationStrategy::createDefaultFormula)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Formula is required when additional parameters are insufficient"));
    }

    /**
     * Check if context has sufficient parameters for universal calculation.
     */
    private boolean hasUniversalCalculationParameters(UniversalCalculationContext context) {
        return Optional.ofNullable(context.getAdditionalParameters())
                .map(params -> params.containsKey("basePrice") && params.containsKey("levelDiff"))
                .orElse(false);
    }

    /**
     * Calculate base price using appropriate strategy.
     */
    private Integer calculateBasePrice(CalculationFormulaEntity formula, GamePriceCalculationRequest request) {
        var strategy = strategyFactory.getStrategy(request.getFormulaType());

        Integer basePrice = determineBasePrice(request);

        return strategy.calculatePrice(formula, basePrice, request.getStartLevel(), request.getTargetLevel());
    }

    /**
     * Determine base price for calculation based on formula type and context.
     */
    private Integer determineBasePrice(GamePriceCalculationRequest request) {
        if ("UNIVERSAL".equals(request.getFormulaType())) {
            return Optional.ofNullable(request.getContext())
                    .map(UniversalCalculationContext::getAdditionalParameters)
                    .filter(params -> params.containsKey("basePrice"))
                    .map(params -> params.get("basePrice"))
                    .orElse(0);
        }
        return 0; // Default for other formula types
    }

    /**
     * Apply modifiers if present in the request.
     */
    private ModifierCalculationResult applyModifiersIfPresent(GamePriceCalculationRequest request, Integer basePrice) {
        return Optional.ofNullable(request.getContext())
                .map(UniversalCalculationContext::getModifiers)
                .filter(modifiers -> !modifiers.isEmpty())
                .map(modifiers -> applyModifiersWithValidation(request, modifiers, basePrice))
                .orElse(ModifierCalculationResult.noModifiers(basePrice));
    }

    /**
     * Apply modifiers with game/service type validation.
     */
    private ModifierCalculationResult applyModifiersWithValidation(GamePriceCalculationRequest request,
                                                                 List<String> modifiers, Integer basePrice) {
        var context = request.getContext();

        // Validate and get game entity
        var gameEntity = Optional.ofNullable(context.getGameCode())
                .flatMap(gameRepository::findByCode)
                .orElseThrow(() -> new IllegalArgumentException("Game not found: " + context.getGameCode()));

        // Validate and get service type entity
        var serviceTypeEntity = Optional.ofNullable(context.getServiceTypeCode())
                .flatMap(code -> serviceTypeRepository.findByGameIdAndCode(gameEntity.getId(), code))
                .orElseThrow(() -> new IllegalArgumentException(
                        "Service type not found: " + context.getServiceTypeCode() + " for game: " + context.getGameCode()));

        // Apply modifiers
        return modifierCalculationService.applyModifiers(
                gameEntity.getId(),
                serviceTypeEntity.getId(),
                modifiers,
                basePrice,
                request.getStartLevel(),
                request.getTargetLevel());
    }

    /**
     * Handle calculation errors with proper logging.
     */
    private void handleCalculationError(GamePriceCalculationRequest request, Exception e) {
        Optional.of(log)
                .filter(Logger::isErrorEnabled)
                .ifPresent(logger -> logger.error(
                        "Failed to calculate price for formulaType={}, startLevel={}, targetLevel={}: {}",
                        request.getFormulaType(), request.getStartLevel(), request.getTargetLevel(),
                        e.getMessage(), e));
    }
}
