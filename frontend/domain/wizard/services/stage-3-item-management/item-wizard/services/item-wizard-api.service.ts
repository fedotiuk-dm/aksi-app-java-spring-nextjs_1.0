/**
 * @fileoverview Сервіс для API взаємодії при роботі з предметами в Order Wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard/services/item-wizard-api
 */

import {
  getOrderItemById,
  getOrderItems,
  addOrderItem,
  updateOrderItem,
  deleteOrderItem,
  calculateOrderItemPrice
} from '../../../../adapters/order/api/order-item.api';
import {
  WizardOrderItem,
  WizardOrderOperationResult
} from '../../../../adapters/order/types';

/** Константа для невідомої помилки */
const UNKNOWN_ERROR = 'Невідома помилка при операції з предметом';

/** Повідомлення про відсутність ID замовлення */
const ORDER_ID_NOT_SET = 'ID замовлення не встановлено';

/**
 * Сервіс для API взаємодії при роботі з предметами
 */
export class ItemWizardApiService {
  /**
   * Конструктор сервісу
   * @param orderId ID поточного замовлення
   */
  constructor(private orderId: string = '') {}

  /**
   * Встановлення ID замовлення
   * @param orderId ID замовлення
   */
  setOrderId(orderId: string): void {
    this.orderId = orderId;
  }

  /**
   * Отримання ID замовлення
   */
  getOrderId(): string {
    return this.orderId;
  }

  /**
   * Отримання всіх предметів замовлення
   */
  async getAllItems(): Promise<WizardOrderOperationResult<WizardOrderItem[]>> {
    try {
      if (!this.orderId) {
        return {
          success: false,
          error: ORDER_ID_NOT_SET
        };
      }

      return await getOrderItems(this.orderId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання предмета за ID
   * @param itemId ID предмета
   */
  async getItemById(itemId: string): Promise<WizardOrderOperationResult<WizardOrderItem>> {
    try {
      if (!this.orderId) {
        return {
          success: false,
          error: ORDER_ID_NOT_SET
        };
      }

      return await getOrderItemById(this.orderId, itemId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Додавання нового предмета
   * @param itemData Дані предмета
   */
  async addItem(itemData: Partial<WizardOrderItem>): Promise<WizardOrderOperationResult<WizardOrderItem>> {
    try {
      if (!this.orderId) {
        return {
          success: false,
          error: ORDER_ID_NOT_SET
        };
      }

      return await addOrderItem(this.orderId, itemData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Оновлення існуючого предмета
   * @param itemId ID предмета
   * @param itemData Дані предмета
   */
  async updateItem(itemId: string, itemData: Partial<WizardOrderItem>): Promise<WizardOrderOperationResult<WizardOrderItem>> {
    try {
      if (!this.orderId) {
        return {
          success: false,
          error: ORDER_ID_NOT_SET
        };
      }

      return await updateOrderItem(this.orderId, itemId, itemData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Видалення предмета
   * @param itemId ID предмета
   */
  async deleteItem(itemId: string): Promise<WizardOrderOperationResult<void>> {
    try {
      if (!this.orderId) {
        return {
          success: false,
          error: ORDER_ID_NOT_SET
        };
      }

      return await deleteOrderItem(this.orderId, itemId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Розрахунок ціни предмета
   * @param itemData Дані предмета
   */
  async calculatePrice(itemData: Partial<WizardOrderItem>): Promise<WizardOrderOperationResult<number>> {
    try {
      return await calculateOrderItemPrice(itemData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }
}
