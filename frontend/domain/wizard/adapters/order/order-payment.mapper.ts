/**
 * @fileoverview Маппер для платіжних операцій замовлень
 * @module domain/wizard/adapters/order
 */

import type { PaymentCalculationRequest } from '@/lib/api';

/**
 * Доменні типи для платіжних операцій
 */
export interface PaymentCalculationApiResponse {
  orderId: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number;
  paymentMethod: string;
  calculatedAt: string;
}
export interface PaymentCalculationData {
  orderId: string;
  paymentMethod: 'TERMINAL' | 'CASH' | 'BANK_TRANSFER';
  prepaymentAmount?: number;
}

export interface PaymentCalculationResult {
  orderId: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number;
  paymentMethod: string;
  calculatedAt: string;
}

/**
 * Перетворює доменні дані оплати у API формат
 */
export function mapPaymentDataToApi(domainData: PaymentCalculationData): PaymentCalculationRequest {
  return {
    orderId: domainData.orderId,
    paymentMethod: domainData.paymentMethod as PaymentCalculationRequest.paymentMethod,
    prepaymentAmount: domainData.prepaymentAmount,
  };
}

/**
 * Перетворює API результат оплати у доменний тип
 */
export function mapPaymentResultFromApi(
  apiResult: PaymentCalculationApiResponse
): PaymentCalculationResult {
  return {
    orderId: apiResult.orderId || '',
    totalAmount: apiResult.totalAmount || 0,
    discountAmount: apiResult.discountAmount || 0,
    finalAmount: apiResult.finalAmount || 0,
    prepaymentAmount: apiResult.prepaymentAmount || 0,
    balanceAmount: apiResult.balanceAmount || 0,
    paymentMethod: apiResult.paymentMethod || '',
    calculatedAt: apiResult.calculatedAt || new Date().toISOString(),
  };
}
