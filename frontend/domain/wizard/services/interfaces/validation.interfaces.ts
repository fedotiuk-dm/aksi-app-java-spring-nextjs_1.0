/**
 * @fileoverview Інтерфейси валідації для сервісів
 * @module domain/wizard/services/interfaces/validation
 */

import type { ValidationError, ValidationOperationResult } from './operation-result.interfaces';

/**
 * Базовий інтерфейс валідатора
 */
export interface BaseValidator<T = unknown> {
  validate(data: T): ValidationOperationResult<T>;
  validateField(field: string, value: unknown): ValidationError | null;
}

/**
 * Інтерфейс асинхронного валідатора
 */
export interface AsyncValidator<T = unknown> {
  validateAsync(data: T): Promise<ValidationOperationResult<T>>;
  validateFieldAsync(field: string, value: unknown): Promise<ValidationError | null>;
}

/**
 * Правило валідації
 */
export interface ValidationRule<T = unknown> {
  field: string;
  required?: boolean;
  validator: (value: T) => ValidationError | null;
  asyncValidator?: (value: T) => Promise<ValidationError | null>;
}

/**
 * Схема валідації
 */
export interface ValidationSchema<T = Record<string, unknown>> {
  rules: ValidationRule[];
  validate(data: T): ValidationOperationResult<T>;
  validateAsync(data: T): Promise<ValidationOperationResult<T>>;
}

/**
 * Конфігурація валідації
 */
export interface ValidationConfig {
  stopOnFirstError?: boolean;
  validateAllFields?: boolean;
  customMessages?: Record<string, string>;
}

/**
 * Контекст валідації
 */
export interface ValidationContext {
  field: string;
  value: unknown;
  data: Record<string, unknown>;
  config: ValidationConfig;
}
