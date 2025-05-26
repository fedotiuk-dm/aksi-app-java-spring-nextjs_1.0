/**
 * @fileoverview API функції для отримання детального підсумку замовлення
 * @module domain/wizard/adapters/order/api
 */

import { OrderSummaryService, type OrderDetailedSummaryResponse } from '@/lib/api';

import { mapOrderDetailedToDomain } from '../mappers';

import type { WizardOrderOperationResult, WizardOrderDetailed } from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Детальний підсумок замовлення з розширеною інформацією
 */
export interface WizardOrderDetailedSummary extends WizardOrderDetailed {
  readonly calculationDetails?: {
    readonly baseAmount: number;
    readonly discountDetails?: {
      readonly type: string;
      readonly percentage: number;
      readonly amount: number;
    };
    readonly expediteDetails?: {
      readonly type: string;
      readonly surchargePercentage: number;
      readonly surchargeAmount: number;
    };
    readonly taxDetails?: {
      readonly taxRate: number;
      readonly taxAmount: number;
    };
  };
  readonly paymentSummary?: {
    readonly totalAmount: number;
    readonly paidAmount: number;
    readonly remainingAmount: number;
    readonly paymentMethod?: string;
  };
  readonly completionInfo?: {
    readonly standardCompletionDate: string;
    readonly expeditedCompletionDate?: string;
    readonly actualCompletionDate?: string;
  };
}

/**
 * Маппер з API моделі в доменну модель
 */
function mapDetailedSummaryToDomain(
  apiSummary: OrderDetailedSummaryResponse
): WizardOrderDetailedSummary {
  // Базове маппування через існуючий маппер
  const baseOrder = mapOrderDetailedToDomain(apiSummary);

  // OrderDetailedSummaryResponse не містить додаткових полів calculationDetails, paymentSummary, completionInfo
  // Тому повертаємо тільки базову інформацію
  return {
    ...baseOrder,
    // Додаткові поля можуть бути додані пізніше, коли API буде розширено
    calculationDetails: undefined,
    paymentSummary: undefined,
    completionInfo: undefined,
  };
}

/**
 * Отримання детального підсумку замовлення
 * Повертає повну інформацію про замовлення з деталізацією розрахунків
 */
export async function getOrderDetailedSummary(
  orderId: string
): Promise<WizardOrderOperationResult<WizardOrderDetailedSummary>> {
  try {
    const apiResponse = await OrderSummaryService.getOrderDetailedSummary({ orderId });
    const detailedSummary = mapDetailedSummaryToDomain(apiResponse);

    return {
      success: true,
      data: detailedSummary,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати детальний підсумок замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
