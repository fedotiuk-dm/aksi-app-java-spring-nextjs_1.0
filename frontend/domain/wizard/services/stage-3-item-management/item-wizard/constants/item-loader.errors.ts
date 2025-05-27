/**
 * @fileoverview Константи помилок для сервісу завантаження предметів
 * @module domain/wizard/services/stage-3-item-management/item-wizard/constants/item-loader-errors
 */

/**
 * Помилки сервісу завантаження предметів
 */
export const ITEM_LOADER_ERRORS = {
  INVALID_ORDER_ID: 'Некоректний ID замовлення',
  INVALID_ITEM_ID: 'Некоректний ID предмета',
  LOAD_ITEMS_FAILED: 'Не вдалося завантажити предмети',
  LOAD_ITEM_FAILED: 'Не вдалося завантажити предмет',
  VALIDATION_FAILED: 'Помилка валідації даних предмета',
  INVALID_ITEMS_DATA: 'Знайдено невалідні дані предметів',
  CACHE_ERROR: 'Помилка роботи з кешем',
} as const;
