/**
 * @fileoverview API функції для операцій зі знижками замовлень
 * @module domain/wizard/adapters/order/api
 */

import { OrderDiscountsService } from '@/lib/api';

import { mapDiscountDataToApi, mapDiscountResultFromApi } from '../mappers';

import type {
  WizardDiscountData,
  WizardDiscountResult,
  WizardOrderOperationResult,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Застосування знижки до замовлення
 */
export async function applyOrderDiscount(
  discountData: WizardDiscountData
): Promise<WizardOrderOperationResult<WizardDiscountResult>> {
  try {
    const apiRequest = mapDiscountDataToApi(discountData);
    // Отримуємо відповідь з API
    const apiResponse = await OrderDiscountsService.applyDiscount1({
      requestBody: apiRequest,
    });

    // Валідація відповіді
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error('Отримано некоректну відповідь від API');
    }

    // Перетворюємо відповідь в типізований формат
    const typedResponse = {
      discountAmount: Number(apiResponse.discountAmount || 0),
      finalAmount: Number(apiResponse.finalAmount || 0),
      discountDescription: apiResponse.discountDescription
        ? String(apiResponse.discountDescription)
        : undefined,
      ...apiResponse,
    };

    const result = mapDiscountResultFromApi(typedResponse);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося застосувати знижку: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання інформації про знижку замовлення
 */
export async function getOrderDiscount(
  orderId: string
): Promise<WizardOrderOperationResult<WizardDiscountResult>> {
  try {
    const apiResponse = await OrderDiscountsService.getOrderDiscount({
      orderId,
    });

    // Валідація відповіді
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error('Отримано некоректну відповідь від API');
    }

    // Перетворюємо відповідь в типізований формат
    const typedResponse = {
      discountAmount: Number(apiResponse.discountAmount || 0),
      finalAmount: Number(apiResponse.finalAmount || 0),
      discountDescription: apiResponse.discountDescription
        ? String(apiResponse.discountDescription)
        : undefined,
      ...apiResponse,
    };

    const result = mapDiscountResultFromApi(typedResponse);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати інформацію про знижку: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Видалення знижки з замовлення
 */
export async function removeOrderDiscount(
  orderId: string
): Promise<WizardOrderOperationResult<void>> {
  try {
    await OrderDiscountsService.removeDiscount({ orderId });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося видалити знижку: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
