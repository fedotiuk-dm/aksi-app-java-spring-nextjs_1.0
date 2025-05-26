/**
 * @fileoverview Маппер для перетворення PriceModifierDTO ↔ WizardPriceModifier
 * @module domain/wizard/adapters/pricing/mappers
 */

import type {
  WizardPriceModifier,
  WizardModifierType,
  WizardModifierCategory,
} from '../types';
import type { PriceModifierDTO } from '@/lib/api';

/**
 * Перетворює PriceModifierDTO у WizardPriceModifier
 */
export function mapPriceModifierDTOToDomain(apiModifier: PriceModifierDTO): WizardPriceModifier {
  return {
    id: apiModifier.id || '',
    code: apiModifier.code || '',
    name: apiModifier.name || '',
    description: apiModifier.description,
    type: mapModifierTypeToDomain(apiModifier.type),
    category: mapModifierCategoryToDomain(apiModifier.category),
    value: apiModifier.value || 0,
    isActive: apiModifier.active || false,
    applicableCategories: apiModifier.applicableCategories || [],
    conditions: apiModifier.conditions || [],
  };
}

/**
 * Перетворює масив PriceModifierDTO у WizardPriceModifier[]
 */
export function mapPriceModifierArrayToDomain(
  apiModifiers: PriceModifierDTO[]
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
