/**
 * @fileoverview API функції для операцій зі знижками замовлень
 * @module domain/wizard/adapters/order
 */

import { OrderManagementFinancialService } from '@/lib/api';

import { mapDiscountDataToApi, mapDiscountResultFromApi } from './order-discount.mapper';

import type { DiscountData, DiscountResult, DiscountApiResponse } from './order-discount.mapper';

/**
 * Застосування знижки до замовлення
 */
export async function applyOrderDiscount(discountData: DiscountData): Promise<DiscountResult> {
  try {
    const apiRequest = mapDiscountDataToApi(discountData);
    const apiResponse = await OrderManagementFinancialService.applyDiscount1({
      requestBody: apiRequest,
    });
    return mapDiscountResultFromApi(apiResponse as DiscountApiResponse);
  } catch (error) {
    console.error('Помилка при застосуванні знижки:', error);
    throw new Error(`Не вдалося застосувати знижку: ${error}`);
  }
}

/**
 * Отримання інформації про знижку замовлення
 */
export async function getOrderDiscount(orderId: string): Promise<DiscountResult> {
  try {
    const apiResponse = await OrderManagementFinancialService.getOrderDiscount({ orderId });
    return mapDiscountResultFromApi(apiResponse as DiscountApiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні інформації про знижку замовлення ${orderId}:`, error);
    throw new Error(`Не вдалося отримати інформацію про знижку: ${error}`);
  }
}

/**
 * Видалення знижки з замовлення
 */
export async function removeOrderDiscount(orderId: string): Promise<void> {
  try {
    await OrderManagementFinancialService.removeDiscount({ orderId });
  } catch (error) {
    console.error(`Помилка при видаленні знижки з замовлення ${orderId}:`, error);
    throw new Error(`Не вдалося видалити знижку: ${error}`);
  }
}
