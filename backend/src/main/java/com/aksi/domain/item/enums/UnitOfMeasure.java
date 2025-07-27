package com.aksi.domain.item.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/** Units of measurement for price list items */
@Getter
@RequiredArgsConstructor
public enum UnitOfMeasure {
  PIECE("шт", "Штука"),
  KILOGRAM("кг", "Кілограм"),
  PAIR("пара", "Пара"),
  SQUARE_METER("кв.м", "Квадратний метр");

  private final String csvValue;
  private final String displayName;

  /**
   * Convert CSV value to enum
   *
   * @param csvValue value from CSV file
   * @return UnitOfMeasure enum
   */
  public static UnitOfMeasure fromCsvValue(String csvValue) {
    if (csvValue == null) {
      return null;
    }

    for (UnitOfMeasure unit : values()) {
      if (unit.csvValue.equalsIgnoreCase(csvValue.trim())) {
        return unit;
      }
    }
    throw new IllegalArgumentException("Unknown unit of measure: " + csvValue);
  }

  /**
   * Get the value for CSV export
   *
   * @return CSV formatted value
   */
  public String toCsvValue() {
    return csvValue;
  }
}
