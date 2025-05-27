/**
 * @fileoverview Сервіс для керування прайс-листом
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/price-list-manager
 */

import { ServiceCategoryManagerService } from './service-category-manager.service';

import type {
  PriceListItem,
  BasicInfoOperationResult,
  BasicInfoFilters
} from '../types/basic-info.types';

import { PriceListService } from '@/domain/wizard/adapters/pricing/api';

const UNKNOWN_ERROR = 'Невідома помилка при роботі з прайс-листом';

/**
 * Сервіс для керування прайс-листом
 */
export class PriceListManagerService {
  private priceListAdapter: PriceListService;
  private categoryManager: ServiceCategoryManagerService;

  // Кеш прайс-листів за категоріями
  private priceListCache: Map<string, { items: PriceListItem[], timestamp: number }> = new Map();
  private cacheTimeoutMs = 5 * 60 * 1000; // 5 хвилин

  constructor(categoryManager: ServiceCategoryManagerService) {
    this.priceListAdapter = new PriceListService();
    this.categoryManager = categoryManager;
  }

  /**
   * Отримання прайс-листа для категорії
   * @param categoryId Ідентифікатор категорії
   * @param forceRefresh Примусове оновлення даних з сервера
   */
  async getPriceListByCategory(
    categoryId: string,
    forceRefresh = false
  ): Promise<BasicInfoOperationResult<PriceListItem[]>> {
    try {
      // Перевіряємо кеш, якщо не потрібне оновлення
      const cacheEntry = this.priceListCache.get(categoryId);
      const now = Date.now();

      if (cacheEntry && !forceRefresh && (now - cacheEntry.timestamp < this.cacheTimeoutMs)) {
        return {
          success: true,
          data: cacheEntry.items
        };
      }

      // Отримуємо категорію для коду
      const categoryResult = await this.categoryManager.getCategoryById(categoryId);

      if (!categoryResult.success || !categoryResult.data) {
        return {
          success: false,
          error: `Не вдалося отримати інформацію про категорію: ${categoryResult.error}`
        };
      }

      // Отримуємо прайс-лист через адаптер
      const result = await this.priceListAdapter.getPriceListByCategory(categoryId);

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося отримати прайс-лист: ${result.error}`
        };
      }

      // Додаємо додаткові властивості для wizard
      const enhancedItems = result.data.map(item => ({
        ...item,
        categoryCode: categoryResult.data?.code
      }));

      // Зберігаємо в кеші
      this.priceListCache.set(categoryId, {
        items: enhancedItems,
        timestamp: now
      });

      return {
        success: true,
        data: enhancedItems
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання елемента прайс-листа за ідентифікатором
   * @param itemId Ідентифікатор елемента прайс-листа
   */
  async getPriceListItem(itemId: string): Promise<BasicInfoOperationResult<PriceListItem>> {
    try {
      // Спочатку шукаємо в кеші
      for (const [, cacheEntry] of this.priceListCache) {
        const item = cacheEntry.items.find(item => item.id === itemId);
        if (item) {
          return {
            success: true,
            data: item
          };
        }
      }

      // Якщо не знайдено в кеші, звертаємося до API
      const result = await this.priceListAdapter.getPriceListItem(itemId);

      if (!result.success || !result.data) {
        return {
          success: false,
          error: `Не вдалося отримати елемент прайс-листа: ${result.error}`
        };
      }

      // Додаємо додаткові властивості (categoryCode)
      const categoryResult = await this.categoryManager.getCategoryById(result.data.categoryId);
      const categoryCode = categoryResult.success ? categoryResult.data?.code : undefined;

      const enhancedItem: PriceListItem = {
        ...result.data,
        categoryCode
      };

      return {
        success: true,
        data: enhancedItem
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Пошук елементів прайс-листа за фільтрами
   * @param filters Фільтри для пошуку
   */
  async searchPriceList(filters: BasicInfoFilters): Promise<BasicInfoOperationResult<PriceListItem[]>> {
    try {
      // Підготовка параметрів пошуку для адаптера
      const searchParams: any = {
        searchTerm: filters.searchTerm || '',
        categoryCode: filters.categoryCode
      };

      if (filters.priceRange) {
        searchParams.minPrice = filters.priceRange.min;
        searchParams.maxPrice = filters.priceRange.max;
      }

      // Виконуємо пошук через адаптер
      const result = await this.priceListAdapter.searchPriceList(searchParams);

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося виконати пошук: ${result.error}`
        };
      }

      // Додаємо додаткові властивості для wizard
      const enhancedItems = await Promise.all(result.data.map(async item => {
        // Для кожного елемента отримуємо інформацію про категорію
        const categoryResult = await this.categoryManager.getCategoryById(item.categoryId);
        const categoryCode = categoryResult.success ? categoryResult.data?.code : undefined;

        return {
          ...item,
          categoryCode
        };
      }));

      return {
        success: true,
        data: enhancedItems
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Очищення кешу прайс-листів
   * @param categoryId Ідентифікатор категорії (якщо не вказано, очищається весь кеш)
   */
  clearCache(categoryId?: string): void {
    if (categoryId) {
      this.priceListCache.delete(categoryId);
    } else {
      this.priceListCache.clear();
    }
  }
}

// Створюємо екземпляр з залежністю від категорій
import { serviceCategoryManagerService } from './service-category-manager.service';
export const priceListManagerService = new PriceListManagerService(serviceCategoryManagerService);
