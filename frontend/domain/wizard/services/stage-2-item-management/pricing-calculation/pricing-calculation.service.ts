import { z } from 'zod';

import {
  calculatePriceBody,
  calculatePrice200Response,
  getBasePriceQueryParams,
  getBasePrice200Response,
  getAvailableModifiersForCategoryQueryParams,
  getAvailableModifiersForCategory200Response,
  getRiskWarningsForItemQueryParams,
  getRiskWarningsForItem200Response,
  safeValidate,
  validateOrThrow,
} from '@/shared/api/generated/full/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс розрахунку цін з orval + zod інтеграцією
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація запитів розрахунку цін через orval Zod схеми
 * - Бізнес-правила для застосування модифікаторів
 * - Валідація параметрів та відповідей API
 * - Форматування та розрахунки цін
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Складні розрахунки цін (роль API)
 */

// Використовуємо orval схеми напряму з префіксом для унікальності
export type PricingCalculationRequest = z.infer<typeof calculatePriceBody>;
export type PricingCalculationResponse = z.infer<typeof calculatePrice200Response>;
export type PricingBasePriceParams = z.infer<typeof getBasePriceQueryParams>;
export type PricingBasePriceResponse = z.infer<typeof getBasePrice200Response>;
export type PricingModifiersParams = z.infer<typeof getAvailableModifiersForCategoryQueryParams>;
export type PricingModifiersResponse = z.infer<typeof getAvailableModifiersForCategory200Response>;
export type PricingRiskWarningsParams = z.infer<typeof getRiskWarningsForItemQueryParams>;
export type PricingRiskWarningsResponse = z.infer<typeof getRiskWarningsForItem200Response>;

// Локальні схеми для бізнес-логіки
const priceFormattingOptionsSchema = z.object({
  currency: z.enum(['UAH', 'USD', 'EUR']).default('UAH'),
  locale: z.enum(['uk-UA', 'en-US', 'en-GB']).default('uk-UA'),
  minimumFractionDigits: z.number().min(0).max(4).default(2),
});

const modifierApplicationSchema = z.object({
  categoryCode: z.string().min(1, "Код категорії обов'язковий"),
  modifierCode: z.string().min(1, "Код модифікатора обов'язковий"),
  isApplicable: z.boolean(),
  reason: z.string().optional(),
});

const priceBreakdownSchema = z.object({
  basePrice: z.number().min(0),
  modifiersTotal: z.number(),
  expeditedSurcharge: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  finalPrice: z.number().min(0),
});

// Експортуємо локальні типи з префіксом для унікальності
export type PricingFormattingOptions = z.infer<typeof priceFormattingOptionsSchema>;
export type PricingModifierApplication = z.infer<typeof modifierApplicationSchema>;
export type PricingBreakdown = z.infer<typeof priceBreakdownSchema>;

export interface PricingCalculationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: PricingCalculationResponse;
}

export interface PricingBasePriceResult {
  isValid: boolean;
  errors: string[];
  basePrice?: number;
}

export interface PricingValidationResult {
  isValid: boolean;
  errors: string[];
  validatedRequest?: PricingCalculationRequest;
}

export class PricingCalculationService extends BaseWizardService {
  protected readonly serviceName = 'PricingCalculationService';

  private readonly defaultFormattingOptions: PricingFormattingOptions;

  constructor() {
    super();
    this.defaultFormattingOptions = priceFormattingOptionsSchema.parse({});
  }

  /**
   * Валідація запиту розрахунку ціни
   */
  validateCalculationRequest(data: unknown): PricingValidationResult {
    const validation = safeValidate(calculatePriceBody, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedRequest: validation.data,
    };
  }

  /**
   * Валідація відповіді з розрахунком ціни
   */
  validateCalculationResponse(data: unknown): PricingCalculationResult {
    const validation = safeValidate(calculatePrice200Response, data);
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
   * Валідація параметрів для отримання базової ціни
   */
  validateBasePriceParams(
    categoryCode: string,
    itemName: string,
    color?: string
  ): {
    isValid: boolean;
    errors: string[];
    validatedParams?: PricingBasePriceParams;
  } {
    const params = { categoryCode, itemName, color };
    const validation = safeValidate(getBasePriceQueryParams, params);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedParams: validation.data,
    };
  }

  /**
   * Створення запиту для розрахунку ціни
   */
  createPriceCalculationRequest(
    categoryCode: string,
    itemName: string,
    quantity: number,
    options: {
      color?: string;
      modifierCodes?: string[];
      rangeModifierValues?: Array<{ modifierCode?: string; value?: number }>;
      fixedModifierQuantities?: Array<{ modifierCode?: string; quantity?: number }>;
      expedited?: boolean;
      expeditePercent?: number;
      discountPercent?: number;
    } = {}
  ): PricingValidationResult {
    const requestData = {
      categoryCode,
      itemName,
      quantity,
      ...options,
    };

    return this.validateCalculationRequest(requestData);
  }

  /**
   * Перевірка чи застосовується модифікатор до категорії
   */
  validateModifierApplication(
    modifierCode: string,
    categoryCode: string
  ): PricingModifierApplication {
    // Бізнес-правила для застосування модифікаторів
    const categoryRestrictions: Record<string, string[]> = {
      child_discount: ['all'], // для всіх категорій
      expedited_50: ['all'], // терміновість для всіх
      expedited_100: ['all'],
      hand_cleaning: ['textiles', 'leather'], // ручна чистка
      fur_collar: ['outerwear'], // тільки для верхнього одягу
      waterproof: ['leather', 'shoes'], // водовідштовхуюче
      silk_cleaning: ['textiles'], // шовк тільки для текстилю
      combined_cleaning: ['textiles'], // комбіновані вироби
      press_only: ['all'], // прасування
      stain_removal: ['all'], // виведення плям
      color_restoration: ['leather', 'textiles'], // відновлення кольору
      size_alteration: ['textiles'], // підгонка розміру
    };

    const applicableCategories = categoryRestrictions[modifierCode] || [];
    const isApplicable =
      applicableCategories.includes('all') || applicableCategories.includes(categoryCode);

    const application = {
      categoryCode,
      modifierCode,
      isApplicable,
      reason: !isApplicable
        ? `Модифікатор ${modifierCode} не застосовується до категорії ${categoryCode}`
        : undefined,
    };

    // Валідація через схему
    return modifierApplicationSchema.parse(application);
  }

  /**
   * Фільтрація модифікаторів за категорією
   */
  filterModifiersForCategory(
    modifierCodes: string[],
    categoryCode: string
  ): {
    applicable: string[];
    notApplicable: Array<{ modifierCode: string; reason: string }>;
  } {
    const applicable: string[] = [];
    const notApplicable: Array<{ modifierCode: string; reason: string }> = [];

    modifierCodes.forEach((modifierCode) => {
      const application = this.validateModifierApplication(modifierCode, categoryCode);
      if (application.isApplicable) {
        applicable.push(modifierCode);
      } else {
        notApplicable.push({
          modifierCode,
          reason: application.reason || 'Невідома причина',
        });
      }
    });

    return { applicable, notApplicable };
  }

  /**
   * Розрахунок відсотка знижки/надбавки
   */
  calculatePercentageChange(basePrice: number, finalPrice: number): number {
    if (basePrice === 0) return 0;
    return Math.round(((finalPrice - basePrice) / basePrice) * 100 * 100) / 100;
  }

  /**
   * Створення розбивки ціни
   */
  createPriceBreakdown(response: PricingCalculationResponse): PricingBreakdown | null {
    const basePrice = response.baseUnitPrice || 0;
    const finalPrice = response.finalUnitPrice || 0;
    const baseTotalPrice = response.baseTotalPrice || 0;
    const finalTotalPrice = response.finalTotalPrice || 0;

    if (basePrice === 0) return null;

    // Розраховуємо модифікатори на основі деталей
    let expeditedSurcharge = 0;
    let discount = 0;

    if (response.calculationDetails) {
      response.calculationDetails.forEach((detail) => {
        const priceDiff = detail.priceDifference || 0;

        // Терміновість
        if (
          detail.modifierCode?.includes('expedited') ||
          detail.modifierName?.toLowerCase().includes('термін')
        ) {
          expeditedSurcharge += Math.abs(priceDiff);
        }
        // Знижки
        else if (
          detail.modifierCode?.includes('discount') ||
          detail.modifierName?.toLowerCase().includes('знижка') ||
          priceDiff < 0
        ) {
          discount += Math.abs(priceDiff);
        }
      });
    }

    // Загальна сума модифікаторів
    const modifiersTotal = finalPrice - basePrice;

    const breakdown: PricingBreakdown = {
      basePrice: baseTotalPrice, // Використовуємо загальну базову ціну
      modifiersTotal,
      expeditedSurcharge,
      discount,
      finalPrice: finalTotalPrice, // Використовуємо загальну фінальну ціну
    };

    return priceBreakdownSchema.parse(breakdown);
  }

  /**
   * Форматування ціни для відображення
   */
  formatPrice(price: number, options: Partial<PricingFormattingOptions> = {}): string {
    const formattingOptions = { ...this.defaultFormattingOptions, ...options };

    return new Intl.NumberFormat(formattingOptions.locale, {
      style: 'currency',
      currency: formattingOptions.currency,
      minimumFractionDigits: formattingOptions.minimumFractionDigits,
    }).format(price);
  }

  /**
   * Форматування відсотку для відображення
   */
  formatPercentage(percentage: number): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(percentage / 100);
  }

  /**
   * Перевірка чи має предмет знижки
   */
  hasDiscounts(response: PricingCalculationResponse): boolean {
    if (!response.calculationDetails) return false;

    return response.calculationDetails.some(
      (detail: { modifierCode?: string; modifierName?: string; priceDifference?: number }) =>
        detail.modifierCode?.includes('discount') ||
        detail.modifierName?.toLowerCase().includes('знижка') ||
        (detail.priceDifference && detail.priceDifference < 0)
    );
  }

  /**
   * Перевірка чи має предмет надбавки
   */
  hasSurcharges(response: PricingCalculationResponse): boolean {
    if (!response.calculationDetails) return false;

    return response.calculationDetails.some(
      (detail: { modifierCode?: string; modifierName?: string; priceDifference?: number }) =>
        detail.modifierCode?.includes('expedited') ||
        detail.modifierName?.toLowerCase().includes('термін') ||
        (detail.priceDifference && detail.priceDifference > 0)
    );
  }

  /**
   * Отримання деталізації розрахунку в зручному форматі
   */
  getCalculationSummary(response: PricingCalculationResponse): {
    baseInfo: {
      unitPrice: string;
      quantity: number;
      totalPrice: string;
      unitOfMeasure?: string;
    };
    modifiers: Array<{
      name: string;
      code?: string;
      impact: string;
      amount: string;
    }>;
    final: {
      unitPrice: string;
      totalPrice: string;
      percentageChange: string;
    };
  } {
    const baseInfo = {
      unitPrice: this.formatPrice(response.baseUnitPrice || 0),
      quantity: response.quantity || 1,
      totalPrice: this.formatPrice(response.baseTotalPrice || 0),
      unitOfMeasure: response.unitOfMeasure,
    };

    const modifiers =
      response.calculationDetails?.map(
        (detail: {
          modifierName?: string;
          stepName?: string;
          modifierCode?: string;
          priceDifference?: number;
        }) => ({
          name: detail.modifierName || detail.stepName || 'Модифікатор',
          code: detail.modifierCode,
          impact:
            detail.priceDifference && detail.priceDifference !== 0
              ? detail.priceDifference > 0
                ? 'збільшення'
                : 'зменшення'
              : 'без змін',
          amount: this.formatPrice(Math.abs(detail.priceDifference || 0)),
        })
      ) || [];

    const percentageChange = this.calculatePercentageChange(
      response.baseUnitPrice || 0,
      response.finalUnitPrice || 0
    );

    const final = {
      unitPrice: this.formatPrice(response.finalUnitPrice || 0),
      totalPrice: this.formatPrice(response.finalTotalPrice || 0),
      percentageChange: this.formatPercentage(percentageChange),
    };

    return { baseInfo, modifiers, final };
  }
}
