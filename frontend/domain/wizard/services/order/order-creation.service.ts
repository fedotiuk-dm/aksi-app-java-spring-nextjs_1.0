/**
 * @fileoverview Сервіс створення замовлень
 * @module domain/wizard/services/order/order-creation
 */

import { OperationResultFactory } from '../interfaces';
import { priceCalculationService } from '../pricing';

import type {
  OrderDomain,
  CreateOrderDomainRequest,
  CreateOrderItemDomainRequest,
} from './order-domain.types';
import type { IOrderCreationService } from './order.interfaces';
import type { OperationResult, ValidationOperationResult } from '../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    CREATION_FAILED: 'Помилка створення замовлення',
    VALIDATION_FAILED: 'Помилка валідації замовлення',
    CALCULATION_FAILED: 'Помилка розрахунку замовлення',
    RECEIPT_GENERATION_FAILED: 'Помилка генерації номера квитанції',
    CLIENT_REQUIRED: "Клієнт є обов'язковим",
    BRANCH_REQUIRED: "Філія є обов'язкова",
    ITEMS_REQUIRED: "Предмети замовлення є обов'язковими",
    INVALID_PAYMENT: 'Некоректні дані оплати',
    INVALID_DATE: 'Некоректна дата виконання',
    UNKNOWN: 'Невідома помилка',
  },
  VALIDATION: {
    MIN_ITEMS: 1,
    MAX_ITEMS: 50,
    MIN_QUANTITY: 0.01,
    MAX_QUANTITY: 1000,
    MAX_NOTES_LENGTH: 1000,
    MIN_COMPLETION_DAYS: 1,
    MAX_COMPLETION_DAYS: 30,
  },
  RECEIPT_NUMBER: {
    PREFIX: 'RC',
    LENGTH: 8,
  },
} as const;

/**
 * Сервіс створення замовлень
 * Відповідальність: валідація, розрахунки, генерація номерів квитанцій
 */
export class OrderCreationService implements IOrderCreationService {
  public readonly name = 'OrderCreationService';
  public readonly version = '1.0.0';

  /**
   * Створення замовлення (тільки бізнес-логіка)
   * Адаптер викликається в хуках домену
   */
  async createOrder(request: CreateOrderDomainRequest): Promise<OperationResult<OrderDomain>> {
    try {
      // Валідація запиту
      const validationResult = this.validateOrderRequest(request);
      if (!validationResult.isValid) {
        const errorMessages = (validationResult.validationErrors || []).map((e) => e.message);
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${errorMessages.join(', ')}`
        );
      }

      // Генерація номера квитанції
      const receiptNumberResult = this.generateReceiptNumber();
      if (!receiptNumberResult.success || !receiptNumberResult.data) {
        return OperationResultFactory.error(
          receiptNumberResult.error || CONSTANTS.ERROR_MESSAGES.RECEIPT_GENERATION_FAILED
        );
      }

      // Розрахунок загальної вартості
      const totalResult = await this.calculateOrderTotal(request);
      if (!totalResult.success || totalResult.data === undefined) {
        return OperationResultFactory.error(
          totalResult.error || CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED
        );
      }

      // Створення доменного об'єкта замовлення
      const order: OrderDomain = {
        id: '', // Буде встановлено адаптером
        receiptNumber: receiptNumberResult.data,
        clientId: request.clientId,
        branchId: request.branchId,
        operatorId: request.operatorId || this.getCurrentOperatorId(),
        status: 'DRAFT',
        items: [], // Буде заповнено адаптером
        totalAmount: totalResult.data.totalAmount,
        paidAmount: request.paidAmount || 0,
        remainingAmount: totalResult.data.totalAmount - (request.paidAmount || 0),
        paymentMethod: request.paymentMethod || 'CASH',
        discountAmount: totalResult.data.discountAmount,
        expediteType: request.expediteType || 'STANDARD',
        expediteFee: totalResult.data.expediteFee,
        completionDate: request.completionDate,
        notes: request.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return OperationResultFactory.success(order);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CREATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація запиту створення замовлення
   */
  validateOrderRequest(
    request: CreateOrderDomainRequest
  ): ValidationOperationResult<CreateOrderDomainRequest> {
    const validationErrors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація основних полів
    validationErrors.push(...this.validateBasicFields(request));

    // Валідація предметів
    validationErrors.push(...this.validateItems(request.items));

    // Валідація дати виконання
    validationErrors.push(...this.validateCompletionDate(request.completionDate));

    // Валідація приміток та оплати
    validationErrors.push(...this.validateNotesAndPayment(request));

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
   * Валідація основних полів замовлення
   */
  private validateBasicFields(
    request: CreateOrderDomainRequest
  ): Array<{ field: string; message: string; code: string }> {
    const errors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація клієнта
    if (!request.clientId?.trim()) {
      errors.push({
        field: 'clientId',
        message: "ID клієнта є обов'язковим",
        code: 'REQUIRED',
      });
    }

    // Валідація філії
    if (!request.branchId?.trim()) {
      errors.push({
        field: 'branchId',
        message: "ID філії є обов'язковим",
        code: 'REQUIRED',
      });
    }

    return errors;
  }

  /**
   * Валідація предметів замовлення
   */
  private validateItems(
    items: CreateOrderItemDomainRequest[]
  ): Array<{ field: string; message: string; code: string }> {
    const errors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація наявності предметів
    if (!items || items.length === 0) {
      errors.push({
        field: 'items',
        message: 'Замовлення повинно містити хоча б один предмет',
        code: 'REQUIRED',
      });
    } else if (items.length > CONSTANTS.VALIDATION.MAX_ITEMS) {
      errors.push({
        field: 'items',
        message: `Максимальна кількість предметів: ${CONSTANTS.VALIDATION.MAX_ITEMS}`,
        code: 'MAX_LENGTH',
      });
    }

    // Валідація кожного предмета
    items?.forEach((item, index) => {
      const itemErrors = this.validateOrderItem(item, index);
      errors.push(...itemErrors);
    });

    return errors;
  }

  /**
   * Валідація дати виконання
   */
  private validateCompletionDate(
    completionDate: Date
  ): Array<{ field: string; message: string; code: string }> {
    const errors: Array<{ field: string; message: string; code: string }> = [];

    if (!completionDate) {
      errors.push({
        field: 'completionDate',
        message: "Дата виконання є обов'язковою",
        code: 'REQUIRED',
      });
    } else {
      const daysDiff = Math.ceil(
        (completionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff < CONSTANTS.VALIDATION.MIN_COMPLETION_DAYS) {
        errors.push({
          field: 'completionDate',
          message: `Мінімальний термін виконання: ${CONSTANTS.VALIDATION.MIN_COMPLETION_DAYS} день`,
          code: 'MIN_VALUE',
        });
      } else if (daysDiff > CONSTANTS.VALIDATION.MAX_COMPLETION_DAYS) {
        errors.push({
          field: 'completionDate',
          message: `Максимальний термін виконання: ${CONSTANTS.VALIDATION.MAX_COMPLETION_DAYS} днів`,
          code: 'MAX_VALUE',
        });
      }
    }

    return errors;
  }

  /**
   * Валідація приміток та оплати
   */
  private validateNotesAndPayment(
    request: CreateOrderDomainRequest
  ): Array<{ field: string; message: string; code: string }> {
    const errors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація приміток
    if (request.notes && request.notes.length > CONSTANTS.VALIDATION.MAX_NOTES_LENGTH) {
      errors.push({
        field: 'notes',
        message: `Примітки не можуть перевищувати ${CONSTANTS.VALIDATION.MAX_NOTES_LENGTH} символів`,
        code: 'MAX_LENGTH',
      });
    }

    // Валідація передоплати
    if (request.paidAmount !== undefined && request.paidAmount < 0) {
      errors.push({
        field: 'paidAmount',
        message: "Сума передоплати не може бути від'ємною",
        code: 'INVALID_VALUE',
      });
    }

    return errors;
  }

  /**
   * Валідація предмета замовлення
   */
  private validateOrderItem(
    item: CreateOrderItemDomainRequest,
    index: number
  ): Array<{ field: string; message: string; code: string }> {
    const errors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація послуги
    if (!item.serviceId?.trim()) {
      errors.push({
        field: `items[${index}].serviceId`,
        message: "ID послуги є обов'язковим",
        code: 'REQUIRED',
      });
    }

    // Валідація кількості
    if (!item.quantity || item.quantity <= 0) {
      errors.push({
        field: `items[${index}].quantity`,
        message: 'Кількість повинна бути більше 0',
        code: 'INVALID_VALUE',
      });
    }

    return errors;
  }

  /**
   * Генерація номера квитанції
   */
  generateReceiptNumber(): OperationResult<string> {
    try {
      const timestamp = Date.now().toString();
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      const receiptNumber = `${CONSTANTS.RECEIPT_NUMBER.PREFIX}${timestamp.slice(-4)}${randomPart}`;

      return OperationResultFactory.success(receiptNumber);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.RECEIPT_GENERATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Розрахунок загальної вартості замовлення
   */
  async calculateOrderTotal(request: CreateOrderDomainRequest): Promise<
    OperationResult<{
      totalAmount: number;
      discountAmount: number;
      expediteFee: number;
    }>
  > {
    try {
      // Розрахунок базової суми всіх предметів через pricing service
      let itemsTotal = 0;

      // Розрахунок ціни для кожного предмета
      const priceResults = await Promise.all(
        request.items.map(async (item) => {
          const priceRequest = {
            serviceId: item.serviceId,
            quantity: item.quantity,
            unitOfMeasure: item.unitOfMeasure,
            modifierIds: item.modifierIds || [],
            expediteType: request.expediteType || 'STANDARD',
          };

          const result = await priceCalculationService.calculatePrice(priceRequest);
          return result.success ? result.data?.totalPrice || 0 : 0;
        })
      );

      itemsTotal = priceResults.reduce((sum: number, price: number) => sum + price, 0);

      // Розрахунок знижки
      const discountAmount = this.calculateDiscount(itemsTotal, request.discountType);

      // Розрахунок надбавки за терміновість
      const expediteFee = this.calculateExpediteFee(itemsTotal, request.expediteType);

      // Загальна сума
      const totalAmount = itemsTotal - discountAmount + expediteFee;

      return OperationResultFactory.success({
        totalAmount,
        discountAmount,
        expediteFee,
      });
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Розрахунок знижки
   */
  private calculateDiscount(amount: number, discountType?: string): number {
    if (!discountType || discountType === 'NONE') {
      return 0;
    }

    switch (discountType) {
      case 'EVERCARD':
        return amount * 0.1; // 10%
      case 'SOCIAL_MEDIA':
        return amount * 0.05; // 5%
      case 'MILITARY':
        return amount * 0.1; // 10%
      default:
        return 0;
    }
  }

  /**
   * Розрахунок надбавки за терміновість
   */
  private calculateExpediteFee(amount: number, expediteType?: string): number {
    if (!expediteType || expediteType === 'STANDARD') {
      return 0;
    }

    switch (expediteType) {
      case 'URGENT_48H':
        return amount * 0.5; // +50%
      case 'URGENT_24H':
        return amount * 1.0; // +100%
      default:
        return 0;
    }
  }

  /**
   * Отримання ID поточного оператора
   * В реальному додатку буде отримуватися з контексту автентифікації
   */
  private getCurrentOperatorId(): string {
    // В реальному додатку це буде отримуватися з контексту автентифікації
    // Наприклад, з JWT токена або сесії користувача
    return 'system-operator';
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const orderCreationService = new OrderCreationService();
