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

// Типи для нових функцій
export interface WizardSignatureData {
  orderId: string;
  signatureData: string;
  signatureType: string;
}

export interface WizardSignatureResult {
  signatureId: string;
  isValid: boolean;
  savedAt: string;
}

export interface WizardTermsData {
  terms: string[];
  documents: Array<{
    title: string;
    url: string;
    type: 'law' | 'regulation' | 'standard';
  }>;
  version: string;
  updatedAt: string;
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
 * Аліас для saveCustomerSignature (для зворотної сумісності)
 */
export async function saveClientSignature(
  signatureData: WizardSignatureData,
  termsAccepted: boolean = true
): Promise<WizardOrderOperationResult<WizardSignatureResult>> {
  try {
    const customerSignatureData: WizardCustomerSignatureCreateData = {
      orderId: signatureData.orderId,
      signatureData: signatureData.signatureData,
      signatureType: signatureData.signatureType,
    };

    const result = await saveCustomerSignature(customerSignatureData, termsAccepted);

    if (result.success && result.data) {
      return {
        success: true,
        data: {
          signatureId: result.data.id,
          isValid: true,
          savedAt: result.data.createdAt,
        },
      };
    }

    return {
      success: false,
      error: result.error || 'Не вдалося зберегти підпис',
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося зберегти підпис клієнта: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Валідація підпису
 */
export async function validateSignature(
  signatureData: string
): Promise<WizardOrderOperationResult<{ isValid: boolean; reason?: string }>> {
  try {
    // Базова валідація підпису
    const isValid = signatureData.length >= 10 && signatureData.includes('stroke');

    return {
      success: true,
      data: {
        isValid,
        reason: isValid ? undefined : 'Підпис не відповідає мінімальним вимогам',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Помилка валідації підпису: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання умов надання послуг
 */
export async function getTermsOfService(): Promise<WizardOrderOperationResult<WizardTermsData>> {
  try {
    // Поки що повертаємо статичні дані
    // У майбутньому можна інтегрувати з API
    const termsData: WizardTermsData = {
      terms: [
        'Термін виконання замовлення вказаний орієнтовно',
        'Хімчистка не несе відповідальності за ризики вказані у квитанції',
        'Вироби видаються тільки при наявності квитанції',
        'Претензії приймаються протягом 3 днів після видачі',
        'Клієнт несе відповідальність за достовірність наданих даних',
      ],
      documents: [
        {
          title: 'Закон України "Про захист прав споживачів"',
          url: 'https://zakon.rada.gov.ua/laws/show/1023-12',
          type: 'law',
        },
        {
          title: 'ДСТУ 7946:2015 "Послуги хімічної чистки"',
          url: 'https://dstu.gov.ua/ua/catalog/std?id=36895',
          type: 'standard',
        },
      ],
      version: '1.0',
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: termsData,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати умови послуг: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
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
