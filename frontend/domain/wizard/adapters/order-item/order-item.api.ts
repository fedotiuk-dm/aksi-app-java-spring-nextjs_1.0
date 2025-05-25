/**
 * @fileoverview API функції для операцій з предметами замовлення
 * @module domain/wizard/adapters/order-item
 */

import {
  OrderManagementBasicOperationsService,
  OrderManagementItemsService,
  PricingCalculationService,
} from '@/lib/api';

import {
  mapOrderItemDTOToDomain,
  mapOrderItemArrayToDomain,
  mapOrderItemToDTO,
} from './order-item.mapper';

import type { OrderItem } from '../../types';
import type { OrderItemDTO } from '@/lib/api';

/**
 * Отримання всіх предметів замовлення
 */
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  try {
    const apiResponse = await OrderManagementItemsService.getOrderItems({ orderId });
    return mapOrderItemArrayToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні предметів замовлення ${orderId}:`, error);
    throw new Error(`Не вдалося отримати предмети замовлення: ${error}`);
  }
}

/**
 * Отримання предмета за ID
 */
export async function getOrderItemById(orderId: string, itemId: string): Promise<OrderItem> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.getOrderItem({
      orderId,
      itemId,
    });
    return mapOrderItemDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні предмета ${itemId}:`, error);
    throw new Error(`Не вдалося отримати предмет: ${error}`);
  }
}

/**
 * Додавання предмета до замовлення
 */
export async function addOrderItem(
  orderId: string,
  itemData: Partial<OrderItem>
): Promise<OrderItem> {
  try {
    const apiRequest = mapOrderItemToDTO({ ...itemData, orderId });
    const apiResponse = await OrderManagementBasicOperationsService.addOrderItem({
      orderId,
      requestBody: apiRequest as OrderItemDTO,
    });
    return mapOrderItemDTOToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при додаванні предмета до замовлення:', error);
    throw new Error(`Не вдалося додати предмет: ${error}`);
  }
}

/**
 * Оновлення предмета замовлення
 */
export async function updateOrderItem(
  orderId: string,
  itemId: string,
  itemData: Partial<OrderItem>
): Promise<OrderItem> {
  try {
    const apiRequest = mapOrderItemToDTO(itemData);
    const apiResponse = await OrderManagementBasicOperationsService.updateOrderItem({
      orderId,
      itemId,
      requestBody: apiRequest as OrderItemDTO,
    });
    return mapOrderItemDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при оновленні предмета ${itemId}:`, error);
    throw new Error(`Не вдалося оновити предмет: ${error}`);
  }
}

/**
 * Видалення предмета з замовлення
 */
export async function deleteOrderItem(orderId: string, itemId: string): Promise<void> {
  try {
    await OrderManagementBasicOperationsService.deleteOrderItem({ orderId, itemId });
  } catch (error) {
    console.error(`Помилка при видаленні предмета ${itemId}:`, error);
    throw new Error(`Не вдалося видалити предмет: ${error}`);
  }
}

/**
 * Розрахунок ціни предмета через PricingCalculationService
 */
export async function calculateOrderItemPrice(itemData: Partial<OrderItem>): Promise<number> {
  try {
    // Перетворюємо доменні дані в формат для розрахунку ціни
    const calculationRequest = {
      categoryCode: itemData.category || '',
      itemName: itemData.name || '',
      color: itemData.color,
      quantity: itemData.quantity || 1,
      modifierCodes: [], // Модифікатори будуть додані в майбутніх версіях
      expedited: false, // Терміновість буде додана в майбутніх версіях
      expeditePercent: 0,
      discountPercent: 0,
    };

    const apiResponse = await PricingCalculationService.calculatePrice({
      requestBody: calculationRequest,
    });

    return apiResponse.finalTotalPrice || 0;
  } catch (error) {
    console.error('Помилка при розрахунку ціни предмета:', error);
    throw new Error(`Не вдалося розрахувати ціну: ${error}`);
  }
}
