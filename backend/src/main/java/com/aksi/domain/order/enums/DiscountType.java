package com.aksi.domain.order.enums;

import java.math.BigDecimal;
import java.util.Set;

/** Domain enum для типу знижки з business логікою розрахунків */
public enum DiscountType {
  NONE("Без знижки", BigDecimal.ZERO, false),
  EVERCARD("Еверкард", BigDecimal.valueOf(0.10), false),
  SOCIAL_MEDIA("Соцмережі", BigDecimal.valueOf(0.05), false),
  MILITARY("ЗСУ", BigDecimal.valueOf(0.10), false),
  OTHER("Інша знижка", BigDecimal.ZERO, true);

  private final String description;
  private final BigDecimal defaultPercentage;
  private final boolean allowsCustomPercentage;

  DiscountType(String description, BigDecimal defaultPercentage, boolean allowsCustomPercentage) {
    this.description = description;
    this.defaultPercentage = defaultPercentage;
    this.allowsCustomPercentage = allowsCustomPercentage;
  }

  public String getDescription() {
    return description;
  }

  /** Отримує стандартний відсоток знижки (0.10 = 10%) */
  public BigDecimal getDefaultPercentage() {
    return defaultPercentage;
  }

  /** Отримує відсоток для відображення */
  public int getDisplayPercentage() {
    return defaultPercentage.multiply(BigDecimal.valueOf(100)).intValue();
  }

  /** Перевіряє чи дозволений кастомний відсоток */
  public boolean allowsCustomPercentage() {
    return allowsCustomPercentage;
  }

  /** Перевіряє чи є знижка */
  public boolean hasDiscount() {
    return this != NONE;
  }

  /** Перевіряє чи потрібна документація для знижки */
  public boolean requiresDocumentation() {
    return this == MILITARY;
  }

  /** Перевіряє чи можна комбінувати з іншими знижками */
  public boolean canCombineWith(DiscountType other) {
    // Зазвичай знижки не комбінуються, але можна додати логіку
    return false;
  }

  /** Отримує типи знижок які потребують верифікації */
  public static Set<DiscountType> getTypesRequiringVerification() {
    return Set.of(EVERCARD, MILITARY);
  }

  /** Отримує максимально дозволений відсоток для типу */
  public BigDecimal getMaxAllowedPercentage() {
    return switch (this) {
      case NONE -> BigDecimal.ZERO;
      case EVERCARD -> BigDecimal.valueOf(0.10); // Фіксований 10%
      case SOCIAL_MEDIA -> BigDecimal.valueOf(0.05); // Фіксований 5%
      case MILITARY -> BigDecimal.valueOf(0.10); // Фіксований 10%
      case OTHER -> BigDecimal.valueOf(0.50); // До 50% для кастомної знижки
    };
  }

  /** Валідує відсоток знижки для даного типу */
  public boolean isValidPercentage(BigDecimal percentage) {
    if (percentage.compareTo(BigDecimal.ZERO) < 0) {
      return false;
    }

    if (!allowsCustomPercentage && !percentage.equals(defaultPercentage)) {
      return false;
    }

    return percentage.compareTo(getMaxAllowedPercentage()) <= 0;
  }

  /** Розраховує суму знижки */
  public BigDecimal calculateDiscountAmount(BigDecimal totalAmount, BigDecimal customPercentage) {
    BigDecimal percentage =
        allowsCustomPercentage && customPercentage != null ? customPercentage : defaultPercentage;

    if (!isValidPercentage(percentage)) {
      throw new IllegalArgumentException("Неправильний відсоток знижки: " + percentage);
    }

    return totalAmount.multiply(percentage);
  }

  /** Розраховує фінальну суму після знижки */
  public BigDecimal calculateFinalAmount(BigDecimal totalAmount, BigDecimal customPercentage) {
    BigDecimal discountAmount = calculateDiscountAmount(totalAmount, customPercentage);
    return totalAmount.subtract(discountAmount);
  }
}
