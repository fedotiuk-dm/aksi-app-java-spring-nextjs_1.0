package com.aksi.service.pricing.calculation;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.domain.pricing.PriceModifier;

import lombok.extern.slf4j.Slf4j;

/** Service for precise price calculations using BigDecimal */
@Service
@Slf4j
public class PriceCalculationService {

  // Constants for percentage calculations
  private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
  private static final BigDecimal TEN_THOUSAND = BigDecimal.valueOf(10000);
  private static final int MONEY_SCALE = 2;

  // Urgency percentages from OpenAPI
  private static final Map<GlobalPriceModifiers.UrgencyTypeEnum, Integer> URGENCY_PERCENTAGES =
      Map.of(
          GlobalPriceModifiers.UrgencyTypeEnum.NORMAL, 0,
          GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_48H, 50,
          GlobalPriceModifiers.UrgencyTypeEnum.EXPRESS_24H, 100);

  // Discount percentages from OpenAPI
  private static final Map<GlobalPriceModifiers.DiscountTypeEnum, Integer> DISCOUNT_PERCENTAGES =
      Map.of(
          GlobalPriceModifiers.DiscountTypeEnum.NONE, 0,
          GlobalPriceModifiers.DiscountTypeEnum.EVERCARD, 10,
          GlobalPriceModifiers.DiscountTypeEnum.MILITARY, 10,
          GlobalPriceModifiers.DiscountTypeEnum.SOCIAL_MEDIA, 5);

  // Categories excluded from discounts (from OrderWizard doc, line 183-185)
  // Defined in pricing-api.yaml x-discount-excluded-categories
  private static final Set<String> DISCOUNT_EXCLUDED_CATEGORIES =
      Set.of("LAUNDRY", "IRONING", "DYEING");

  /**
   * Calculate modifier amount based on type
   *
   * @param modifier Price modifier
   * @param baseAmount Base amount in kopiykas
   * @param quantity Item quantity
   * @return Calculated amount in kopiykas
   */
  public int calculateModifierAmount(PriceModifier modifier, int baseAmount, int quantity) {
    return switch (modifier.getType()) {
      case PERCENTAGE -> calculatePercentageFromBasisPoints(baseAmount, modifier.getValue());
      case FIXED -> modifier.getValue() * quantity;
      default -> {
        log.warn("Unknown modifier type: {}", modifier.getType());
        yield 0;
      }
    };
  }

  /**
   * Calculate urgency amount
   *
   * @param amount Base amount for urgency calculation
   * @param urgencyType Type of urgency
   * @return Urgency amount in kopiykas
   */
  public int calculateUrgencyAmount(int amount, GlobalPriceModifiers.UrgencyTypeEnum urgencyType) {
    if (urgencyType == null) {
      return 0;
    }
    return calculatePercentage(amount, getUrgencyPercentage(urgencyType));
  }

  /**
   * Calculate discount amount
   *
   * @param amount Base amount for discount calculation
   * @param discountType Type of discount
   * @param discountPercentage Custom percentage for OTHER type
   * @return Discount amount in kopiykas
   */
  public int calculateDiscountAmount(
      int amount, GlobalPriceModifiers.DiscountTypeEnum discountType, Integer discountPercentage) {
    if (discountType == null || discountType == GlobalPriceModifiers.DiscountTypeEnum.NONE) {
      return 0;
    }
    return calculatePercentage(amount, getDiscountPercentage(discountType, discountPercentage));
  }

  /**
   * Calculate percentage of amount with configurable divisor
   *
   * @param amount Base amount
   * @param value Percentage or basis points value
   * @param divisor Divisor (100 for percentage, 10000 for basis points)
   * @return Calculated amount
   */
  private int calculatePercentageWithDivisor(int amount, int value, BigDecimal divisor) {
    return BigDecimal.valueOf(amount)
        .multiply(BigDecimal.valueOf(value))
        .divide(divisor, MONEY_SCALE, RoundingMode.HALF_UP)
        .intValue();
  }

  /**
   * Calculate percentage of amount
   *
   * @param amount Base amount
   * @param percentage Percentage value (0-100)
   * @return Calculated amount
   */
  private int calculatePercentage(int amount, int percentage) {
    return calculatePercentageWithDivisor(amount, percentage, HUNDRED);
  }

  /**
   * Calculate percentage from basis points
   *
   * @param amount Base amount
   * @param basisPoints Value in basis points (1550 = 15.5%)
   * @return Calculated amount
   */
  private int calculatePercentageFromBasisPoints(int amount, int basisPoints) {
    return calculatePercentageWithDivisor(amount, basisPoints, TEN_THOUSAND);
  }

  /**
   * Get urgency percentage based on type
   *
   * @param urgencyType Type of urgency
   * @return Percentage value
   */
  public int getUrgencyPercentage(GlobalPriceModifiers.UrgencyTypeEnum urgencyType) {
    return urgencyType == null ? 0 : URGENCY_PERCENTAGES.getOrDefault(urgencyType, 0);
  }

  /**
   * Get discount percentage based on type
   *
   * @param discountType Type of discount
   * @param customPercentage Custom percentage for OTHER type
   * @return Percentage value
   */
  public int getDiscountPercentage(
      GlobalPriceModifiers.DiscountTypeEnum discountType, Integer customPercentage) {
    if (discountType == null) {
      return 0;
    }

    if (discountType == GlobalPriceModifiers.DiscountTypeEnum.OTHER) {
      return customPercentage != null ? customPercentage : 0;
    }

    return DISCOUNT_PERCENTAGES.getOrDefault(discountType, 0);
  }

  /**
   * Check if discount is applicable to category
   *
   * @param categoryCode Category code
   * @return true if discount can be applied
   */
  public boolean isDiscountApplicableToCategory(String categoryCode) {
    return !DISCOUNT_EXCLUDED_CATEGORIES.contains(categoryCode);
  }
}
