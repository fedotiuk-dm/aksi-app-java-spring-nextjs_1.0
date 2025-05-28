import {
  calculatePriceForPricing,
  getBasePriceForPricing,
  getRiskWarningsForPricing,
} from '@/domain/wizard/adapters/pricing';
import {
  priceCalculationRequestSchema,
  priceCalculationResultSchema,
  priceModifierSchema,
  calculationDetailSchema,
} from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

import type {
  WizardPriceCalculationRequest,
  WizardPriceCalculationResponse,
  WizardRiskWarning,
} from '@/domain/wizard/adapters/shared';

/**
 * Розширений мінімалістський сервіс для розрахунку ціни
 * Розмір: ~110 рядків (в межах ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція pricing адаптерів для розрахунків та ризиків
 * - Валідація через ВСІ централізовані Zod схеми підетапу 2.4
 * - Мінімальна логіка застосування модифікаторів та форматування
 *
 * НЕ дублює:
 * - API виклики (роль pricing адаптерів)
 * - Складні розрахунки (роль pricing адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Схеми валідації (роль централізованих schemas)
 */

export class PricingCalculationService extends BaseWizardService {
  protected readonly serviceName = 'PricingCalculationService';

  /**
   * Композиція: розрахунок ціни через адаптер
   */
  async calculatePrice(
    request: WizardPriceCalculationRequest
  ): Promise<WizardPriceCalculationResponse | null> {
    const validationResult = this.validateCalculationRequest(request);
    if (!validationResult.success) {
      return null;
    }

    const result = await calculatePriceForPricing(request);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: отримання базової ціни через адаптер
   */
  async getBasePrice(categoryCode: string, itemName: string, color?: string): Promise<number> {
    const result = await getBasePriceForPricing(categoryCode, itemName, color);
    return result.success ? result.data || 0 : 0;
  }

  /**
   * Композиція: отримання попереджень про ризики через адаптер
   */
  async getRiskWarnings(
    categoryCode: string,
    itemName: string,
    material?: string,
    color?: string
  ): Promise<WizardRiskWarning[]> {
    const result = await getRiskWarningsForPricing(categoryCode, itemName, material, color);
    return result.success ? result.data || [] : [];
  }

  /**
   * Валідація запиту розрахунку через централізовану схему
   */
  validateCalculationRequest(data: unknown) {
    return priceCalculationRequestSchema.safeParse(data);
  }

  /**
   * Валідація результату розрахунку через централізовану схему
   */
  validateCalculationResult(data: unknown) {
    return priceCalculationResultSchema.safeParse(data);
  }

  /**
   * Валідація модифікатора через централізовану схему
   */
  validateModifier(data: unknown) {
    return priceModifierSchema.safeParse(data);
  }

  /**
   * Валідація деталей розрахунку через централізовану схему
   */
  validateCalculationDetail(data: unknown) {
    return calculationDetailSchema.safeParse(data);
  }

  /**
   * Перевірка чи застосовується модифікатор до категорії
   */
  isModifierApplicable(modifierCode: string, categoryCode: string): boolean {
    const restrictions: Record<string, string[]> = {
      child_discount: ['all'], // для всіх категорій
      expedited_50: ['all'], // терміновість для всіх
      hand_cleaning: ['textiles', 'leather'], // ручна чистка
      fur_collar: ['outerwear'], // тільки для верхнього одягу
      waterproof: ['leather', 'shoes'], // водовідштовхуюче
      silk_cleaning: ['textiles'], // шовк тільки для текстилю
      combined_cleaning: ['textiles'], // комбіновані вироби
    };

    const applicableCategories = restrictions[modifierCode] || [];
    return applicableCategories.includes('all') || applicableCategories.includes(categoryCode);
  }

  /**
   * Створення запиту для розрахунку з валідацією
   */
  createCalculationRequest(
    categoryCode: string,
    itemName: string,
    quantity: number,
    modifierCodes: string[] = [],
    color?: string,
    expedited?: boolean,
    expeditePercent?: number,
    discountPercent?: number
  ): WizardPriceCalculationRequest {
    return {
      categoryCode,
      itemName,
      quantity,
      modifierCodes,
      color,
      expedited,
      expeditePercent,
      discountPercent,
    };
  }

  /**
   * Форматування ціни для відображення
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
    }).format(price);
  }

  /**
   * Розрахунок відсотка знижки/надбавки
   */
  calculatePercentage(basePrice: number, finalPrice: number): number {
    if (basePrice === 0) return 0;
    return Math.round(((finalPrice - basePrice) / basePrice) * 100 * 100) / 100;
  }
}
