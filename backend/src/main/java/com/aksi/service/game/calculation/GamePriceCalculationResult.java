package com.aksi.service.game.calculation;

import java.util.List;

import com.aksi.api.game.dto.ModifierAdjustment;

import lombok.Builder;
import lombok.Data;

/**
 * Result object for price calculations.
 * Contains all calculation details including breakdown and metadata.
 */
@Data
@Builder
public class GamePriceCalculationResult {

    private Integer basePrice;
    private List<ModifierAdjustment> modifierAdjustments;
    private Integer totalModifierAdjustment;
    private Integer finalPrice;
    private Integer executionTimeMs;
    private String formulaType;
    private Integer levelDifference;

    /**
     * Check if any modifiers were applied.
     */
    public boolean hasModifiers() {
        return modifierAdjustments != null && !modifierAdjustments.isEmpty();
    }

    /**
     * Get count of applied modifiers.
     */
    public int getAppliedModifiersCount() {
        return modifierAdjustments != null ? modifierAdjustments.size() : 0;
    }

    /**
     * Check if calculation was successful (positive final price).
     */
    public boolean isSuccessful() {
        return finalPrice != null && finalPrice > 0;
    }
}
