/**
 * @fileoverview Сервіс управління прайс-листом
 * @module domain/wizard/services/stage-3-item-management/basic-info/services
 */

import {
  getPriceListItemById,
  getPriceListItemsByCategoryCode,
} from '@/domain/wizard/adapters/pricing';

import type { IPriceListManager } from '../interfaces/basic-info.interfaces';
import type {
  PriceListItem,
  BasicInfoOperationResult,
  BasicInfoFilters,
} from '../types/basic-info.types';

/**
 * Сервіс управління прайс-листом
 */
export class PriceListManagerService implements IPriceListManager {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';
  private priceListCache: Map<string, PriceListItem[]> = new Map(); // categoryCode -> items
  private itemCache: Map<string, PriceListItem> = new Map(); // itemId -> item
  private lastCacheUpdate: Map<string, number> = new Map(); // categoryCode -> timestamp
  private readonly CACHE_TIMEOUT = 5 * 60 * 1000; // 5 хвилин

  // === API операції ===

  /**
   * Завантаження прайс-листа за кодом категорії
   */
  async loadPriceListByCategory(
    categoryCode: string
  ): Promise<BasicInfoOperationResult<PriceListItem[]>> {
    try {
      const apiItems = await getPriceListItemsByCategoryCode(categoryCode);

      // Перетворюємо API типи в локальні типи wizard
      const items: PriceListItem[] = apiItems.map((apiItem) => ({
        id: apiItem.id,
        categoryId: apiItem.categoryId || '',
        categoryCode: categoryCode,
        itemNumber: apiItem.itemNumber || '',
        name: apiItem.name,
        unitOfMeasure: apiItem.unitOfMeasure || 'pieces',
        basePrice: apiItem.basePrice || 0,
        blackColorPrice: apiItem.blackColorPrice,
        lightColorPrice: apiItem.lightColorPrice,
        active: apiItem.active ?? true,
      }));

      // Оновлюємо кеш
      this.priceListCache.set(categoryCode, items);
      this.lastCacheUpdate.set(categoryCode, Date.now());

      // Також кешуємо окремі елементи
      items.forEach((item) => this.itemCache.set(item.id, item));

      return {
        success: true,
        data: items,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка завантаження прайс-листа для категорії ${categoryCode}: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Отримання елемента прайс-листа за ID
   */
  async getPriceListItemById(itemId: string): Promise<BasicInfoOperationResult<PriceListItem>> {
    try {
      // Спочатку перевіряємо кеш
      const cachedItem = this.itemCache.get(itemId);
      if (cachedItem) {
        return {
          success: true,
          data: cachedItem,
        };
      }

      // Завантажуємо з API
      const apiItem = await getPriceListItemById(itemId);

      const item: PriceListItem = {
        id: apiItem.id,
        categoryId: apiItem.categoryId || '',
        categoryCode: '', // Буде заповнено пізніше
        itemNumber: apiItem.itemNumber || '',
        name: apiItem.name,
        unitOfMeasure: apiItem.unitOfMeasure || 'pieces',
        basePrice: apiItem.basePrice || 0,
        blackColorPrice: apiItem.blackColorPrice,
        lightColorPrice: apiItem.lightColorPrice,
        active: apiItem.active ?? true,
      };

      // Оновлюємо кеш
      this.itemCache.set(itemId, item);

      return {
        success: true,
        data: item,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка отримання елемента прайс-листа ${itemId}: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  // === Локальні операції ===

  /**
   * Отримання прайс-листа з кешу
   */
  getCachedPriceList(categoryCode: string): PriceListItem[] {
    return this.priceListCache.get(categoryCode) || [];
  }

  /**
   * Пошук елемента прайс-листа за назвою
   */
  findPriceListItem(categoryCode: string, itemName: string): PriceListItem | null {
    const items = this.getCachedPriceList(categoryCode);
    return items.find((item) => item.name.toLowerCase().includes(itemName.toLowerCase())) || null;
  }

  /**
   * Пошук елементів прайс-листа за фільтрами
   */
  searchPriceListItems(categoryCode: string, filters: BasicInfoFilters): PriceListItem[] {
    let items = this.getCachedPriceList(categoryCode);

    if (filters.searchTerm) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
          item.itemNumber.toLowerCase().includes(filters.searchTerm!.toLowerCase())
      );
    }

    if (filters.unitOfMeasure) {
      items = items.filter((item) => item.unitOfMeasure === filters.unitOfMeasure);
    }

    if (filters.priceRange) {
      items = items.filter(
        (item) =>
          item.basePrice >= filters.priceRange!.min && item.basePrice <= filters.priceRange!.max
      );
    }

    return items;
  }

  // === Утиліти ===

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.priceListCache.clear();
    this.itemCache.clear();
    this.lastCacheUpdate.clear();
  }

  /**
   * Перевірка валідності кешу для категорії
   */
  private isCacheValid(categoryCode: string): boolean {
    const lastUpdate = this.lastCacheUpdate.get(categoryCode);
    return lastUpdate ? Date.now() - lastUpdate < this.CACHE_TIMEOUT : false;
  }

  /**
   * Отримання активних елементів прайс-листа
   */
  getActivePriceListItems(categoryCode: string): PriceListItem[] {
    return this.getCachedPriceList(categoryCode).filter((item) => item.active);
  }

  /**
   * Перевірка існування елемента в кеші
   */
  itemExists(itemId: string): boolean {
    return this.itemCache.has(itemId);
  }

  /**
   * Отримання кількості елементів в кеші для категорії
   */
  getCacheSize(categoryCode: string): number {
    return this.getCachedPriceList(categoryCode).length;
  }

  /**
   * Отримання всіх закешованих категорій
   */
  getCachedCategories(): string[] {
    return Array.from(this.priceListCache.keys());
  }

  /**
   * Пошук елемента за номером
   */
  findItemByNumber(categoryCode: string, itemNumber: string): PriceListItem | null {
    const items = this.getCachedPriceList(categoryCode);
    return items.find((item) => item.itemNumber === itemNumber) || null;
  }

  /**
   * Отримання діапазону цін для категорії
   */
  getPriceRange(categoryCode: string): { min: number; max: number } | null {
    const items = this.getCachedPriceList(categoryCode);
    if (items.length === 0) return null;

    const prices = items.map((item) => item.basePrice);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
}

// Експорт екземпляра сервісу (Singleton)
export const priceListManagerService = new PriceListManagerService();
