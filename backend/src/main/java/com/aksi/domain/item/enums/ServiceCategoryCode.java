package com.aksi.domain.item.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Service category codes for dry cleaning services. These codes match the category_code values in
 * the price_list.csv
 */
@Getter
@RequiredArgsConstructor
public enum ServiceCategoryCode {
  CLOTHING("CLOTHING", "Чистка одягу та текстилю", 2),
  LAUNDRY("LAUNDRY", "Прання білизни", 2),
  IRONING("IRONING", "Прасування", 1),
  RESTORATION("RESTORATION", "Реставрація одягу", 5),
  STAIN_REMOVAL("STAIN_REMOVAL", "Виведення плям", 3),
  WET_CLEANING("WET_CLEANING", "Аквачистка", 3),
  SHOES("SHOES", "Чистка взуття", 2),
  CARPETS("CARPETS", "Чистка килимів", 3),
  FUR("FUR", "Чистка хутра", 5),
  LEATHER("LEATHER", "Чистка шкіри", 5),
  HOUSEHOLD("HOUSEHOLD", "Чистка домашнього текстилю", 3),
  DYEING("DYEING", "Фарбування", 5),
  PADDING("PADDING", "Робота з наповнювачем", 3),
  ADDITIONAL_SERVICES("ADDITIONAL_SERVICES", "Додаткові послуги", 1);

  private final String code;
  private final String description;
  private final int standardDays;

  /**
   * Find enum by code value
   *
   * @param code the category code
   * @return ServiceCategoryCode enum
   */
  public static ServiceCategoryCode fromCode(String code) {
    for (ServiceCategoryCode category : values()) {
      if (category.code.equalsIgnoreCase(code)) {
        return category;
      }
    }
    throw new IllegalArgumentException("Unknown service category code: " + code);
  }
}
