/**
 * @fileoverview API функції для платіжних операцій замовлень
 * @module domain/wizard/adapters/order
 */

import { OrderManagementFinancialService } from '@/lib/api';

import { mapPaymentDataToApi, mapPaymentResultFromApi } from './order-payment.mapper';

import type {
  PaymentCalculationData,
  PaymentCalculationResult,
  PaymentCalculationApiResponse,
} from './order-payment.mapper';

/**
 * Застосування оплати до замовлення
 */
export async function applyOrderPayment(
  paymentData: PaymentCalculationData
): Promise<PaymentCalculationResult> {
  try {
    const apiRequest = mapPaymentDataToApi(paymentData);
    const apiResponse = await OrderManagementFinancialService.applyPayment({
      requestBody: apiRequest,
    });
    return mapPaymentResultFromApi(apiResponse as PaymentCalculationApiResponse);
  } catch (error) {
    console.error('Помилка при застосуванні оплати:', error);
    throw new Error(`Не вдалося застосувати оплату: ${error}`);
  }
}

/**
 * Розрахунок оплати замовлення
 */
export async function calculateOrderPayment(
  paymentData: PaymentCalculationData
): Promise<PaymentCalculationResult> {
  try {
    const apiRequest = mapPaymentDataToApi(paymentData);
    const apiResponse = await OrderManagementFinancialService.calculatePayment({
      requestBody: apiRequest,
    });
    return mapPaymentResultFromApi(apiResponse as PaymentCalculationApiResponse);
  } catch (error) {
    console.error('Помилка при розрахунку оплати:', error);
    throw new Error(`Не вдалося розрахувати оплату: ${error}`);
  }
}
