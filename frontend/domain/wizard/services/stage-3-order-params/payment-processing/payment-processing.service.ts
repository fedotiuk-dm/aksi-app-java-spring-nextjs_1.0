import { z } from 'zod';

import {
  applyPaymentBody,
  applyPaymentParams,
  getOrderPayment200Response,
  addPrepaymentParams,
} from '@/shared/api/generated/order/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для бізнес-логіки обробки платежів (Stage 3.3)
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація платіжних даних через orval Zod схеми
 * - Розрахунок боргу та передоплати
 * - Бізнес-правила для способів оплати
 * - Перетворення API типів в доменні типи
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 */

// Використовуємо orval схеми напряму
export type PaymentApplicationData = z.infer<typeof applyPaymentBody>;
export type OrderPaymentInfo = z.infer<typeof getOrderPayment200Response>;
export type PrepaymentData = z.infer<typeof addPrepaymentParams>;

// Енум способів оплати з orval (з документу: Термінал, Готівка, На рахунок)
export type PaymentMethodType = 'TERMINAL' | 'CASH' | 'BANK_TRANSFER';

// Локальна композитна схема для валідації платежу (розширює API дані)
const paymentValidationSchema = applyPaymentBody.extend({
  totalAmount: z.number().min(0, "Загальна сума не може бути від'ємною"),
  previouslyPaid: z.number().min(0, "Раніше сплачена сума не може бути від'ємною"),
});

export type PaymentValidationData = z.infer<typeof paymentValidationSchema>;

// Локальна схема для розрахунку фінансів
const financialCalculationSchema = z.object({
  totalAmount: z.number().min(0, 'Загальна сума повинна бути позитивною'),
  paidAmount: z.number().min(0, "Сплачена сума не може бути від'ємною"),
  prepaymentAmount: z.number().min(0, "Передоплата не може бути від'ємною").optional(),
});

export interface PaymentValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: PaymentApplicationData;
}

export interface FinancialSummary {
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  prepaymentAmount?: number;
  isFullyPaid: boolean;
  overpaymentAmount?: number;
}

export class PaymentProcessingService extends BaseWizardService {
  protected readonly serviceName = 'PaymentProcessingService';

  /**
   * Отримання способів оплати відповідно до документу
   * Спосіб оплати (вибір один): Термінал, Готівка, На рахунок
   */
  getPaymentMethodOptions(): Array<{
    value: PaymentMethodType;
    label: string;
    description?: string;
  }> {
    return [
      {
        value: 'TERMINAL',
        label: 'Термінал',
        description: 'Безготівковий розрахунок картою',
      },
      {
        value: 'CASH',
        label: 'Готівка',
        description: 'Готівковий розрахунок',
      },
      {
        value: 'BANK_TRANSFER',
        label: 'На рахунок',
        description: 'Банківський переказ на рахунок компанії',
      },
    ];
  }

  /**
   * Валідація платіжних даних через orval Zod схему
   */
  validatePaymentData(paymentData: PaymentValidationData): PaymentValidationResult {
    const errors: string[] = [];

    try {
      // Валідація через orval схему
      const orvalValidation = applyPaymentBody.safeParse(paymentData);
      if (!orvalValidation.success) {
        errors.push(...orvalValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Додаткова валідація через розширену схему
      const extendedValidation = paymentValidationSchema.safeParse(paymentData);
      if (!extendedValidation.success) {
        errors.push(...extendedValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Бізнес-логіка валідації
      if (paymentData.prepaymentAmount && paymentData.totalAmount) {
        if (paymentData.prepaymentAmount > paymentData.totalAmount) {
          errors.push('Передоплата не може перевищувати загальну суму замовлення');
        }
      }

      const validatedData = orvalValidation.success ? orvalValidation.data : undefined;

      return {
        isValid: errors.length === 0,
        errors,
        validatedData,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Невідома помилка валідації платіжних даних'],
      };
    }
  }

  /**
   * Розрахунок фінансового підсумку (з документу)
   * Загальна вартість, Сплачено, Борг (розраховується автоматично як різниця)
   */
  calculateFinancialSummary(data: {
    totalAmount: number;
    paidAmount: number;
    prepaymentAmount?: number;
  }): FinancialSummary {
    try {
      // Валідація вхідних даних
      const validation = financialCalculationSchema.safeParse(data);
      if (!validation.success) {
        throw new Error('Невалідні дані для розрахунку');
      }

      const { totalAmount, paidAmount, prepaymentAmount = 0 } = data;
      const debtAmount = Math.max(0, totalAmount - paidAmount);
      const isFullyPaid = paidAmount >= totalAmount;
      const overpaymentAmount = paidAmount > totalAmount ? paidAmount - totalAmount : undefined;

      return {
        totalAmount,
        paidAmount,
        debtAmount,
        prepaymentAmount,
        isFullyPaid,
        overpaymentAmount,
      };
    } catch (error) {
      // Повертаємо безпечні значення за замовчуванням
      return {
        totalAmount: data.totalAmount || 0,
        paidAmount: data.paidAmount || 0,
        debtAmount: Math.max(0, (data.totalAmount || 0) - (data.paidAmount || 0)),
        isFullyPaid: false,
      };
    }
  }

  /**
   * Валідація методу оплати
   */
  validatePaymentMethod(method: string): { isValid: boolean; errors: string[] } {
    const validMethods: PaymentMethodType[] = ['TERMINAL', 'CASH', 'BANK_TRANSFER'];

    if (!validMethods.includes(method as PaymentMethodType)) {
      return {
        isValid: false,
        errors: [`Недопустимий спосіб оплати: ${method}. Дозволені: ${validMethods.join(', ')}`],
      };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Перевірка чи можна застосувати передоплату
   */
  canApplyPrepayment(
    totalAmount: number,
    prepaymentAmount: number,
    currentlyPaid: number = 0
  ): { canApply: boolean; reason?: string } {
    if (prepaymentAmount <= 0) {
      return { canApply: false, reason: 'Сума передоплати повинна бути більше нуля' };
    }

    if (prepaymentAmount > totalAmount) {
      return { canApply: false, reason: 'Передоплата не може перевищувати загальну суму' };
    }

    if (currentlyPaid + prepaymentAmount > totalAmount) {
      return {
        canApply: false,
        reason: 'Загальна сума платежів не може перевищувати вартість замовлення',
      };
    }

    return { canApply: true };
  }

  /**
   * Форматування фінансових сум для відображення (українська локаль)
   */
  formatFinancialAmount(amount: number): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Отримання рекомендованого методу оплати на основі суми
   */
  getRecommendedPaymentMethod(amount: number): {
    method: PaymentMethodType;
    reason: string;
  } {
    // Бізнес-логіка рекомендацій
    if (amount >= 5000) {
      return {
        method: 'BANK_TRANSFER',
        reason: 'Для великих сум рекомендується банківський переказ',
      };
    }

    if (amount >= 1000) {
      return {
        method: 'TERMINAL',
        reason: 'Для середніх сум зручно розрахуватися карткою',
      };
    }

    return {
      method: 'CASH',
      reason: 'Для невеликих сум підходить готівкова оплата',
    };
  }

  /**
   * Перевірка лімітів для різних методів оплати
   */
  validatePaymentLimits(
    method: PaymentMethodType,
    amount: number
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    switch (method) {
      case 'CASH':
        if (amount > 50000) {
          errors.push('Готівкова оплата обмежена сумою 50,000 грн');
        }
        break;
      case 'TERMINAL':
        if (amount < 1) {
          errors.push('Мінімальна сума для картки: 1 грн');
        }
        break;
      case 'BANK_TRANSFER':
        if (amount < 100) {
          errors.push('Мінімальна сума для банківського переказу: 100 грн');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
