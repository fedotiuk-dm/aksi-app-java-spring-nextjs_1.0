/**
 * @fileoverview API функції для операцій з квитанціями замовлень
 * @module domain/wizard/adapters/order/api
 */

import { OrderManagementDocumentsService } from '@/lib/api';

import {
  mapReceiptGenerationDataToApi,
  mapReceiptGenerationResultFromApi,
  mapEmailReceiptDataToApi,
  mapEmailReceiptResultFromApi,
  mapReceiptDTOToDomain,
} from '../mappers';

import type {
  WizardReceiptGenerationData,
  WizardReceiptGenerationResult,
  WizardEmailReceiptData,
  WizardEmailReceiptResult,
  WizardReceiptData,
  WizardOrderOperationResult,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Генерування PDF квитанції
 */
export async function generateOrderPdfReceipt(
  receiptData: WizardReceiptGenerationData
): Promise<WizardOrderOperationResult<WizardReceiptGenerationResult>> {
  try {
    const apiRequest = mapReceiptGenerationDataToApi(receiptData);
    const apiResponse = await OrderManagementDocumentsService.generatePdfReceipt({
      requestBody: apiRequest,
    });
    const result = mapReceiptGenerationResultFromApi(apiResponse);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося згенерувати PDF квитанцію: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Відправлення квитанції на email
 */
export async function sendOrderReceiptByEmail(
  emailData: WizardEmailReceiptData
): Promise<WizardOrderOperationResult<WizardEmailReceiptResult>> {
  try {
    const apiRequest = mapEmailReceiptDataToApi(emailData);
    const apiResponse = await OrderManagementDocumentsService.sendReceiptByEmail({
      requestBody: apiRequest,
    });
    const result = mapEmailReceiptResultFromApi(apiResponse);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося відправити квитанцію на email: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання даних для квитанції
 */
export async function getOrderReceiptData(
  orderId: string
): Promise<WizardOrderOperationResult<WizardReceiptData>> {
  try {
    const apiResponse = await OrderManagementDocumentsService.getReceiptData({ orderId });
    const receiptData = mapReceiptDTOToDomain(apiResponse);

    return {
      success: true,
      data: receiptData,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати дані для квитанції: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
