/**
 * @fileoverview Типи для управління основною інформацією про предмет
 * @module domain/wizard/services/stage-3-item-management/basic-info/types
 */

import type { OrderItem } from '@/domain/wizard/types';

/**
 * Категорія послуги для wizard
 * Відповідає структурі даних, що повертаються адаптерами
 */
export interface ServiceCategory {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly active: boolean;
  // Додаткові поля з API
  readonly sortOrder?: number;
  readonly standardProcessingDays?: number;
  // Додаткові поля для wizard
  unitOfMeasure?: 'pieces' | 'kg';
  standardDeliveryDays?: number;
}

/**
 * Елемент прайс-листа для wizard
 * Відповідає структурі даних, що повертаються адаптерами
 */
export interface PriceListItem {
  readonly id: string;
  readonly categoryId: string;
  readonly catalogNumber?: number;
  readonly name: string;
  readonly unitOfMeasure: string;
  readonly basePrice: number;
  readonly priceBlack?: number;
  readonly priceColor?: number;
  readonly active: boolean;
  // Додаткові поля для wizard
  categoryCode?: string;
}

/**
 * Результат операції з основною інформацією
 */
export interface BasicInfoOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Конфігурація для basic-info сервісу
 */
export interface BasicInfoConfig {
  enableCaching: boolean;
  cacheTimeout: number;
  autoValidation: boolean;
}

/**
 * Стан завантаження для basic-info
 */
export interface BasicInfoLoadingState {
  categories: boolean;
  priceList: boolean;
  validation: boolean;
}

/**
 * Фільтри для пошуку
 */
export interface BasicInfoFilters {
  categoryCode?: string;
  searchTerm?: string;
  unitOfMeasure?: 'pieces' | 'kg';
  priceRange?: {
    min: number;
    max: number;
  };
}

/**
 * Результат валідації основної інформації
 */
export interface BasicInfoValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fieldErrors: Record<string, string[]>;
}

/**
 * Дані для створення базового предмета
 */
export interface CreateBasicItemData {
  categoryId: string;
  priceListItemId: string;
  quantity: number;
  customName?: string;
}

/**
 * Дані для оновлення основної інформації
 */
export interface UpdateBasicInfoData {
  categoryId?: string;
  priceListItemId?: string;
  quantity?: number;
  customName?: string;
}
