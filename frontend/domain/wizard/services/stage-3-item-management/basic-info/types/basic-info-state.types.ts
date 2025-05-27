/**
 * @fileoverview Типи стану для підетапу 2.1 - основна інформація
 * @module domain/wizard/services/stage-3-item-management/basic-info/types/basic-info-state
 */

import type { ServiceCategory, MeasurementUnit } from './service-categories.types';

/**
 * Стан підетапу основної інформації
 */
export interface BasicInfoState {
  // Вибрана категорія послуги
  selectedCategory?: ServiceCategory;

  // Найменування виробу
  itemName: string;

  // Одиниця виміру та кількість
  measurementUnit: MeasurementUnit;
  quantity: number;

  // Стан завантаження
  isLoading: boolean;
  error?: string;

  // Доступні опції
  availableItems: ItemNameOption[];

  // Валідація
  validationErrors: Record<string, string>;
  isValid: boolean;
}

/**
 * Опція найменування предмета з прайсу
 */
export interface ItemNameOption {
  id: string;
  name: string;
  basePrice: number;
  category: ServiceCategory;
  defaultUnit: MeasurementUnit;
}

/**
 * Дані основної інформації для збереження
 */
export interface BasicInfoData {
  category: ServiceCategory;
  itemName: string;
  measurementUnit: MeasurementUnit;
  quantity: number;
}
