/**
 * @fileoverview Маппер для перетворення PriceModifierDTO ↔ WizardPriceModifier
 * @module domain/wizard/adapters/pricing/mappers
 */

import { WizardModifierType } from '../../shared';
import { WizardModifierCategory } from '../types';

import type { WizardPriceModifier, PriceModifierApiResponse } from '../types';

/**
 * Перетворює PriceModifierApiResponse у WizardPriceModifier
 */
export function mapPriceModifierDTOToDomain(
  apiModifier: PriceModifierApiResponse
): WizardPriceModifier {
  return {
    id: apiModifier.id || apiModifier.modifierId || '',
    code: apiModifier.code || '',
    name: apiModifier.name || '',
    description: apiModifier.reason, // reason використовується як description
    type: mapModifierTypeToDomain(), // тип буде визначатися за замовчуванням
    category: mapModifierCategoryToDomain(apiModifier.category),
    value: apiModifier.recommendedValue || 0,
    isActive: apiModifier.active || true,
    applicableCategories: apiModifier.applicableCategories || [],
    conditions: apiModifier.conditions || [],
  };
}

/**
 * Перетворює масив PriceModifierApiResponse у WizardPriceModifier[]
 */
export function mapPriceModifierArrayToDomain(
  apiModifiers: PriceModifierApiResponse[]
): WizardPriceModifier[] {
  return apiModifiers.map(mapPriceModifierDTOToDomain);
}

/**
 * Перетворює тип модифікатора з API у доменний тип
 */
function mapModifierTypeToDomain(apiType?: string): WizardModifierType {
  switch (apiType?.toUpperCase()) {
    case 'PERCENTAGE':
      return WizardModifierType.PERCENTAGE;
    case 'FIXED_AMOUNT':
      return WizardModifierType.FIXED_AMOUNT;
    case 'MULTIPLIER':
      return WizardModifierType.MULTIPLIER;
    default:
      return WizardModifierType.PERCENTAGE;
  }
}

/**
 * Перетворює категорію модифікатора з API у доменний тип
 */
function mapModifierCategoryToDomain(apiCategory?: string): WizardModifierCategory {
  switch (apiCategory?.toUpperCase()) {
    case 'MATERIAL':
      return WizardModifierCategory.MATERIAL;
    case 'COLOR':
      return WizardModifierCategory.COLOR;
    case 'SIZE':
      return WizardModifierCategory.SIZE;
    case 'URGENCY':
      return WizardModifierCategory.URGENCY;
    case 'CONDITION':
      return WizardModifierCategory.CONDITION;
    case 'SPECIAL_SERVICE':
      return WizardModifierCategory.SPECIAL_SERVICE;
    case 'DISCOUNT':
      return WizardModifierCategory.DISCOUNT;
    default:
      return WizardModifierCategory.MATERIAL;
  }
}
