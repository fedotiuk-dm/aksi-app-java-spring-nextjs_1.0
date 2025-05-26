/**
 * @fileoverview API функції для роботи з підписами клієнтів
 * @module domain/wizard/adapters/order/api
 */

import { CustomerSignatureService, type CustomerSignatureResponse } from '@/lib/api';

import type {
  WizardCustomerSignature,
  WizardCustomerSignatureCreateData,
  WizardOrderOperationResult,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Маппер з API моделі в доменну модель
 */
function mapSignatureResponseToDomain(
  apiSignature: CustomerSignatureResponse
): WizardCustomerSignature {
  return {
    id: apiSignature.id || '',
    orderId: apiSignature.orderId || '',
    signatureData: apiSignature.signatureData || '',
    signatureType: apiSignature.signatureType || '',
    createdAt: apiSignature.createdAt || '',
    updatedAt: apiSignature.updatedAt,
  };
}

/**
 * Збереження підпису клієнта
 * Зберігає новий або оновлює існуючий підпис клієнта
 */
export async function saveCustomerSignature(
  signatureData: WizardCustomerSignatureCreateData,
  termsAccepted: boolean = true
): Promise<WizardOrderOperationResult<WizardCustomerSignature>> {
  try {
    const requestBody = {
      orderId: signatureData.orderId,
      signatureData: signatureData.signatureData,
      signatureType: signatureData.signatureType,
      termsAccepted,
    };

    const apiResponse = await CustomerSignatureService.saveSignature({
      requestBody,
    });

    const signature = mapSignatureResponseToDomain(apiResponse);

    return {
      success: true,
      data: signature,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося зберегти підпис: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання підпису за ID
 * Повертає підпис клієнта за його ID
 */
export async function getSignatureById(
  id: string
): Promise<WizardOrderOperationResult<WizardCustomerSignature>> {
  try {
    const apiResponse = await CustomerSignatureService.getSignatureById({ id });
    const signature = mapSignatureResponseToDomain(apiResponse);

    return {
      success: true,
      data: signature,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати підпис: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання всіх підписів для замовлення
 * Повертає всі підписи для конкретного замовлення
 */
export async function getSignaturesByOrderId(
  orderId: string
): Promise<WizardOrderOperationResult<WizardCustomerSignature[]>> {
  try {
    const apiResponse = await CustomerSignatureService.getSignaturesByOrderId({ orderId });
    const signatures = apiResponse.map(mapSignatureResponseToDomain);

    return {
      success: true,
      data: signatures,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати підписи: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання підпису за типом для замовлення
 * Повертає підпис конкретного типу для замовлення
 */
export async function getSignatureByOrderIdAndType(
  orderId: string,
  signatureType: string
): Promise<WizardOrderOperationResult<WizardCustomerSignature>> {
  try {
    const apiResponse = await CustomerSignatureService.getSignatureByOrderIdAndType({
      orderId,
      signatureType,
    });
    const signature = mapSignatureResponseToDomain(apiResponse);

    return {
      success: true,
      data: signature,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати підпис: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
