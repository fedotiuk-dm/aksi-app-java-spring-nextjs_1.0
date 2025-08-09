package com.aksi.service.pricing;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.aksi.api.pricing.dto.DiscountType;
import com.aksi.api.pricing.dto.UrgencyType;
import com.aksi.domain.pricing.PriceModifierEntity;

import lombok.extern.slf4j.Slf4j;

/**
 * Service for precise price calculations using BigDecimal. Centralizes all mathematical pricing
 * operations for consistency and accuracy. Based on existing PriceCalculationService with
 * OrderWizard business rules.
 */
@Service
@Slf4j
public class PriceCalculationService {

  // Constants for percentage calculations
  private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
  private static final BigDecimal TEN_THOUSAND = BigDecimal.valueOf(10000);
  private static final int MONEY_SCALE = 2;

  // Urgency percentages from OpenAPI/OrderWizard
  private static final Map<UrgencyType, Integer> URGENCY_PERCENTAGES =
      Map.of(
          UrgencyType.NORMAL, 0,
          UrgencyType.EXPRESS_48_H, 50,
          UrgencyType.EXPRESS_24_H, 100);

  // Discount percentages from OpenAPI/OrderWizard
  private static final Map<DiscountType, Integer> DISCOUNT_PERCENTAGES =
      Map.of(
          DiscountType.NONE, 0,
          DiscountType.EVERCARD, 10,
          DiscountType.MILITARY, 10,
          DiscountType.SOCIAL_MEDIA, 5);

  // Categories excluded from discounts (from OrderWizard doc, line 183-185)
  private static final Set<String> DISCOUNT_EXCLUDED_CATEGORIES =
      Set.of("LAUNDRY", "IRONING", "DYEING");

  /**
   * Calculate modifier amount based on type. Following OrderWizard steps 3-5: special modifiers,
   * multipliers, fixed services
   */
  public int calculateModifierAmount(PriceModifierEntity modifier, int baseAmount, int quantity) {
    return switch (modifier.getType()) {
      case PERCENTAGE -> calculatePercentageFromBasisPoints(baseAmount, modifier.getValue());
      case FIXED -> modifier.getValue() * quantity;
      default -> {
        log.warn("Unknown modifier type: {}", modifier.getType());
        yield 0;
      }
    };
  }

  /** Calculate urgency amount. Following OrderWizard step 6: +50% or +100% to intermediate sum */
  public int calculateUrgencyAmount(int amount, UrgencyType urgencyType) {
    if (urgencyType == null) {
      return 0;
    }
    return calculatePercentage(amount, getUrgencyPercentage(urgencyType));
  }

  /**
   * Calculate discount amount. Following OrderWizard step 7: discounts if applicable and allowed
   * for category
   */
  public int calculateDiscountAmount(
      int amount, DiscountType discountType, Integer discountPercentage) {
    if (discountType == null || discountType == DiscountType.NONE) {
      return 0;
    }
    return calculatePercentage(amount, getDiscountPercentage(discountType, discountPercentage));
  }

  /**
   * Get urgency percentage based on type. From OrderWizard: EXPRESS_48H = +50%, EXPRESS_24H = +100%
   */
  public int getUrgencyPercentage(UrgencyType urgencyType) {
    return urgencyType == null ? 0 : URGENCY_PERCENTAGES.getOrDefault(urgencyType, 0);
  }

  /**
   * Get discount percentage based on type. From OrderWizard: EVERCARD/MILITARY = 10%, SOCIAL_MEDIA
   * = 5%
   */
  public int getDiscountPercentage(DiscountType discountType, Integer customPercentage) {
    if (discountType == null) {
      return 0;
    }

    if (discountType == DiscountType.OTHER) {
      return customPercentage != null ? customPercentage : 0;
    }

    return DISCOUNT_PERCENTAGES.getOrDefault(discountType, 0);
  }

  /**
   * Check if discount is applicable to category. From OrderWizard: discounts do not apply to
   * washing, ironing, dyeing
   */
  public boolean isDiscountApplicableToCategory(String categoryCode) {
    return !DISCOUNT_EXCLUDED_CATEGORIES.contains(categoryCode);
  }

  // ===== PRIVATE CALCULATION METHODS =====

  /**
   * Calculate percentage of amount with configurable divisor. Following OrderWizard step 8: proper
   * rounding to kopiykas
   */
  private int calculatePercentageWithDivisor(int amount, int value, BigDecimal divisor) {
    return BigDecimal.valueOf(amount)
        .multiply(BigDecimal.valueOf(value))
        .divide(divisor, MONEY_SCALE, RoundingMode.HALF_UP)
        .intValue();
  }

  /** Calculate percentage of amount (0-100). */
  private int calculatePercentage(int amount, int percentage) {
    return calculatePercentageWithDivisor(amount, percentage, HUNDRED);
  }

  /**
   * Calculate percentage from basis points. For precise modifier calculations (1550 basis points =
   * 15.5%)
   */
  private int calculatePercentageFromBasisPoints(int amount, int basisPoints) {
    return calculatePercentageWithDivisor(amount, basisPoints, TEN_THOUSAND);
  }
}
