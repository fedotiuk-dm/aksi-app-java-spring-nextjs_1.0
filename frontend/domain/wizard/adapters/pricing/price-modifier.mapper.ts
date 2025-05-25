/**
 * @fileoverview Маппер для перетворення модифікаторів цін
 * @module domain/wizard/adapters/pricing
 */

import { PriceModifierDTO } from '@/lib/api';

import { ModifierCategory, ModifierType } from '../../../pricing/types/pricing.types';

import type { PriceModifier } from '../../../pricing/types/pricing.types';

/**
 * Перетворює PriceModifierDTO у доменний PriceModifier
 */
export function mapPriceModifierDTOToDomain(apiModifier: PriceModifierDTO): PriceModifier {
  return {
    id: '', // PriceModifierDTO не має id
    code: '', // PriceModifierDTO не має code
    name: apiModifier.name || '',
    description: apiModifier.description,
    category: ModifierCategory.GENERAL, // За замовчуванням, потрібно визначити логіку
    appliesTo: [], // PriceModifierDTO не має цього поля
    type: mapModifierTypeToDomain(apiModifier.type),
    value: apiModifier.value || 0,
    active: true, // За замовчуванням
  };
}

/**
 * Перетворює тип модифікатора з API в доменний тип
 */
function mapModifierTypeToDomain(apiType?: PriceModifierDTO.type): ModifierType {
  switch (apiType) {
    case PriceModifierDTO.type.PERCENTAGE:
      return ModifierType.PERCENTAGE;
    case PriceModifierDTO.type.FIXED_AMOUNT:
      return ModifierType.FIXED_AMOUNT;
    case PriceModifierDTO.type.MULTIPLIER:
      return ModifierType.PERCENTAGE; // Multiplier мапимо як percentage
    default:
      return ModifierType.PERCENTAGE;
  }
}

/**
 * Перетворює масив API модифікаторів у доменні типи
 */
export function mapPriceModifierArrayToDomain(apiModifiers: PriceModifierDTO[]): PriceModifier[] {
  return apiModifiers.map(mapPriceModifierDTOToDomain);
}
