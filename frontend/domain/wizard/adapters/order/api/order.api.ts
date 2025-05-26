/**
 * @fileoverview API функції для основних операцій з замовленнями
 * @module domain/wizard/adapters/order/api
 */

import { OrderManagementBasicOperationsService } from '@/lib/api';

import {
  mapOrderDTOToDomain,
  mapOrderArrayToDomain,
  mapOrderToCreateRequest,
} from '../mappers';

import type {
  WizardOrder,
  WizardOrderCreateData,
  WizardOrderOperationResult,
  WizardOrderStatus,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання всіх замовлень
 */
export async function getAllOrders(): Promise<WizardOrderOperationResult<WizardOrder[]>> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.getAllOrders();
    const orders = mapOrderArrayToDomain(apiResponse);

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання замовлення за ID
 */
export async function getOrderById(id: string): Promise<WizardOrderOperationResult<WizardOrder>> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.getOrderById({ id });
    const order = mapOrderDTOToDomain(apiResponse);

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Створення нового замовлення
 */
export async function createOrder(
  orderData: WizardOrderCreateData
): Promise<WizardOrderOperationResult<WizardOrder>> {
  try {
    const createRequest = mapOrderToCreateRequest(orderData);
    const apiResponse = await OrderManagementBasicOperationsService.createOrder({
      requestBody: createRequest,
    });
    const order = mapOrderDTOToDomain(apiResponse);

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося створити замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Збереження чернетки замовлення
 */
export async function saveOrderDraft(
  orderData: WizardOrderCreateData
): Promise<WizardOrderOperationResult<WizardOrder>> {
  try {
    const createRequest = mapOrderToCreateRequest({ ...orderData, draft: true });
    const apiResponse = await OrderManagementBasicOperationsService.saveOrderDraft({
      requestBody: createRequest,
    });
    const order = mapOrderDTOToDomain(apiResponse);

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося зберегти чернетку замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання всіх чернеток замовлень
 */
export async function getDraftOrders(): Promise<WizardOrderOperationResult<WizardOrder[]>> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.getDraftOrders();
    const orders = mapOrderArrayToDomain(apiResponse);

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати чернетки замовлень: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Перетворення чернетки в замовлення
 */
export async function convertDraftToOrder(
  id: string
): Promise<WizardOrderOperationResult<WizardOrder>> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.convertDraftToOrder({ id });
    const order = mapOrderDTOToDomain(apiResponse);

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося перетворити чернетку в замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання всіх активних замовлень
 */
export async function getActiveOrders(): Promise<WizardOrderOperationResult<WizardOrder[]>> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.getActiveOrders();
    const orders = mapOrderArrayToDomain(apiResponse);

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати активні замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Оновлення статусу замовлення
 */
export async function updateOrderStatus(
  id: string,
  status: WizardOrderStatus
): Promise<WizardOrderOperationResult<WizardOrder>> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.updateOrderStatus({
      id,
      status: status as 'DRAFT' | 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED',
    });
    const order = mapOrderDTOToDomain(apiResponse);

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося оновити статус замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Завершення замовлення
 */
export async function completeOrder(id: string): Promise<WizardOrderOperationResult<WizardOrder>> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.completeOrder({ id });
    const order = mapOrderDTOToDomain(apiResponse);

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося завершити замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Скасування замовлення
 */
export async function cancelOrder(id: string): Promise<WizardOrderOperationResult<void>> {
  try {
    await OrderManagementBasicOperationsService.cancelOrder({ id });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося скасувати замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Додавання передоплати до замовлення
 */
export async function addPrepayment(
  id: string,
  amount: number
): Promise<WizardOrderOperationResult<WizardOrder>> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.addPrepayment({
      id,
      amount,
    });
    const order = mapOrderDTOToDomain(apiResponse);

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося додати передоплату: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Застосування знижки до замовлення
 */
export async function applyDiscount(
  id: string,
  amount: number
): Promise<WizardOrderOperationResult<WizardOrder>> {
  try {
    const apiResponse = await OrderManagementBasicOperationsService.applyDiscount({
      id,
      amount,
    });
    const order = mapOrderDTOToDomain(apiResponse);

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося застосувати знижку: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
