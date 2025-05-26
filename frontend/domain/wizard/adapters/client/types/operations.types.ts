/**
 * @fileoverview Типи для операцій з клієнтами
 * @module domain/wizard/adapters/client/types
 */

/**
 * Результат операції з клієнтом
 */
export interface WizardClientOperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Результат валідації клієнта
 */
export interface WizardClientValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
  readonly fieldErrors: Record<string, string[]>;
}

/**
 * Конфігурація для client адаптера
 */
export interface WizardClientAdapterConfig {
  readonly enableCaching: boolean;
  readonly cacheTimeout: number;
  readonly retryAttempts: number;
  readonly retryDelay: number;
  readonly defaultPageSize: number;
  readonly maxPageSize: number;
}

/**
 * Стан завантаження для client операцій
 */
export interface WizardClientLoadingState {
  readonly loading: boolean;
  readonly searching: boolean;
  readonly creating: boolean;
  readonly updating: boolean;
  readonly deleting: boolean;
}
