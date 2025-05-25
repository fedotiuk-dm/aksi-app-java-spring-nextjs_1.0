/**
 * @fileoverview Сервіс прайс-листа
 * @module domain/wizard/services/pricing/price-list
 */

import {
  getPriceListItemById as getPriceListItemByIdAdapter,
  getAllServiceCategories as getServiceCategoriesAdapter,
} from '../../adapters/pricing';
import { OperationResultFactory } from '../interfaces';

import type {
  IPriceListService,
  PriceListItemDomain,
  ServiceCategoryDomain,
} from './pricing.interfaces';
import type { OperationResult } from '../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    FETCH_FAILED: 'Помилка отримання прайс-листа',
    SEARCH_FAILED: 'Помилка пошуку в прайс-листі',
    ITEM_NOT_FOUND: 'Елемент прайс-листа не знайдено',
    CATEGORY_NOT_FOUND: 'Категорію не знайдено',
    CATEGORIES_FETCH_FAILED: 'Помилка отримання категорій',
    EMPTY_QUERY: 'Запит не може бути порожнім',
    UNKNOWN: 'Невідома помилка',
  },
  CACHE_TTL: 5 * 60 * 1000, // 5 хвилин
} as const;

/**
 * Сервіс прайс-листа
 * Відповідальність: управління каталогом послуг та їх цінами
 */
export class PriceListService implements IPriceListService {
  public readonly name = 'PriceListService';
  public readonly version = '1.0.0';

  private priceListCache: Map<string, { data: PriceListItemDomain[]; timestamp: number }> =
    new Map();
  private categoriesCache: { data: ServiceCategoryDomain[]; timestamp: number } | null = null;

  /**
   * Отримання елементів прайс-листа
   */
  async getPriceListItems(categoryId?: string): Promise<OperationResult<PriceListItemDomain[]>> {
    try {
      const cacheKey = categoryId || 'all';
      const cached = this.priceListCache.get(cacheKey);

      // Перевірка кешу
      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // TODO: Реалізувати адаптер getPriceListItems
      // Тимчасова заглушка
      const apiItems: any[] = [];
      const domainItems = apiItems.map(this.convertToDomainPriceItem);

      // Оновлення кешу
      this.priceListCache.set(cacheKey, {
        data: domainItems,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(domainItems);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання елемента прайс-листа за ID
   */
  async getPriceListItemById(id: string): Promise<OperationResult<PriceListItemDomain | null>> {
    try {
      const apiItem = await getPriceListItemByIdAdapter(id);

      if (!apiItem) {
        return OperationResultFactory.success(null);
      }

      const domainItem = this.convertToDomainPriceItem(apiItem);
      return OperationResultFactory.success(domainItem);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.ITEM_NOT_FOUND}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Пошук елементів прайс-листа
   */
  async searchPriceListItems(query: string): Promise<OperationResult<PriceListItemDomain[]>> {
    if (!query.trim()) {
      return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.EMPTY_QUERY);
    }

    try {
      // TODO: Реалізувати адаптер searchPriceListItems
      // Тимчасова заглушка
      const apiItems: any[] = [];
      const domainItems = apiItems.map(this.convertToDomainPriceItem);

      return OperationResultFactory.success(domainItems);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання категорій послуг
   */
  async getServiceCategories(): Promise<OperationResult<ServiceCategoryDomain[]>> {
    try {
      // Перевірка кешу
      if (
        this.categoriesCache &&
        Date.now() - this.categoriesCache.timestamp < CONSTANTS.CACHE_TTL
      ) {
        return OperationResultFactory.success(this.categoriesCache.data);
      }

      // Отримання з адаптера
      const apiCategories = await getServiceCategoriesAdapter();
      const domainCategories = apiCategories.map(this.convertToDomainCategory);

      // Оновлення кешу
      this.categoriesCache = {
        data: domainCategories,
        timestamp: Date.now(),
      };

      return OperationResultFactory.success(domainCategories);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CATEGORIES_FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання категорії за ID
   */
  async getCategoryById(id: string): Promise<OperationResult<ServiceCategoryDomain | null>> {
    try {
      // TODO: Реалізувати адаптер getCategoryById
      // Тимчасова заглушка
      const apiCategory: any = null;

      if (!apiCategory) {
        return OperationResultFactory.success(null);
      }

      const domainCategory = this.convertToDomainCategory(apiCategory);
      return OperationResultFactory.success(domainCategory);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CATEGORY_NOT_FOUND}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.priceListCache.clear();
    this.categoriesCache = null;
  }

  /**
   * Отримання елементів за категорією з кешу
   */
  getCachedItemsByCategory(categoryId: string): PriceListItemDomain[] | null {
    const cached = this.priceListCache.get(categoryId);
    if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  /**
   * Конвертація API елемента в доменний тип
   */
  private convertToDomainPriceItem(apiItem: any): PriceListItemDomain {
    return {
      id: apiItem.id,
      serviceId: apiItem.serviceId,
      serviceName: apiItem.serviceName,
      categoryId: apiItem.categoryId,
      categoryName: apiItem.categoryName,
      basePrice: apiItem.basePrice,
      unitOfMeasure: apiItem.unitOfMeasure,
      description: apiItem.description,
      isActive: apiItem.isActive,
      createdAt: new Date(apiItem.createdAt),
      updatedAt: new Date(apiItem.updatedAt),
    };
  }

  /**
   * Конвертація API категорії в доменний тип
   */
  private convertToDomainCategory(apiCategory: any): ServiceCategoryDomain {
    return {
      id: apiCategory.id,
      name: apiCategory.name,
      description: apiCategory.description,
      parentId: apiCategory.parentId,
      isActive: apiCategory.isActive,
      sortOrder: apiCategory.sortOrder,
      createdAt: new Date(apiCategory.createdAt),
      updatedAt: new Date(apiCategory.updatedAt),
    };
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const priceListService = new PriceListService();
