/**
 * @fileoverview Сервіс управління кешем для basic-info
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/basic-info-cache
 */

import type { ItemNameOption } from '../types/basic-info-state.types';
import type { ServiceCategoryInfo } from '../types/service-categories.types';

/**
 * Константи для кешування
 */
const CACHE_DURATION = 10 * 60 * 1000; // 10 хвилин

/**
 * Сервіс для управління кешем basic-info
 */
export class BasicInfoCacheService {
  private categoriesCache: ServiceCategoryInfo[] = [];
  private itemsCache: Map<string, ItemNameOption[]> = new Map();
  private lastCategoriesLoad = 0;
  private lastItemsLoad = new Map<string, number>();

  /**
   * Методи для роботи з кешем категорій
   */
  getCachedCategories(): ServiceCategoryInfo[] | null {
    return this.isCategoriesCacheValid() ? this.categoriesCache : null;
  }

  setCachedCategories(categories: ServiceCategoryInfo[]): void {
    this.categoriesCache = categories;
    this.lastCategoriesLoad = Date.now();
  }

  isCategoriesCacheValid(): boolean {
    return this.categoriesCache.length > 0 && Date.now() - this.lastCategoriesLoad < CACHE_DURATION;
  }

  /**
   * Методи для роботи з кешем предметів
   */
  getCachedItems(categoryId: string): ItemNameOption[] | null {
    return this.isItemsCacheValid(categoryId) ? this.itemsCache.get(categoryId) || null : null;
  }

  setCachedItems(categoryId: string, items: ItemNameOption[]): void {
    this.itemsCache.set(categoryId, items);
    this.lastItemsLoad.set(categoryId, Date.now());
  }

  isItemsCacheValid(categoryId: string): boolean {
    const lastLoad = this.lastItemsLoad.get(categoryId) || 0;
    return this.itemsCache.has(categoryId) && Date.now() - lastLoad < CACHE_DURATION;
  }

  /**
   * Очищення кешу
   */
  clearAllCache(): void {
    this.categoriesCache = [];
    this.itemsCache.clear();
    this.lastCategoriesLoad = 0;
    this.lastItemsLoad.clear();
  }

  clearCategoriesCache(): void {
    this.categoriesCache = [];
    this.lastCategoriesLoad = 0;
  }

  clearItemsCache(categoryId?: string): void {
    if (categoryId) {
      this.itemsCache.delete(categoryId);
      this.lastItemsLoad.delete(categoryId);
    } else {
      this.itemsCache.clear();
      this.lastItemsLoad.clear();
    }
  }

  /**
   * Інформація про стан кешу
   */
  getCacheStats(): {
    categoriesCount: number;
    itemsCacheSize: number;
    categoriesAge: number;
    oldestItemsAge: number;
  } {
    const categoriesAge = this.lastCategoriesLoad > 0 ? Date.now() - this.lastCategoriesLoad : -1;

    let oldestItemsAge = -1;
    for (const [, timestamp] of this.lastItemsLoad) {
      const age = Date.now() - timestamp;
      if (oldestItemsAge === -1 || age > oldestItemsAge) {
        oldestItemsAge = age;
      }
    }

    return {
      categoriesCount: this.categoriesCache.length,
      itemsCacheSize: this.itemsCache.size,
      categoriesAge,
      oldestItemsAge,
    };
  }
}

// Експортуємо singleton екземпляр
export const basicInfoCacheService = new BasicInfoCacheService();
