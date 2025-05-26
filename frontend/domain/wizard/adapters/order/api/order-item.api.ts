/**
 * @fileoverview API функції для операцій з предметами замовлення
 * @module domain/wizard/adapters/order/api
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
} from '../mappers';

import type { WizardOrderItem, WizardOrderOperationResult } from '../types';
import type { OrderItemDTO } from '@/lib/api';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання всіх предметів замовлення
 */
export async function getOrderItems(
  orderId: string
): Promise<WizardOrderOperationResult<WizardOrderItem[]>> {
  try {
    const apiResponse = await OrderManagementItemsService.getOrderItems({ orderId });
    const items = mapOrderItemArrayToDomain(apiResponse);

    return {
      success: true,
      data: items,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати предмети замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання предмета за ID
 */
export async function getOrderItemById(
  orderId: string,
  itemId: string
): Promise<WizardOrderOperationResult<WizardOrderItem>> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.getOrderItem({
      orderId,
      itemId,
    });
    const item = mapOrderItemDTOToDomain(apiResponse);

    return {
      success: true,
      data: item,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати предмет: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Додавання предмета до замовлення
 */
export async function addOrderItem(
  orderId: string,
  itemData: Partial<WizardOrderItem>
): Promise<WizardOrderOperationResult<WizardOrderItem>> {
  try {
    const apiRequest = mapOrderItemToDTO(itemData);
    const apiResponse = await OrderManagementBasicOperationsService.addOrderItem({
      orderId,
      requestBody: apiRequest as OrderItemDTO,
    });
    const item = mapOrderItemDTOToDomain(apiResponse);

    return {
      success: true,
      data: item,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося додати предмет: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Оновлення предмета замовлення
 */
export async function updateOrderItem(
  orderId: string,
  itemId: string,
  itemData: Partial<WizardOrderItem>
): Promise<WizardOrderOperationResult<WizardOrderItem>> {
  try {
    const apiRequest = mapOrderItemToDTO(itemData);
    const apiResponse = await OrderManagementBasicOperationsService.updateOrderItem({
      orderId,
      itemId,
      requestBody: apiRequest as OrderItemDTO,
    });
    const item = mapOrderItemDTOToDomain(apiResponse);

    return {
      success: true,
      data: item,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося оновити предмет: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Видалення предмета з замовлення
 */
export async function deleteOrderItem(
  orderId: string,
  itemId: string
): Promise<WizardOrderOperationResult<void>> {
  try {
    await OrderManagementBasicOperationsService.deleteOrderItem({ orderId, itemId });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося видалити предмет: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Розрахунок ціни предмета через PricingCalculationService
 */
export async function calculateOrderItemPrice(
  itemData: Partial<WizardOrderItem>
): Promise<WizardOrderOperationResult<number>> {
  try {
    // Перетворюємо доменні дані в формат для розрахунку ціни
    const calculationRequest = {
      categoryCode: itemData.categoryName || '',
      itemName: itemData.itemName || '',
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

    return {
      success: true,
      data: apiResponse.finalTotalPrice || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося розрахувати ціну: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
