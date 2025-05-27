/**
 * @fileoverview Інтерфейс для завантаження даних основної інформації
 * @module domain/wizard/services/stage-3-item-management/basic-info/interfaces/basic-info-loader
 */

import type { BasicInfoOperationResult } from '../types/basic-info-operation-result.types';
import type { ItemNameOption } from '../types/basic-info-state.types';
import type { ServiceCategoryInfo, MeasurementUnitInfo } from '../types/service-categories.types';

/**
 * Інтерфейс для завантаження даних підетапу 2.1
 */
export interface IBasicInfoLoaderService {
  /**
   * Завантаження всіх категорій послуг
   */
  loadServiceCategories(): Promise<BasicInfoOperationResult<ServiceCategoryInfo[]>>;

  /**
   * Завантаження доступних одиниць виміру
   */
  loadMeasurementUnits(): Promise<BasicInfoOperationResult<MeasurementUnitInfo[]>>;

  /**
   * Завантаження предметів з прайсу за категорією
   */
  loadItemsByCategory(categoryId: string): Promise<BasicInfoOperationResult<ItemNameOption[]>>;

  /**
   * Пошук предметів за назвою
   */
  searchItems(
    query: string,
    categoryId?: string
  ): Promise<BasicInfoOperationResult<ItemNameOption[]>>;

  /**
   * Очищення кешу
   */
  clearCache(): void;
}
