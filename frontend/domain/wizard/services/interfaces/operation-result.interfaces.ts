/**
 * @fileoverview Інтерфейси результатів операцій для сервісів
 * @module domain/wizard/services/interfaces/operation-result
 */

/**
 * Базовий результат операції
 */
export interface OperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

/**
 * Розширений результат операції з додатковими метаданими
 */
export interface ExtendedOperationResult<T = unknown> extends OperationResult<T> {
  operationId: string;
  duration: number;
  metadata?: Record<string, unknown>;
}

/**
 * Результат операції з валідацією
 */
export interface ValidationOperationResult<T = unknown> extends OperationResult<T> {
  validationErrors?: ValidationError[];
  isValid: boolean;
}

/**
 * Помилка валідації
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

/**
 * Результат асинхронної операції
 */
export interface AsyncOperationResult<T = unknown> extends OperationResult<T> {
  isLoading: boolean;
  progress?: number;
  estimatedTimeRemaining?: number;
}

/**
 * Результат операції з пагінацією
 */
export interface PaginatedOperationResult<T = unknown> extends OperationResult<T[]> {
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Результат операції збереження
 */
export interface SaveOperationResult<T = unknown> extends OperationResult<T> {
  saved: boolean;
  version?: number;
  lastSaved?: Date;
}

/**
 * Результат операції завантаження
 */
export interface LoadOperationResult<T = unknown> extends OperationResult<T> {
  loaded: boolean;
  fromCache: boolean;
  cacheAge?: number;
}

/**
 * Фабрика для створення результатів операцій
 */
export class OperationResultFactory {
  static success<T>(data: T): OperationResult<T> {
    return {
      success: true,
      data,
      timestamp: new Date(),
    };
  }

  static error<T>(error: string): OperationResult<T> {
    return {
      success: false,
      error,
      timestamp: new Date(),
    };
  }

  static validationError<T>(
    error: string,
    validationErrors: ValidationError[]
  ): ValidationOperationResult<T> {
    return {
      success: false,
      error,
      validationErrors,
      isValid: false,
      timestamp: new Date(),
    };
  }

  static loading<T>(): AsyncOperationResult<T> {
    return {
      success: false,
      isLoading: true,
      timestamp: new Date(),
    };
  }
}
