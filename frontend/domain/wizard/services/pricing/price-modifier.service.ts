/**
 * @fileoverview Сервіс модифікаторів цін
 * @module domain/wizard/services/pricing/price-modifier
 */

// TODO: Додати адаптери для модифікаторів
// import {
//   getPriceModifiersByServiceId,
//   getPriceModifierById as getPriceModifierByIdAdapter,
//   validateModifierCombination as validateModifierCombinationAdapter,
// } from '../../adapters/pricing';
import { OperationResultFactory } from '../interfaces';

import type { IPriceModifierService, PriceModifierDomain } from './pricing.interfaces';
import type { OperationResult } from '../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    FETCH_FAILED: 'Помилка отримання модифікаторів',
    MODIFIER_NOT_FOUND: 'Модифікатор не знайдено',
    VALIDATION_FAILED: 'Помилка валідації модифікаторів',
    CALCULATION_FAILED: 'Помилка розрахунку впливу модифікаторів',
    INVALID_COMBINATION: 'Некоректна комбінація модифікаторів',
    UNKNOWN: 'Невідома помилка',
  },
  CACHE_TTL: 10 * 60 * 1000, // 10 хвилин
  MAX_MODIFIERS: 20,
} as const;

/**
 * Сервіс модифікаторів цін
 * Відповідальність: управління модифікаторами цін та їх комбінаціями
 */
export class PriceModifierService implements IPriceModifierService {
  public readonly name = 'PriceModifierService';
  public readonly version = '1.0.0';

  private modifiersCache: Map<string, { data: PriceModifierDomain[]; timestamp: number }> =
    new Map();

  /**
   * Отримання доступних модифікаторів для послуги
   */
  async getAvailableModifiers(serviceId: string): Promise<OperationResult<PriceModifierDomain[]>> {
    try {
      // Перевірка кешу
      const cached = this.modifiersCache.get(serviceId);
      if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
        return OperationResultFactory.success(cached.data);
      }

      // TODO: Реалізувати адаптер getPriceModifiersByServiceId
      // Тимчасова заглушка
      const apiModifiers: any[] = [];
      const domainModifiers = apiModifiers.map(this.convertToDomainModifier);

      // Оновлення кешу
      this.modifiersCache.set(serviceId, {
        data: domainModifiers,
        timestamp: Date.now(),
      });

      return OperationResultFactory.success(domainModifiers);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання модифікатора за ID
   */
  async getModifierById(id: string): Promise<OperationResult<PriceModifierDomain | null>> {
    try {
      // TODO: Реалізувати адаптер getPriceModifierById
      // Тимчасова заглушка
      const apiModifier: any = null;

      if (!apiModifier) {
        return OperationResultFactory.success(null);
      }

      const domainModifier = this.convertToDomainModifier(apiModifier);
      return OperationResultFactory.success(domainModifier);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.MODIFIER_NOT_FOUND}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація комбінації модифікаторів
   */
  async validateModifierCombination(modifierIds: string[]): Promise<OperationResult<boolean>> {
    try {
      // Перевірка кількості модифікаторів
      if (modifierIds.length > CONSTANTS.MAX_MODIFIERS) {
        return OperationResultFactory.error(
          `Максимальна кількість модифікаторів: ${CONSTANTS.MAX_MODIFIERS}`
        );
      }

      // Перевірка унікальності
      const uniqueIds = new Set(modifierIds);
      if (uniqueIds.size !== modifierIds.length) {
        return OperationResultFactory.error('Модифікатори не можуть повторюватися');
      }

      // TODO: Реалізувати адаптер validateModifierCombination
      // Тимчасова заглушка - завжди валідно
      const isValid = true;
      return OperationResultFactory.success(isValid);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Розрахунок впливу модифікаторів на ціну
   */
  async calculateModifierImpact(
    basePrice: number,
    modifierIds: string[]
  ): Promise<OperationResult<{ total: number; breakdown: PriceModifierDomain[] }>> {
    try {
      // Валідація комбінації
      const validationResult = await this.validateModifierCombination(modifierIds);
      if (!validationResult.success || !validationResult.data) {
        return OperationResultFactory.error(
          validationResult.error || CONSTANTS.ERROR_MESSAGES.INVALID_COMBINATION
        );
      }

      // Отримання модифікаторів
      const modifiers: PriceModifierDomain[] = [];
      for (const id of modifierIds) {
        const modifierResult = await this.getModifierById(id);
        if (modifierResult.success && modifierResult.data) {
          modifiers.push(modifierResult.data);
        }
      }

      // Розрахунок впливу
      let currentPrice = basePrice;
      const appliedModifiers: PriceModifierDomain[] = [];

      for (const modifier of modifiers) {
        const appliedModifier = this.applyModifier(currentPrice, modifier);
        appliedModifiers.push(appliedModifier);
        currentPrice = appliedModifier.appliedAmount;
      }

      return OperationResultFactory.success({
        total: currentPrice,
        breakdown: appliedModifiers,
      });
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.modifiersCache.clear();
  }

  /**
   * Отримання модифікаторів з кешу
   */
  getCachedModifiers(serviceId: string): PriceModifierDomain[] | null {
    const cached = this.modifiersCache.get(serviceId);
    if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  /**
   * Застосування модифікатора до ціни
   */
  private applyModifier(price: number, modifier: PriceModifierDomain): PriceModifierDomain {
    let appliedAmount: number;

    switch (modifier.type) {
      case 'PERCENTAGE':
        appliedAmount = price * (1 + modifier.value / 100);
        break;
      case 'FIXED':
        appliedAmount = price + modifier.value;
        break;
      case 'MULTIPLIER':
        appliedAmount = price * modifier.value;
        break;
      default:
        appliedAmount = price;
    }

    return {
      ...modifier,
      appliedAmount: Math.round(appliedAmount * 100) / 100, // Округлення до копійок
    };
  }

  /**
   * Конвертація API модифікатора в доменний тип
   */
  private convertToDomainModifier(apiModifier: any): PriceModifierDomain {
    return {
      id: apiModifier.id,
      name: apiModifier.name,
      type: apiModifier.type,
      value: apiModifier.value,
      appliedAmount: 0, // Буде розраховано при застосуванні
      category: apiModifier.category,
      description: apiModifier.description,
    };
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const priceModifierService = new PriceModifierService();
