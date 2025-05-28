import {
  applyOrderDiscount,
  getOrderDiscount,
  type WizardDiscountData,
  type WizardDiscountResult,
  WizardDiscountType,
} from '@/domain/wizard/adapters/order';
import {
  globalDiscountsSchema,
  globalDiscountsFormSchema,
  type DiscountType,
} from '@/domain/wizard/schemas/wizard-stage-3.schemas';

// Імпорти адаптерів з wizard domain

import { BaseWizardService } from '../../base.service';

/**
 * ✅ МІНІМАЛІСТСЬКИЙ СЕРВІС ДЛЯ 3.2: ЗНИЖКИ (глобальні для замовлення)
 * ✅ На основі: OrderWizard instruction_structure logic.md
 * Розмір: ~80 рядків (дотримання ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order адаптерів для знижок
 * - Валідація знижок через централізовані Zod схеми
 * - Перевірка обмежень відповідно до документу
 *
 * НЕ дублює:
 * - Розрахунок знижок (роль order адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 */

export class GlobalDiscountsService extends BaseWizardService {
  protected readonly serviceName = 'GlobalDiscountsService';

  /**
   * Валідація глобальних знижок (через централізовані схеми)
   */
  validateGlobalDiscounts(data: unknown) {
    return globalDiscountsSchema.safeParse(data);
  }

  /**
   * Валідація форми глобальних знижок
   */
  validateGlobalDiscountsForm(data: unknown) {
    return globalDiscountsFormSchema.safeParse(data);
  }

  /**
   * Отримання типів знижок відповідно до документу
   * Тип знижки (вибір один):
   * - Без знижки, Еверкард (10%), Соцмережі (5%), ЗСУ (10%), Інше
   */
  getDiscountTypeOptions(): Array<{ value: DiscountType; label: string; percent?: number }> {
    return [
      { value: 'без_знижки', label: 'Без знижки' },
      { value: 'еверкард', label: 'Еверкард', percent: 10 },
      { value: 'соцмережі', label: 'Соцмережі', percent: 5 },
      { value: 'зсу', label: 'ЗСУ', percent: 10 },
      { value: 'інше', label: 'Інше (вказати відсоток)' },
    ];
  }

  /**
   * Отримання категорій виключених зі знижок (з документу)
   * Знижки НЕ діють на прасування, прання і фарбування текстилю
   */
  getExcludedCategories(): string[] {
    return ['прасування', 'прання', 'фарбування_текстилю'];
  }

  /**
   * Композиція: застосування глобальної знижки через адаптер
   */
  async applyGlobalDiscount(
    discountData: WizardDiscountData
  ): Promise<WizardDiscountResult | null> {
    const result = await applyOrderDiscount(discountData);
    return result.success ? result.data || null : null;
  }

  /**
   * Отримання поточної знижки замовлення
   */
  async getOrderDiscount(orderId: string): Promise<WizardDiscountResult | null> {
    const result = await getOrderDiscount(orderId);
    return result.success ? result.data || null : null;
  }

  /**
   * Перевірка чи має знижка відсоток за замовчуванням
   */
  hasDefaultPercent(discountType: DiscountType): boolean {
    return ['еверкард', 'соцмережі', 'зсу'].includes(discountType);
  }

  /**
   * Отримання відсотка знижки за замовчуванням
   */
  getDefaultDiscountPercent(discountType: DiscountType): number {
    const mapping: Record<DiscountType, number> = {
      без_знижки: 0,
      еверкард: 10,
      соцмережі: 5,
      зсу: 10,
      інше: 0,
    };
    return mapping[discountType] || 0;
  }

  /**
   * Маппінг UI типу знижки на domain тип для адаптера
   */
  mapDiscountTypeToWizard(
    orderId: string,
    discountType: DiscountType,
    customPercent?: number
  ): WizardDiscountData {
    return {
      orderId,
      type: this.getWizardDiscountTypeFromUI(discountType),
      percentage: customPercent || this.getDefaultDiscountPercent(discountType),
      description: this.getDiscountDescription(discountType),
    };
  }

  /**
   * Приватний метод: конвертація UI типу знижки
   */
  private getWizardDiscountTypeFromUI(discountType: DiscountType): WizardDiscountType {
    const mapping: Record<DiscountType, WizardDiscountType> = {
      без_знижки: WizardDiscountType.NONE,
      еверкард: WizardDiscountType.EVERCARD,
      соцмережі: WizardDiscountType.SOCIAL_MEDIA,
      зсу: WizardDiscountType.MILITARY,
      інше: WizardDiscountType.CUSTOM,
    };
    return mapping[discountType] || WizardDiscountType.NONE;
  }

  /**
   * Приватний метод: отримання опису знижки
   */
  private getDiscountDescription(discountType: DiscountType): string {
    const mapping: Record<DiscountType, string> = {
      без_знижки: '',
      еверкард: 'Знижка за картою Еверкард',
      соцмережі: 'Знижка за інформацію із соцмереж',
      зсу: 'Знижка для військовослужбовців ЗСУ',
      інше: 'Індивідуальна знижка',
    };
    return mapping[discountType] || '';
  }
}
