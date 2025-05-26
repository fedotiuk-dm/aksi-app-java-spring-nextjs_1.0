/**
 * @fileoverview API функції для платіжних операцій замовлень
 * @module domain/wizard/adapters/order/api
 */

import { PaymentForOrderService } from '@/lib/api';

import { mapPaymentDataToApi, mapPaymentResultFromApi } from '../mappers';

import type {
  WizardPaymentCalculationData,
  WizardPaymentCalculationResult,
  WizardOrderOperationResult,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';
const INVALID_API_RESPONSE = 'Отримано некоректну відповідь від API';

/**
 * Застосування оплати до замовлення
 */
export async function applyOrderPayment(
  paymentData: WizardPaymentCalculationData,
  orderId: string
): Promise<WizardOrderOperationResult<WizardPaymentCalculationResult>> {
  try {
    const apiRequest = mapPaymentDataToApi(paymentData, orderId);
    // Отримуємо відповідь з API та перевіряємо наявність обов'язкових полів
    const apiResponse = await PaymentForOrderService.applyPayment({
      orderId,
      requestBody: apiRequest,
    });

    // Валідація відповіді та приведення до очікуваного типу
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error(INVALID_API_RESPONSE);
    }

    // Перетворюємо відповідь в типізований формат
    const typedResponse = {
      orderId: String(apiResponse.orderId || ''),
      totalAmount: Number(apiResponse.totalAmount || 0),
      discountAmount: Number(apiResponse.discountAmount || 0),
      finalAmount: Number(apiResponse.finalAmount || 0),
      prepaymentAmount: Number(apiResponse.prepaymentAmount || 0),
      balanceAmount: Number(apiResponse.balanceAmount || 0),
      paymentMethod: String(apiResponse.paymentMethod || ''),
      calculatedAt: String(apiResponse.calculatedAt || new Date().toISOString()),
      ...apiResponse,
    };

    const result = mapPaymentResultFromApi(typedResponse);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося застосувати оплату: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Розрахунок оплати замовлення
 */
export async function calculateOrderPayment(
  paymentData: WizardPaymentCalculationData,
  orderId: string
): Promise<WizardOrderOperationResult<WizardPaymentCalculationResult>> {
  try {
    const apiRequest = mapPaymentDataToApi(paymentData, orderId);
    // Отримуємо відповідь з API та перевіряємо наявність обов'язкових полів
    const apiResponse = await PaymentForOrderService.calculatePayment({
      orderId,
      requestBody: apiRequest,
    });

    // Валідація відповіді та приведення до очікуваного типу
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error(INVALID_API_RESPONSE);
    }

    // Перетворюємо відповідь в типізований формат
    const typedResponse = {
      orderId: String(apiResponse.orderId || ''),
      totalAmount: Number(apiResponse.totalAmount || 0),
      discountAmount: Number(apiResponse.discountAmount || 0),
      finalAmount: Number(apiResponse.finalAmount || 0),
      prepaymentAmount: Number(apiResponse.prepaymentAmount || 0),
      balanceAmount: Number(apiResponse.balanceAmount || 0),
      paymentMethod: String(apiResponse.paymentMethod || ''),
      calculatedAt: String(apiResponse.calculatedAt || new Date().toISOString()),
      ...apiResponse,
    };

    const result = mapPaymentResultFromApi(typedResponse);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося розрахувати оплату: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання інформації про оплату замовлення
 */
export async function getOrderPayment(
  orderId: string
): Promise<WizardOrderOperationResult<WizardPaymentCalculationResult>> {
  try {
    const apiResponse = await PaymentForOrderService.getOrderPayment({
      orderId,
    });

    // Валідація відповіді та приведення до очікуваного типу
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error(INVALID_API_RESPONSE);
    }

    // Перетворюємо відповідь в типізований формат
    const typedResponse = {
      orderId: String(apiResponse.orderId || ''),
      totalAmount: Number(apiResponse.totalAmount || 0),
      discountAmount: Number(apiResponse.discountAmount || 0),
      finalAmount: Number(apiResponse.finalAmount || 0),
      prepaymentAmount: Number(apiResponse.prepaymentAmount || 0),
      balanceAmount: Number(apiResponse.balanceAmount || 0),
      paymentMethod: String(apiResponse.paymentMethod || ''),
      calculatedAt: String(apiResponse.calculatedAt || new Date().toISOString()),
      ...apiResponse,
    };

    const result = mapPaymentResultFromApi(typedResponse);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати інформацію про оплату: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
