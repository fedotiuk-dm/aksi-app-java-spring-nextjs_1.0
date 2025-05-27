/**
 * @fileoverview Типи результатів операцій з основною інформацією предмета
 * @module domain/wizard/services/stage-3-item-management/basic-info/types/basic-info-operation-result
 */

/**
 * Результат операції з основною інформацією
 */
export interface BasicInfoOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: string[];
}

/**
 * Результат валідації основної інформації
 */
export interface BasicInfoValidationResult {
  isValid: boolean;
  errors: string[];
  field?: string;
}
