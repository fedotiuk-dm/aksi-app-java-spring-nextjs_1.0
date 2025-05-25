/**
 * @fileoverview Сервіс управління замовленнями
 * @module domain/wizard/services/order/order-management
 */

import { OperationResultFactory } from '../interfaces';

import type { OrderDomain, UpdateOrderDomainRequest, OrderStatus } from './order-domain.types';
import type { IOrderManagementService } from './order.interfaces';
import type { OperationResult, ValidationOperationResult } from '../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    UPDATE_FAILED: 'Помилка оновлення замовлення',
    ORDER_NOT_FOUND: 'Замовлення не знайдено',
    INVALID_STATUS_TRANSITION: 'Некоректний перехід статусу',
    INVALID_PAYMENT_AMOUNT: 'Некоректна сума платежу',
    PAYMENT_EXCEEDS_TOTAL: 'Сума платежу перевищує загальну вартість',
    VALIDATION_FAILED: 'Помилка валідації',
    UNKNOWN: 'Невідома помилка',
    ORDER_ID_REQUIRED: "ID замовлення є обов'язковим",
  },
  STATUS_TRANSITIONS: {
    DRAFT: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['READY', 'CANCELLED'],
    READY: ['COMPLETED'],
    COMPLETED: [],
    CANCELLED: [],
  } as Record<OrderStatus, OrderStatus[]>,
} as const;

/**
 * Сервіс управління замовленнями
 * Відповідальність: оновлення замовлень, зміна статусів, управління платежами
 */
export class OrderManagementService implements IOrderManagementService {
  public readonly name = 'OrderManagementService';
  public readonly version = '1.0.0';

  /**
   * Оновлення замовлення
   */
  async updateOrder(
    id: string,
    request: UpdateOrderDomainRequest
  ): Promise<OperationResult<OrderDomain>> {
    try {
      if (!id?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.ORDER_ID_REQUIRED);
      }

      // Валідація запиту
      const validationResult = this.validateUpdateRequest(request);
      if (!validationResult.isValid) {
        const errorMessages = (validationResult.validationErrors || []).map((e) => e.message);
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${errorMessages.join(', ')}`
        );
      }

      // Адаптер викликається в хуках домену для збереження в API
      // Тимчасова заглушка для демонстрації структури
      const updatedOrder: OrderDomain = {
        id,
        receiptNumber: 'RC001',
        clientId: 'client1',
        branchId: 'branch1',
        operatorId: 'operator1',
        status: request.status || 'DRAFT',
        items: [],
        totalAmount: 100,
        paidAmount: request.paidAmount || 0,
        remainingAmount: 100 - (request.paidAmount || 0),
        paymentMethod: request.paymentMethod || 'CASH',
        discountAmount: 0,
        expediteType: 'STANDARD',
        expediteFee: 0,
        completionDate: request.completionDate || new Date(),
        notes: request.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return OperationResultFactory.success(updatedOrder);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Оновлення статусу замовлення
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<OperationResult<OrderDomain>> {
    try {
      if (!id?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.ORDER_ID_REQUIRED);
      }

      // Отримання поточного замовлення для перевірки переходу статусу
      // Адаптер викликається в хуках домену
      // Тимчасова заглушка для уникнення помилок типів
      const currentOrder: OrderDomain = {
        id,
        receiptNumber: 'RC001',
        clientId: 'client1',
        branchId: 'branch1',
        operatorId: 'operator1',
        status: 'DRAFT',
        items: [],
        totalAmount: 100,
        paidAmount: 0,
        remainingAmount: 100,
        paymentMethod: 'CASH',
        discountAmount: 0,
        expediteType: 'STANDARD',
        expediteFee: 0,
        completionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Валідація переходу статусу
      const isValidTransition = this.isValidStatusTransition(currentOrder.status, status);
      if (!isValidTransition) {
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.INVALID_STATUS_TRANSITION}: ${currentOrder.status} -> ${status}`
        );
      }

      return await this.updateOrder(id, { status });
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Скасування замовлення
   */
  async cancelOrder(id: string, reason?: string): Promise<OperationResult<OrderDomain>> {
    try {
      const notes = reason ? `Скасовано: ${reason}` : 'Замовлення скасовано';

      return await this.updateOrder(id, {
        status: 'CANCELLED',
        notes,
      });
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Завершення замовлення
   */
  async completeOrder(id: string): Promise<OperationResult<OrderDomain>> {
    try {
      // Додаткові перевірки перед завершенням
      // - Чи всі предмети готові
      // - Чи оплачено повністю
      // Ці перевірки будуть реалізовані в хуках домену

      return await this.updateOrderStatus(id, 'COMPLETED');
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Додавання платежу
   */
  async addPayment(id: string, amount: number): Promise<OperationResult<OrderDomain>> {
    try {
      if (!id?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.ORDER_ID_REQUIRED);
      }

      if (amount <= 0) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.INVALID_PAYMENT_AMOUNT);
      }

      // Отримання поточного замовлення
      // Адаптер викликається в хуках домену
      const currentOrder: OrderDomain = {
        id,
        receiptNumber: 'RC001',
        clientId: 'client1',
        branchId: 'branch1',
        operatorId: 'operator1',
        status: 'DRAFT',
        items: [],
        totalAmount: 100,
        paidAmount: 0,
        remainingAmount: 100,
        paymentMethod: 'CASH',
        discountAmount: 0,
        expediteType: 'STANDARD',
        expediteFee: 0,
        completionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newPaidAmount = currentOrder.paidAmount + amount;

      // Перевірка що платіж не перевищує загальну суму
      if (newPaidAmount > currentOrder.totalAmount) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.PAYMENT_EXCEEDS_TOTAL);
      }

      return await this.updateOrder(id, {
        paidAmount: newPaidAmount,
      });
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація запиту оновлення
   */
  private validateUpdateRequest(
    request: UpdateOrderDomainRequest
  ): ValidationOperationResult<UpdateOrderDomainRequest> {
    const validationErrors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація суми оплати
    if (request.paidAmount !== undefined && request.paidAmount < 0) {
      validationErrors.push({
        field: 'paidAmount',
        message: "Сума оплати не може бути від'ємною",
        code: 'INVALID_VALUE',
      });
    }

    // Валідація дати виконання
    if (request.completionDate && request.completionDate <= new Date()) {
      validationErrors.push({
        field: 'completionDate',
        message: 'Дата виконання повинна бути в майбутньому',
        code: 'INVALID_DATE',
      });
    }

    // Валідація приміток
    if (request.notes && request.notes.length > 1000) {
      validationErrors.push({
        field: 'notes',
        message: 'Примітки не можуть перевищувати 1000 символів',
        code: 'MAX_LENGTH',
      });
    }

    const isValid = validationErrors.length === 0;

    return {
      success: isValid,
      data: isValid ? request : undefined,
      error: isValid ? undefined : CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED,
      validationErrors,
      isValid,
      timestamp: new Date(),
    };
  }

  /**
   * Перевірка валідності переходу статусу
   */
  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const allowedTransitions = CONSTANTS.STATUS_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Отримання доступних статусів для переходу
   */
  getAvailableStatusTransitions(currentStatus: OrderStatus): OrderStatus[] {
    return CONSTANTS.STATUS_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Перевірка чи можна скасувати замовлення
   */
  canCancelOrder(status: OrderStatus): boolean {
    return ['DRAFT', 'CONFIRMED', 'IN_PROGRESS'].includes(status);
  }

  /**
   * Перевірка чи можна завершити замовлення
   */
  canCompleteOrder(status: OrderStatus): boolean {
    return status === 'READY';
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const orderManagementService = new OrderManagementService();
