/**
 * @fileoverview Основний інтерфейс basic-info сервісу
 * @module domain/wizard/services/stage-3-item-management/basic-info/interfaces/basic-info-main
 */

import type { BasicInfoOperationResult } from '../types/basic-info-operation-result.types';
import type { BasicInfoState, BasicInfoData } from '../types/basic-info-state.types';
import type { ServiceCategory, MeasurementUnit } from '../types/service-categories.types';

/**
 * Основний інтерфейс basic-info сервісу
 */
export interface IBasicInfoService {
  /**
   * Отримання поточного стану
   */
  getState(): BasicInfoState;

  /**
   * Ініціалізація підетапу
   */
  initialize(): Promise<BasicInfoOperationResult<void>>;

  /**
   * Вибір категорії послуги
   */
  selectCategory(category: ServiceCategory): Promise<BasicInfoOperationResult<void>>;

  /**
   * Встановлення найменування предмета
   */
  setItemName(itemName: string): BasicInfoOperationResult<void>;

  /**
   * Встановлення одиниці виміру
   */
  setMeasurementUnit(unit: MeasurementUnit): BasicInfoOperationResult<void>;

  /**
   * Встановлення кількості
   */
  setQuantity(quantity: number): BasicInfoOperationResult<void>;

  /**
   * Валідація поточних даних
   */
  validateCurrentData(): BasicInfoOperationResult<void>;

  /**
   * Перевірка можливості переходу до наступного кроку
   */
  canProceedToNext(): boolean;

  /**
   * Отримання даних для збереження
   */
  getDataForSave(): BasicInfoOperationResult<BasicInfoData>;

  /**
   * Скидання стану
   */
  reset(): void;
}
