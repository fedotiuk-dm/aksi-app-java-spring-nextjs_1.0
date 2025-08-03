package com.aksi.domain.catalog;

import lombok.Getter;

/** Unit of measure for price list items */
@Getter
public enum UnitOfMeasure {
  PIECE("шт", "Штука"),
  KILOGRAM("кг", "Кілограм"),
  PAIR("пара", "Пара"),
  SQUARE_METER("кв.м", "Квадратний метр");

  private final String code;
  private final String description;

  UnitOfMeasure(String code, String description) {
    this.code = code;
    this.description = description;
  }

  public static UnitOfMeasure fromCode(String code) {
    for (UnitOfMeasure unit : values()) {
      if (unit.code.equals(code)) {
        return unit;
      }
    }
    throw new IllegalArgumentException("Unknown unit of measure code: " + code);
  }
}
