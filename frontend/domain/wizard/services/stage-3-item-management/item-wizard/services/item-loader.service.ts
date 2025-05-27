/**
 * @fileoverview Сервіс завантаження предметів замовлення з кешуванням
 * @module domain/wizard/services/stage-3-item-management/item-wizard/services/item-loader
 */

import { getOrderItems, getOrderItemById } from '../../../../adapters/order/api/order-item.api';
import {
  wizardOrderItemSchema,
  wizardOrderItemDetailedSchema,
  type WizardOrderItem,
  type WizardOrderItemDetailed,
} from '../../../../schemas';
import { ITEM_LOADER_ERRORS } from '../constants/item-loader.errors';

import type { IItemLoaderService } from '../interfaces/item-loader.interface';
import type { ItemOperationResult } from '../types/item-operation-result.types';
import type { ItemLoaderServiceState } from '../types/item-wizard-state.types';

/**
 * Константи для кешування
 */
const CACHE_DURATION = 5 * 60 * 1000; // 5 хвилин

/**
 * Сервіс для завантаження предметів замовлення з кешуванням
 */
export class ItemLoaderService implements IItemLoaderService {
  private state: ItemLoaderServiceState = {
    items: [],
    loading: false,
    lastLoadTime: 0,
    orderId: undefined,
  };

  /**
   * Завантаження всіх предметів замовлення
   */
  async loadAllItems(orderId: string): Promise<ItemOperationResult<WizardOrderItem[]>> {
    try {
      if (!this.validateOrderId(orderId)) {
        return { success: false, error: ITEM_LOADER_ERRORS.INVALID_ORDER_ID };
      }

      if (this.isCacheValid(orderId)) {
        return { success: true, data: this.state.items };
      }

      return this.loadFromApi(orderId);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Завантаження предмета за ID
   */
  async loadItemById(
    orderId: string,
    itemId: string
  ): Promise<ItemOperationResult<WizardOrderItemDetailed>> {
    try {
      if (!this.validateOrderId(orderId) || !this.validateItemId(itemId)) {
        return {
          success: false,
          error: !orderId
            ? ITEM_LOADER_ERRORS.INVALID_ORDER_ID
            : ITEM_LOADER_ERRORS.INVALID_ITEM_ID,
        };
      }

      const adapterResult = await getOrderItemById(orderId, itemId);

      if (!adapterResult.success || !adapterResult.data) {
        return {
          success: false,
          error: adapterResult.error || ITEM_LOADER_ERRORS.LOAD_ITEM_FAILED,
        };
      }

      return this.validateAndReturnItem(adapterResult.data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.state = {
      items: [],
      loading: false,
      lastLoadTime: 0,
      orderId: undefined,
    };
  }

  /**
   * Примусове оновлення даних
   */
  async forceReload(orderId: string): Promise<ItemOperationResult<WizardOrderItem[]>> {
    this.clearCache();
    return this.loadAllItems(orderId);
  }

  /**
   * Приватні методи
   */
  private validateOrderId(orderId: string): boolean {
    return Boolean(orderId && typeof orderId === 'string');
  }

  private validateItemId(itemId: string): boolean {
    return Boolean(itemId && typeof itemId === 'string');
  }

  private isCacheValid(orderId: string): boolean {
    return (
      this.state.orderId === orderId &&
      this.state.items.length > 0 &&
      Date.now() - this.state.lastLoadTime < CACHE_DURATION
    );
  }

  private async loadFromApi(orderId: string): Promise<ItemOperationResult<WizardOrderItem[]>> {
    this.state.loading = true;
    this.state.error = undefined;

    const adapterResult = await getOrderItems(orderId);

    if (!adapterResult.success || !adapterResult.data) {
      this.state.loading = false;
      this.state.error = adapterResult.error || ITEM_LOADER_ERRORS.LOAD_ITEMS_FAILED;
      return { success: false, error: this.state.error };
    }

    return this.validateAndCacheItems(adapterResult.data, orderId);
  }

  private validateAndCacheItems(
    items: any[],
    orderId: string
  ): ItemOperationResult<WizardOrderItem[]> {
    const validationResults = items.map((item) => wizardOrderItemSchema.safeParse(item));
    const invalidItems = validationResults.filter((result) => !result.success);

    if (invalidItems.length > 0) {
      console.warn(ITEM_LOADER_ERRORS.INVALID_ITEMS_DATA, invalidItems);
    }

    const validItems = validationResults
      .filter((result) => result.success)
      .map((result) => result.data as WizardOrderItem);

    this.state = {
      items: validItems,
      loading: false,
      lastLoadTime: Date.now(),
      orderId,
    };

    return { success: true, data: validItems };
  }

  private validateAndReturnItem(itemData: any): ItemOperationResult<WizardOrderItemDetailed> {
    const validationResult = wizardOrderItemDetailedSchema.safeParse(itemData);

    if (!validationResult.success) {
      console.error('Помилка валідації предмета:', validationResult.error);
      return {
        success: false,
        error: ITEM_LOADER_ERRORS.VALIDATION_FAILED,
        validationErrors: validationResult.error.errors.map((err) => err.message),
      };
    }

    return { success: true, data: validationResult.data };
  }

  private handleError(error: unknown): ItemOperationResult<any> {
    const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
    console.error('Помилка сервісу завантаження:', error);

    this.state.loading = false;
    this.state.error = errorMessage;

    return { success: false, error: errorMessage };
  }
}

// Експортуємо singleton екземпляр
export const itemLoaderService = new ItemLoaderService();
