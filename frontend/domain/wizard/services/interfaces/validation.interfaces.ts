/**
 * @fileoverview Інтерфейси валідації для сервісів
 * @module domain/wizard/services/interfaces/validation
 */

/**
 * Базовий інтерфейс валідатора
 */
export interface Validator<T> {
  validate(value: T): ValidationResult<T>;
}

/**
 * Результат валідації
 */
export interface ValidationResult<T> {
  isValid: boolean;
  value?: T;
  errors: ValidationError[];
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
 * Правило валідації
 */
export interface ValidationRule<T> {
  name: string;
  validate: (value: T) => boolean;
  message: string;
  code: string;
}

/**
 * Схема валідації
 */
export interface ValidationSchema<T> {
  rules: ValidationRule<T>[];
  required?: boolean;
}

/**
 * Контекст валідації
 */
export interface ValidationContext {
  field: string;
  value: unknown;
  parent?: unknown;
  root?: unknown;
}
