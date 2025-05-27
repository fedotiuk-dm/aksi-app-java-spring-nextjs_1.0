/**
 * @fileoverview Константи помилок для валідації основної інформації
 * @module domain/wizard/services/stage-3-item-management/basic-info/constants/basic-info-validation-errors
 */

/**
 * Помилки валідації основної інформації
 */
export const BASIC_INFO_VALIDATION_ERRORS = {
  CATEGORY_REQUIRED: "Категорія послуги є обов'язковою",
  ITEM_NAME_REQUIRED: "Найменування предмета є обов'язковим",
  MEASUREMENT_UNIT_REQUIRED: "Одиниця виміру є обов'язковою",
  QUANTITY_REQUIRED: "Кількість є обов'язковою",
  INVALID_DATA_TYPE: 'Некоректний тип даних',
  VALIDATION_FAILED: 'Помилка валідації даних',
  FIELD_VALIDATION_FAILED: 'Помилка валідації поля',
} as const;
