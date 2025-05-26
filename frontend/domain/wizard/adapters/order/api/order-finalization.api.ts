/**
 * @fileoverview API функції для фіналізації замовлень
 * @module domain/wizard/adapters/order/api
 */

import { OrderFinalizationService, type EmailReceiptResponse } from '@/lib/api';

import { mapOrderDTOToDomain } from '../mappers';

import type {
  WizardOrder,
  WizardOrderOperationResult,
  WizardOrderFinalizationData,
  WizardEmailReceiptData,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Завершення оформлення замовлення
 * Фіналізує замовлення, зберігає підпис клієнта та змінює статус замовлення
 */
export async function finalizeOrder(
  finalizationData: WizardOrderFinalizationData
): Promise<WizardOrderOperationResult<WizardOrder>> {
  try {
    const requestBody = {
      orderId: finalizationData.orderId,
      signatureData: finalizationData.signatureData,
      termsAccepted: finalizationData.termsAccepted,
      sendReceiptByEmail: finalizationData.sendReceiptByEmail,
      generatePrintableReceipt: finalizationData.generatePrintableReceipt,
      comments: finalizationData.comments,
    };

    const apiResponse = await OrderFinalizationService.finalizeOrder({
      requestBody,
    });

    const order = mapOrderDTOToDomain(apiResponse);

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося завершити оформлення замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання PDF-чека замовлення
 * Повертає PDF-файл з чеком для завантаження
 */
export async function getOrderReceipt(
  orderId: string,
  includeSignature: boolean = true
): Promise<WizardOrderOperationResult<Blob>> {
  try {
    const apiResponse = await OrderFinalizationService.getOrderReceipt({
      orderId,
      includeSignature,
    });

    // Перетворюємо відповідь в Blob для завантаження PDF
    const blob = new Blob([JSON.stringify(apiResponse)], { type: 'application/pdf' });

    return {
      success: true,
      data: blob,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати PDF-чек: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Відправлення чека на email
 * Відправляє PDF-чек замовлення на email клієнта
 */
export async function emailReceipt(
  emailData: WizardEmailReceiptData
): Promise<WizardOrderOperationResult<EmailReceiptResponse>> {
  try {
    const requestBody = {
      orderId: emailData.orderId,
      recipientEmail: emailData.email,
      includeSignature: emailData.includeSignature,
      message: emailData.additionalMessage,
    };

    const apiResponse = await OrderFinalizationService.emailReceipt({
      orderId: emailData.orderId,
      requestBody,
    });

    return {
      success: true,
      data: apiResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося відправити чек на email: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
