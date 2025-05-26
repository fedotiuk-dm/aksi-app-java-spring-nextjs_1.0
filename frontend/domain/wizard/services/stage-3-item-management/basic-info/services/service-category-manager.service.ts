/**
 * @fileoverview Сервіс управління категоріями послуг
 * @module domain/wizard/services/stage-3-item-management/basic-info/services
 */

import {
  getAllServiceCategories,
  getActiveServiceCategories,
  getServiceCategoryById,
  getServiceCategoryByCode,
} from '@/domain/wizard/adapters/pricing';

import type { IServiceCategoryManager } from '../interfaces/basic-info.interfaces';
import type {
  ServiceCategory,
  BasicInfoOperationResult,
  BasicInfoFilters,
} from '../types/basic-info.types';

/**
 * Сервіс управління категоріями послуг
 */
export class ServiceCategoryManagerService implements IServiceCategoryManager {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';
  private categoriesCache: Map<string, ServiceCategory> = new Map();
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TIMEOUT = 5 * 60 * 1000; // 5 хвилин

  // === API операції ===

  /**
   * Завантаження всіх категорій
   */
  async loadCategories(): Promise<BasicInfoOperationResult<ServiceCategory[]>> {
    try {
      const apiCategories = await getAllServiceCategories();

      // Перетворюємо API типи в локальні типи wizard
      const categories: ServiceCategory[] = apiCategories.map((apiCat) => ({
        id: apiCat.id,
        code: apiCat.code,
        name: apiCat.name,
        description: apiCat.description,
        active: apiCat.active,
        unitOfMeasure: undefined, // Буде заповнено пізніше
        standardDeliveryDays: undefined, // Буде заповнено пізніше
      }));

      // Оновлюємо кеш
      this.categoriesCache.clear();
      categories.forEach((cat) => this.categoriesCache.set(cat.id, cat));
      this.lastCacheUpdate = Date.now();

      return {
        success: true,
        data: categories,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка завантаження категорій: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Отримання категорії за ID
   */
  async getCategoryById(id: string): Promise<BasicInfoOperationResult<ServiceCategory>> {
    try {
      // Спочатку перевіряємо кеш
      const cachedCategory = this.categoriesCache.get(id);
      if (cachedCategory && this.isCacheValid()) {
        return {
          success: true,
          data: cachedCategory,
        };
      }

      // Завантажуємо з API
      const apiCategory = await getServiceCategoryById(id);

      const category: ServiceCategory = {
        id: apiCategory.id,
        code: apiCategory.code,
        name: apiCategory.name,
        description: apiCategory.description,
        active: apiCategory.active,
        unitOfMeasure: undefined,
        standardDeliveryDays: undefined,
      };

      // Оновлюємо кеш
      this.categoriesCache.set(id, category);

      return {
        success: true,
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка отримання категорії ${id}: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Отримання категорії за кодом
   */
  async getCategoryByCode(code: string): Promise<BasicInfoOperationResult<ServiceCategory>> {
    try {
      // Перевіряємо кеш за кодом
      const cachedCategory = Array.from(this.categoriesCache.values()).find(
        (cat) => cat.code === code
      );

      if (cachedCategory && this.isCacheValid()) {
        return {
          success: true,
          data: cachedCategory,
        };
      }

      // Завантажуємо з API
      const apiCategory = await getServiceCategoryByCode(code);

      const category: ServiceCategory = {
        id: apiCategory.id,
        code: apiCategory.code,
        name: apiCategory.name,
        description: apiCategory.description,
        active: apiCategory.active,
        unitOfMeasure: undefined,
        standardDeliveryDays: undefined,
      };

      // Оновлюємо кеш
      this.categoriesCache.set(category.id, category);

      return {
        success: true,
        data: category,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка отримання категорії з кодом ${code}: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  // === Локальні операції ===

  /**
   * Отримання всіх категорій з кешу
   */
  getCachedCategories(): ServiceCategory[] {
    return Array.from(this.categoriesCache.values());
  }

  /**
   * Пошук категорії за назвою
   */
  findCategoryByName(name: string): ServiceCategory | null {
    const categories = this.getCachedCategories();
    return categories.find((cat) => cat.name.toLowerCase().includes(name.toLowerCase())) || null;
  }

  /**
   * Пошук категорій за фільтрами
   */
  searchCategories(filters: BasicInfoFilters): ServiceCategory[] {
    let categories = this.getCachedCategories();

    if (filters.categoryCode) {
      const categoryCode = filters.categoryCode;
      categories = categories.filter((cat) =>
        cat.code.toLowerCase().includes(categoryCode.toLowerCase())
      );
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm;
      categories = categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.unitOfMeasure) {
      categories = categories.filter((cat) => cat.unitOfMeasure === filters.unitOfMeasure);
    }

    return categories;
  }

  // === Утиліти ===

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.categoriesCache.clear();
    this.lastCacheUpdate = 0;
  }

  /**
   * Перевірка валідності кешу
   */
  private isCacheValid(): boolean {
    return Date.now() - this.lastCacheUpdate < this.CACHE_TIMEOUT;
  }

  /**
   * Отримання активних категорій
   */
  getActiveCategories(): ServiceCategory[] {
    return this.getCachedCategories().filter((cat) => cat.active);
  }

  /**
   * Перевірка існування категорії
   */
  categoryExists(id: string): boolean {
    return this.categoriesCache.has(id);
  }

  /**
   * Отримання кількості категорій в кеші
   */
  getCacheSize(): number {
    return this.categoriesCache.size;
  }
}

// Експорт екземпляра сервісу (Singleton)
export const serviceCategoryManagerService = new ServiceCategoryManagerService();
