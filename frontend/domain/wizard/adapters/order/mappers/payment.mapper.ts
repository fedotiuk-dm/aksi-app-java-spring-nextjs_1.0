/**
 * @fileoverview Маппер для платіжних операцій замовлень
 * @module domain/wizard/adapters/order/mappers
 */

import { PaymentCalculationRequest } from '@/lib/api';

// Імпорт не потрібен, оскільки ми не використовуємо enum WizardPaymentMethod

import type {
  WizardPaymentCalculationData,
  WizardPaymentCalculationResult,
} from '../types';

/**
 * Інтерфейс для відповіді з API платіжних операцій
 * Використовується тільки в маппері
 */
interface PaymentCalculationApiResponse {
  orderId: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number;
  paymentMethod: string;
  calculatedAt: string;
  // Можливі додаткові поля
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Перетворює доменні дані оплати у API формат
 */
export function mapPaymentDataToApi(domainData: WizardPaymentCalculationData, orderId: string): PaymentCalculationRequest {
  // Використовуємо orderId як окремий параметр, оскільки він не частина доменного типу WizardPaymentCalculationData
  return {
    orderId,
    // За замовчуванням використовуємо оплату готівкою
    paymentMethod: PaymentCalculationRequest.paymentMethod.CASH,
    prepaymentAmount: domainData.prepaymentAmount,
  };
}

/**
 * Перетворює API результат оплати у доменний тип
 */
export function mapPaymentResultFromApi(apiResult: PaymentCalculationApiResponse): WizardPaymentCalculationResult {
  return {
    totalAmount: apiResult.totalAmount || 0,
    discountAmount: apiResult.discountAmount || 0,
    expediteSurcharge: 0, // Немає в API відповіді
    finalAmount: apiResult.finalAmount || 0,
    prepaymentAmount: apiResult.prepaymentAmount || 0,
    balanceAmount: apiResult.balanceAmount || 0,
  };
}
