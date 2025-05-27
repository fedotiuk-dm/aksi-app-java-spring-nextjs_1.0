/**
 * @fileoverview Константи помилок для сервісу операцій з предметами
 * @module domain/wizard/services/stage-3-item-management/item-wizard/constants/item-operations-errors
 */

/**
 * Помилки сервісу операцій з предметами
 */
export const ITEM_OPERATIONS_ERRORS = {
  INVALID_ORDER_ID: 'Некоректний ID замовлення',
  INVALID_ITEM_ID: 'Некоректний ID предмета',
  INVALID_ITEM_DATA: 'Некоректні дані предмета',
  CREATE_FAILED: 'Не вдалося створити предмет',
  UPDATE_FAILED: 'Не вдалося оновити предмет',
  DELETE_FAILED: 'Не вдалося видалити предмет',
  DUPLICATE_FAILED: 'Не вдалося дублювати предмет',
  VALIDATION_FAILED: 'Помилка валідації даних',
  ITEM_NOT_FOUND: 'Предмет не знайдено',
  OPERATION_FAILED: 'Операція не вдалася',
} as const;
