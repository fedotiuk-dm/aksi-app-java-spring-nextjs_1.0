/**
 * Калькулятор цін для Pricing домену
 * Обчислює вартість послуг з урахуванням модифікаторів, знижок та бізнес-правил
 */

import { PricingValidator } from './pricing.validator';
import { PriceModifierType, ModifierApplicationRule } from '../types';

import type {
  PriceListItem,
  PriceModifier,
  PriceCalculationParams,
  PriceCalculationResult,
  AppliedModifier,
  PriceBreakdownItem,
  ServiceCategory,
  UnitOfMeasure,
} from '../types';

/**
 * Налаштування калькулятора
 */
interface CalculatorSettings {
  currency: string;
  roundingPrecision: number;
  roundingRule: 'up' | 'down' | 'nearest';
  enableDebugMode: boolean;
}

export class PricingCalculator {
  private static defaultSettings: CalculatorSettings = {
    currency: 'UAH',
    roundingPrecision: 2,
    roundingRule: 'nearest',
    enableDebugMode: false,
  };

  /**
   * Головний метод розрахунку ціни
   */
  static calculatePrice(
    params: PriceCalculationParams,
    modifiers: PriceModifier[] = [],
    settings: Partial<CalculatorSettings> = {}
  ): PriceCalculationResult {
    const config = { ...this.defaultSettings, ...settings };

    // Валідуємо параметри
    const validation = PricingValidator.validateCalculationParams(params);
    if (!validation.valid) {
      throw new Error(`Помилки валідації: ${validation.errors.join(', ')}`);
    }

    // Початкова ціна
    const basePrice = this.getBasePriceForItem(params.priceListItem, params);
    const subtotalBeforeModifiers = basePrice * params.quantity;

    // Застосовуємо модифікатори
    const appliedModifiers = this.applyModifiers(params, modifiers, subtotalBeforeModifiers);

    // Розраховуємо проміжну суму з модифікаторами
    const modifiersTotal = appliedModifiers.reduce((sum, mod) => sum + mod.resultingAmount, 0);
    const subtotalAfterModifiers = subtotalBeforeModifiers + modifiersTotal;

    // Застосовуємо знижку
    const { discountAmount, discountPercentage } = this.calculateDiscount(
      params,
      subtotalAfterModifiers
    );

    // Фінальна ціна
    const finalPrice = this.roundPrice(
      Math.max(0, subtotalAfterModifiers - discountAmount),
      config
    );

    // Створюємо деталізацію
    const breakdown = this.createPriceBreakdown(
      basePrice,
      params.quantity,
      appliedModifiers,
      discountAmount,
      discountPercentage,
      finalPrice
    );

    // Результат валідації
    const result: PriceCalculationResult = {
      itemId: params.priceListItem.id || params.priceListItem.itemNumber,
      basePrice,
      quantity: params.quantity,
      unitOfMeasure: params.priceListItem.unitOfMeasure,
      appliedModifiers,
      subtotalBeforeModifiers,
      modifiersTotal,
      subtotalAfterModifiers,
      discountAmount,
      discountPercentage,
      finalPrice,
      pricePerUnit: this.roundPrice(finalPrice / params.quantity, config),
      breakdown,
      calculatedAt: new Date(),
      calculationMethod: 'standard',
      notes: validation.warnings,
      warnings: [],
    };

    // Валідуємо результат
    const resultValidation = PricingValidator.validateCalculationResult(result, params);
    if (!resultValidation.valid) {
      result.warnings = resultValidation.errors;
    }

    return result;
  }

  /**
   * Отримує базову ціну для предмета з урахуванням кольору
   */
  private static getBasePriceForItem(item: PriceListItem, params: PriceCalculationParams): number {
    // Перевіряємо спеціальні ціни за кольором
    if (params.color) {
      const colorLower = params.color.toLowerCase();

      // Чорний колір
      if (colorLower.includes('чорн') || colorLower.includes('black')) {
        if (item.blackColorPrice !== undefined) {
          return item.blackColorPrice;
        }
      }

      // Світлі кольори
      if (
        colorLower.includes('біл') ||
        colorLower.includes('світл') ||
        colorLower.includes('white') ||
        colorLower.includes('light')
      ) {
        if (item.lightColorPrice !== undefined) {
          return item.lightColorPrice;
        }
      }
    }

    // Спеціальна ціна
    if (item.specialPrice !== undefined && item.specialPrice > 0) {
      return item.specialPrice;
    }

    return item.basePrice;
  }

  /**
   * Застосовує модифікатори до ціни
   */
  private static applyModifiers(
    params: PriceCalculationParams,
    modifiers: PriceModifier[],
    baseAmount: number
  ): AppliedModifier[] {
    const appliedModifiers: AppliedModifier[] = [];

    // Фільтруємо та сортуємо модифікатори за пріоритетом
    const applicableModifiers = modifiers
      .filter((modifier) => {
        const canApply = PricingValidator.canApplyModifier(modifier, params, baseAmount);
        return canApply.canApply;
      })
      .sort((a, b) => a.priority - b.priority);

    let currentAmount = baseAmount;
    let order = 1;

    for (const modifier of applicableModifiers) {
      // Перевіряємо чи не виключає цей модифікатор інші
      if (modifier.applicationRule === ModifierApplicationRule.EXCLUSIVE) {
        appliedModifiers.length = 0; // Очищуємо попередні модифікатори
      }

      const appliedModifier = this.applyModifier(modifier, currentAmount, params, order++);

      if (appliedModifier) {
        appliedModifiers.push(appliedModifier);

        // Оновлюємо поточну суму для мультиплікативних модифікаторів
        if (modifier.applicationRule === ModifierApplicationRule.MULTIPLICATIVE) {
          currentAmount = baseAmount + appliedModifier.resultingAmount;
        }
      }
    }

    return appliedModifiers;
  }

  /**
   * Застосовує окремий модифікатор
   */
  private static applyModifier(
    modifier: PriceModifier,
    amount: number,
    params: PriceCalculationParams,
    order: number
  ): AppliedModifier | null {
    let appliedValue = modifier.value;
    let resultingAmount = 0;
    let reason = '';

    switch (modifier.type) {
      case PriceModifierType.PERCENTAGE:
        resultingAmount = (amount * appliedValue) / 100;
        reason = `${appliedValue}% від базової ціни`;
        break;

      case PriceModifierType.FIXED_AMOUNT:
        resultingAmount = appliedValue * params.quantity;
        reason = `Фіксована сума ${appliedValue} за одиницю`;
        break;

      case PriceModifierType.MULTIPLIER:
        resultingAmount = amount * (appliedValue - 1);
        reason = `Множник x${appliedValue}`;
        break;

      default:
        return null;
    }

    // Додаткові модифікації залежно від правил застосування
    switch (modifier.applicationRule) {
      case ModifierApplicationRule.ADDITIVE:
        // Результат додається до поточної суми
        break;

      case ModifierApplicationRule.MULTIPLICATIVE:
        // Результат множиться на поточну суму
        break;

      case ModifierApplicationRule.CONDITIONAL:
        // Застосовується тільки за певних умов
        if (!this.checkConditionalRules(modifier, params)) {
          return null;
        }
        break;
    }

    return {
      modifierId: modifier.id,
      modifier,
      appliedValue,
      resultingAmount: this.roundPrice(resultingAmount, this.defaultSettings),
      reason,
      order,
    };
  }

  /**
   * Перевіряє умовні правила для модифікатора
   */
  private static checkConditionalRules(
    modifier: PriceModifier,
    params: PriceCalculationParams
  ): boolean {
    // Тут можна додати складні умовні правила
    // Наприклад, модифікатор застосовується тільки в певні дні тижня,
    // або для певних розмірів, або комбінацій матеріалів

    // Базова перевірка матеріалу
    if (modifier.materialTypes && modifier.materialTypes.length > 0) {
      if (!params.materialType || !modifier.materialTypes.includes(params.materialType)) {
        return false;
      }
    }

    // Базова перевірка кольору
    if (modifier.colorTypes && modifier.colorTypes.length > 0) {
      if (!params.color || !modifier.colorTypes.includes(params.color)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Розраховує знижку
   */
  private static calculateDiscount(
    params: PriceCalculationParams,
    amount: number
  ): { discountAmount: number; discountPercentage: number } {
    if (!params.discountPercentage || params.discountPercentage <= 0) {
      return { discountAmount: 0, discountPercentage: 0 };
    }

    // Перевіряємо чи дозволена знижка для цієї категорії
    const discountValidation = PricingValidator.validateDiscountRules(
      params.priceListItem.category,
      params.discountPercentage
    );

    if (!discountValidation.valid) {
      return { discountAmount: 0, discountPercentage: 0 };
    }

    const discountAmount = (amount * params.discountPercentage) / 100;

    return {
      discountAmount: this.roundPrice(discountAmount, this.defaultSettings),
      discountPercentage: params.discountPercentage,
    };
  }

  /**
   * Створює деталізацію розрахунку ціни
   */
  private static createPriceBreakdown(
    basePrice: number,
    quantity: number,
    appliedModifiers: AppliedModifier[],
    discountAmount: number,
    discountPercentage: number,
    finalPrice: number
  ): PriceBreakdownItem[] {
    const breakdown: PriceBreakdownItem[] = [];

    // Базова ціна
    breakdown.push({
      description: `Базова ціна за ${quantity} од.`,
      type: 'base',
      amount: basePrice * quantity,
      calculation: `${basePrice} × ${quantity}`,
    });

    // Модифікатори
    appliedModifiers.forEach((mod) => {
      breakdown.push({
        description: mod.modifier.name,
        type: 'modifier',
        amount: mod.resultingAmount,
        percentage:
          mod.modifier.type === PriceModifierType.PERCENTAGE ? mod.appliedValue : undefined,
        calculation: mod.reason,
      });
    });

    // Знижка
    if (discountAmount > 0) {
      breakdown.push({
        description: 'Знижка',
        type: 'discount',
        amount: -discountAmount,
        percentage: discountPercentage,
        calculation: `-${discountPercentage}%`,
      });
    }

    // Загальна сума
    breakdown.push({
      description: 'Загальна сума',
      type: 'total',
      amount: finalPrice,
    });

    return breakdown;
  }

  /**
   * Округлює ціну згідно з налаштуваннями
   */
  private static roundPrice(price: number, settings: CalculatorSettings): number {
    const multiplier = Math.pow(10, settings.roundingPrecision);

    switch (settings.roundingRule) {
      case 'up':
        return Math.ceil(price * multiplier) / multiplier;
      case 'down':
        return Math.floor(price * multiplier) / multiplier;
      case 'nearest':
      default:
        return Math.round(price * multiplier) / multiplier;
    }
  }

  /**
   * Розраховує ціну для терміновості
   */
  static calculateUrgencyPrice(
    basePrice: number,
    urgencyLevel: 'standard' | '48h' | '24h'
  ): number {
    const surcharges = {
      standard: 0,
      '48h': 50, // +50%
      '24h': 100, // +100%
    };

    const surcharge = surcharges[urgencyLevel] || 0;
    return basePrice * (1 + surcharge / 100);
  }

  /**
   * Розраховує знижку для дитячих речей
   */
  static calculateChildDiscount(basePrice: number, size?: string): number {
    if (!size) return 0;

    // Дитячі розміри до 30
    const childSizePattern = /^([0-9]|[1-2][0-9]|30)$/;
    if (childSizePattern.test(size)) {
      return basePrice * 0.3; // 30% знижка
    }

    return 0;
  }

  /**
   * Розраховує загальну вартість кількох предметів
   */
  static calculateBulkPrice(calculations: PriceCalculationResult[]): {
    totalAmount: number;
    totalDiscount: number;
    finalAmount: number;
    itemsCount: number;
    averagePrice: number;
  } {
    if (calculations.length === 0) {
      return {
        totalAmount: 0,
        totalDiscount: 0,
        finalAmount: 0,
        itemsCount: 0,
        averagePrice: 0,
      };
    }

    const totalAmount = calculations.reduce((sum, calc) => sum + calc.subtotalAfterModifiers, 0);

    const totalDiscount = calculations.reduce((sum, calc) => sum + calc.discountAmount, 0);

    const finalAmount = calculations.reduce((sum, calc) => sum + calc.finalPrice, 0);

    const itemsCount = calculations.reduce((sum, calc) => sum + calc.quantity, 0);

    return {
      totalAmount: this.roundPrice(totalAmount, this.defaultSettings),
      totalDiscount: this.roundPrice(totalDiscount, this.defaultSettings),
      finalAmount: this.roundPrice(finalAmount, this.defaultSettings),
      itemsCount,
      averagePrice: this.roundPrice(finalAmount / calculations.length, this.defaultSettings),
    };
  }

  /**
   * Порівнює ціни з різними модифікаторами
   */
  static comparePrices(
    params: PriceCalculationParams,
    modifierSets: PriceModifier[][]
  ): Array<{
    setIndex: number;
    result: PriceCalculationResult;
    savings: number;
    isOptimal: boolean;
  }> {
    const results = modifierSets.map((modifiers, index) => {
      const result = this.calculatePrice(params, modifiers);
      return { setIndex: index, result };
    });

    // Знаходимо найкращу ціну
    const minPrice = Math.min(...results.map((r) => r.result.finalPrice));

    return results.map((item) => ({
      ...item,
      savings: item.result.finalPrice - minPrice,
      isOptimal: item.result.finalPrice === minPrice,
    }));
  }
}
