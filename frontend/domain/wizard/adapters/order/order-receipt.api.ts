/**
 * @fileoverview API функції для операцій з квитанціями замовлень
 * @module domain/wizard/adapters/order
 */

import { OrderManagementDocumentsService } from '@/lib/api';

import {
  mapReceiptGenerationDataToApi,
  mapReceiptGenerationResultFromApi,
  mapEmailReceiptDataToApi,
  mapEmailReceiptResultFromApi,
  mapReceiptDataFromApi,
} from './order-receipt.mapper';

import type {
  ReceiptGenerationData,
  ReceiptGenerationResult,
  EmailReceiptData,
  EmailReceiptResult,
  ReceiptData,
  PdfReceiptApiResponse,
  EmailReceiptApiResponse,
} from './order-receipt.mapper';

/**
 * Генерування PDF квитанції
 */
export async function generateOrderPdfReceipt(
  receiptData: ReceiptGenerationData
): Promise<ReceiptGenerationResult> {
  try {
    const apiRequest = mapReceiptGenerationDataToApi(receiptData);
    const apiResponse = await OrderManagementDocumentsService.generatePdfReceipt({
      requestBody: apiRequest,
    });
    return mapReceiptGenerationResultFromApi(apiResponse as PdfReceiptApiResponse);
  } catch (error) {
    console.error('Помилка при генеруванні PDF квитанції:', error);
    throw new Error(`Не вдалося згенерувати PDF квитанцію: ${error}`);
  }
}

/**
 * Відправлення квитанції на email
 */
export async function sendOrderReceiptByEmail(
  emailData: EmailReceiptData
): Promise<EmailReceiptResult> {
  try {
    const apiRequest = mapEmailReceiptDataToApi(emailData);
    const apiResponse = await OrderManagementDocumentsService.sendReceiptByEmail({
      requestBody: apiRequest,
    });
    return mapEmailReceiptResultFromApi(apiResponse as EmailReceiptApiResponse);
  } catch (error) {
    console.error('Помилка при відправленні квитанції на email:', error);
    throw new Error(`Не вдалося відправити квитанцію на email: ${error}`);
  }
}

/**
 * Отримання даних для квитанції
 */
export async function getOrderReceiptData(orderId: string): Promise<ReceiptData> {
  try {
    const apiResponse = await OrderManagementDocumentsService.getReceiptData({ orderId });
    return mapReceiptDataFromApi(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні даних для квитанції замовлення ${orderId}:`, error);
    throw new Error(`Не вдалося отримати дані для квитанції: ${error}`);
  }
}
