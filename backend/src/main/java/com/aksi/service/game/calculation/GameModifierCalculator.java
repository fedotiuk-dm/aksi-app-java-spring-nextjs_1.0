package com.aksi.service.game.calculation;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.domain.game.GameModifierEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * Calculator for game-specific modifiers using the new GameModifier domain.
 * Handles timing, support, mode, quality, extra, promotional, and seasonal modifiers
 * for game boosting services.
 */
@Component
@Slf4j
public class GameModifierCalculator {

  /**
   * Apply all game-specific modifiers to base price.
   *
   * @param applicableModifiers List of modifiers to apply
   * @param basePrice Base price before modifiers
   * @param context Calculation context with game/service/level information
   * @return Modifier calculation result
   */
  public GameModifierCalculationResult calculate(
      List<GameModifierEntity> applicableModifiers, int basePrice, Map<String, Object> context) {

    if (applicableModifiers.isEmpty()) {
      log.debug("No modifiers to apply");
      return new GameModifierCalculationResult(0, basePrice);
    }

    int totalAdjustments = 0;

    for (GameModifierEntity modifier : applicableModifiers) {
      int adjustment = calculateModifierAdjustment(modifier, basePrice, context);
      totalAdjustments += adjustment;

      log.debug("Applied modifier '{}': type={}, operation={}, adjustment={}",
          modifier.getCode(), modifier.getType(), modifier.getOperation(), adjustment);
    }

    int finalPrice = basePrice + totalAdjustments;

    log.debug("Total modifier adjustments: {} modifiers applied, total adjustment: {}, final: {}",
        applicableModifiers.size(), totalAdjustments, finalPrice);

    return new GameModifierCalculationResult(totalAdjustments, finalPrice);
  }

  /**
   * Calculate adjustment for a single modifier based on its type and operation.
   *
   * @param modifier The modifier to apply
   * @param basePrice Base price for calculation
   * @param context Calculation context
   * @return Adjustment amount in kopiykas
   */
  private int calculateModifierAdjustment(
      GameModifierEntity modifier, int basePrice, Map<String, Object> context) {

    int rawAdjustment = switch (modifier.getType()) {
      case TIMING -> calculateTimingAdjustment(modifier, basePrice, context);
      case SUPPORT -> calculateSupportAdjustment(modifier, basePrice, context);
      case MODE -> calculateModeAdjustment(modifier, basePrice, context);
      case QUALITY -> calculateQualityAdjustment(modifier, basePrice, context);
      case EXTRA -> calculateExtraAdjustment(modifier, basePrice, context);
      case PROMOTIONAL -> calculatePromotionalAdjustment(modifier, basePrice, context);
      case SEASONAL -> calculateSeasonalAdjustment(modifier, basePrice, context);
    };

    // Apply operation type to the raw adjustment
    return applyOperation(modifier.getOperation(), basePrice, rawAdjustment);
  }

  /**
   * Apply operation type to calculate final adjustment.
   *
   * @param operation The operation to apply
   * @param basePrice Base price for relative operations
   * @param adjustment Raw adjustment value
   * @return Final adjustment amount
   */
  private int applyOperation(GameModifierOperation operation, int basePrice, int adjustment) {
    return switch (operation) {
      case ADD -> adjustment;
      case SUBTRACT -> -Math.abs(adjustment);
      case MULTIPLY -> {
        // adjustment represents multiplier (10000 = 1.0x, 15000 = 1.5x)
        // Calculate final price: basePrice * (adjustment / 10000)
        // Return adjustment: finalPrice - basePrice
        long multiplier = (long) basePrice * adjustment;
        int finalPrice = (int) (multiplier / 10000);
        int adjustmentResult = finalPrice - basePrice;
        log.debug("MULTIPLY operation: basePrice={}, adjustment={}, multiplier={}, finalPrice={}, adjustmentResult={}",
            basePrice, adjustment, multiplier, finalPrice, adjustmentResult);
        yield adjustmentResult;
      }
      case DIVIDE -> {
        int divisor = adjustment / 100;
        yield divisor != 0 ? -(basePrice / divisor) : 0;
      }
    };
  }

  /**
   * Calculate timing-based adjustment (rush orders, weekend work, etc.).
   * Timing modifiers typically add premium for expedited service.
   * Uses percentage calculation with potential for higher multipliers during peak times.
   */
  private int calculateTimingAdjustment(GameModifierEntity modifier, int basePrice, Map<String, Object> context) {
    // Check for weekend/weekday context
    boolean isWeekend = context != null && Boolean.TRUE.equals(context.get("isWeekend"));
    int multiplier = isWeekend ? 125 : 100; // 25% extra on weekends

    long result = (long) basePrice * modifier.getValue() * multiplier / 1000000;

    log.debug("Timing adjustment: {}% ({}x multiplier) of {} = {}",
        modifier.getValue() / 100.0, multiplier / 100.0, basePrice, (int) result);

    return (int) result;
  }

  /**
   * Calculate support adjustment (priority support, live chat, etc.).
   * Support modifiers add value for enhanced customer service.
   * Uses fixed amount for small values, percentage for larger ones.
   */
  private int calculateSupportAdjustment(GameModifierEntity modifier, int basePrice, Map<String, Object> context) {
    int adjustment;

    // Check for priority support context (suppress unused warning)
    boolean isPriority = context != null && Boolean.TRUE.equals(context.get("isPrioritySupport"));
    int priorityMultiplier = isPriority ? 120 : 100; // 20% extra for priority support

    // If value is small (less than 100), treat as fixed amount in cents
    if (Math.abs(modifier.getValue()) < 100) {
      adjustment = modifier.getValue() * priorityMultiplier / 100; // Fixed amount with priority multiplier
      log.debug("Support fixed adjustment: {} cents (priority: {})", adjustment, isPriority);
    } else {
      // Otherwise treat as percentage
      adjustment = (int) ((long) basePrice * modifier.getValue() * priorityMultiplier / 1000000);
      log.debug("Support percentage adjustment: {}% of {} (priority: {}) = {}",
          modifier.getValue() / 100.0, basePrice, isPriority, adjustment);
    }

    return adjustment;
  }

  /**
   * Calculate mode adjustment (solo vs duo, ranked vs casual, etc.).
   * Mode modifiers adjust price based on complexity or demand.
   */
  private int calculateModeAdjustment(GameModifierEntity modifier, int basePrice, Map<String, Object> context) {
    // Check for ranked mode context
    boolean isRanked = context != null && Boolean.TRUE.equals(context.get("isRankedMode"));
    int modeMultiplier = isRanked ? 110 : 100; // 10% extra for ranked mode

    // Mode modifiers are percentage-based with mode multiplier
    long result = (long) basePrice * modifier.getValue() * modeMultiplier / 1000000;

    log.debug("Mode adjustment: {}% of {} (ranked: {}) = {}",
        modifier.getValue() / 100.0, basePrice, isRanked, (int) result);

    return (int) result;
  }

  /**
   * Calculate quality adjustment (standard vs premium quality).
   * Quality modifiers affect price based on service level.
   */
  private int calculateQualityAdjustment(GameModifierEntity modifier, int basePrice, Map<String, Object> context) {
    // Check for premium quality context
    boolean isPremium = context != null && Boolean.TRUE.equals(context.get("isPremiumQuality"));
    int qualityMultiplier = isPremium ? 115 : 100; // 15% extra for premium quality

    // Quality modifiers are percentage-based with quality multiplier
    long result = (long) basePrice * modifier.getValue() * qualityMultiplier / 1000000;

    log.debug("Quality adjustment: {}% of {} (premium: {}) = {}",
        modifier.getValue() / 100.0, basePrice, isPremium, (int) result);

    return (int) result;
  }

  /**
   * Calculate extra services adjustment (additional features, custom requests).
   * Extra modifiers add value for supplementary services.
   */
  private int calculateExtraAdjustment(GameModifierEntity modifier, int basePrice, Map<String, Object> context) {
    // Check for custom request context
    boolean isCustom = context != null && Boolean.TRUE.equals(context.get("isCustomRequest"));
    int customMultiplier = isCustom ? 125 : 100; // 25% extra for custom requests

    return switch (modifier.getOperation()) {
      case ADD -> {
        // Fixed amount added to base price with custom multiplier
        long adjustment = (long) modifier.getValue() * customMultiplier / 100;
        log.debug("Extra services ADD adjustment: {} * {}% = {} (added to base price {})",
            modifier.getValue(), customMultiplier, (int) adjustment, basePrice);
        yield (int) adjustment;
      }
      case SUBTRACT -> {
        // Fixed amount discount from base price with custom multiplier
        long discount = (long) modifier.getValue() * customMultiplier / 100;
        log.debug("Extra services SUBTRACT adjustment: {} * {}% = {} (subtracted from base price {})",
            modifier.getValue(), customMultiplier, (int) discount, basePrice);
        yield -(int) discount;
      }
      case MULTIPLY -> {
        // Multiplier applied to base price (e.g., 15000 = 1.5x) with custom multiplier
        long multiplier = (long) modifier.getValue() * customMultiplier / 100;
        long finalPrice = (long) basePrice * multiplier / 10000;
        long adjustment = finalPrice - basePrice;
        log.debug("Extra services MULTIPLY: basePrice {} * ({} * {}% / 10000) = {} (adjustment: {})",
            basePrice, modifier.getValue(), customMultiplier, finalPrice, adjustment);
        yield (int) adjustment;
      }
      case DIVIDE -> {
        // Division applied to base price (e.g., 20000 = divide by 2) with custom multiplier
        long divisor = (long) modifier.getValue() * customMultiplier / 100;
        long finalPrice = divisor != 0 ? (long) basePrice * 10000 / divisor : basePrice;
        long adjustment = finalPrice - basePrice;
        log.debug("Extra services DIVIDE: basePrice {} / ({} * {}% / 100) = {} (adjustment: {})",
            basePrice, modifier.getValue(), customMultiplier, finalPrice, adjustment);
        yield (int) adjustment;
      }
    };
  }

  /**
   * Calculate promotional adjustment (discounts, special offers).
   * Promotional modifiers typically reduce price.
   */
  private int calculatePromotionalAdjustment(GameModifierEntity modifier, int basePrice, Map<String, Object> context) {
    // Check for first-time customer context
    boolean isFirstTime = context != null && Boolean.TRUE.equals(context.get("isFirstTimeCustomer"));
    int loyaltyMultiplier = isFirstTime ? 120 : 100; // Extra discount for first-time customers

    // Promotional modifiers are usually discounts with loyalty multiplier
    long discountAmount = (long) basePrice * modifier.getValue() * loyaltyMultiplier / 1000000;
    int adjustment = -(int) discountAmount; // Negative because it's a discount

    log.debug("Promotional adjustment: {}% discount of {} (first-time: {}) = {}",
        modifier.getValue() / 100.0, basePrice, isFirstTime, adjustment);

    return adjustment;
  }

  /**
   * Calculate seasonal adjustment (holiday pricing, peak season premiums).
   * Seasonal modifiers can be either premium or discount based on timing.
   * Supports both positive (premium) and negative (discount) values.
   */
  private int calculateSeasonalAdjustment(GameModifierEntity modifier, int basePrice, Map<String, Object> context) {
    // Check for holiday season context
    boolean isHoliday = context != null && Boolean.TRUE.equals(context.get("isHolidaySeason"));
    int holidayMultiplier = isHoliday ? 130 : 100; // 30% extra effect during holidays

    // Seasonal modifiers can be either premium or discount based on value sign
    long adjustment = (long) basePrice * Math.abs(modifier.getValue()) * holidayMultiplier / 1000000;

    if (modifier.getValue() < 0) {
      // Negative value = discount
      int discount = -(int) adjustment;
      log.debug("Seasonal discount: {}% of {} (holiday: {}) = {}",
          Math.abs(modifier.getValue()) / 100.0, basePrice, isHoliday, discount);
      return discount;
    } else {
      // Positive value = premium
      log.debug("Seasonal premium: {}% of {} (holiday: {}) = {}",
          modifier.getValue() / 100.0, basePrice, isHoliday, (int) adjustment);
      return (int) adjustment;
    }
  }

  /**
   * Result of game modifier calculation.
   *
   * @param totalAdjustment Total adjustment amount from all modifiers
   * @param finalPrice Final price after applying all modifiers
   */
  public record GameModifierCalculationResult(
      int totalAdjustment,
      int finalPrice) {}


}
