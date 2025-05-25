/**
 * @fileoverview Сервіс знижок
 * @module domain/wizard/services/pricing/discount
 */

import { OperationResultFactory } from '../interfaces';

import type { IPriceDiscountService, PriceDiscountDomain } from './pricing.interfaces';
import type { OperationResult } from '../interfaces';

/**
 * Константи для знижок
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    FETCH_FAILED: 'Помилка отримання знижок',
    VALIDATION_FAILED: 'Помилка валідації знижки',
    CALCULATION_FAILED: 'Помилка розрахунку знижки',
    INVALID_DISCOUNT_TYPE: 'Некоректний тип знижки',
    INVALID_AMOUNT: 'Некоректна сума для розрахунку знижки',
    UNKNOWN: 'Невідома помилка',
  },
  DISCOUNT_RATES: {
    EVERCARD: 0.1, // 10%
    SOCIAL: 0.05, // 5%
    MILITARY: 0.1, // 10%
  },
  EXCLUDED_CATEGORIES: {
    // Категорії, на які не поширюються знижки
    IRONING: 'ironing',
    WASHING: 'washing',
    DYEING: 'dyeing',
  },
} as const;

/**
 * Сервіс знижок
 * Відповідальність: управління знижками та їх застосуванням
 */
export class PriceDiscountService implements IPriceDiscountService {
  public readonly name = 'PriceDiscountService';
  public readonly version = '1.0.0';

  /**
   * Отримання доступних знижок
   */
  async getAvailableDiscounts(): Promise<OperationResult<PriceDiscountDomain[]>> {
    try {
      const discounts: PriceDiscountDomain[] = [
        {
          id: 'evercard',
          name: 'Еверкард',
          type: 'PERCENTAGE',
          value: CONSTANTS.DISCOUNT_RATES.EVERCARD * 100,
          appliedAmount: 0,
          conditions: ['Не діє на прасування, прання і фарбування'],
        },
        {
          id: 'social',
          name: 'Соцмережі',
          type: 'PERCENTAGE',
          value: CONSTANTS.DISCOUNT_RATES.SOCIAL * 100,
          appliedAmount: 0,
          conditions: ['Не діє на прасування, прання і фарбування'],
        },
        {
          id: 'military',
          name: 'ЗСУ',
          type: 'PERCENTAGE',
          value: CONSTANTS.DISCOUNT_RATES.MILITARY * 100,
          appliedAmount: 0,
          conditions: ['Не діє на прасування, прання і фарбування'],
        },
      ];

      return OperationResultFactory.success(discounts);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація права на знижку
   */
  async validateDiscountEligibility(
    discountType: string,
    serviceIds: string[]
  ): Promise<OperationResult<boolean>> {
    try {
      // TODO: Реалізувати перевірку категорій послуг через адаптер
      // Поки що заглушка - всі послуги мають право на знижку
      const isEligible = true;

      return OperationResultFactory.success(isEligible);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Розрахунок суми знижки
   */
  async calculateDiscountAmount(
    discountType: string,
    totalAmount: number,
    discountValue?: number
  ): Promise<OperationResult<number>> {
    try {
      if (totalAmount <= 0) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.INVALID_AMOUNT);
      }

      let discountAmount = 0;

      switch (discountType.toUpperCase()) {
        case 'EVERCARD':
          discountAmount = totalAmount * CONSTANTS.DISCOUNT_RATES.EVERCARD;
          break;
        case 'SOCIAL':
          discountAmount = totalAmount * CONSTANTS.DISCOUNT_RATES.SOCIAL;
          break;
        case 'MILITARY':
          discountAmount = totalAmount * CONSTANTS.DISCOUNT_RATES.MILITARY;
          break;
        case 'OTHER':
          if (discountValue !== undefined && discountValue > 0) {
            // Якщо discountValue передано як відсоток
            if (discountValue <= 1) {
              discountAmount = totalAmount * discountValue;
            } else {
              // Якщо discountValue передано як відсоток (наприклад, 10 для 10%)
              discountAmount = totalAmount * (discountValue / 100);
            }
          }
          break;
        default:
          return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.INVALID_DISCOUNT_TYPE);
      }

      // Округлення до копійок
      discountAmount = Math.round(discountAmount * 100) / 100;

      return OperationResultFactory.success(discountAmount);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Перевірка чи категорія виключена зі знижок
   */
  isCategoryExcluded(categoryId: string): boolean {
    const excludedCategories = Object.values(CONSTANTS.EXCLUDED_CATEGORIES);
    return excludedCategories.includes(categoryId);
  }

  /**
   * Отримання інформації про знижку за типом
   */
  getDiscountInfo(discountType: string): PriceDiscountDomain | null {
    switch (discountType.toUpperCase()) {
      case 'EVERCARD':
        return {
          id: 'evercard',
          name: 'Еверкард',
          type: 'PERCENTAGE',
          value: CONSTANTS.DISCOUNT_RATES.EVERCARD * 100,
          appliedAmount: 0,
          conditions: ['Не діє на прасування, прання і фарбування'],
        };
      case 'SOCIAL':
        return {
          id: 'social',
          name: 'Соцмережі',
          type: 'PERCENTAGE',
          value: CONSTANTS.DISCOUNT_RATES.SOCIAL * 100,
          appliedAmount: 0,
          conditions: ['Не діє на прасування, прання і фарбування'],
        };
      case 'MILITARY':
        return {
          id: 'military',
          name: 'ЗСУ',
          type: 'PERCENTAGE',
          value: CONSTANTS.DISCOUNT_RATES.MILITARY * 100,
          appliedAmount: 0,
          conditions: ['Не діє на прасування, прання і фарбування'],
        };
      default:
        return null;
    }
  }

  /**
   * Розрахунок фінальної ціни з урахуванням знижки
   */
  async calculateFinalPrice(
    originalPrice: number,
    discountType: string,
    discountValue?: number
  ): Promise<OperationResult<{ finalPrice: number; discountAmount: number }>> {
    try {
      const discountResult = await this.calculateDiscountAmount(
        discountType,
        originalPrice,
        discountValue
      );

      if (!discountResult.success || discountResult.data === undefined) {
        return OperationResultFactory.error(
          discountResult.error || CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED
        );
      }

      const discountAmount = discountResult.data;
      const finalPrice = Math.round((originalPrice - discountAmount) * 100) / 100;

      return OperationResultFactory.success({
        finalPrice: Math.max(0, finalPrice), // Ціна не може бути від'ємною
        discountAmount,
      });
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const priceDiscountService = new PriceDiscountService();
