/**
 * @fileoverview Константи помилок для завантаження основної інформації
 * @module domain/wizard/services/stage-3-item-management/basic-info/constants/basic-info-loader-errors
 */

/**
 * Помилки сервісу завантаження основної інформації
 */
export const BASIC_INFO_LOADER_ERRORS = {
  LOAD_CATEGORIES_FAILED: 'Не вдалося завантажити категорії послуг',
  LOAD_MEASUREMENT_UNITS_FAILED: 'Не вдалося завантажити одиниці виміру',
  LOAD_ITEMS_FAILED: 'Не вдалося завантажити предмети з прайсу',
  SEARCH_ITEMS_FAILED: 'Не вдалося виконати пошук предметів',
  INVALID_CATEGORY_ID: 'Некоректний ID категорії',
  INVALID_SEARCH_QUERY: 'Некоректний запит для пошуку',
  VALIDATION_FAILED: 'Помилка валідації завантажених даних',
  CACHE_ERROR: 'Помилка роботи з кешем',
} as const;
