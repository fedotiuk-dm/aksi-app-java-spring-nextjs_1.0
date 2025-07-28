package com.aksi.domain.item.enums;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/** Urgency types for item execution with price multipliers */
@Getter
@RequiredArgsConstructor
public enum UrgencyType {
  NORMAL("Звичайне виконання", BigDecimal.ONE, 72),
  URGENT_48H("Термінове 48 годин", new BigDecimal("1.5"), 48),
  URGENT_24H("Термінове 24 години", new BigDecimal("2.0"), 24);

  private final String displayName;
  private final BigDecimal priceMultiplier;
  private final int hoursToComplete;

  /**
   * Convert from API urgency type to domain urgency type
   *
   * @param apiUrgency API urgency type
   * @return domain urgency type
   */
  public static UrgencyType fromApiUrgency(com.aksi.api.item.dto.UrgencyType apiUrgency) {
    if (apiUrgency == null) {
      return NORMAL;
    }
    return switch (apiUrgency) {
      case URGENT_48_H -> URGENT_48H;
      case URGENT_24_H -> URGENT_24H;
      default -> NORMAL;
    };
  }
}
