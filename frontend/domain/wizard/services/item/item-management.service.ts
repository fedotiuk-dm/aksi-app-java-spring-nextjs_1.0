/**
 * @fileoverview Сервіс управління предметами
 * @module domain/wizard/services/item/item-management
 */

import { OperationResultFactory } from '../interfaces';

import type {
  ItemDomain,
  ItemSearchDomainParams,
  ItemSearchDomainResult,
  ItemStatus,
  ItemStatsDomain,
} from './item-domain.types';
import type { OperationResult } from '../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    SEARCH_FAILED: 'Помилка пошуку предметів',
    ITEM_NOT_FOUND: 'Предмет не знайдено',
    STATUS_UPDATE_FAILED: 'Помилка оновлення статусу',
    INVALID_STATUS_TRANSITION: 'Некоректний перехід статусу',
    STATS_FAILED: 'Помилка отримання статистики',
    UNKNOWN: 'Невідома помилка',
    ITEM_ID_REQUIRED: "ID предмета є обов'язковим",
  },
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CACHE_TTL: 3 * 60 * 1000, // 3 хвилини
  STATUS_TRANSITIONS: {
    PENDING: ['IN_PROCESS'],
    IN_PROCESS: ['READY'],
    READY: ['DELIVERED'],
    DELIVERED: [],
  } as Record<ItemStatus, ItemStatus[]>,
} as const;

/**
 * Інтерфейс сервісу управління предметами
 */
export interface IItemManagementService {
  searchItems(params: ItemSearchDomainParams): Promise<OperationResult<ItemSearchDomainResult>>;
  getItemById(id: string): Promise<OperationResult<ItemDomain | null>>;
  getItemsByOrder(orderId: string): Promise<OperationResult<ItemDomain[]>>;
  updateItemStatus(id: string, status: ItemStatus): Promise<OperationResult<ItemDomain>>;
  deleteItem(id: string): Promise<OperationResult<boolean>>;
  getItemStats(orderId?: string): Promise<OperationResult<ItemStatsDomain>>;
  getAvailableStatusTransitions(currentStatus: ItemStatus): ItemStatus[];
  canUpdateStatus(currentStatus: ItemStatus, newStatus: ItemStatus): boolean;
  clearCache(): void;
}

/**
 * Сервіс управління предметами
 * Відповідальність: пошук, управління статусами, статистика предметів
 */
export class ItemManagementService implements IItemManagementService {
  public readonly name = 'ItemManagementService';
  public readonly version = '1.0.0';

  private searchCache: Map<string, { data: ItemSearchDomainResult; timestamp: number }> = new Map();
  private itemCache: Map<string, { data: ItemDomain; timestamp: number }> = new Map();

  /**
   * Пошук предметів з фільтрами
   */
  async searchItems(
    params: ItemSearchDomainParams
  ): Promise<OperationResult<ItemSearchDomainResult>> {
    try {
      const page = params.page || 0;
      const size = Math.min(params.size || CONSTANTS.DEFAULT_PAGE_SIZE, CONSTANTS.MAX_PAGE_SIZE);

      // Створення ключа кешу
      const cacheKey = this.createSearchCacheKey(params);
      const cached = this.searchCache.get(cacheKey);

      // Перевірка кешу
      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // Адаптер викликається в хуках домену
      // Повертаємо структуру для демонстрації
      const searchResult: ItemSearchDomainResult = {
        items: [],
        total: 0,
        page,
        size,
        hasMore: false,
      };

      // Оновлення кешу
      this.searchCache.set(cacheKey, {
        data: searchResult,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(searchResult);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання предмета за ID
   */
  async getItemById(id: string): Promise<OperationResult<ItemDomain | null>> {
    try {
      if (!id?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.ITEM_ID_REQUIRED);
      }

      // Перевірка кешу
      const cached = this.itemCache.get(id);
      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // Адаптер викликається в хуках домену
      // Повертаємо null для демонстрації
      const apiItem: any = null;

      if (!apiItem) {
        return OperationResultFactory.success(null);
      }

      const domainItem = this.convertToDomainItem(apiItem);

      // Оновлення кешу
      this.itemCache.set(id, {
        data: domainItem,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(domainItem);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.ITEM_NOT_FOUND}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання предметів замовлення
   */
  async getItemsByOrder(orderId: string): Promise<OperationResult<ItemDomain[]>> {
    try {
      if (!orderId?.trim()) {
        return OperationResultFactory.error("ID замовлення є обов'язковим");
      }

      // Використання загального пошуку з фільтром по замовленню
      const searchResult = await this.searchItems({
        orderId,
        page: 0,
        size: CONSTANTS.MAX_PAGE_SIZE,
      });

      if (!searchResult.success || !searchResult.data) {
        return OperationResultFactory.error(
          searchResult.error || CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED
        );
      }

      return OperationResultFactory.success(searchResult.data.items);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Оновлення статусу предмета
   */
  async updateItemStatus(id: string, status: ItemStatus): Promise<OperationResult<ItemDomain>> {
    try {
      if (!id?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.ITEM_ID_REQUIRED);
      }

      // Отримання поточного предмета
      const currentItemResult = await this.getItemById(id);
      if (!currentItemResult.success || !currentItemResult.data) {
        return OperationResultFactory.error(
          currentItemResult.error || CONSTANTS.ERROR_MESSAGES.ITEM_NOT_FOUND
        );
      }

      const currentItem = currentItemResult.data;

      // Валідація переходу статусу
      if (!this.canUpdateStatus(currentItem.status, status)) {
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.INVALID_STATUS_TRANSITION}: ${currentItem.status} -> ${status}`
        );
      }

      // Створення оновленого предмета
      // Адаптер викликається в хуках домену для збереження
      const updatedItem: ItemDomain = {
        ...currentItem,
        status,
        updatedAt: new Date(),
      };

      // Оновлення кешу
      this.itemCache.set(id, {
        data: updatedItem,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(updatedItem);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.STATUS_UPDATE_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Видалення предмета
   */
  async deleteItem(id: string): Promise<OperationResult<boolean>> {
    try {
      if (!id?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.ITEM_ID_REQUIRED);
      }

      // Адаптер викликається в хуках домену для видалення
      // Повертаємо успіх для демонстрації
      const success = true;

      if (success) {
        // Видалення з кешу
        this.itemCache.delete(id);
        // Очищення кешу пошуку
        this.searchCache.clear();
      }

      return OperationResultFactory.success(success);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка видалення предмета: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання статистики предметів
   */
  async getItemStats(orderId?: string): Promise<OperationResult<ItemStatsDomain>> {
    try {
      // Адаптер викликається в хуках домену
      // Повертаємо структуру для демонстрації
      const stats: ItemStatsDomain = {
        totalItems: 0,
        itemsByStatus: {
          PENDING: 0,
          IN_PROCESS: 0,
          READY: 0,
          DELIVERED: 0,
        },
        itemsByCategory: {},
        itemsByMaterial: {
          COTTON: 0,
          WOOL: 0,
          SILK: 0,
          SYNTHETIC: 0,
          LEATHER: 0,
          SUEDE: 0,
          NUBUCK: 0,
          FUR: 0,
          DOWN: 0,
          MIXED: 0,
        },
        averageProcessingTime: 0,
        mostCommonStains: [],
        mostCommonDefects: [],
      };

      return OperationResultFactory.success(stats);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.STATS_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання доступних статусів для переходу
   */
  getAvailableStatusTransitions(currentStatus: ItemStatus): ItemStatus[] {
    return CONSTANTS.STATUS_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Перевірка можливості оновлення статусу
   */
  canUpdateStatus(currentStatus: ItemStatus, newStatus: ItemStatus): boolean {
    const allowedTransitions = this.getAvailableStatusTransitions(currentStatus);
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.searchCache.clear();
    this.itemCache.clear();
  }

  /**
   * Створення ключа кешу для пошуку
   */
  private createSearchCacheKey(params: ItemSearchDomainParams): string {
    const keyParts = [
      params.orderId || '',
      params.serviceId || '',
      params.categoryId || '',
      params.status || '',
      params.material || '',
      params.hasStains?.toString() || '',
      params.hasDefects?.toString() || '',
      params.page || 0,
      params.size || CONSTANTS.DEFAULT_PAGE_SIZE,
    ];

    return keyParts.join('|');
  }

  /**
   * Конвертація API предмета в доменний тип
   */
  private convertToDomainItem(apiItem: any): ItemDomain {
    return {
      id: apiItem.id,
      orderId: apiItem.orderId,
      serviceId: apiItem.serviceId,
      serviceName: apiItem.serviceName,
      categoryId: apiItem.categoryId,
      categoryName: apiItem.categoryName,
      quantity: apiItem.quantity,
      unitOfMeasure: apiItem.unitOfMeasure,
      basePrice: apiItem.basePrice,
      modifiers: apiItem.modifiers || [],
      totalPrice: apiItem.totalPrice,
      characteristics: apiItem.characteristics || {},
      defectsAndRisks: apiItem.defectsAndRisks || {
        stains: [],
        defects: [],
        risks: [],
        hasNoGuarantee: false,
      },
      photos: apiItem.photos || [],
      notes: apiItem.notes,
      status: apiItem.status,
      createdAt: new Date(apiItem.createdAt),
      updatedAt: new Date(apiItem.updatedAt),
    };
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const itemManagementService = new ItemManagementService();
