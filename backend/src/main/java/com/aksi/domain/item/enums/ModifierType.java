package com.aksi.domain.item.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/** Types of price modifiers */
@Getter
@RequiredArgsConstructor
public enum ModifierType {
  PERCENTAGE("Відсотковий модифікатор"), // Percentage modifier (e.g., +30%)
  FIXED_AMOUNT("Фіксована сума"); // Fixed amount modifier (e.g., +50.00 UAH)

  private final String displayName;
}
