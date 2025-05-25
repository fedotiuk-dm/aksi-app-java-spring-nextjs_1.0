/**
 * @fileoverview Адаптер API операцій з предметами замовлень
 * @module domain/wizard/adapters/order-item-adapters
 */

import { OrderManagementBasicOperationsService, OrderManagementItemsService } from '@/lib/api';

import { OrderItemMappingAdapter } from './mapping.adapter';

import type { OrderItem } from '../../types';

/**
 * Адаптер для прямих API операцій з предметами замовлень
 *
 * Відповідальність:
 * - Виклики lib/api сервісів
 * - Інтеграція з OrderItemMappingAdapter
 * - Обробка API помилок
 */
export class OrderItemApiOperationsAdapter {
  // === ОСНОВНІ ОПЕРАЦІЇ ===

  /**
   * Отримання всіх предметів замовлення через API (OrderManagementItemsService)
   */
  static async getOrderItems(orderId: string): Promise<OrderItem[]> {
    try {
      const apiResponse = await OrderManagementItemsService.getOrderItems({ orderId });
      return OrderItemMappingAdapter.toDomainArray(apiResponse);
    } catch (error) {
      console.error(`Помилка при отриманні предметів замовлення ${orderId}:`, error);
      throw new Error(`Не вдалося отримати предмети замовлення: ${error}`);
    }
  }

  /**
   * Отримання всіх предметів замовлення через API (OrderManagementBasicOperationsService)
   */
  static async getOrderItemsBasic(orderId: string): Promise<OrderItem[]> {
    try {
      const apiResponse = await OrderManagementBasicOperationsService.getOrderItems({ orderId });
      return OrderItemMappingAdapter.toDomainArray(apiResponse);
    } catch (error) {
      console.error(`Помилка при отриманні предметів замовлення (basic) ${orderId}:`, error);
      throw new Error(`Не вдалося отримати предмети замовлення: ${error}`);
    }
  }

  /**
   * Отримання предмета замовлення за ID через API
   */
  static async getOrderItem(orderId: string, itemId: string): Promise<OrderItem> {
    try {
      const apiResponse = await OrderManagementBasicOperationsService.getOrderItem({
        orderId,
        itemId,
      });
      return OrderItemMappingAdapter.fromBasicDTO(apiResponse);
    } catch (error) {
      console.error(`Помилка при отриманні предмета ${itemId} з замовлення ${orderId}:`, error);
      throw new Error(`Не вдалося отримати предмет замовлення: ${error}`);
    }
  }

  /**
   * Додавання нового предмета до замовлення через API
   */
  static async addOrderItem(orderId: string, domainItem: Partial<OrderItem>): Promise<OrderItem> {
    try {
      // Валідація перед відправкою
      const validationErrors = OrderItemMappingAdapter.validateDomainItem(domainItem);
      if (validationErrors.length > 0) {
        throw new Error(`Помилки валідації: ${validationErrors.join(', ')}`);
      }

      const createRequest = OrderItemMappingAdapter.toCreateRequest(domainItem);
      const apiResponse = await OrderManagementBasicOperationsService.addOrderItem({
        orderId,
        requestBody: createRequest,
      });

      return OrderItemMappingAdapter.fromBasicDTO(apiResponse);
    } catch (error) {
      console.error(`Помилка при додаванні предмета до замовлення ${orderId}:`, error);
      throw new Error(`Не вдалося додати предмет до замовлення: ${error}`);
    }
  }

  /**
   * Оновлення існуючого предмета замовлення через API
   */
  static async updateOrderItem(
    orderId: string,
    itemId: string,
    domainItem: Partial<OrderItem>
  ): Promise<OrderItem> {
    try {
      // Валідація перед відправкою
      const validationErrors = OrderItemMappingAdapter.validateDomainItem(domainItem);
      if (validationErrors.length > 0) {
        throw new Error(`Помилки валідації: ${validationErrors.join(', ')}`);
      }

      const updateRequest = OrderItemMappingAdapter.toUpdateRequest(domainItem);
      const apiResponse = await OrderManagementBasicOperationsService.updateOrderItem({
        orderId,
        itemId,
        requestBody: updateRequest,
      });

      return OrderItemMappingAdapter.fromBasicDTO(apiResponse);
    } catch (error) {
      console.error(`Помилка при оновленні предмета ${itemId} в замовленні ${orderId}:`, error);
      throw new Error(`Не вдалося оновити предмет замовлення: ${error}`);
    }
  }

  /**
   * Видалення предмета замовлення через API
   */
  static async deleteOrderItem(orderId: string, itemId: string): Promise<void> {
    try {
      await OrderManagementBasicOperationsService.deleteOrderItem({
        orderId,
        itemId,
      });
    } catch (error) {
      console.error(`Помилка при видаленні предмета ${itemId} з замовлення ${orderId}:`, error);
      throw new Error(`Не вдалося видалити предмет замовлення: ${error}`);
    }
  }

  // === УТИЛІТАРНІ МЕТОДИ ===

  /**
   * Перевірка існування предмета в замовленні
   */
  static async itemExists(orderId: string, itemId: string): Promise<boolean> {
    try {
      await this.getOrderItem(orderId, itemId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Отримання кількості предметів у замовленні
   */
  static async getItemCount(orderId: string): Promise<number> {
    try {
      const items = await this.getOrderItems(orderId);
      return items.length;
    } catch (error) {
      console.error(`Помилка при отриманні кількості предметів замовлення ${orderId}:`, error);
      return 0;
    }
  }

  /**
   * Отримання загальної вартості всіх предметів замовлення
   */
  static async getTotalAmount(orderId: string): Promise<number> {
    try {
      const items = await this.getOrderItems(orderId);
      return items.reduce((total, item) => total + (item.totalPrice || 0), 0);
    } catch (error) {
      console.error(`Помилка при розрахунку загальної вартості замовлення ${orderId}:`, error);
      return 0;
    }
  }

  /**
   * Пакетне додавання предметів до замовлення
   */
  static async addMultipleOrderItems(
    orderId: string,
    domainItems: Partial<OrderItem>[]
  ): Promise<OrderItem[]> {
    const results: OrderItem[] = [];
    const errors: string[] = [];

    for (const [index, item] of domainItems.entries()) {
      try {
        const result = await this.addOrderItem(orderId, item);
        results.push(result);
      } catch (error) {
        errors.push(`Предмет ${index + 1}: ${error}`);
      }
    }

    if (errors.length > 0) {
      console.warn(`Помилки при додаванні предметів до замовлення ${orderId}:`, errors);
    }

    return results;
  }

  /**
   * Пакетне оновлення предметів замовлення
   */
  static async updateMultipleOrderItems(
    orderId: string,
    updates: Array<{ itemId: string; data: Partial<OrderItem> }>
  ): Promise<OrderItem[]> {
    const results: OrderItem[] = [];
    const errors: string[] = [];

    for (const update of updates) {
      try {
        const result = await this.updateOrderItem(orderId, update.itemId, update.data);
        results.push(result);
      } catch (error) {
        errors.push(`Предмет ${update.itemId}: ${error}`);
      }
    }

    if (errors.length > 0) {
      console.warn(`Помилки при оновленні предметів замовлення ${orderId}:`, errors);
    }

    return results;
  }

  /**
   * Пакетне видалення предметів замовлення
   */
  static async deleteMultipleOrderItems(orderId: string, itemIds: string[]): Promise<void> {
    const errors: string[] = [];

    for (const itemId of itemIds) {
      try {
        await this.deleteOrderItem(orderId, itemId);
      } catch (error) {
        errors.push(`Предмет ${itemId}: ${error}`);
      }
    }

    if (errors.length > 0) {
      console.warn(`Помилки при видаленні предметів з замовлення ${orderId}:`, errors);
      throw new Error(`Не вдалося видалити деякі предмети: ${errors.join(', ')}`);
    }
  }
}
