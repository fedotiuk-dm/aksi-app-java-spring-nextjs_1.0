package com.aksi.domain.service;

import lombok.Getter;

/** Service category types from price list */
@Getter
public enum ServiceCategoryType {
  CLOTHING("CLOTHING", "Одяг та текстильні вироби"),
  LAUNDRY("LAUNDRY", "Прання"),
  IRONING("IRONING", "Прасування"),
  LEATHER("LEATHER", "Шкіряні вироби"),
  PADDING("PADDING", "Виробі з утеплювачем"),
  FUR("FUR", "Хутряні вироби"),
  DYEING("DYEING", "Фарбування"),
  ADDITIONAL_SERVICES("ADDITIONAL_SERVICES", "Додаткові послуги");

  private final String code;
  private final String description;

  ServiceCategoryType(String code, String description) {
    this.code = code;
    this.description = description;
  }
}
