/**
 * @fileoverview Типи для результатів операцій з замовленнями
 * @module domain/wizard/adapters/order/types/operations
 */

/**
 * Результат операції з замовленням
 */
export interface WizardOrderOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Результат валідації замовлення
 */
export interface WizardOrderValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
  readonly fieldErrors: Record<string, string[]>;
}

/**
 * Стан завантаження для order операцій
 */
export interface WizardOrderLoadingState {
  readonly loading: boolean;
  readonly creating: boolean;
  readonly updating: boolean;
  readonly deleting: boolean;
  readonly searching: boolean;
  readonly calculating: boolean;
  readonly generating: boolean;
}
