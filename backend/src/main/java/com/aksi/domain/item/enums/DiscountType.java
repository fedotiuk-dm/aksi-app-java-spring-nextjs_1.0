package com.aksi.domain.item.enums;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/** Global discount types for orders */
@Getter
@RequiredArgsConstructor
public enum DiscountType {
  NONE("Без знижки", BigDecimal.ZERO),
  EVERCARD("Еверкард", new BigDecimal("0.10")),
  SOCIAL_MEDIA("Соцмережі", new BigDecimal("0.05")),
  MILITARY("ЗСУ", new BigDecimal("0.10")),
  CUSTOM("Інше", null); // Custom discount value to be provided separately

  private final String displayName;
  private final BigDecimal discountValue;

  /**
   * Check if this discount type requires a custom value
   *
   * @return true if custom value is required
   */
  public boolean requiresCustomValue() {
    return this == CUSTOM;
  }

  /**
   * Get discount multiplier (1 - discount value) For example, 10% discount returns 0.9
   *
   * @return discount multiplier
   */
  public BigDecimal getDiscountMultiplier() {
    if (discountValue == null) {
      throw new IllegalStateException("Custom discount requires explicit value");
    }
    return BigDecimal.ONE.subtract(discountValue);
  }

  /**
   * Get discount multiplier with custom value
   *
   * @param customValue custom discount value (e.g., 0.15 for 15%)
   * @return discount multiplier
   */
  public BigDecimal getDiscountMultiplier(BigDecimal customValue) {
    if (this == CUSTOM && customValue != null) {
      return BigDecimal.ONE.subtract(customValue);
    }
    return getDiscountMultiplier();
  }
}
