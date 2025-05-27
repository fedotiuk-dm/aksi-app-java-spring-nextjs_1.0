/**
 * @fileoverview Типи результатів операцій з предметами
 * @module domain/wizard/services/stage-3-item-management/item-wizard/types/item-operation-result
 */

/**
 * Результат операції з предметом
 */
export interface ItemOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: string[];
}

/**
 * Результат валідації предмета
 */
export interface ItemValidationResult {
  isValid: boolean;
  errors: string[];
  field?: string;
}
