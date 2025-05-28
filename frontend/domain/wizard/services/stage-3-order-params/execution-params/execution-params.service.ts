import { z } from 'zod';

import {
  calculateCompletionDateBody,
  calculateCompletionDate200Response,
  updateOrderCompletionBody,
  updateOrderCompletion200Response,
  safeValidate,
  validateOrThrow,
} from '@/shared/api/generated/order/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для параметрів виконання замовлення з orval + zod інтеграцією
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація параметрів виконання через orval Zod схеми
 * - Бізнес-правила для розрахунку дат та терміновості
 * - Валідація параметрів запитів та відповідей API
 * - Композиція даних для API викликів
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Навігацію (роль XState)
 *
 * ✅ ORVAL READY: повністю інтегровано з orval + zod схемами
 */

// Використовуємо orval схеми напряму
export type CalculateCompletionDateRequest = z.infer<typeof calculateCompletionDateBody>;
export type CalculateCompletionDateResponse = z.infer<typeof calculateCompletionDate200Response>;
export type UpdateOrderCompletionRequest = z.infer<typeof updateOrderCompletionBody>;
export type UpdateOrderCompletionResponse = z.infer<typeof updateOrderCompletion200Response>;

// Локальні zod схеми для специфічної бізнес-логіки
const dateFormatValidationSchema = z.object({
  dateString: z.string().min(1, 'Дата не може бути порожньою'),
  allowPastDates: z.boolean().default(false),
});

const skinCategoryDetectionSchema = z.object({
  serviceCategoryIds: z.array(z.string().uuid()),
  skinPatterns: z.array(z.string()).default(['leather', 'skin', 'шкіра', 'дубляк']),
});

// Локальні типи для бізнес-логіки
export type ExpediteType = z.infer<typeof calculateCompletionDateBody>['expediteType'];
export type DateFormatValidation = z.infer<typeof dateFormatValidationSchema>;
export type SkinCategoryDetection = z.infer<typeof skinCategoryDetectionSchema>;

export interface UrgentExecutionOption {
  value: ExpediteType;
  label: string;
  percent: number;
}

export interface ExecutionParamsValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: CalculateCompletionDateRequest | UpdateOrderCompletionRequest;
}

export class ExecutionParamsService extends BaseWizardService {
  protected readonly serviceName = 'ExecutionParamsService';

  /**
   * Валідація параметрів для розрахунку дати завершення через orval схему
   */
  validateCalculateCompletionDate(
    serviceCategoryIds: string[],
    expediteType: ExpediteType
  ): ExecutionParamsValidationResult {
    const requestData = { serviceCategoryIds, expediteType };
    const validation = safeValidate(calculateCompletionDateBody, requestData);

    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Валідація параметрів для оновлення виконання замовлення через orval схему
   */
  validateUpdateOrderCompletion(
    orderId: string,
    expediteType: ExpediteType,
    expectedCompletionDate: string
  ): ExecutionParamsValidationResult {
    const requestData = { orderId, expediteType, expectedCompletionDate };
    const validation = safeValidate(updateOrderCompletionBody, requestData);

    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Отримання опцій терміновості відповідно до документу
   */
  getUrgentExecutionOptions(): UrgentExecutionOption[] {
    return [
      { value: 'STANDARD', label: 'Звичайне (без націнки)', percent: 0 },
      { value: 'EXPRESS_48H', label: '+50% за 48 год', percent: 50 },
      { value: 'EXPRESS_24H', label: '+100% за 24 год', percent: 100 },
    ];
  }

  /**
   * Отримання відсотка надбавки за терміновість
   */
  getUrgencyPercent(expediteType: ExpediteType): number {
    const option = this.getUrgentExecutionOptions().find((opt) => opt.value === expediteType);
    return option?.percent || 0;
  }

  /**
   * Валідація формату дати через локальну схему
   */
  validateDateFormat(
    dateString: string,
    allowPastDates: boolean = false
  ): {
    isValid: boolean;
    errors: string[];
    parsedDate?: Date;
  } {
    const validation = safeValidate(dateFormatValidationSchema, {
      dateString,
      allowPastDates,
    });

    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    try {
      const date = new Date(dateString);
      const now = new Date();

      if (isNaN(date.getTime())) {
        return {
          isValid: false,
          errors: ['Неправильний формат дати'],
        };
      }

      if (!allowPastDates && date <= now) {
        return {
          isValid: false,
          errors: ['Дата виконання повинна бути в майбутньому'],
        };
      }

      return {
        isValid: true,
        errors: [],
        parsedDate: date,
      };
    } catch {
      return {
        isValid: false,
        errors: ['Неможливо розпізнати дату'],
      };
    }
  }

  /**
   * Форматування дати для відображення користувачу
   */
  formatCompletionDate(dateString: string, locale: string = 'uk-UA'): string {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  }

  /**
   * Перевірка наявності шкіряних категорій через локальну схему
   */
  hasSkinCategories(
    serviceCategoryIds: string[],
    customPatterns?: string[]
  ): {
    isValid: boolean;
    errors: string[];
    hasSkinItems: boolean;
  } {
    const skinPatterns = customPatterns || ['leather', 'skin', 'шкіра', 'дубляк'];
    const validation = safeValidate(skinCategoryDetectionSchema, {
      serviceCategoryIds,
      skinPatterns,
    });

    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
        hasSkinItems: false,
      };
    }

    const hasSkinItems = serviceCategoryIds.some((id) =>
      skinPatterns.some((pattern) => id.toLowerCase().includes(pattern.toLowerCase()))
    );

    return {
      isValid: true,
      errors: [],
      hasSkinItems,
    };
  }

  /**
   * Інформація про стандартні терміни (з документу)
   */
  getStandardDeadlineInfo(hasSkinItems: boolean = false): string {
    return hasSkinItems ? '14 днів для шкіряних виробів' : '48 годин для звичайних виробів';
  }

  /**
   * Створення запиту для розрахунку дати завершення
   */
  createCalculateCompletionDateRequest(
    serviceCategoryIds: string[],
    expediteType: ExpediteType
  ): {
    isValid: boolean;
    errors: string[];
    requestData?: CalculateCompletionDateRequest;
  } {
    const validation = this.validateCalculateCompletionDate(serviceCategoryIds, expediteType);

    if (!validation.isValid) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      requestData: validation.validatedData as CalculateCompletionDateRequest,
    };
  }

  /**
   * Створення запиту для оновлення параметрів виконання
   */
  createUpdateOrderCompletionRequest(
    orderId: string,
    expediteType: ExpediteType,
    expectedCompletionDate: string
  ): {
    isValid: boolean;
    errors: string[];
    requestData?: UpdateOrderCompletionRequest;
  } {
    const validation = this.validateUpdateOrderCompletion(
      orderId,
      expediteType,
      expectedCompletionDate
    );

    if (!validation.isValid) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      requestData: validation.validatedData as UpdateOrderCompletionRequest,
    };
  }

  /**
   * Перевірка чи дата у правильному ISO форматі для orval
   */
  isValidISODate(dateString: string): boolean {
    try {
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
      return isoRegex.test(dateString) && !isNaN(new Date(dateString).getTime());
    } catch {
      return false;
    }
  }

  /**
   * Конвертація дати у ISO формат для orval API
   */
  convertToISODate(dateInput: string | Date): string {
    try {
      const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      return date.toISOString();
    } catch {
      throw new Error('Неможливо конвертувати дату у ISO формат');
    }
  }
}
