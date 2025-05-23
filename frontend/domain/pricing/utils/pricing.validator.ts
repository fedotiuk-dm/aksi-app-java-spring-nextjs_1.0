/**
 * Валідатор для Pricing домену
 * Перевіряє бізнес-правила, обмеження та валідність даних
 */

import { ServiceCategory, UnitOfMeasure, PriceModifierType } from '../types';

import type {
  PriceListItem,
  PriceModifier,
  PriceCalculationParams,
  PricingOperationResult,
} from '../types';

/**
 * Результат валідації
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class PricingValidator {
  /**
   * Валідує елемент прайс-листа
   */
  static validatePriceListItem(item: PriceListItem): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Валідація обов'язкових полів
    this.validateRequiredFields(item, errors);

    // Валідація цін
    this.validatePrices(item, errors, warnings);

    // Валідація кількісних обмежень
    this.validateQuantityLimits(item, errors);

    // Валідація довжини полів
    this.validateFieldLengths(item, errors);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Валідує обов'язкові поля елемента прайс-листа
   */
  private static validateRequiredFields(item: PriceListItem, errors: string[]): void {
    if (!item.name || item.name.trim().length === 0) {
      errors.push("Назва послуги обов'язкова");
    }

    if (!item.itemNumber || item.itemNumber.trim().length === 0) {
      errors.push("Номер в прайс-листі обов'язковий");
    }

    if (!item.categoryId || item.categoryId.trim().length === 0) {
      errors.push("Категорія послуги обов'язкова");
    }
  }

  /**
   * Валідує ціни елемента прайс-листа
   */
  private static validatePrices(item: PriceListItem, errors: string[], warnings: string[]): void {
    if (item.basePrice === undefined || item.basePrice === null) {
      errors.push("Базова ціна обов'язкова");
    } else if (item.basePrice < 0) {
      errors.push("Базова ціна не може бути від'ємною");
    } else if (item.basePrice === 0) {
      warnings.push('Базова ціна дорівнює нулю');
    }

    if (item.blackColorPrice !== undefined && item.blackColorPrice < 0) {
      errors.push("Ціна для чорних виробів не може бути від'ємною");
    }

    if (item.lightColorPrice !== undefined && item.lightColorPrice < 0) {
      errors.push("Ціна для світлих виробів не може бути від'ємною");
    }

    if (item.specialPrice !== undefined && item.specialPrice < 0) {
      errors.push("Спеціальна ціна не може бути від'ємною");
    }
  }

  /**
   * Валідує кількісні обмеження
   */
  private static validateQuantityLimits(item: PriceListItem, errors: string[]): void {
    if (item.minQuantity !== undefined && item.minQuantity < 0) {
      errors.push("Мінімальна кількість не може бути від'ємною");
    }

    if (item.maxQuantity !== undefined && item.maxQuantity < 0) {
      errors.push("Максимальна кількість не може бути від'ємною");
    }

    if (
      item.minQuantity !== undefined &&
      item.maxQuantity !== undefined &&
      item.minQuantity > item.maxQuantity
    ) {
      errors.push('Мінімальна кількість не може бути більше максимальної');
    }
  }

  /**
   * Валідує довжину полів
   */
  private static validateFieldLengths(item: PriceListItem, errors: string[]): void {
    if (item.name && item.name.length > 200) {
      errors.push('Назва послуги не може бути більше 200 символів');
    }

    if (item.description && item.description.length > 1000) {
      errors.push('Опис не може бути більше 1000 символів');
    }
  }

  /**
   * Валідує модифікатор ціни
   */
  static validatePriceModifier(modifier: PriceModifier): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Валідація обов'язкових полів
    this.validateModifierRequiredFields(modifier, errors);

    // Валідація значення за типом
    this.validateModifierValue(modifier, errors, warnings);

    // Валідація інших параметрів
    this.validateModifierParameters(modifier, errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Валідує обов'язкові поля модифікатора
   */
  private static validateModifierRequiredFields(modifier: PriceModifier, errors: string[]): void {
    if (!modifier.name || modifier.name.trim().length === 0) {
      errors.push("Назва модифікатора обов'язкова");
    }

    if (!modifier.code || modifier.code.trim().length === 0) {
      errors.push("Код модифікатора обов'язковий");
    }
  }

  /**
   * Валідує значення модифікатора за типом
   */
  private static validateModifierValue(
    modifier: PriceModifier,
    errors: string[],
    warnings: string[]
  ): void {
    switch (modifier.type) {
      case PriceModifierType.PERCENTAGE:
        if (modifier.value < -100) {
          errors.push('Відсотковий модифікатор не може бути менше -100%');
        }
        if (modifier.value > 1000) {
          warnings.push('Відсотковий модифікатор більше 1000% - перевірте правильність');
        }
        break;

      case PriceModifierType.FIXED_AMOUNT:
        if (modifier.value < -10000) {
          errors.push('Фіксована сума не може бути менше -10000');
        }
        break;

      case PriceModifierType.MULTIPLIER:
        if (modifier.value < 0) {
          errors.push("Множник не може бути від'ємним");
        }
        if (modifier.value > 10) {
          warnings.push('Множник більше 10 - перевірте правильність');
        }
        break;
    }
  }

  /**
   * Валідує додаткові параметри модифікатора
   */
  private static validateModifierParameters(
    modifier: PriceModifier,
    errors: string[],
    warnings: string[]
  ): void {
    if (modifier.priority < 0) {
      errors.push("Пріоритет не може бути від'ємним");
    }

    if (modifier.priority > 1000) {
      warnings.push('Дуже високий пріоритет - перевірте правильність');
    }

    if (modifier.validFrom && modifier.validUntil) {
      if (modifier.validFrom > modifier.validUntil) {
        errors.push('Дата початку дії не може бути пізніше дати закінчення');
      }
    }

    if (!modifier.applicableCategories || modifier.applicableCategories.length === 0) {
      warnings.push('Модифікатор не застосовується до жодної категорії');
    }

    if (modifier.minOrderAmount !== undefined && modifier.minOrderAmount < 0) {
      errors.push("Мінімальна сума замовлення не може бути від'ємною");
    }

    if (modifier.maxApplications !== undefined && modifier.maxApplications <= 0) {
      errors.push('Максимальна кількість застосувань повинна бути більше 0');
    }
  }

  /**
   * Валідує параметри розрахунку ціни
   */
  static validateCalculationParams(params: PriceCalculationParams): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Валідуємо прайс-лист елемент
    if (!params.priceListItem) {
      errors.push("Елемент прайс-листа обов'язковий");
    } else {
      const itemValidation = this.validatePriceListItem(params.priceListItem);
      errors.push(...itemValidation.errors);
      warnings.push(...itemValidation.warnings);
    }

    // Валідуємо кількість
    if (params.quantity === undefined || params.quantity === null) {
      errors.push("Кількість обов'язкова");
    } else if (params.quantity <= 0) {
      errors.push('Кількість повинна бути більше 0');
    } else if (params.quantity > 1000) {
      warnings.push('Дуже велика кількість - перевірте правильність');
    }

    // Валідуємо знижку
    if (params.discountPercentage !== undefined) {
      if (params.discountPercentage < 0) {
        errors.push("Відсоток знижки не може бути від'ємним");
      } else if (params.discountPercentage > 100) {
        errors.push('Відсоток знижки не може бути більше 100%');
      }
    }

    // Валідуємо рівень терміновості
    if (params.urgencyLevel && !['standard', '48h', '24h'].includes(params.urgencyLevel)) {
      errors.push('Некоректний рівень терміновості');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Перевіряє чи модифікатор застосовується до категорії
   */
  static isModifierApplicableToCategory(
    modifier: PriceModifier,
    category: ServiceCategory
  ): boolean {
    if (!modifier.isActive) {
      return false;
    }

    // Перевіряємо дати дії
    const now = new Date();
    if (modifier.validFrom && modifier.validFrom > now) {
      return false;
    }
    if (modifier.validUntil && modifier.validUntil < now) {
      return false;
    }

    // Перевіряємо категорії
    return modifier.applicableCategories.includes(category);
  }

  /**
   * Перевіряє чи можна застосувати модифікатор до предмета
   */
  static canApplyModifier(
    modifier: PriceModifier,
    params: PriceCalculationParams,
    orderAmount?: number
  ): { canApply: boolean; reason?: string } {
    if (!modifier.isActive) {
      return { canApply: false, reason: 'Модифікатор неактивний' };
    }

    // Перевіряємо категорію
    if (!this.isModifierApplicableToCategory(modifier, params.priceListItem.category)) {
      return { canApply: false, reason: 'Модифікатор не застосовується до цієї категорії' };
    }

    // Перевіряємо мінімальну суму замовлення
    if (
      modifier.minOrderAmount !== undefined &&
      orderAmount !== undefined &&
      orderAmount < modifier.minOrderAmount
    ) {
      return {
        canApply: false,
        reason: `Мінімальна сума замовлення для цього модифікатора: ${modifier.minOrderAmount}`,
      };
    }

    // Перевіряємо матеріал
    if (
      modifier.materialTypes &&
      modifier.materialTypes.length > 0 &&
      params.materialType &&
      !modifier.materialTypes.includes(params.materialType)
    ) {
      return { canApply: false, reason: 'Модифікатор не застосовується до цього матеріалу' };
    }

    // Перевіряємо колір
    if (
      modifier.colorTypes &&
      modifier.colorTypes.length > 0 &&
      params.color &&
      !modifier.colorTypes.includes(params.color)
    ) {
      return { canApply: false, reason: 'Модифікатор не застосовується до цього кольору' };
    }

    return { canApply: true };
  }

  /**
   * Валідує загальний результат розрахунку
   */
  static validateCalculationResult(
    result: any,
    originalParams: PriceCalculationParams
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Перевіряємо базові поля
    if (result.finalPrice === undefined || result.finalPrice === null) {
      errors.push("Фінальна ціна обов'язкова");
    } else if (result.finalPrice < 0) {
      errors.push("Фінальна ціна не може бути від'ємною");
    }

    // Перевіряємо логічність розрахунків
    if (result.subtotalBeforeModifiers < 0) {
      errors.push("Проміжна сума до модифікаторів не може бути від'ємною");
    }

    if (result.finalPrice > result.subtotalBeforeModifiers * 10) {
      warnings.push('Фінальна ціна значно перевищує базову - перевірте модифікатори');
    }

    // Перевіряємо кількість
    if (result.quantity !== originalParams.quantity) {
      errors.push('Кількість в результаті не відповідає параметрам');
    }

    // Перевіряємо одиницю виміру
    if (result.unitOfMeasure !== originalParams.priceListItem.unitOfMeasure) {
      errors.push('Одиниця виміру в результаті не відповідає прайс-листу');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Перевіряє бізнес-правила для знижок
   */
  static validateDiscountRules(
    category: ServiceCategory,
    discountPercentage: number
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Категорії, на які не поширюються знижки
    const excludedCategories = [
      ServiceCategory.IRONING,
      ServiceCategory.LAUNDRY,
      ServiceCategory.TEXTILE_DYEING,
    ];

    if (excludedCategories.includes(category) && discountPercentage > 0) {
      errors.push('Знижки не поширюються на прасування, прання та фарбування');
    }

    // Максимальна знижка
    if (discountPercentage > 50) {
      warnings.push('Знижка більше 50% - потребує підтвердження');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Перевіряє цілісність прайс-листа
   */
  static validatePriceListIntegrity(items: PriceListItem[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Перевіряємо унікальність номерів
    const itemNumbers = items.map((item) => item.itemNumber);
    const duplicateNumbers = itemNumbers.filter(
      (number, index) => itemNumbers.indexOf(number) !== index
    );

    if (duplicateNumbers.length > 0) {
      errors.push(`Дублікати номерів в прайс-листі: ${duplicateNumbers.join(', ')}`);
    }

    // Перевіряємо активні елементи
    const activeItems = items.filter((item) => item.isActive);
    if (activeItems.length === 0) {
      warnings.push('Немає активних елементів в прайс-листі');
    }

    // Перевіряємо ціни
    const itemsWithZeroPrice = items.filter((item) => item.basePrice === 0);
    if (itemsWithZeroPrice.length > 0) {
      warnings.push(`Елементи з нульовою ціною: ${itemsWithZeroPrice.length}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
