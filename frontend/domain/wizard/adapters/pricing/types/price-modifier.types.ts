/**
 * @fileoverview Типи для модифікаторів цін
 * @module domain/wizard/adapters/pricing/types/price-modifier
 */

/**
 * Типи модифікаторів
 */
export enum WizardModifierType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  MULTIPLIER = 'MULTIPLIER',
}

/**
 * Категорії модифікаторів
 */
export enum WizardModifierCategory {
  MATERIAL = 'MATERIAL',
  COLOR = 'COLOR',
  SIZE = 'SIZE',
  URGENCY = 'URGENCY',
  CONDITION = 'CONDITION',
  SPECIAL_SERVICE = 'SPECIAL_SERVICE',
  DISCOUNT = 'DISCOUNT',
}

/**
 * Модифікатор ціни для wizard
 */
export interface WizardPriceModifier {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: WizardModifierType;
  category: WizardModifierCategory;
  value: number;
  isActive: boolean;
  applicableCategories: string[];
  conditions?: string[];
}

/**
 * Деталі застосованого модифікатора
 */
export interface WizardAppliedModifier {
  code: string;
  name: string;
  type: WizardModifierType;
  value: number;
  amount: number;
  description?: string;
}

/**
 * Параметри пошуку модифікаторів
 */
export interface WizardModifierSearchParams {
  categoryCode?: string;
  modifierCategory?: WizardModifierCategory;
  searchTerm?: string;
  isActive?: boolean;
}
