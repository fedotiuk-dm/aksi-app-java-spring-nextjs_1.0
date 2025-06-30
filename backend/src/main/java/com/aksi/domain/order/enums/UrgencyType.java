package com.aksi.domain.order.enums;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Domain enum для типу терміновості з business логікою розрахунків */
public enum UrgencyType {
  NORMAL("Звичайне виконання", BigDecimal.ZERO, 5),
  URGENT_48H("Термінове 48 годин", BigDecimal.valueOf(0.50), 2),
  URGENT_24H("Термінове 24 години", BigDecimal.valueOf(1.00), 1);

  private final String description;
  private final BigDecimal priceMultiplier;
  private final int standardDays;

  UrgencyType(String description, BigDecimal priceMultiplier, int standardDays) {
    this.description = description;
    this.priceMultiplier = priceMultiplier;
    this.standardDays = standardDays;
  }

  public String getDescription() {
    return description;
  }

  /** Отримує коефіцієнт надбавки до ціни (0.0 = 0%, 0.5 = 50%, 1.0 = 100%) */
  public BigDecimal getPriceMultiplier() {
    return priceMultiplier;
  }

  /** Отримує відсоток надбавки для відображення */
  public int getPercentage() {
    return priceMultiplier.multiply(BigDecimal.valueOf(100)).intValue();
  }

  /** Стандартна кількість робочих днів для виконання */
  public int getStandardDays() {
    return standardDays;
  }

  /** Перевіряє чи це термінове замовлення */
  public boolean isUrgent() {
    return this != NORMAL;
  }

  /** Перевіряє чи потребує особливої уваги операторів */
  public boolean requiresSpecialAttention() {
    return this == URGENT_24H;
  }

  /** Розраховує надбавку до суми */
  public BigDecimal calculateUrgencyCharge(BigDecimal baseAmount) {
    return baseAmount.multiply(priceMultiplier);
  }

  /** Розраховує загальну суму з надбавкою */
  public BigDecimal calculateTotalWithUrgency(BigDecimal baseAmount) {
    return baseAmount.add(calculateUrgencyCharge(baseAmount));
  }

  /** Розраховує приблизну дату готовності замовлення */
  public LocalDateTime calculateReadyDate(LocalDateTime orderDate) {
    return orderDate.plusDays(standardDays);
  }

  /** Перевіряє чи дата відповідає терміновості */
  public boolean isDateCompatibleWithUrgency(LocalDateTime orderDate, LocalDateTime requestedDate) {
    LocalDateTime earliestReady = calculateReadyDate(orderDate);
    return !requestedDate.isBefore(earliestReady);
  }

  /** Отримує максимальну терміновість для заданої дати */
  public static UrgencyType getMaxUrgencyForDate(
      LocalDateTime orderDate, LocalDateTime requestedDate) {
    long daysDiff = java.time.Duration.between(orderDate, requestedDate).toDays();

    if (daysDiff >= NORMAL.getStandardDays()) {
      return NORMAL;
    } else if (daysDiff >= URGENT_48H.getStandardDays()) {
      return URGENT_48H;
    } else if (daysDiff >= URGENT_24H.getStandardDays()) {
      return URGENT_24H;
    }

    return null; // Неможливо виконати в такі терміни
  }
}
