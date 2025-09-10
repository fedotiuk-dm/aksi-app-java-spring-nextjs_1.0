package com.aksi.service.game.calculation.util;

import java.util.Optional;

import com.aksi.api.game.dto.UniversalCalculationContext;
import com.aksi.domain.game.formula.CalculationFormulaEntity;

/**
 * Utility methods for calculation operations.
 * Contains static helper methods used across calculation services.
 * Uses functional approach with Optional for null-safe operations.
 */
public final class CalculationUtils {

    // Private constructor to prevent instantiation
    private CalculationUtils() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Safely calculate level difference, ensuring non-negative result.
     *
     * @param startLevel Starting level
     * @param targetLevel Target level
     * @return Level difference (0 or positive)
     */
    public static int calculateLevelDifference(int startLevel, int targetLevel) {
        return Math.max(0, targetLevel - startLevel);
    }

    /**
     * Validate level range is within acceptable bounds.
     *
     * @param startLevel Starting level
     * @param targetLevel Target level
     * @return true if both levels are valid
     */
    public static boolean isValidLevelRange(int startLevel, int targetLevel) {
        return startLevel < CalculationConstants.Limits.MIN_LEVEL ||
            startLevel > CalculationConstants.Limits.MAX_LEVEL ||
            targetLevel < CalculationConstants.Limits.MIN_LEVEL ||
            targetLevel > CalculationConstants.Limits.MAX_LEVEL ||
            targetLevel < startLevel;
    }

    /**
     * Validate base price is within acceptable bounds.
     *
     * @param basePrice Base price to validate
     * @return true if base price is valid
     */
    public static boolean isValidBasePrice(Integer basePrice) {
        return Optional.ofNullable(basePrice)
                .map(price -> price >= CalculationConstants.Limits.MIN_BASE_PRICE &&
                             price <= CalculationConstants.Limits.MAX_BASE_PRICE)
                .orElse(false);
    }

    /**
     * Check if context has sufficient parameters for universal calculation.
     *
     * @param context Universal calculation context
     * @return true if context has required parameters
     */
    public static boolean hasUniversalCalculationParameters(UniversalCalculationContext context) {
        return Optional.ofNullable(context)
                .map(UniversalCalculationContext::getAdditionalParameters)
                .map(params -> params.containsKey(CalculationConstants.Universal.BASE_PRICE_PARAM) &&
                              params.containsKey(CalculationConstants.Universal.LEVEL_DIFF_PARAM))
                .orElse(false);
    }

    /**
     * Extract base price from universal calculation context.
     *
     * @param context Universal calculation context
     * @return Base price from additional parameters, or 0 if not found
     */
    public static Integer extractBasePrice(UniversalCalculationContext context) {
        return Optional.ofNullable(context)
                .map(UniversalCalculationContext::getAdditionalParameters)
                .filter(params -> params.containsKey(CalculationConstants.Universal.BASE_PRICE_PARAM))
                .map(params -> params.get(CalculationConstants.Universal.BASE_PRICE_PARAM))
                .orElse(CalculationConstants.Response.DEFAULT_BASE_PRICE);
    }

    /**
     * Extract level difference from universal calculation context.
     *
     * @param context Universal calculation context
     * @return Level difference from additional parameters, or 0 if not found
     */
    public static Integer extractLevelDiff(UniversalCalculationContext context) {
        return Optional.ofNullable(context)
                .map(UniversalCalculationContext::getAdditionalParameters)
                .filter(params -> params.containsKey(CalculationConstants.Universal.LEVEL_DIFF_PARAM))
                .map(params -> params.get(CalculationConstants.Universal.LEVEL_DIFF_PARAM))
                .orElse(CalculationConstants.Response.DEFAULT_LEVEL_DIFFERENCE);
    }

    /**
     * Get human-readable description of formula type.
     *
     * @param formula Calculation formula entity
     * @return Description string for logging
     */
    public static String getFormulaDescription(CalculationFormulaEntity formula) {
        return Optional.ofNullable(formula)
                .map(f -> switch (f.getType()) {
                    case LINEAR -> "Linear Formula";
                    case RANGE -> "Range-based Formula";
                    case TIME_BASED -> "Time-based Formula";
                    case FORMULA -> "Expression Formula";
                })
                .orElse("Unknown Formula");
    }

    /**
     * Format price as currency string for logging.
     *
     * @param price Price in cents
     * @return Formatted price string
     */
    public static String formatPrice(Integer price) {
        return Optional.ofNullable(price)
                .map(p -> String.format("$%.2f", p / 100.0))
                .orElse("$0.00");
    }

    /**
     * Calculate percentage from base value and percentage points.
     *
     * @param baseValue Base value
     * @param percentagePoints Percentage points (50 = 50%)
     * @return Calculated percentage value
     */
    public static long calculatePercentage(long baseValue, int percentagePoints) {
        return (baseValue * percentagePoints) / CalculationConstants.Modifier.PERCENTAGE_BASE;
    }

    /**
     * Calculate multiplier adjustment (percentage increase).
     *
     * @param basePrice Base price
     * @param modifierValue Modifier value in percentage points
     * @return Adjustment amount
     */
    public static int calculateMultiplierAdjustment(Integer basePrice, int modifierValue) {
        long multiplier = CalculationConstants.Modifier.PERCENTAGE_BASE + modifierValue;
        long adjustment = calculatePercentage(basePrice, (int) multiplier) - basePrice;
        return (int) adjustment;
    }

    /**
     * Calculate divide adjustment (percentage decrease).
     *
     * @param basePrice Base price
     * @param modifierValue Modifier value in percentage points
     * @return Adjustment amount (negative for discount)
     */
    public static int calculateDivideAdjustment(Integer basePrice, int modifierValue) {
        int divisor = Math.max(CalculationConstants.Modifier.MIN_PERCENTAGE_DIVISOR, modifierValue);
        long newPrice = (long) basePrice * CalculationConstants.Modifier.PERCENTAGE_BASE / divisor;
        return (int) (newPrice - basePrice);
    }

    /**
     * Safe integer addition with overflow protection.
     *
     * @param a First operand
     * @param b Second operand
     * @return Sum, or Integer.MAX_VALUE if overflow would occur
     */
    public static int safeAdd(int a, int b) {
        try {
            return Math.addExact(a, b);
        } catch (ArithmeticException e) {
            return a > 0 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
        }
    }

    /**
     * Determine if formula type is universal.
     *
     * @param formulaType Formula type string
     * @return true if formula type is universal
     */
    public static boolean isUniversalFormula(String formulaType) {
        return CalculationConstants.FormulaType.UNIVERSAL.equals(formulaType);
    }

    /**
     * Convert execution time from nanoseconds to milliseconds.
     *
     * @param nanoTime Time in nanoseconds
     * @return Time in milliseconds
     */
    public static int nanoToMillis(long nanoTime) {
        return (int) (nanoTime / 1_000_000);
    }
}
