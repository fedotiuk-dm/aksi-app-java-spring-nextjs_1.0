/**
 * @fileoverview Спільні типи для розрахунку цін між order та pricing адаптерами
 * @module domain/wizard/adapters/shared/types/price-calculation
 */

/**
 * Тип модифікатора
 */
export enum WizardModifierType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  MULTIPLIER = 'MULTIPLIER',
}

/**
 * Запит на розрахунок ціни (спільний для order та pricing)
 */
export interface WizardPriceCalculationRequest {
  readonly categoryCode: string;
  readonly itemName: string;
  readonly quantity: number;
  readonly color?: string;
  readonly material?: string;
  readonly modifierCodes?: string[];
  readonly rangeModifierValues?: Array<{
    readonly modifierCode: string;
    readonly value: number;
  }>;
  readonly fixedModifierQuantities?: Array<{
    readonly modifierCode: string;
    readonly quantity: number;
  }>;
  readonly expedited?: boolean;
  readonly expeditePercent?: number;
  readonly discountPercent?: number;
  readonly urgencyLevel?: number;
  readonly specialInstructions?: string;
}

/**
 * Відповідь розрахунку ціни (спільна для order та pricing)
 */
export interface WizardPriceCalculationResponse {
  readonly baseUnitPrice?: number;
  readonly quantity?: number;
  readonly baseTotalPrice?: number;
  readonly finalUnitPrice?: number;
  readonly finalTotalPrice?: number;
  readonly unitOfMeasure?: string;
  readonly calculationDetails?: WizardCalculationDetail[];
  readonly success?: boolean;
  readonly itemName?: string;
  readonly categoryCode?: string;
  readonly categoryName?: string;
  readonly calculation?: WizardPriceCalculationDetails;
  readonly warnings?: string[];
  readonly recommendations?: string[];
  readonly timestamp?: string;
}

/**
 * Деталі розрахунку
 */
export interface WizardCalculationDetail {
  readonly step: number;
  readonly stepName: string;
  readonly description: string;
  readonly modifierCode?: string;
  readonly modifierName?: string;
  readonly modifierValue?: string;
  readonly priceBefore: number;
  readonly priceAfter: number;
  readonly priceDifference: number;
}

/**
 * Деталі розрахунку ціни (альтернативна структура)
 */
export interface WizardPriceCalculationDetails {
  basePrice: number;
  quantity: number;
  subtotal: number;
  modifiersAmount: number;
  urgencyAmount: number;
  discountAmount: number;
  finalPrice: number;
  appliedModifiers: WizardAppliedModifier[];
}

/**
 * Застосований модифікатор
 */
export interface WizardAppliedModifier {
  code: string;
  name: string;
  type: WizardModifierType;
  value: number;
  appliedAmount: number;
  description?: string;
}

/**
 * Інформація про модифікатор (спільна для order та pricing)
 */
export interface WizardModifierInfo {
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly type: WizardModifierType;
  readonly value: number;
  readonly category: 'GENERAL' | 'TEXTILE' | 'LEATHER';
  readonly applicableCategories: string[];
  readonly isRecommended?: boolean;
  readonly reason?: string;
  readonly priority?: number;
  readonly isRequired?: boolean;
}

/**
 * Попередження про ризики (спільне для order та pricing)
 */
export interface WizardRiskWarning {
  readonly type: string;
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly message: string;
  readonly recommendation?: string;
}

/**
 * Рекомендований модифікатор для розрахунку ціни
 */
export interface WizardRecommendedModifier {
  code: string;
  name: string;
  reason: string;
  priority: number;
  isRequired: boolean;
  description?: string;
}
