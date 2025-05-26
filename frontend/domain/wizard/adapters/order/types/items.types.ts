/**
 * @fileoverview Типи для предметів замовлення
 * @module domain/wizard/adapters/order/types/items
 */

/**
 * Предмет замовлення (базова інформація)
 */
export interface WizardOrderItem {
  readonly id?: string;
  readonly categoryName: string;
  readonly itemName: string;
  readonly quantity: number;
  readonly unit: string;
  readonly basePrice: number;
  readonly finalPrice: number;
  readonly material?: string;
  readonly color?: string;
  readonly notes?: string;
}

/**
 * Модифікатор ціни для предмету замовлення
 */
export interface WizardOrderItemPriceModifier {
  readonly name: string;
  readonly type: 'PERCENTAGE' | 'FIXED';
  readonly value: number;
  readonly amount: number;
}

/**
 * Розрахунок ціни для предмету замовлення
 */
export interface WizardOrderItemPriceCalculation {
  readonly basePrice: number;
  readonly modifiers: WizardOrderItemPriceModifier[];
  readonly subtotal: number;
  readonly discountAmount?: number;
  readonly finalPrice: number;
}

/**
 * Детальний предмет замовлення з розрахунками
 */
export interface WizardOrderItemDetailed extends WizardOrderItem {
  readonly priceCalculation: WizardOrderItemPriceCalculation;
  readonly defects?: string[];
  readonly stains?: string[];
  readonly risks?: string[];
  readonly fillerType?: string;
  readonly fillerCompressed?: boolean;
  readonly wearDegree?: string;
  readonly photos?: string[];
}
