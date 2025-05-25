/**
 * @fileoverview Адаптер операцій розрахунку цін
 * @module domain/wizard/adapters/pricing-adapters
 */

import {
  PricingCalculationService,
  PricingModifiersService,
  ModifierRecommendationService,
} from '@/lib/api';

import { PricingMappingAdapter } from './mapping.adapter';

import type {
  PriceCalculationRequest,
  PriceCalculationResponse,
  PriceModifier,
} from './mapping.adapter';

/**
 * Адаптер для операцій розрахунку цін
 *
 * Відповідальність:
 * - Виконання розрахунків цін через API
 * - Отримання модифікаторів для категорій
 * - Рекомендації модифікаторів на основі плям
 * - Обробка помилок розрахунків
 */
export class PricingCalculationAdapter {
  /**
   * Розраховує ціну для предмета з модифікаторами
   */
  static async calculatePrice(request: PriceCalculationRequest): Promise<PriceCalculationResponse> {
    try {
      const apiRequest = PricingMappingAdapter.priceCalculationRequestToApi(request);
      const apiResponse = await PricingCalculationService.calculatePrice({
        requestBody: apiRequest,
      });

      return PricingMappingAdapter.priceCalculationResponseToDomain(apiResponse);
    } catch (error) {
      console.error('Помилка при розрахунку ціни:', error);
      throw new Error('Не вдалося розрахувати ціну. Спробуйте ще раз.');
    }
  }

  /**
   * Отримує модифікатори для категорії послуг
   */
  static async getModifiersForCategory(categoryCode: string): Promise<PriceModifier[]> {
    try {
      const apiModifiers = await PricingModifiersService.getModifiersForServiceCategory({
        categoryCode,
      });

      return PricingMappingAdapter.priceModifiersToDomain(apiModifiers);
    } catch (error) {
      console.error('Помилка при отриманні модифікаторів:', error);
      return [];
    }
  }

  /**
   * Отримує всі доступні модифікатори через пошук
   */
  static async getAllModifiers(): Promise<PriceModifier[]> {
    try {
      const apiModifiers = await PricingModifiersService.searchModifiers({});
      return PricingMappingAdapter.priceModifiersToDomain(apiModifiers);
    } catch (error) {
      console.error('Помилка при отриманні всіх модифікаторів:', error);
      return [];
    }
  }

  /**
   * Отримує модифікатори за категорією (GENERAL, TEXTILE, LEATHER)
   */
  static async getModifiersByCategory(
    category: 'GENERAL' | 'TEXTILE' | 'LEATHER'
  ): Promise<PriceModifier[]> {
    try {
      const apiModifiers = await PricingModifiersService.getModifiersByCategory({
        category,
      });

      return PricingMappingAdapter.priceModifiersToDomain(apiModifiers);
    } catch (error) {
      console.error(`Помилка при отриманні модифікаторів категорії ${category}:`, error);
      return [];
    }
  }

  /**
   * Отримує рекомендовані модифікатори на основі плям
   */
  static async getRecommendedModifiersForStains(
    stains: string[],
    categoryCode?: string,
    materialType?: string
  ): Promise<PriceModifier[]> {
    try {
      const apiResponse = await ModifierRecommendationService.getRecommendedModifiersForStains({
        stains,
        categoryCode,
        materialType,
      });

      // API повертає Record<string, any>, тому потрібно перетворити
      if (Array.isArray(apiResponse)) {
        return PricingMappingAdapter.priceModifiersToDomain(apiResponse);
      }

      // Якщо відповідь у форматі { modifiers: [...] }
      if (apiResponse && Array.isArray(apiResponse.modifiers)) {
        return PricingMappingAdapter.priceModifiersToDomain(apiResponse.modifiers);
      }

      return [];
    } catch (error) {
      console.error('Помилка при отриманні рекомендованих модифікаторів:', error);
      return [];
    }
  }

  /**
   * Отримує рекомендовані модифікатори на основі дефектів
   */
  static async getRecommendedModifiersForDefects(
    defects: string[],
    categoryCode?: string,
    materialType?: string
  ): Promise<PriceModifier[]> {
    try {
      const apiResponse = await ModifierRecommendationService.getRecommendedModifiersForDefects({
        defects,
        categoryCode,
        materialType,
      });

      // Аналогічна обробка як для плям
      if (Array.isArray(apiResponse)) {
        return PricingMappingAdapter.priceModifiersToDomain(apiResponse);
      }

      if (apiResponse && Array.isArray(apiResponse.modifiers)) {
        return PricingMappingAdapter.priceModifiersToDomain(apiResponse.modifiers);
      }

      return [];
    } catch (error) {
      console.error('Помилка при отриманні рекомендованих модифікаторів для дефектів:', error);
      return [];
    }
  }

  /**
   * Валідує запит розрахунку ціни
   */
  static validateCalculationRequest(request: PriceCalculationRequest): string[] {
    const errors: string[] = [];

    if (!request.categoryCode) {
      errors.push('Не вказано код категорії');
    }

    if (!request.itemName) {
      errors.push('Не вказано назву предмета');
    }

    if (!request.quantity || request.quantity <= 0) {
      errors.push('Кількість повинна бути більше 0');
    }

    if (request.discountPercent && (request.discountPercent < 0 || request.discountPercent > 100)) {
      errors.push('Відсоток знижки повинен бути від 0 до 100');
    }

    return errors;
  }

  /**
   * Створює базовий запит розрахунку ціни
   */
  static createBasicCalculationRequest(
    categoryCode: string,
    itemName: string,
    quantity: number = 1
  ): PriceCalculationRequest {
    return {
      categoryCode,
      itemName,
      quantity,
      modifierCodes: [],
      expedited: false,
    };
  }

  /**
   * Додає модифікатори до запиту розрахунку
   */
  static addModifiersToRequest(
    request: PriceCalculationRequest,
    modifierCodes: string[]
  ): PriceCalculationRequest {
    return {
      ...request,
      modifierCodes: [...new Set([...(request.modifierCodes || []), ...modifierCodes])],
    };
  }

  /**
   * Встановлює терміновість у запиті
   */
  static setExpediteInRequest(
    request: PriceCalculationRequest,
    expedited: boolean,
    expeditePercent?: number
  ): PriceCalculationRequest {
    return {
      ...request,
      expedited,
      expeditePercent,
    };
  }

  /**
   * Встановлює знижку у запиті
   */
  static setDiscountInRequest(
    request: PriceCalculationRequest,
    discountPercent?: number
  ): PriceCalculationRequest {
    return {
      ...request,
      discountPercent,
    };
  }
}
