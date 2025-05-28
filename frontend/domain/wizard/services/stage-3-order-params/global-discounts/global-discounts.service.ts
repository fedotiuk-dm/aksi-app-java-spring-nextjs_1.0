import { z } from 'zod';

import {
  applyDiscount1Body,
  applyDiscount1200Response,
  applyDiscountParams,
  applyDiscount200Response,
  safeValidate,
  validateOrThrow,
} from '@/shared/api/generated/order/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс для глобальних знижок замовлення з orval + zod інтеграцією
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація знижок через orval Zod схеми
 * - Бізнес-правила для типів знижок та обмежень категорій
 * - Валідація параметрів запитів та відповідей API
 * - Композиція даних для застосування знижок
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
export type ApplyDiscountRequest = z.infer<typeof applyDiscount1Body>;
export type ApplyDiscountResponse = z.infer<typeof applyDiscount1200Response>;
export type ApplyDiscountByAmountParams = z.infer<typeof applyDiscountParams>;
export type ApplyDiscountByAmountResponse = z.infer<typeof applyDiscount200Response>;

// Константи для уникнення дублювання
const EXCLUDED_CATEGORIES_PATTERNS = ['прасування', 'прання', 'фарбування'] as const;
const EXCLUDED_CATEGORIES_FULL = ['прасування', 'прання', 'фарбування_текстилю'] as const;

// Локальні zod схеми для специфічної бізнес-логіки
const discountTypeValidationSchema = z.object({
  discountType: z.enum(['NO_DISCOUNT', 'EVERCARD', 'SOCIAL_MEDIA', 'MILITARY', 'CUSTOM']),
  customPercentage: z.number().min(0).max(100).optional(),
  description: z.string().max(255).optional(),
});

const excludedCategoriesSchema = z.object({
  serviceCategoryIds: z.array(z.string().uuid()),
  excludedPatterns: z.array(z.string()).default([...EXCLUDED_CATEGORIES_PATTERNS]),
});

const discountCalculationSchema = z.object({
  totalAmount: z.number().min(0, "Сума не може бути від'ємною"),
  discountPercentage: z.number().min(0).max(100),
  excludedCategoriesAmount: z.number().min(0).default(0),
});

// Локальні типи для бізнес-логіки
export type DiscountType = z.infer<typeof applyDiscount1Body>['discountType'];
export type DiscountTypeValidation = z.infer<typeof discountTypeValidationSchema>;
export type ExcludedCategoriesCheck = z.infer<typeof excludedCategoriesSchema>;
export type DiscountCalculation = z.infer<typeof discountCalculationSchema>;

export interface DiscountTypeOption {
  value: DiscountType;
  label: string;
  percent?: number;
  description: string;
}

export interface DiscountValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: ApplyDiscountRequest;
}

export interface DiscountCalculationResult {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  discountPercentage: number;
  excludedAmount: number;
  isValid: boolean;
  errors: string[];
}

export class GlobalDiscountsService extends BaseWizardService {
  protected readonly serviceName = 'GlobalDiscountsService';

  /**
   * Валідація запиту на застосування знижки через orval схему
   */
  validateApplyDiscountRequest(
    orderId: string,
    discountType: DiscountType,
    discountPercentage?: number,
    discountDescription?: string
  ): DiscountValidationResult {
    const requestData = {
      orderId,
      discountType,
      discountPercentage,
      discountDescription,
    };

    const validation = safeValidate(applyDiscount1Body, requestData);

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
   * Валідація типу знижки через локальну схему
   */
  validateDiscountType(
    discountType: DiscountType,
    customPercentage?: number,
    description?: string
  ): {
    isValid: boolean;
    errors: string[];
    validatedData?: DiscountTypeValidation;
  } {
    const validation = safeValidate(discountTypeValidationSchema, {
      discountType,
      customPercentage,
      description,
    });

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
   * Отримання опцій типів знижок відповідно до документу
   */
  getDiscountTypeOptions(): DiscountTypeOption[] {
    return [
      {
        value: 'NO_DISCOUNT',
        label: 'Без знижки',
        percent: 0,
        description: 'Замовлення без знижки',
      },
      {
        value: 'EVERCARD',
        label: 'Еверкард',
        percent: 10,
        description: 'Знижка за картою Еверкард',
      },
      {
        value: 'SOCIAL_MEDIA',
        label: 'Соцмережі',
        percent: 5,
        description: 'Знижка за інформацію із соцмереж',
      },
      {
        value: 'MILITARY',
        label: 'ЗСУ',
        percent: 10,
        description: 'Знижка для військовослужбовців ЗСУ',
      },
      {
        value: 'CUSTOM',
        label: 'Інше',
        description: 'Індивідуальна знижка (вказати відсоток)',
      },
    ];
  }

  /**
   * Отримання категорій виключених зі знижок (з документу)
   * Знижки НЕ діють на прасування, прання і фарбування текстилю
   */
  getExcludedCategories(): string[] {
    return [...EXCLUDED_CATEGORIES_FULL];
  }

  /**
   * Перевірка чи має знижка фіксований відсоток
   */
  hasFixedPercent(discountType: DiscountType): boolean {
    return ['EVERCARD', 'SOCIAL_MEDIA', 'MILITARY'].includes(discountType);
  }

  /**
   * Перевірка виключених категорій через локальну схему
   */
  checkExcludedCategories(
    serviceCategoryIds: string[],
    customExcludedPatterns?: string[]
  ): {
    isValid: boolean;
    errors: string[];
    excludedCategoryIds: string[];
    hasExcludedCategories: boolean;
  } {
    const excludedPatterns = customExcludedPatterns || [...EXCLUDED_CATEGORIES_PATTERNS];
    const validation = safeValidate(excludedCategoriesSchema, {
      serviceCategoryIds,
      excludedPatterns,
    });

    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
        excludedCategoryIds: [],
        hasExcludedCategories: false,
      };
    }

    // Знайти категорії, які містять виключені шаблони
    const excludedCategoryIds = serviceCategoryIds.filter((id) =>
      excludedPatterns.some((pattern) => id.toLowerCase().includes(pattern.toLowerCase()))
    );

    return {
      isValid: true,
      errors: [],
      excludedCategoryIds,
      hasExcludedCategories: excludedCategoryIds.length > 0,
    };
  }

  /**
   * Розрахунок знижки з урахуванням виключених категорій
   */
  calculateDiscountAmount(
    totalAmount: number,
    discountPercentage: number,
    excludedCategoriesAmount: number = 0
  ): DiscountCalculationResult {
    const validation = safeValidate(discountCalculationSchema, {
      totalAmount,
      discountPercentage,
      excludedCategoriesAmount,
    });

    if (!validation.success) {
      return {
        originalAmount: totalAmount,
        discountAmount: 0,
        finalAmount: totalAmount,
        discountPercentage: 0,
        excludedAmount: 0,
        isValid: false,
        errors: validation.errors,
      };
    }

    // Сума, до якої застосовується знижка (без виключених категорій)
    const discountableAmount = Math.max(0, totalAmount - excludedCategoriesAmount);

    // Розрахунок суми знижки
    const discountAmount = (discountableAmount * discountPercentage) / 100;

    // Фінальна сума
    const finalAmount = totalAmount - discountAmount;

    return {
      originalAmount: totalAmount,
      discountAmount,
      finalAmount,
      discountPercentage,
      excludedAmount: excludedCategoriesAmount,
      isValid: true,
      errors: [],
    };
  }

  /**
   * Отримання опису знижки
   */
  getDiscountDescription(discountType: DiscountType, customDescription?: string): string {
    if (customDescription) {
      return customDescription;
    }

    const option = this.getDiscountTypeOptions().find((opt) => opt.value === discountType);
    return option?.description || '';
  }

  /**
   * Отримання інформації про обмеження знижок
   */
  getDiscountRestrictions(): {
    excludedCategories: string[];
    message: string;
  } {
    return {
      excludedCategories: [...EXCLUDED_CATEGORIES_FULL],
      message: 'Знижки НЕ діють на прасування, прання і фарбування текстилю',
    };
  }

  /**
   * Створення запиту для застосування знижки
   */
  createApplyDiscountRequest(
    orderId: string,
    discountType: DiscountType,
    customPercentage?: number
  ): {
    isValid: boolean;
    errors: string[];
    requestData?: ApplyDiscountRequest;
  } {
    const discountPercentage = customPercentage || this.getDefaultDiscountPercent(discountType);
    const discountDescription = this.getDiscountDescription(discountType);

    const validation = this.validateApplyDiscountRequest(
      orderId,
      discountType,
      discountPercentage,
      discountDescription
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
      requestData: validation.validatedData,
    };
  }

  /**
   * Валідація відсотка знижки
   */
  validateDiscountPercentage(percentage: number): {
    isValid: boolean;
    errors: string[];
  } {
    if (percentage < 0) {
      return {
        isValid: false,
        errors: ["Відсоток знижки не може бути від'ємним"],
      };
    }

    if (percentage > 100) {
      return {
        isValid: false,
        errors: ['Відсоток знижки не може перевищувати 100%'],
      };
    }

    return {
      isValid: true,
      errors: [],
    };
  }

  /**
   * Форматування суми знижки для відображення
   */
  formatDiscountAmount(amount: number, currency: string = 'UAH'): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Отримання відсотка знижки за замовчуванням
   */
  getDefaultDiscountPercent(discountType: DiscountType): number {
    const option = this.getDiscountTypeOptions().find((opt) => opt.value === discountType);
    return option?.percent || 0;
  }
}
