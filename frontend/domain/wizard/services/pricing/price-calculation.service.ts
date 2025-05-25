/**
 * @fileoverview Сервіс розрахунку цін
 * @module domain/wizard/services/pricing/price-calculation
 */

import {
  calculatePrice as calculatePriceAdapter,
  getPriceListItemById,
} from '../../adapters/pricing';
import { OperationResultFactory } from '../interfaces';
import { priceDiscountService } from './discount.service';
import { priceModifierService } from './price-modifier.service';

import type {
  IPriceCalculationService,
  PriceCalculationRequest,
  PriceCalculationDomain,
  PriceModifierDomain,
  PriceDiscountDomain,
  PriceCalculationStepDomain,
} from './pricing.interfaces';
import type { OperationResult, ValidationOperationResult } from '../interfaces';

/**
 * Константи для розрахунку цін
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    CALCULATION_FAILED: 'Помилка розрахунку ціни',
    VALIDATION_FAILED: 'Помилка валідації запиту',
    SERVICE_NOT_FOUND: 'Послугу не знайдено',
    INVALID_QUANTITY: 'Некоректна кількість',
    INVALID_MODIFIERS: 'Некоректні модифікатори',
    UNKNOWN: 'Невідома помилка',
  },
  VALIDATION: {
    MIN_QUANTITY: 0.01,
    MAX_QUANTITY: 1000,
    MAX_MODIFIERS: 20,
  },
  EXPEDITE_MULTIPLIERS: {
    STANDARD: 1.0,
    EXPRESS_48H: 1.5,
    EXPRESS_24H: 2.0,
  },
  DISCOUNT_RATES: {
    EVERCARD: 0.1,
    SOCIAL: 0.05,
    MILITARY: 0.1,
  },
} as const;

/**
 * Сервіс розрахунку цін
 * Відповідальність: розрахунок цін з урахуванням модифікаторів, знижок та терміновості
 */
export class PriceCalculationService implements IPriceCalculationService {
  public readonly name = 'PriceCalculationService';
  public readonly version = '1.0.0';

  /**
   * Розрахунок ціни
   */
  async calculatePrice(
    request: PriceCalculationRequest
  ): Promise<OperationResult<PriceCalculationDomain>> {
    try {
      // Валідація запиту
      const validationResult = this.validateCalculationRequest(request);
      if (!validationResult.isValid) {
        const errorMessages = (validationResult.validationErrors || []).map((e) => e.message);
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${errorMessages.join(', ')}`
        );
      }

      // Отримання базової ціни послуги
      const basePriceResult = await this.getBasePrice(request.serviceId);
      if (!basePriceResult.success || !basePriceResult.data) {
        return OperationResultFactory.error(
          basePriceResult.error || CONSTANTS.ERROR_MESSAGES.SERVICE_NOT_FOUND
        );
      }

      const basePrice = basePriceResult.data;

      // Розрахунок з модифікаторами
      const modifiersResult = await this.calculateModifiers(basePrice, request.modifierIds);
      if (!modifiersResult.success) {
        return OperationResultFactory.error(
          modifiersResult.error || CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED
        );
      }

      // Розрахунок знижок
      const modifiersData = modifiersResult.data;
      if (!modifiersData) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED);
      }

      const discountsResult = await this.calculateDiscounts(
        modifiersData.totalPrice,
        request.discountType,
        request.discountValue
      );
      if (!discountsResult.success) {
        return OperationResultFactory.error(
          discountsResult.error || CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED
        );
      }

      // Застосування терміновості
      const discountsData = discountsResult.data;
      if (!discountsData) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED);
      }

      const expediteResult = this.calculateExpedite(discountsData.finalPrice, request.expediteType);

      // Формування результату
      const calculation: PriceCalculationDomain = {
        basePrice: basePrice * request.quantity,
        modifiers: modifiersData.modifiers,
        discounts: discountsData.discounts,
        totalPrice: expediteResult.finalPrice,
        breakdown: {
          basePrice: basePrice * request.quantity,
          modifiersTotal: modifiersData.totalModifiers,
          discountsTotal: discountsData.totalDiscounts,
          subtotal: discountsData.finalPrice,
          finalPrice: expediteResult.finalPrice,
          steps: this.buildCalculationSteps(
            basePrice,
            request.quantity,
            modifiersData.modifiers,
            discountsData.discounts,
            expediteResult
          ),
        },
      };

      return OperationResultFactory.success(calculation);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація запиту розрахунку
   */
  validateCalculationRequest(
    request: PriceCalculationRequest
  ): ValidationOperationResult<PriceCalculationRequest> {
    const validationErrors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація serviceId
    if (!request.serviceId?.trim()) {
      validationErrors.push({
        field: 'serviceId',
        message: "ID послуги є обов'язковим",
        code: 'REQUIRED',
      });
    }

    // Валідація кількості
    if (request.quantity <= 0) {
      validationErrors.push({
        field: 'quantity',
        message: CONSTANTS.ERROR_MESSAGES.INVALID_QUANTITY,
        code: 'INVALID_VALUE',
      });
    } else if (
      request.quantity < CONSTANTS.VALIDATION.MIN_QUANTITY ||
      request.quantity > CONSTANTS.VALIDATION.MAX_QUANTITY
    ) {
      validationErrors.push({
        field: 'quantity',
        message: `Кількість повинна бути від ${CONSTANTS.VALIDATION.MIN_QUANTITY} до ${CONSTANTS.VALIDATION.MAX_QUANTITY}`,
        code: 'OUT_OF_RANGE',
      });
    }

    // Валідація модифікаторів
    if (request.modifierIds.length > CONSTANTS.VALIDATION.MAX_MODIFIERS) {
      validationErrors.push({
        field: 'modifierIds',
        message: `Максимальна кількість модифікаторів: ${CONSTANTS.VALIDATION.MAX_MODIFIERS}`,
        code: 'TOO_MANY',
      });
    }

    const isValid = validationErrors.length === 0;

    return {
      success: isValid,
      data: isValid ? request : undefined,
      error: isValid ? undefined : CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED,
      validationErrors,
      isValid,
      timestamp: new Date(),
    };
  }

  /**
   * Перерахунок з новими модифікаторами
   */
  async recalculateWithModifiers(
    baseCalculation: PriceCalculationDomain,
    modifierIds: string[]
  ): Promise<OperationResult<PriceCalculationDomain>> {
    try {
      const modifiersResult = await this.calculateModifiers(baseCalculation.basePrice, modifierIds);
      if (!modifiersResult.success) {
        return OperationResultFactory.error(
          modifiersResult.error || CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED
        );
      }

      const modifiersData = modifiersResult.data;
      if (!modifiersData) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED);
      }

      const updatedCalculation: PriceCalculationDomain = {
        ...baseCalculation,
        modifiers: modifiersData.modifiers,
        totalPrice: modifiersData.totalPrice,
        breakdown: {
          ...baseCalculation.breakdown,
          modifiersTotal: modifiersData.totalModifiers,
          finalPrice: modifiersData.totalPrice,
        },
      };

      return OperationResultFactory.success(updatedCalculation);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка перерахунку: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Застосування знижки
   */
  async applyDiscount(
    calculation: PriceCalculationDomain,
    discountType: string,
    discountValue?: number
  ): Promise<OperationResult<PriceCalculationDomain>> {
    try {
      const discountsResult = await this.calculateDiscounts(
        calculation.totalPrice,
        discountType,
        discountValue
      );

      if (!discountsResult.success) {
        return OperationResultFactory.error(
          discountsResult.error || CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED
        );
      }

      const discountsData = discountsResult.data;
      if (!discountsData) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.CALCULATION_FAILED);
      }

      const updatedCalculation: PriceCalculationDomain = {
        ...calculation,
        discounts: discountsData.discounts,
        totalPrice: discountsData.finalPrice,
        breakdown: {
          ...calculation.breakdown,
          discountsTotal: discountsData.totalDiscounts,
          finalPrice: discountsData.finalPrice,
        },
      };

      return OperationResultFactory.success(updatedCalculation);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка застосування знижки: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання базової ціни послуги
   */
  private async getBasePrice(serviceId: string): Promise<OperationResult<number>> {
    try {
      const priceItem = await getPriceListItemById(serviceId);
      if (!priceItem) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.SERVICE_NOT_FOUND);
      }
      return OperationResultFactory.success(priceItem.basePrice);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання базової ціни: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Розрахунок модифікаторів
   */
  private async calculateModifiers(
    basePrice: number,
    modifierIds: string[]
  ): Promise<
    OperationResult<{
      modifiers: PriceModifierDomain[];
      totalModifiers: number;
      totalPrice: number;
    }>
  > {
    try {
      if (modifierIds.length === 0) {
        return OperationResultFactory.success({
          modifiers: [],
          totalModifiers: 0,
          totalPrice: basePrice,
        });
      }

      // Отримання модифікаторів через pricing service
      const modifiersResult = await priceModifierService.calculateModifierImpact(
        basePrice,
        modifierIds
      );
      if (!modifiersResult.success || !modifiersResult.data) {
        return OperationResultFactory.error(
          modifiersResult.error || 'Помилка розрахунку модифікаторів'
        );
      }

      const { total, breakdown } = modifiersResult.data;
      const totalModifiers = total - basePrice;

      return OperationResultFactory.success({
        modifiers: breakdown,
        totalModifiers,
        totalPrice: total,
      });
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка розрахунку модифікаторів: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Розрахунок знижок
   */
  private async calculateDiscounts(
    price: number,
    discountType?: string,
    discountValue?: number
  ): Promise<
    OperationResult<{
      discounts: PriceDiscountDomain[];
      totalDiscounts: number;
      finalPrice: number;
    }>
  > {
    try {
      if (!discountType || discountType === 'NONE') {
        return OperationResultFactory.success({
          discounts: [],
          totalDiscounts: 0,
          finalPrice: price,
        });
      }

      // Розрахунок знижки через discount service
      const discountResult = await priceDiscountService.calculateDiscountAmount(
        discountType,
        price,
        discountValue
      );

      if (!discountResult.success || discountResult.data === undefined) {
        return OperationResultFactory.error(discountResult.error || 'Помилка розрахунку знижки');
      }

      const discountAmount = discountResult.data;
      const finalPrice = price - discountAmount;

      const discount: PriceDiscountDomain = {
        id: `discount-${discountType}`,
        name: this.getDiscountName(discountType),
        type: 'PERCENTAGE',
        value: discountValue || this.getDefaultDiscountValue(discountType),
        appliedAmount: discountAmount,
      };

      return OperationResultFactory.success({
        discounts: [discount],
        totalDiscounts: discountAmount,
        finalPrice,
      });
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка розрахунку знижки: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Розрахунок терміновості
   */
  private calculateExpedite(
    price: number,
    expediteType?: string
  ): { expediteFee: number; finalPrice: number } {
    const multiplier = expediteType
      ? CONSTANTS.EXPEDITE_MULTIPLIERS[
          expediteType as keyof typeof CONSTANTS.EXPEDITE_MULTIPLIERS
        ] || 1.0
      : 1.0;
    const expediteFee = price * (multiplier - 1.0);
    return {
      expediteFee,
      finalPrice: price * multiplier,
    };
  }

  /**
   * Побудова кроків розрахунку
   */
  private buildCalculationSteps(
    basePrice: number,
    quantity: number,
    modifiers: PriceModifierDomain[],
    discounts: PriceDiscountDomain[],
    expedite: { expediteFee: number; finalPrice: number }
  ): PriceCalculationStepDomain[] {
    const steps: PriceCalculationStepDomain[] = [];
    let runningTotal = basePrice;
    let stepNumber = 1;

    // Крок 1: Базова ціна
    steps.push({
      stepNumber: stepNumber++,
      description: 'Базова ціна послуги',
      operation: 'ADD',
      value: basePrice,
      runningTotal,
    });

    // Крок 2: Кількість
    if (quantity !== 1) {
      runningTotal *= quantity;
      steps.push({
        stepNumber: stepNumber++,
        description: `Множення на кількість (${quantity})`,
        operation: 'MULTIPLY',
        value: quantity,
        runningTotal,
      });
    }

    // Кроки 3+: Модифікатори
    modifiers.forEach((modifier) => {
      const operation = modifier.type === 'PERCENTAGE' ? 'ADD' : 'ADD';
      runningTotal += modifier.appliedAmount;
      steps.push({
        stepNumber: stepNumber++,
        description: `Модифікатор: ${modifier.name}`,
        operation,
        value: modifier.appliedAmount,
        runningTotal,
      });
    });

    // Кроки знижок
    discounts.forEach((discount) => {
      runningTotal -= discount.appliedAmount;
      steps.push({
        stepNumber: stepNumber++,
        description: `Знижка: ${discount.name}`,
        operation: 'SUBTRACT',
        value: discount.appliedAmount,
        runningTotal,
      });
    });

    // Крок терміновості
    if (expedite.expediteFee > 0) {
      runningTotal += expedite.expediteFee;
      steps.push({
        stepNumber: stepNumber++,
        description: 'Надбавка за терміновість',
        operation: 'ADD',
        value: expedite.expediteFee,
        runningTotal,
      });
    }

    return steps;
  }

  /**
   * Отримання назви знижки
   */
  private getDiscountName(discountType: string): string {
    const names: Record<string, string> = {
      EVERCARD: 'Знижка Еверкард',
      SOCIAL: 'Знижка соцмережі',
      MILITARY: 'Знижка ЗСУ',
      OTHER: 'Інша знижка',
    };
    return names[discountType] || 'Знижка';
  }

  /**
   * Отримання значення знижки за замовчуванням
   */
  private getDefaultDiscountValue(discountType: string): number {
    const values: Record<string, number> = {
      EVERCARD: 10,
      SOCIAL: 5,
      MILITARY: 10,
      OTHER: 0,
    };
    return values[discountType] || 0;
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const priceCalculationService = new PriceCalculationService();
