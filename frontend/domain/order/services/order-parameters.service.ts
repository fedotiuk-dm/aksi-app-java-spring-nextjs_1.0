/**
 * Сервіс для роботи з параметрами замовлення
 * Реалізує DDD Domain Service для управління бізнес-логікою параметрів замовлення
 */

import { DiscountType, PaymentMethod } from '../types';

import type { UrgencyOption, OrderOperationResult } from '../types';

/**
 * Дані параметрів замовлення для збереження
 */
export interface OrderParametersData {
  executionParams: {
    executionDate: Date | null;
    urgencyOption: UrgencyOption;
    customDeadline: Date | null;
    isUrgent: boolean;
  };
  discountParams: {
    discountType: DiscountType;
    discountPercentage: number;
    isDiscountApplicable: boolean;
    discountExclusions: string[];
  };
  paymentParams: {
    paymentMethod: PaymentMethod;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    prepaymentAmount: number;
    balanceAmount: number;
  };
  additionalInfo: {
    orderNotes: string;
    clientRequirements: string;
  };
}

/**
 * Параметри замовлення з сервера
 */
export interface ServerOrderParameters {
  executionDate?: string;
  urgencyOption?: UrgencyOption;
  customDeadline?: string;
  discountType?: DiscountType;
  discountPercentage?: number;
  paymentMethod?: PaymentMethod;
  totalAmount?: number;
  prepaymentAmount?: number;
  orderNotes?: string;
  clientRequirements?: string;
}

/**
 * Order Parameters Domain Service
 */
export class OrderParametersService {
  /**
   * Збереження параметрів замовлення
   */
  static async saveOrderParameters(
    orderId: string,
    parameters: OrderParametersData
  ): Promise<OrderOperationResult> {
    try {
      // TODO: Інтеграція з реальним API
      console.log('OrderParametersService.saveOrderParameters:', { orderId, parameters });

      // Симуляція API виклику
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Симуляція валідації
      const validationResult = this.validateParametersForSave(parameters);
      if (!validationResult.success) {
        return validationResult;
      }

      // Симуляція успішного збереження
      return {
        order: null,
        success: true,
        errors: null,
        warnings: ['Параметри замовлення збережено успішно'],
      };
    } catch (error) {
      console.error('Error saving order parameters:', error);
      return {
        order: null,
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка збереження',
        },
      };
    }
  }

  /**
   * Завантаження параметрів замовлення
   */
  static async loadOrderParameters(orderId: string): Promise<OrderOperationResult> {
    try {
      // TODO: Інтеграція з реальним API
      console.log('OrderParametersService.loadOrderParameters:', { orderId });

      // Симуляція API виклику
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Симуляція завантаження даних
      const mockData: ServerOrderParameters = {
        executionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 дні
        urgencyOption: 'STANDARD',
        discountType: DiscountType.NONE,
        discountPercentage: 0,
        paymentMethod: PaymentMethod.CASH,
        totalAmount: 0,
        prepaymentAmount: 0,
        orderNotes: '',
        clientRequirements: '',
      };

      return {
        order: mockData as any,
        success: true,
        errors: null,
        warnings: ['Параметри замовлення завантажено успішно'],
      };
    } catch (error) {
      console.error('Error loading order parameters:', error);
      return {
        order: null,
        success: false,
        errors: {
          general: error instanceof Error ? error.message : 'Невідома помилка завантаження',
        },
      };
    }
  }

  /**
   * Розрахунок дати виконання з урахуванням терміновості
   */
  static calculateExecutionDate(urgencyOption: UrgencyOption, startDate: Date = new Date()): Date {
    const calculationDate = new Date(startDate);

    switch (urgencyOption) {
      case 'URGENT_24H':
        calculationDate.setDate(calculationDate.getDate() + 1);
        break;
      case 'URGENT_48H':
        calculationDate.setDate(calculationDate.getDate() + 2);
        break;
      case 'STANDARD':
      default:
        calculationDate.setDate(calculationDate.getDate() + 3); // Стандартний термін 3 дні
        break;
    }

    return calculationDate;
  }

  /**
   * Розрахунок ціни з урахуванням терміновості
   */
  static calculateUrgencyMultiplier(urgencyOption: UrgencyOption): number {
    switch (urgencyOption) {
      case 'URGENT_24H':
        return 2.0; // +100%
      case 'URGENT_48H':
        return 1.5; // +50%
      case 'STANDARD':
      case 'CUSTOM':
      default:
        return 1.0; // Без надбавки
    }
  }

  /**
   * Перевірка чи знижка може бути застосована
   */
  static isDiscountApplicable(
    discountType: DiscountType,
    serviceCategories: string[] = []
  ): boolean {
    if (discountType === DiscountType.NONE) return true;

    // Знижки не діють на прасування, прання і фарбування текстилю
    const excludedCategories = ['IRONING', 'WASHING', 'DYEING'];
    const hasExcludedServices = serviceCategories.some((category) =>
      excludedCategories.includes(category)
    );

    return !hasExcludedServices;
  }

  /**
   * Валідація параметрів перед збереженням
   */
  private static validateParametersForSave(parameters: OrderParametersData): OrderOperationResult {
    const errors: Record<string, string> = {};

    // Валідація дати виконання
    if (!parameters.executionParams.executionDate) {
      errors.executionDate = "Дата виконання обов'язкова";
    } else if (parameters.executionParams.executionDate < new Date()) {
      errors.executionDate = 'Дата виконання не може бути в минулому';
    }

    // Валідація знижки
    if (
      parameters.discountParams.discountType !== DiscountType.NONE &&
      parameters.discountParams.discountPercentage <= 0
    ) {
      errors.discountPercentage = 'Відсоток знижки повинен бути більше 0';
    }

    if (parameters.discountParams.discountPercentage > 100) {
      errors.discountPercentage = 'Відсоток знижки не може перевищувати 100%';
    }

    // Валідація оплати
    if (parameters.paymentParams.totalAmount < 0) {
      errors.totalAmount = "Загальна сума не може бути від'ємною";
    }

    if (parameters.paymentParams.prepaymentAmount < 0) {
      errors.prepaymentAmount = "Передоплата не може бути від'ємною";
    }

    if (parameters.paymentParams.prepaymentAmount > parameters.paymentParams.finalAmount) {
      errors.prepaymentAmount = 'Передоплата не може перевищувати загальну суму';
    }

    // Повернення результату валідації
    if (Object.keys(errors).length > 0) {
      return {
        order: null,
        success: false,
        errors: {
          general: 'Помилки валідації параметрів',
          ...errors,
        },
      };
    }

    return {
      order: null,
      success: true,
      errors: null,
    };
  }

  /**
   * Розрахунок фінансових сум
   */
  static calculateFinancialAmounts(
    totalAmount: number,
    discountAmount: number,
    prepaymentAmount: number
  ): {
    finalAmount: number;
    balanceAmount: number;
  } {
    const finalAmount = Math.max(0, totalAmount - discountAmount);
    const balanceAmount = Math.max(0, finalAmount - prepaymentAmount);

    return {
      finalAmount,
      balanceAmount,
    };
  }

  /**
   * Форматування параметрів для відображення
   */
  static formatParametersForDisplay(parameters: OrderParametersData): Record<string, string> {
    return {
      executionDate:
        parameters.executionParams.executionDate?.toLocaleDateString('uk-UA') || 'Не встановлено',
      urgencyOption: this.formatUrgencyOption(parameters.executionParams.urgencyOption),
      discountType: this.formatDiscountType(parameters.discountParams.discountType),
      discountPercentage: `${parameters.discountParams.discountPercentage}%`,
      paymentMethod: this.formatPaymentMethod(parameters.paymentParams.paymentMethod),
      totalAmount: `${parameters.paymentParams.totalAmount.toFixed(2)} грн`,
      finalAmount: `${parameters.paymentParams.finalAmount.toFixed(2)} грн`,
      prepaymentAmount: `${parameters.paymentParams.prepaymentAmount.toFixed(2)} грн`,
      balanceAmount: `${parameters.paymentParams.balanceAmount.toFixed(2)} грн`,
    };
  }

  /**
   * Форматування варіанту терміновості
   */
  private static formatUrgencyOption(option: UrgencyOption): string {
    const optionMap: Record<UrgencyOption, string> = {
      STANDARD: 'Звичайне виконання',
      URGENT_48H: 'Терміново за 48 год (+50%)',
      URGENT_24H: 'Терміново за 24 год (+100%)',
      CUSTOM: 'Індивідуальний термін',
    };

    return optionMap[option] || option;
  }

  /**
   * Форматування типу знижки
   */
  private static formatDiscountType(type: DiscountType): string {
    const typeMap: Record<DiscountType, string> = {
      [DiscountType.NONE]: 'Без знижки',
      [DiscountType.EVERCARD]: 'Еверкард (10%)',
      [DiscountType.SOCIAL_MEDIA]: 'Соцмережі (5%)',
      [DiscountType.MILITARY]: 'ЗСУ (10%)',
      [DiscountType.CUSTOM]: 'Інше',
    };

    return typeMap[type] || type;
  }

  /**
   * Форматування способу оплати
   */
  private static formatPaymentMethod(method: PaymentMethod): string {
    const methodMap: Record<PaymentMethod, string> = {
      TERMINAL: 'Термінал',
      CASH: 'Готівка',
      BANK_TRANSFER: 'На рахунок',
    };

    return methodMap[method] || method;
  }
}
