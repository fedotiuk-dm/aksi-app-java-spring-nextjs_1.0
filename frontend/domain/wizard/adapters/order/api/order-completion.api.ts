/**
 * @fileoverview API функції для роботи з завершенням замовлень
 * @module domain/wizard/adapters/order/api
 */

import {
  OrderCompletionService,
  OrderCompletionUpdateRequest,
  CompletionDateCalculationRequest,
} from '@/lib/api';

import type {
  WizardOrderCompletionUpdateData,
  WizardCompletionDateCalculationData,
  WizardOrderCompletionResult,
  WizardCompletionDateCalculationResult,
  WizardOrderOperationResult,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Конвертує наш тип WizardExpediteType в API тип
 */
function convertExpediteTypeToApi(expediteType: string): OrderCompletionUpdateRequest.expediteType {
  switch (expediteType) {
    case 'STANDARD':
      return OrderCompletionUpdateRequest.expediteType.STANDARD;
    case 'EXPRESS_48H':
      return OrderCompletionUpdateRequest.expediteType.EXPRESS_48H;
    case 'EXPRESS_24H':
      return OrderCompletionUpdateRequest.expediteType.EXPRESS_24H;
    default:
      return OrderCompletionUpdateRequest.expediteType.STANDARD;
  }
}

/**
 * Конвертує наш тип WizardExpediteType в API тип для розрахунку дати
 */
function convertExpediteTypeToCalculationApi(
  expediteType: string
): CompletionDateCalculationRequest.expediteType {
  switch (expediteType) {
    case 'STANDARD':
      return CompletionDateCalculationRequest.expediteType.STANDARD;
    case 'EXPRESS_48H':
      return CompletionDateCalculationRequest.expediteType.EXPRESS_48H;
    case 'EXPRESS_24H':
      return CompletionDateCalculationRequest.expediteType.EXPRESS_24H;
    default:
      return CompletionDateCalculationRequest.expediteType.STANDARD;
  }
}

/**
 * Оновлення параметрів виконання замовлення
 * Оновлює тип терміновості та очікувану дату завершення замовлення
 */
export async function updateOrderCompletion(
  completionData: WizardOrderCompletionUpdateData
): Promise<WizardOrderOperationResult<WizardOrderCompletionResult>> {
  try {
    const requestBody: OrderCompletionUpdateRequest = {
      orderId: completionData.orderId,
      expediteType: convertExpediteTypeToApi(completionData.expediteType),
      expectedCompletionDate: completionData.expectedCompletionDate,
    };

    const apiResponse = await OrderCompletionService.updateOrderCompletion({
      requestBody,
    });

    // Валідація відповіді
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error('Отримано некоректну відповідь від API');
    }

    // Перетворюємо відповідь в типізований формат
    const result: WizardOrderCompletionResult = {
      orderId: String(apiResponse.orderId || completionData.orderId),
      expediteType: String(apiResponse.expediteType || completionData.expediteType),
      expectedCompletionDate: String(
        apiResponse.expectedCompletionDate || completionData.expectedCompletionDate
      ),
      expediteSurcharge: apiResponse.expediteSurcharge ? Number(apiResponse.expediteSurcharge) : 0,
      updatedAt: apiResponse.updatedAt ? String(apiResponse.updatedAt) : undefined,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося оновити параметри виконання: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Розрахунок очікуваної дати завершення замовлення
 * Розраховує дату завершення на основі категорій послуг та типу терміновості
 */
export async function calculateCompletionDate(
  calculationData: WizardCompletionDateCalculationData
): Promise<WizardOrderOperationResult<WizardCompletionDateCalculationResult>> {
  try {
    const requestBody: CompletionDateCalculationRequest = {
      serviceCategoryIds: calculationData.serviceCategoryIds,
      expediteType: convertExpediteTypeToCalculationApi(calculationData.expediteType),
    };

    const apiResponse = await OrderCompletionService.calculateCompletionDate({
      requestBody,
    });

    // Валідація відповіді
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error('Отримано некоректну відповідь від API');
    }

    // Перетворюємо відповідь в типізований формат
    const result: WizardCompletionDateCalculationResult = {
      expectedCompletionDate: String(apiResponse.expectedCompletionDate || ''),
      expediteType: String(apiResponse.expediteType || calculationData.expediteType),
      expediteSurcharge: apiResponse.expediteSurcharge ? Number(apiResponse.expediteSurcharge) : 0,
      standardCompletionDate: apiResponse.standardCompletionDate
        ? String(apiResponse.standardCompletionDate)
        : undefined,
      calculatedAt: apiResponse.calculatedAt ? String(apiResponse.calculatedAt) : undefined,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося розрахувати дату завершення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
