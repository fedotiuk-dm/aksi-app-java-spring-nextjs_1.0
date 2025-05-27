/**
 * @fileoverview Головний сервіс координації basic-info підетапу
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/basic-info-main
 */

import { basicInfoCacheService } from './basic-info-cache.service';
import { itemNamesLoaderService } from './item-names-loader.service';
import { measurementUnitsLoaderService } from './measurement-units-loader.service';
import { serviceCategoriesLoaderService } from './service-categories-loader.service';

import type { IBasicInfoLoaderService } from '../interfaces/basic-info-loader.interface';
import type { BasicInfoOperationResult } from '../types';
import type { ItemNameOption } from '../types/basic-info-state.types';
import type { ServiceCategoryInfo, MeasurementUnitInfo } from '../types/service-categories.types';

/**
 * Головний сервіс для координації роботи з basic-info
 */
export class BasicInfoMainService implements IBasicInfoLoaderService {
  /**
   * Завантаження всіх категорій послуг з кешуванням
   */
  async loadServiceCategories(): Promise<BasicInfoOperationResult<ServiceCategoryInfo[]>> {
    // Спробуємо отримати з кешу
    const cachedCategories = basicInfoCacheService.getCachedCategories();
    if (cachedCategories) {
      return { success: true, data: cachedCategories };
    }

    // Завантажуємо з сервера
    const result = await serviceCategoriesLoaderService.loadServiceCategories();

    // Кешуємо успішний результат
    if (result.success && result.data) {
      basicInfoCacheService.setCachedCategories(result.data);
    }

    return result;
  }

  /**
   * Завантаження доступних одиниць виміру
   */
  async loadMeasurementUnits(): Promise<BasicInfoOperationResult<MeasurementUnitInfo[]>> {
    return measurementUnitsLoaderService.loadMeasurementUnits();
  }

  /**
   * Завантаження предметів з прайсу за категорією з кешуванням
   */
  async loadItemsByCategory(
    categoryId: string
  ): Promise<BasicInfoOperationResult<ItemNameOption[]>> {
    // Спробуємо отримати з кешу
    const cachedItems = basicInfoCacheService.getCachedItems(categoryId);
    if (cachedItems) {
      return { success: true, data: cachedItems };
    }

    // Завантажуємо з сервера
    const result = await itemNamesLoaderService.loadItemsByCategory(categoryId);

    // Кешуємо успішний результат
    if (result.success && result.data) {
      basicInfoCacheService.setCachedItems(categoryId, result.data);
    }

    return result;
  }

  /**
   * Пошук предметів за назвою
   */
  async searchItems(
    query: string,
    categoryId?: string
  ): Promise<BasicInfoOperationResult<ItemNameOption[]>> {
    if (!categoryId) {
      return { success: false, error: "ID категорії є обов'язковим для пошуку" };
    }

    return itemNamesLoaderService.searchItems(query, categoryId);
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    basicInfoCacheService.clearAllCache();
  }

  /**
   * Отримання статистики кешу
   */
  getCacheStats() {
    return basicInfoCacheService.getCacheStats();
  }

  /**
   * Утилітарні методи
   */
  getDefaultUnitForCategory(categoryId: string) {
    return measurementUnitsLoaderService.getDefaultUnitForCategory(categoryId);
  }

  getMeasurementUnitInfo(unit: import('../types/service-categories.types').MeasurementUnit) {
    return measurementUnitsLoaderService.getMeasurementUnitInfo(unit);
  }
}

// Експортуємо singleton екземпляр
export const basicInfoMainService = new BasicInfoMainService();
