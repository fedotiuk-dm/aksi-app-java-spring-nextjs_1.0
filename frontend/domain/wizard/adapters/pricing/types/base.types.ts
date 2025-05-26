/**
 * @fileoverview Базові типи для pricing адаптера
 * @module domain/wizard/adapters/pricing/types/base
 */

/**
 * Результат операції pricing адаптера
 */
export interface WizardPricingOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Константа для невідомих помилок
 */
export const UNKNOWN_PRICING_ERROR = 'Невідома помилка при роботі з ціноутворенням';

/**
 * Константа для помилок API
 */
export const API_PRICING_ERROR = 'Помилка при зверненні до API ціноутворення';

/**
 * Константа для помилок перетворення даних
 */
export const MAPPING_PRICING_ERROR = 'Помилка при перетворенні даних ціноутворення';
