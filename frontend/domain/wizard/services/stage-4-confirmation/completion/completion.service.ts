import { z } from 'zod';

import { completeOrderParams, completeOrder200Response } from '@/shared/api/generated/order/zod';
import {
  generatePdfReceiptBody,
  generatePdfReceipt200Response,
  sendReceiptByEmailBody,
  sendReceiptByEmail200Response,
  getReceiptData200Response,
} from '@/shared/api/generated/receipt/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для бізнес-логіки завершення замовлення (Stage 4)
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація даних завершення через orval Zod схеми
 * - Перевірка готовності замовлення до завершення
 * - Бізнес-правила для формування квитанції
 * - Підготовка даних для цифрового підпису та email
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Генерацію PDF (роль API)
 * - Відправку email (роль API)
 */

// Використовуємо orval схеми напряму
export type OrderCompletionData = z.infer<typeof completeOrder200Response>;
export type ReceiptGenerationData = z.infer<typeof generatePdfReceiptBody>;
export type EmailReceiptData = z.infer<typeof sendReceiptByEmailBody>;
export type ReceiptDataInfo = z.infer<typeof getReceiptData200Response>;

// Локальна композитна схема для валідації завершення (розширює API дані)
const completionValidationSchema = z.object({
  orderId: z.string().min(1, "ID замовлення обов'язкове"),
  customerSignature: z.string().optional(),
  agreementAccepted: z.boolean().refine((val) => val === true, {
    message: 'Необхідно прийняти умови надання послуг',
  }),
  emailReceipt: z.boolean().optional(),
  recipientEmail: z.string().email('Некоректний email').optional(),
});

export type CompletionValidationData = z.infer<typeof completionValidationSchema>;

// Локальна схема для підготовки квитанції
const receiptPreparationSchema = generatePdfReceiptBody.extend({
  includeDigitalSignature: z.boolean().default(true),
  additionalNotes: z.string().optional(),
});

export type ReceiptPreparationData = z.infer<typeof receiptPreparationSchema>;

export interface CompletionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validatedData?: CompletionValidationData;
}

export interface OrderReadinessCheck {
  isReady: boolean;
  missingRequirements: string[];
  recommendations: string[];
}

export interface CompletionSummary {
  orderId: string;
  receiptNumber: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  isFullyPaid: boolean;
  completionDate: string;
  canComplete: boolean;
}

export class CompletionService extends BaseWizardService {
  protected readonly serviceName = 'CompletionService';

  /**
   * Валідація даних завершення через orval Zod схему
   */
  validateCompletionData(completionData: CompletionValidationData): CompletionValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Валідація через локальну схему
      const validation = completionValidationSchema.safeParse(completionData);
      if (!validation.success) {
        errors.push(...validation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Бізнес-логіка валідації
      if (completionData.emailReceipt && !completionData.recipientEmail) {
        errors.push('Для відправки квитанції на email необхідно вказати адресу');
      }

      if (!completionData.customerSignature) {
        warnings.push('Відсутній цифровий підпис клієнта');
      }

      // Валідація email якщо потрібна відправка
      if (completionData.emailReceipt && completionData.recipientEmail) {
        const emailValidation = sendReceiptByEmailBody.safeParse({
          orderId: completionData.orderId,
          recipientEmail: completionData.recipientEmail,
        });

        if (!emailValidation.success) {
          errors.push(...emailValidation.error.errors.map((e: z.ZodIssue) => e.message));
        }
      }

      const validatedData = validation.success ? validation.data : undefined;

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        validatedData,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Невідома помилка валідації даних завершення'],
        warnings: [],
      };
    }
  }

  /**
   * Перевірка готовності замовлення до завершення
   */
  checkOrderReadiness(orderData: {
    hasItems: boolean;
    hasClientInfo: boolean;
    hasBranchLocation: boolean;
    totalAmount: number;
    paidAmount?: number;
    agreementAccepted?: boolean;
  }): OrderReadinessCheck {
    const missingRequirements: string[] = [];
    const recommendations: string[] = [];

    // Обов'язкові вимоги
    if (!orderData.hasItems) {
      missingRequirements.push('Замовлення повинно містити принаймні один предмет');
    }

    if (!orderData.hasClientInfo) {
      missingRequirements.push('Необхідна інформація про клієнта');
    }

    if (!orderData.hasBranchLocation) {
      missingRequirements.push('Необхідно вибрати пункт прийому');
    }

    if (orderData.totalAmount <= 0) {
      missingRequirements.push('Загальна сума замовлення повинна бути більше нуля');
    }

    if (!orderData.agreementAccepted) {
      missingRequirements.push('Клієнт повинен прийняти умови надання послуг');
    }

    // Рекомендації
    const paidAmount = orderData.paidAmount || 0;
    if (paidAmount < orderData.totalAmount) {
      recommendations.push(`Залишається доплатити: ${orderData.totalAmount - paidAmount} грн`);
    }

    if (paidAmount === 0) {
      recommendations.push('Рекомендується взяти передоплату');
    }

    return {
      isReady: missingRequirements.length === 0,
      missingRequirements,
      recommendations,
    };
  }

  /**
   * Підготовка даних для квитанції з валідацією
   */
  prepareReceiptData(receiptData: ReceiptPreparationData): {
    isValid: boolean;
    errors: string[];
    preparedData?: ReceiptGenerationData;
  } {
    try {
      // Валідація через orval схему
      const orvalValidation = generatePdfReceiptBody.safeParse(receiptData);
      if (!orvalValidation.success) {
        return {
          isValid: false,
          errors: orvalValidation.error.errors.map((e: z.ZodIssue) => e.message),
        };
      }

      // Додаткова валідація через розширену схему
      const extendedValidation = receiptPreparationSchema.safeParse(receiptData);
      if (!extendedValidation.success) {
        return {
          isValid: false,
          errors: extendedValidation.error.errors.map((e: z.ZodIssue) => e.message),
        };
      }

      return {
        isValid: true,
        errors: [],
        preparedData: orvalValidation.data,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Помилка підготовки даних квитанції'],
      };
    }
  }

  /**
   * Створення підсумку завершення замовлення
   */
  createCompletionSummary(orderData: {
    orderId: string;
    receiptNumber: string;
    totalAmount: number;
    paidAmount: number;
    completionDate?: string;
  }): CompletionSummary {
    const remainingAmount = Math.max(0, orderData.totalAmount - orderData.paidAmount);
    const isFullyPaid = orderData.paidAmount >= orderData.totalAmount;
    const canComplete = isFullyPaid; // Можна додати додаткові умови

    return {
      orderId: orderData.orderId,
      receiptNumber: orderData.receiptNumber,
      totalAmount: orderData.totalAmount,
      paidAmount: orderData.paidAmount,
      remainingAmount,
      isFullyPaid,
      completionDate: orderData.completionDate || new Date().toISOString(),
      canComplete,
    };
  }

  /**
   * Валідація email для відправки квитанції
   */
  validateEmailReceipt(emailData: EmailReceiptData): {
    isValid: boolean;
    errors: string[];
  } {
    try {
      const validation = sendReceiptByEmailBody.safeParse(emailData);

      if (!validation.success) {
        return {
          isValid: false,
          errors: validation.error.errors.map((e: z.ZodIssue) => e.message),
        };
      }

      return { isValid: true, errors: [] };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Помилка валідації email даних'],
      };
    }
  }

  /**
   * Перевірка можливості завершення замовлення
   */
  canCompleteOrder(orderStatus: string): { canComplete: boolean; reason?: string } {
    const allowedStatuses = ['NEW', 'IN_PROGRESS'];

    if (!allowedStatuses.includes(orderStatus)) {
      return {
        canComplete: false,
        reason: `Неможливо завершити замовлення зі статусом: ${orderStatus}`,
      };
    }

    return { canComplete: true };
  }

  /**
   * Форматування повідомлень про завершення
   */
  formatCompletionMessages(summary: CompletionSummary): {
    successMessage: string;
    instructions: string[];
    nextSteps: string[];
  } {
    const successMessage = `Замовлення ${summary.receiptNumber} успішно завершено!`;

    const instructions: string[] = [
      'Квитанція сформована та готова до друку',
      'Клієнт отримав копію документів',
    ];

    const nextSteps: string[] = ['Створити нове замовлення', 'Перейти до списку замовлень'];

    if (!summary.isFullyPaid) {
      instructions.push(`Залишається доплатити: ${this.formatAmount(summary.remainingAmount)}`);
      nextSteps.unshift('Нагадати про доплату при видачі');
    }

    return {
      successMessage,
      instructions,
      nextSteps,
    };
  }

  /**
   * Форматування суми
   */
  private formatAmount(amount: number): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Генерація даних для цифрового підпису
   */
  generateSignatureData(orderSummary: CompletionSummary): {
    dataToSign: string;
    timestamp: string;
  } {
    const timestamp = new Date().toISOString();
    const dataToSign = `${orderSummary.orderId}|${orderSummary.receiptNumber}|${orderSummary.totalAmount}|${timestamp}`;

    return {
      dataToSign,
      timestamp,
    };
  }

  /**
   * Валідація цифрового підпису
   */
  validateDigitalSignature(
    signature: string,
    expectedData: string
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!signature || signature.trim().length === 0) {
      errors.push('Цифровий підпис не може бути порожнім');
    }

    if (signature && signature.length < 10) {
      errors.push('Цифровий підпис занадто короткий');
    }

    // Тут можна додати більш складну логіку валідації підпису

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
