/**
 * @fileoverview Базові типи для wizard сервісів
 * @module domain/wizard/services/shared/types
 */

/**
 * Базовий результат операції для wizard
 */
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}

/**
 * Результат операції з часовою міткою
 */
export interface TimestampedOperationResult<T = void> extends OperationResult<T> {
  timestamp: Date;
}

/**
 * Результат операції збереження
 */
export interface SaveOperationResult extends OperationResult<{ id: string }> {
  saved: boolean;
}

/**
 * Результат валідації
 */
export interface ValidationOperationResult extends OperationResult<void> {
  isValid: boolean;
  validationErrors: Record<string, string>;
}

/**
 * Базовий інтерфейс для всіх доменних сутностей wizard
 */
export interface WizardEntity<TId = string> {
  id?: TId;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Базовий інтерфейс для Value Objects wizard
 */
export interface WizardValueObject {
  equals(other: this): boolean;
}

/**
 * Інтерфейс для Use Cases wizard
 */
export interface WizardUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

/**
 * Пагінація для wizard
 */
export interface WizardPagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasMore: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * Параметри пошуку для wizard
 */
export interface WizardSearchParams {
  keyword?: string;
  page?: number;
  size?: number;
}
