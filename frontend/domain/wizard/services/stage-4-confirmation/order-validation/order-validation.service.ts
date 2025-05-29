import { z } from 'zod';

import {
  completeOrderParams,
  completeOrder200Response,
  updateOrderStatusParams,
  getOrderDetailedSummaryParams,
  getOrderDetailedSummary200Response,
} from '@/shared/api/generated/order/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для бізнес-логіки валідації замовлення (Stage 4.3)
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація замовлення через orval Zod схеми
 * - Комплексна перевірка консистентності даних
 * - Бізнес-правила для готовності до завершення
 * - Валідація статусів та переходів
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Відображення UI (роль компонентів)
 */

// Використовуємо orval схеми напряму
export type CompleteOrderParams = z.infer<typeof completeOrderParams>;
export type CompletedOrderData = z.infer<typeof completeOrder200Response>;
export type OrderStatusParams = z.infer<typeof updateOrderStatusParams>;
export type OrderDetailedSummary = z.infer<typeof getOrderDetailedSummary200Response>;
export type OrderDetailedParams = z.infer<typeof getOrderDetailedSummaryParams>;

// Типи статусів замовлення
export type OrderStatus = 'DRAFT' | 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED';

// Локальна схема для валідації готовності замовлення
const orderReadinessSchema = z.object({
  hasClient: z.boolean().refine((val) => val === true, {
    message: "Замовлення повинно мати прив'язаного клієнта",
  }),
  hasItems: z.boolean().refine((val) => val === true, {
    message: 'Замовлення повинно містити хоча б один предмет',
  }),
  hasBranch: z.boolean().refine((val) => val === true, {
    message: 'Замовлення повинно мати призначену філію',
  }),
  hasValidTotal: z.boolean().refine((val) => val === true, {
    message: 'Замовлення повинно мати валідну загальну суму',
  }),
  hasReceiptNumber: z.boolean().refine((val) => val === true, {
    message: 'Замовлення повинно мати номер квитанції',
  }),
  hasCompletionDate: z.boolean().refine((val) => val === true, {
    message: 'Замовлення повинно мати дату завершення',
  }),
});

export type OrderReadinessData = z.infer<typeof orderReadinessSchema>;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  criticalIssues: string[];
}

export interface ConsistencyCheckResult {
  isConsistent: boolean;
  dataInconsistencies: string[];
  businessRuleViolations: string[];
  recommendations: string[];
}

export interface StatusTransitionResult {
  isValidTransition: boolean;
  allowedStatuses: OrderStatus[];
  transitionErrors: string[];
  statusWarnings: string[];
}

export class OrderValidationService extends BaseWizardService {
  protected readonly serviceName = 'OrderValidationService';

  /**
   * Валідація параметрів завершення замовлення через orval Zod схему
   */
  validateCompleteOrderParams(params: { orderId: string }): {
    isValid: boolean;
    errors: string[];
    validatedParams?: CompleteOrderParams;
  } {
    const errors: string[] = [];

    try {
      // Валідація через orval схему
      const orvalValidation = completeOrderParams.safeParse(params);
      if (!orvalValidation.success) {
        errors.push(...orvalValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Додаткова бізнес-валідація
      if (!params.orderId || params.orderId.trim().length === 0) {
        errors.push("ID замовлення обов'язкове для завершення");
      }

      const validatedParams = orvalValidation.success ? orvalValidation.data : undefined;

      return {
        isValid: errors.length === 0,
        errors,
        validatedParams,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Невідома помилка валідації параметрів завершення'],
      };
    }
  }

  /**
   * Валідація параметрів статусу замовлення через orval Zod схему
   */
  validateStatusUpdate(params: { orderId: string; status: OrderStatus }): {
    isValid: boolean;
    errors: string[];
    validatedParams?: OrderStatusParams;
  } {
    const errors: string[] = [];

    try {
      // Валідація через orval схему
      const orvalValidation = updateOrderStatusParams.safeParse(params);
      if (!orvalValidation.success) {
        errors.push(...orvalValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      const validatedParams = orvalValidation.success ? orvalValidation.data : undefined;

      return {
        isValid: errors.length === 0,
        errors,
        validatedParams,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Невідома помилка валідації статусу'],
      };
    }
  }

  /**
   * Комплексна валідація замовлення
   */
  validateOrder(orderData: OrderDetailedSummary): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const criticalIssues: string[] = [];

    try {
      // Валідація через orval схему
      const orvalValidation = getOrderDetailedSummary200Response.safeParse(orderData);
      if (!orvalValidation.success) {
        errors.push(...orvalValidation.error.errors.map((e: z.ZodIssue) => e.message));
      }

      // Делегуємо перевірки до окремих методів
      this.validateCriticalOrderFields(orderData, criticalIssues, warnings);
      this.validateOrderItems(orderData, errors);
      this.validateOrderAmounts(orderData, criticalIssues, warnings);

      return {
        isValid: errors.length === 0 && criticalIssues.length === 0,
        errors,
        warnings,
        criticalIssues,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Невідома помилка валідації замовлення'],
        warnings: [],
        criticalIssues: ['Критична помилка під час валідації'],
      };
    }
  }

  /**
   * Валідація критичних полів замовлення
   */
  private validateCriticalOrderFields(
    orderData: OrderDetailedSummary,
    criticalIssues: string[],
    warnings: string[]
  ): void {
    if (!orderData.id) {
      criticalIssues.push('Відсутній ID замовлення');
    }

    if (!orderData.receiptNumber) {
      criticalIssues.push('Відсутній номер квитанції');
    }

    if (!orderData.client) {
      criticalIssues.push('Відсутня інформація про клієнта');
    } else {
      if (!orderData.client.firstName && !orderData.client.fullName) {
        criticalIssues.push("Відсутнє ім'я клієнта");
      }
      if (!orderData.client.phone) {
        warnings.push('Відсутній номер телефону клієнта');
      }
    }

    if (!orderData.branchLocation) {
      criticalIssues.push('Відсутня інформація про філію');
    }

    if (!orderData.items || orderData.items.length === 0) {
      criticalIssues.push('Замовлення не містить предметів');
    }
  }

  /**
   * Валідація предметів замовлення
   */
  private validateOrderItems(orderData: OrderDetailedSummary, errors: string[]): void {
    if (!orderData.items) return;

    orderData.items.forEach((item, index) => {
      if (!item.name) {
        errors.push(`Предмет ${index + 1}: відсутня назва`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Предмет ${index + 1}: некоректна кількість`);
      }
      if (!item.basePrice || item.basePrice < 0) {
        errors.push(`Предмет ${index + 1}: некоректна базова ціна`);
      }
      if (!item.finalPrice || item.finalPrice < 0) {
        errors.push(`Предмет ${index + 1}: некоректна фінальна ціна`);
      }
    });
  }

  /**
   * Валідація сум замовлення
   */
  private validateOrderAmounts(
    orderData: OrderDetailedSummary,
    criticalIssues: string[],
    warnings: string[]
  ): void {
    if (!orderData.finalAmount || orderData.finalAmount <= 0) {
      criticalIssues.push('Некоректна загальна сума замовлення');
    }

    if (!orderData.expectedCompletionDate) {
      warnings.push('Не вказана дата завершення');
    }

    if ((orderData.balanceAmount || 0) > 0) {
      warnings.push('Замовлення не повністю оплачене');
    }
  }

  /**
   * Перевірка консистентності даних замовлення
   */
  validateConsistency(orderData: OrderDetailedSummary): ConsistencyCheckResult {
    const dataInconsistencies: string[] = [];
    const businessRuleViolations: string[] = [];
    const recommendations: string[] = [];

    try {
      // Делегуємо перевірки до окремих методів
      this.validateFinancialConsistency(orderData, dataInconsistencies, businessRuleViolations);
      this.validateDateConsistency(orderData, businessRuleViolations, recommendations);
      this.validateExpediteConsistency(orderData, businessRuleViolations, recommendations);
      this.validateDiscountConsistency(orderData, recommendations);

      return {
        isConsistent: dataInconsistencies.length === 0 && businessRuleViolations.length === 0,
        dataInconsistencies,
        businessRuleViolations,
        recommendations,
      };
    } catch (error) {
      return {
        isConsistent: false,
        dataInconsistencies: ['Помилка під час перевірки консистентності'],
        businessRuleViolations: [],
        recommendations: [],
      };
    }
  }

  /**
   * Валідація фінансової консистентності
   */
  private validateFinancialConsistency(
    orderData: OrderDetailedSummary,
    dataInconsistencies: string[],
    businessRuleViolations: string[]
  ): void {
    const itemsTotal = (orderData.items || []).reduce(
      (sum, item) => sum + (item.finalPrice || 0) * (item.quantity || 1),
      0
    );

    const calculatedTotal =
      itemsTotal - (orderData.discountAmount || 0) + (orderData.expediteSurchargeAmount || 0);

    if (Math.abs(calculatedTotal - (orderData.finalAmount || 0)) > 0.01) {
      dataInconsistencies.push(
        `Невідповідність загальної суми: розраховано ${this.formatAmount(calculatedTotal)}, вказано ${this.formatAmount(orderData.finalAmount || 0)}`
      );
    }

    // Перевірка оплати
    const totalPaid = orderData.prepaymentAmount || 0;
    const totalAmount = orderData.finalAmount || 0;
    const expectedBalance = totalAmount - totalPaid;

    if (Math.abs(expectedBalance - (orderData.balanceAmount || 0)) > 0.01) {
      dataInconsistencies.push(
        `Невідповідність балансу: очікується ${this.formatAmount(expectedBalance)}, вказано ${this.formatAmount(orderData.balanceAmount || 0)}`
      );
    }

    if (totalPaid > totalAmount) {
      businessRuleViolations.push('Передоплата перевищує загальну суму замовлення');
    }
  }

  /**
   * Валідація консистентності дат
   */
  private validateDateConsistency(
    orderData: OrderDetailedSummary,
    businessRuleViolations: string[],
    recommendations: string[]
  ): void {
    if (orderData.expectedCompletionDate && orderData.createdDate) {
      const createdDate = new Date(orderData.createdDate);
      const completionDate = new Date(orderData.expectedCompletionDate);

      if (completionDate <= createdDate) {
        businessRuleViolations.push(
          'Дата завершення не може бути раніше або дорівнювати даті створення'
        );
      }

      const daysDiff = Math.ceil(
        (completionDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff < 1) {
        recommendations.push('Рекомендується мати мінімум 1 день на виконання замовлення');
      }
    }
  }

  /**
   * Валідація консистентності терміновості
   */
  private validateExpediteConsistency(
    orderData: OrderDetailedSummary,
    businessRuleViolations: string[],
    recommendations: string[]
  ): void {
    if (orderData.expediteType && orderData.expediteType !== 'STANDARD') {
      if (!orderData.expediteSurchargeAmount || orderData.expediteSurchargeAmount <= 0) {
        businessRuleViolations.push('Термінове замовлення повинно мати надбавку за терміновість');
      }

      if (orderData.expediteType === 'EXPRESS_24H') {
        recommendations.push('Перевірте можливість виконання замовлення за 24 години');
      }
    }
  }

  /**
   * Валідація консистентності знижок
   */
  private validateDiscountConsistency(
    orderData: OrderDetailedSummary,
    recommendations: string[]
  ): void {
    if (orderData.discountAmount && orderData.discountAmount > 0) {
      const itemsTotal = (orderData.items || []).reduce(
        (sum, item) => sum + (item.finalPrice || 0) * (item.quantity || 1),
        0
      );
      const discountPercentage = (orderData.discountAmount / itemsTotal) * 100;
      if (discountPercentage > 50) {
        recommendations.push(
          `Велика знижка ${discountPercentage.toFixed(1)}% - перевірте правильність`
        );
      }
    }
  }

  /**
   * Перевірка можливості переходу статусу
   */
  validateStatusTransition(
    currentStatus: OrderStatus | undefined,
    newStatus: OrderStatus
  ): StatusTransitionResult {
    const transitionErrors: string[] = [];
    const statusWarnings: string[] = [];

    // Визначаємо дозволені переходи
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      DRAFT: ['NEW', 'CANCELLED'],
      NEW: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: ['DELIVERED'],
      DELIVERED: [], // Фінальний статус
      CANCELLED: [], // Фінальний статус
    };

    const currentStatusOrDefault = currentStatus || 'DRAFT';
    const allowedStatuses = allowedTransitions[currentStatusOrDefault] || [];

    // Перевірка дозволеності переходу
    if (!allowedStatuses.includes(newStatus)) {
      transitionErrors.push(
        `Неможливий перехід з статусу "${currentStatusOrDefault}" до "${newStatus}"`
      );
    }

    // Попередження для специфічних переходів
    if (currentStatusOrDefault === 'NEW' && newStatus === 'COMPLETED') {
      statusWarnings.push(
        'Пропущено статус "В процесі" - рекомендується використовувати послідовні переходи'
      );
    }

    if (newStatus === 'CANCELLED') {
      statusWarnings.push('Скасування замовлення - переконайтеся у правильності дії');
    }

    if (newStatus === 'DELIVERED') {
      statusWarnings.push('Видача замовлення - перевірте що клієнт отримав всі предмети');
    }

    return {
      isValidTransition: transitionErrors.length === 0,
      allowedStatuses,
      transitionErrors,
      statusWarnings,
    };
  }

  /**
   * Перевірка готовності замовлення до завершення
   */
  checkOrderReadiness(orderData: OrderDetailedSummary): {
    isReady: boolean;
    readinessErrors: string[];
    readinessWarnings: string[];
    missingRequirements: string[];
  } {
    const readinessErrors: string[] = [];
    const readinessWarnings: string[] = [];
    const missingRequirements: string[] = [];

    // Підготовка даних для валідації готовності
    const readinessData: OrderReadinessData = {
      hasClient: !!orderData.client,
      hasItems: !!orderData.items && orderData.items.length > 0,
      hasBranch: !!orderData.branchLocation,
      hasValidTotal: !!orderData.finalAmount && orderData.finalAmount > 0,
      hasReceiptNumber: !!orderData.receiptNumber,
      hasCompletionDate: !!orderData.expectedCompletionDate,
    };

    // Валідація через схему
    const validation = orderReadinessSchema.safeParse(readinessData);
    if (!validation.success) {
      readinessErrors.push(...validation.error.errors.map((e: z.ZodIssue) => e.message));
    }

    // Детальна перевірка відсутніх вимог
    if (!readinessData.hasClient) {
      missingRequirements.push('Інформація про клієнта');
    }

    if (!readinessData.hasItems) {
      missingRequirements.push('Предмети замовлення');
    }

    if (!readinessData.hasBranch) {
      missingRequirements.push('Інформація про філію');
    }

    if (!readinessData.hasValidTotal) {
      missingRequirements.push('Валідна загальна сума');
    }

    if (!readinessData.hasReceiptNumber) {
      missingRequirements.push('Номер квитанції');
    }

    if (!readinessData.hasCompletionDate) {
      missingRequirements.push('Дата завершення');
    }

    // Додаткові попередження
    if (orderData.client && !orderData.client.phone) {
      readinessWarnings.push("Відсутній номер телефону клієнта для зв'язку");
    }

    if ((orderData.balanceAmount || 0) > 0) {
      readinessWarnings.push('Замовлення має непогашений борг');
    }

    const hasRiskyItems = (orderData.items || []).some(
      (item) => item.defects && item.defects.length > 0
    );
    if (hasRiskyItems) {
      readinessWarnings.push(
        'Замовлення містить предмети з дефектами - потрібне додаткове підтвердження'
      );
    }

    return {
      isReady: readinessErrors.length === 0 && missingRequirements.length === 0,
      readinessErrors,
      readinessWarnings,
      missingRequirements,
    };
  }

  /**
   * Отримання статусів замовлення з описом
   */
  getOrderStatuses(): Array<{
    status: OrderStatus;
    label: string;
    description: string;
    isFinal: boolean;
  }> {
    return [
      {
        status: 'DRAFT',
        label: 'Чернетка',
        description: 'Замовлення в стадії оформлення',
        isFinal: false,
      },
      {
        status: 'NEW',
        label: 'Нове',
        description: 'Замовлення прийнято до виконання',
        isFinal: false,
      },
      {
        status: 'IN_PROGRESS',
        label: 'В процесі',
        description: 'Замовлення виконується',
        isFinal: false,
      },
      {
        status: 'COMPLETED',
        label: 'Завершено',
        description: 'Замовлення готове до видачі',
        isFinal: false,
      },
      {
        status: 'DELIVERED',
        label: 'Видано',
        description: 'Замовлення видано клієнту',
        isFinal: true,
      },
      {
        status: 'CANCELLED',
        label: 'Скасовано',
        description: 'Замовлення скасовано',
        isFinal: true,
      },
    ];
  }

  /**
   * Комплексна валідація для підтвердження замовлення
   */
  validateForConfirmation(orderData: OrderDetailedSummary): {
    canConfirm: boolean;
    validationResult: ValidationResult;
    consistencyResult: ConsistencyCheckResult;
    readinessResult: {
      isReady: boolean;
      readinessErrors: string[];
      readinessWarnings: string[];
      missingRequirements: string[];
    };
    overallIssues: string[];
    criticalBlockers: string[];
  } {
    const validationResult = this.validateOrder(orderData);
    const consistencyResult = this.validateConsistency(orderData);
    const readinessResult = this.checkOrderReadiness(orderData);

    const overallIssues: string[] = [
      ...validationResult.errors,
      ...validationResult.warnings,
      ...consistencyResult.dataInconsistencies,
      ...consistencyResult.businessRuleViolations,
      ...readinessResult.readinessErrors,
      ...readinessResult.readinessWarnings,
    ];

    const criticalBlockers: string[] = [
      ...validationResult.criticalIssues,
      ...validationResult.errors,
      ...consistencyResult.dataInconsistencies,
      ...consistencyResult.businessRuleViolations,
      ...readinessResult.readinessErrors,
      ...readinessResult.missingRequirements,
    ];

    const canConfirm =
      criticalBlockers.length === 0 &&
      validationResult.isValid &&
      consistencyResult.isConsistent &&
      readinessResult.isReady;

    return {
      canConfirm,
      validationResult,
      consistencyResult,
      readinessResult,
      overallIssues,
      criticalBlockers,
    };
  }

  /**
   * Форматування фінансових сум
   */
  private formatAmount(amount: number): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}
