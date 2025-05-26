/**
 * @fileoverview API функції для роботи з додатковими вимогами до замовлень
 * @module domain/wizard/adapters/order/api
 */

import { AdditionalRequirementsForOrderService } from '@/lib/api';

import type {
  WizardAdditionalRequirementsData,
  WizardAdditionalRequirementsResult,
  WizardOrderOperationResult,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання додаткових вимог до замовлення
 * Повертає поточні додаткові вимоги та примітки клієнта до замовлення
 */
export async function getOrderRequirements(
  orderId: string
): Promise<WizardOrderOperationResult<WizardAdditionalRequirementsResult>> {
  try {
    const apiResponse = await AdditionalRequirementsForOrderService.getRequirements({
      orderId,
    });

    // Валідація відповіді
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error('Отримано некоректну відповідь від API');
    }

    // Перетворюємо відповідь в типізований формат
    const result: WizardAdditionalRequirementsResult = {
      orderId: String(apiResponse.orderId || orderId),
      additionalRequirements: apiResponse.additionalRequirements
        ? String(apiResponse.additionalRequirements)
        : undefined,
      customerNotes: apiResponse.customerNotes ? String(apiResponse.customerNotes) : undefined,
      updatedAt: apiResponse.updatedAt ? String(apiResponse.updatedAt) : undefined,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати додаткові вимоги: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Оновлення додаткових вимог до замовлення
 * Зберігає додаткові вимоги та примітки клієнта до замовлення
 */
export async function updateOrderRequirements(
  requirementsData: WizardAdditionalRequirementsData
): Promise<WizardOrderOperationResult<WizardAdditionalRequirementsResult>> {
  try {
    const requestBody = {
      orderId: requirementsData.orderId,
      additionalRequirements: requirementsData.additionalRequirements,
      customerNotes: requirementsData.customerNotes,
    };

    const apiResponse = await AdditionalRequirementsForOrderService.updateRequirements({
      orderId: requirementsData.orderId,
      requestBody,
    });

    // Валідація відповіді
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error('Отримано некоректну відповідь від API');
    }

    // Перетворюємо відповідь в типізований формат
    const result: WizardAdditionalRequirementsResult = {
      orderId: String(apiResponse.orderId || requirementsData.orderId),
      additionalRequirements: apiResponse.additionalRequirements
        ? String(apiResponse.additionalRequirements)
        : undefined,
      customerNotes: apiResponse.customerNotes ? String(apiResponse.customerNotes) : undefined,
      updatedAt: apiResponse.updatedAt ? String(apiResponse.updatedAt) : undefined,
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося оновити додаткові вимоги: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
