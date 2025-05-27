/**
 * @fileoverview Сервіс для операцій з характеристиками предметів
 * @module domain/wizard/services/stage-3-item-management/item-characteristics/services/characteristics-operations
 */

import { OrderItemService } from '@/domain/wizard/adapters/order/api';

import { ICharacteristicsOperationsService } from '../interfaces/item-characteristics.interfaces';

import type {
  CharacteristicsOperationResult,
  ItemCharacteristics,
  UpdateCharacteristicsData
} from '../types/item-characteristics.types';
import type { OrderItem } from '@/domain/wizard/types';

const UNKNOWN_ERROR = 'Невідома помилка при операціях з характеристиками';

/**
 * Сервіс для операцій з характеристиками предметів
 * @implements ICharacteristicsOperationsService
 */
export class CharacteristicsOperationsService implements ICharacteristicsOperationsService {
  private orderItemAdapter: OrderItemService;

  /**
   * Конструктор сервісу операцій з характеристиками
   * @param orderId Ідентифікатор замовлення
   */
  constructor(orderId?: string) {
    this.orderItemAdapter = new OrderItemService(orderId);
  }

  /**
   * Встановлення ID замовлення
   * @param orderId ID замовлення
   */
  setOrderId(orderId: string): void {
    this.orderItemAdapter.setOrderId(orderId);
  }

  /**
   * Отримання характеристик предмета
   * @param itemId Ідентифікатор предмета
   */
  async getItemCharacteristics(
    itemId: string
  ): Promise<CharacteristicsOperationResult<ItemCharacteristics>> {
    try {
      // Отримуємо предмет через адаптер
      const itemResult = await this.orderItemAdapter.getOrderItem(itemId);

      if (!itemResult.success || !itemResult.data) {
        return {
          success: false,
          error: `Не вдалося отримати предмет: ${itemResult.error}`
        };
      }

      const item = itemResult.data;

      // Витягуємо характеристики з предмета
      const characteristics: ItemCharacteristics = {
        materialId: item.materialId,
        colorId: item.colorId,
        customColor: item.customColor,
        fillerTypeId: item.fillerTypeId,
        isFillerLumpy: item.isFillerLumpy,
        wearDegreeId: item.wearDegreeId
      };

      return {
        success: true,
        data: characteristics
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Оновлення характеристик предмета
   * @param itemId Ідентифікатор предмета
   * @param data Дані для оновлення
   */
  async updateItemCharacteristics(
    itemId: string,
    data: UpdateCharacteristicsData
  ): Promise<CharacteristicsOperationResult<OrderItem>> {
    try {
      // Спочатку отримуємо поточний предмет
      const currentItemResult = await this.orderItemAdapter.getOrderItem(itemId);

      if (!currentItemResult.success || !currentItemResult.data) {
        return {
          success: false,
          error: `Не вдалося отримати поточний предмет: ${currentItemResult.error}`
        };
      }

      // Підготовка даних для оновлення
      const updateData: Record<string, any> = {};

      if (data.materialId !== undefined) {
        updateData.materialId = data.materialId;
      }

      if (data.colorId !== undefined) {
        updateData.colorId = data.colorId;
      }

      if (data.customColor !== undefined) {
        updateData.customColor = data.customColor;
      }

      if (data.fillerTypeId !== undefined) {
        updateData.fillerTypeId = data.fillerTypeId;
      }

      if (data.isFillerLumpy !== undefined) {
        updateData.isFillerLumpy = data.isFillerLumpy;
      }

      if (data.wearDegreeId !== undefined) {
        updateData.wearDegreeId = data.wearDegreeId;
      }

      // Оновлюємо предмет через адаптер
      const result = await this.orderItemAdapter.updateOrderItem(itemId, updateData);

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося оновити характеристики предмета: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }
}

// Єдиний екземпляр сервісу для використання в додатку
export const characteristicsOperationsService = new CharacteristicsOperationsService();
