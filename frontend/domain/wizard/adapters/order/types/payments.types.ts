/**
 * @fileoverview Типи для платежів та знижок
 * @module domain/wizard/adapters/order/types/payments
 */

import { WizardDiscountType, WizardExpediteType } from './base.types';

/**
 * Дані для розрахунку платежу
 */
export interface WizardPaymentCalculationData {
  readonly totalAmount: number;
  readonly discountType?: WizardDiscountType;
  readonly discountPercentage?: number;
  readonly expediteType?: WizardExpediteType;
  readonly prepaymentAmount?: number;
}

/**
 * Результат розрахунку платежу
 */
export interface WizardPaymentCalculationResult {
  readonly totalAmount: number;
  readonly discountAmount: number;
  readonly expediteSurcharge: number;
  readonly finalAmount: number;
  readonly prepaymentAmount: number;
  readonly balanceAmount: number;
}

/**
 * Дані для застосування знижки
 */
export interface WizardDiscountData {
  readonly orderId: string;
  readonly type: WizardDiscountType;
  readonly percentage?: number;
  readonly amount?: number;
  readonly description?: string;
}

/**
 * Результат застосування знижки
 */
export interface WizardDiscountResult {
  readonly applied: boolean;
  readonly discountAmount: number;
  readonly finalAmount: number;
  readonly message?: string;
}
