/**
 * @fileoverview API функції для ініціалізації замовлень
 *
 * Логіка роботи:
 * - Номер квитанції генерується автоматично на бекенді при створенні замовлення
 * - Унікальна мітка вводиться вручну користувачем і повинна бути унікальною в системі
 * - Перед створенням замовлення обов'язково перевіряється унікальність мітки
 *
 * @module domain/wizard/adapters/order/api
 */

import { OrdersService } from '@/lib/api';

import type { WizardOrderOperationResult, WizardOrderInitializationResult } from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Валідація формату унікальної мітки
 * @param label Унікальна мітка для валідації
 */
export function validateUniqueLabel(label: string): { isValid: boolean; error?: string } {
  if (!label || label.trim().length === 0) {
    return { isValid: false, error: 'Унікальна мітка не може бути порожньою' };
  }

  if (label.length < 3) {
    return { isValid: false, error: 'Унікальна мітка повинна містити мінімум 3 символи' };
  }

  if (label.length > 50) {
    return { isValid: false, error: 'Унікальна мітка не може містити більше 50 символів' };
  }

  // Перевірка на допустимі символи (літери, цифри, дефіс, підкреслення)
  const validPattern = /^[a-zA-Z0-9\-_]+$/;
  if (!validPattern.test(label)) {
    return {
      isValid: false,
      error: 'Унікальна мітка може містити тільки літери, цифри, дефіс та підкреслення',
    };
  }

  return { isValid: true };
}

/**
 * Перевірка унікальності мітки замовлення
 * Важливо: унікальна мітка вводиться вручну і повинна бути унікальною в системі
 * @param label Унікальна мітка для перевірки
 * @param excludeOrderId ID замовлення, яке треба виключити з перевірки (для редагування)
 */
export async function checkUniqueLabelExists(
  label: string,
  excludeOrderId?: string
): Promise<WizardOrderOperationResult<boolean>> {
  try {
    // TODO: Реалізувати після додавання OrderInitializationService в API
    // Тимчасово використовуємо пошук через OrdersService
    const orders = await OrdersService.getAllOrders();

    // Перевіряємо, чи існує замовлення з такою міткою
    const existingOrder = orders.find(
      (order) => order.tagNumber === label && order.id !== excludeOrderId
    );

    return {
      success: true,
      data: !!existingOrder, // true якщо мітка вже існує
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося перевірити унікальність мітки: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Ініціалізація нового замовлення
 * @param uniqueLabel Унікальна мітка (вводиться вручну)
 * @param branchId ID філії
 * @param clientId ID клієнта (опціонально, може бути встановлено пізніше)
 */
export async function initializeOrder(
  uniqueLabel: string,
  branchId: string,
  clientId?: string
): Promise<WizardOrderOperationResult<WizardOrderInitializationResult>> {
  try {
    // TODO: Реалізувати після додавання OrderInitializationService в API
    // Тимчасово використовуємо createOrder з OrdersService
    const createOrderRequest = {
      tagNumber: uniqueLabel, // Унікальна мітка вводиться вручну
      clientId: clientId || '', // Може бути встановлено пізніше
      branchLocationId: branchId,
      items: [],
      draft: true, // Створюємо як чернетку
    };

    const response = await OrdersService.createOrder({
      requestBody: createOrderRequest,
    });

    return {
      success: true,
      data: {
        orderId: response.id || '',
        receiptNumber: response.receiptNumber, // Номер квитанції генерується автоматично на бекенді
        tagNumber: uniqueLabel, // Унікальна мітка, введена вручну
        createdAt: response.createdDate,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося ініціалізувати замовлення: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
