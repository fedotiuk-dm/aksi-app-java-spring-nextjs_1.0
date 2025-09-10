package com.aksi.service.game.calculation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.api.game.dto.ModifierAdjustment;
import com.aksi.domain.game.GameModifierEntity;
import com.aksi.service.game.GameModifierService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for calculating modifier adjustments.
 * Extracted from CalculationQueryService for better separation of concerns.
 * Uses functional approach with strategy-like method mapping.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameModifierCalculationService {

    private final GameModifierService gameModifierService;

    /**
     * Apply modifiers to the calculated price using functional approach.
     *
     * @param gameId Game entity ID
     * @param serviceTypeId Service type entity ID
     * @param modifierCodes List of modifier codes to apply
     * @param basePrice Base price before modifiers
     * @param startLevel Starting level
     * @param targetLevel Target level
     * @return ModifierCalculationResult with adjustments and final price
     */
    public ModifierCalculationResult applyModifiers(UUID gameId, UUID serviceTypeId, List<String> modifierCodes,
                                                   Integer basePrice, int startLevel, int targetLevel) {

        return Optional.ofNullable(modifierCodes)
                .filter(codes -> !codes.isEmpty())
                .map(codes -> processModifiers(gameId, serviceTypeId, codes, basePrice, startLevel, targetLevel))
                .orElse(ModifierCalculationResult.noModifiers(basePrice));
    }

    /**
     * Process all modifiers and calculate total adjustment.
     */
    private ModifierCalculationResult processModifiers(UUID gameId, UUID serviceTypeId, List<String> modifierCodes,
                                                     Integer basePrice, int startLevel, int targetLevel) {

        // Get and validate modifier entities
        var modifierEntities = gameModifierService.getActiveModifiersForCalculation(gameId, serviceTypeId, modifierCodes);
        gameModifierService.validateModifierCompatibility(modifierEntities);

        // Calculate adjustments using functional approach
        var adjustments = modifierEntities.stream()
                .map(modifier -> calculateSingleModifierAdjustment(modifier, basePrice, startLevel, targetLevel))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();

        // Calculate totals
        Integer totalAdjustment = adjustments.stream()
                .mapToInt(ModifierAdjustment::getAdjustment)
                .sum();

        return new ModifierCalculationResult(
                adjustments,
                totalAdjustment,
                basePrice + totalAdjustment
        );
    }

    /**
     * Calculate adjustment for a single modifier using functional approach.
     */
    private Optional<ModifierAdjustment> calculateSingleModifierAdjustment(GameModifierEntity modifier,
                                                                         Integer basePrice, int startLevel, int targetLevel) {

        return Optional.ofNullable(modifier)
                .filter(m -> m.getValue() != null)
                .map(m -> {
                    Integer adjustment = calculateAdjustmentValue(m, basePrice, startLevel, targetLevel);

                    if (adjustment == 0) {
                        return null;
                    }

                    var modifierAdjustment = new ModifierAdjustment();
                    modifierAdjustment.setModifierCode(m.getCode());
                    modifierAdjustment.setAdjustment(adjustment);
                    modifierAdjustment.setType(mapOperationToTypeEnum(GameModifierOperation.fromValue(m.getOperation().getValue())));

                    logModifierApplication(m, adjustment, basePrice);

                    return modifierAdjustment;
                });
    }

    /**
     * Calculate adjustment value based on modifier operation using strategy-like functional mapping.
     */
    private Integer calculateAdjustmentValue(GameModifierEntity modifier, Integer basePrice, int startLevel, int targetLevel) {
        int modifierValue = modifier.getValue();
        int levelDiff = Math.max(0, targetLevel - startLevel);

        return switch (modifier.getOperation()) {
            case ADD -> calculateTypeBasedAdjustment(modifier.getType(), modifierValue, levelDiff, true);
            case SUBTRACT -> calculateTypeBasedAdjustment(modifier.getType(), modifierValue, levelDiff, false);
            case MULTIPLY -> calculateMultiplyAdjustment(basePrice, modifierValue);
            case DIVIDE -> calculateDivideAdjustment(basePrice, modifierValue);
        };
    }

    /**
     * Calculate type-based adjustment.
     */
    private Integer calculateTypeBasedAdjustment(GameModifierType type, int modifierValue, int levelDiff, boolean isAdd) {
        return Optional.ofNullable(type)
                .map(t -> {
                    int multiplier = isLevelDependentType(t) ? Math.max(1, levelDiff) : 1;
                    int baseValue = modifierValue * multiplier;
                    return isAdd ? baseValue : -baseValue;
                })
                .orElse(0);
    }

    /**
     * Check if modifier type is level-dependent.
     */
    private boolean isLevelDependentType(GameModifierType type) {
        return switch (type) {
            case PROGRESSION, SUPPORT, GUIDANCE, SOCIAL, EXTRA, SPELLS -> true;
            default -> false;
        };
    }

    /**
     * Calculate MULTIPLY operation (percentage increase).
     */
    private Integer calculateMultiplyAdjustment(Integer basePrice, int modifierValue) {
        // modifierValue = 50 represents +50% = multiply by 1.5
        long multiplier = 100 + modifierValue; // 50 becomes 150 (1.5x)
        long adjustment = (long) basePrice * multiplier / 100 - basePrice;
        return (int) adjustment;
    }

    /**
     * Calculate DIVIDE operation (percentage decrease).
     */
    private Integer calculateDivideAdjustment(Integer basePrice, int modifierValue) {
        // modifierValue = 50 represents -50% = divide by 2.0
        long newPrice = (long) basePrice * 100 / Math.max(1, modifierValue);
        long adjustment = newPrice - basePrice; // This will be negative for discount
        return (int) adjustment;
    }

    /**
     * Maps GameModifierOperation to ModifierAdjustment.TypeEnum for DTO compatibility.
     */
    private ModifierAdjustment.TypeEnum mapOperationToTypeEnum(GameModifierOperation operation) {
        return switch (operation) {
            case ADD, SUBTRACT -> ModifierAdjustment.TypeEnum.FIXED;
            case MULTIPLY -> ModifierAdjustment.TypeEnum.MULTIPLIER;
            case DIVIDE -> ModifierAdjustment.TypeEnum.PERCENTAGE;
        };
    }

    /**
     * Log modifier application for debugging.
     */
    private void logModifierApplication(GameModifierEntity modifier, Integer adjustment, Integer basePrice) {
        Optional.of(log)
                .filter(Logger::isInfoEnabled)
                .ifPresent(logger -> logger.info(
                        "Applied modifier {}: operation={}, value={}, adjustment={} (price: {} -> {})",
                        modifier.getCode(), modifier.getOperation(), modifier.getValue(),
                        adjustment, basePrice, basePrice + adjustment));
    }

  /**
   * Result object for modifier calculations.
   */
  public record ModifierCalculationResult(List<ModifierAdjustment> adjustments, Integer totalAdjustment,
                                          Integer finalPrice) {

    public static ModifierCalculationResult noModifiers(Integer basePrice) {
      return new ModifierCalculationResult(List.of(), 0, basePrice);
    }

  }
}
