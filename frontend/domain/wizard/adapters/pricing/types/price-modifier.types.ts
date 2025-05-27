/**
 * @fileoverview Типи для модифікаторів цін
 * @module domain/wizard/adapters/pricing/types/price-modifier
 */

// Імпортуємо спільні типи з shared
import type { WizardModifierType } from '../../shared';

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
 * Параметри пошуку модифікаторів
 */
export interface WizardModifierSearchParams {
  categoryCode?: string;
  modifierCategory?: WizardModifierCategory;
  searchTerm?: string;
  isActive?: boolean;
}
