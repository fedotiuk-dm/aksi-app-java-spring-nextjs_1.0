/**
 * @fileoverview API функції для операцій з модифікаторами цін
 * @module domain/wizard/adapters/pricing
 */

import { PricingApiService } from '@/lib/api';

import {
  mapPriceModifierDTOToDomain,
  mapPriceModifierArrayToDomain,
} from './price-modifier.mapper';

import type { PriceModifier } from '../../../pricing/types/pricing.types';

/**
 * Отримання модифікаторів для категорії послуг
 */
export async function getModifiersForServiceCategory(
  categoryCode: string
): Promise<PriceModifier[]> {
  try {
    const apiResponse = await PricingApiService.getModifiersForServiceCategory({ categoryCode });
    return mapPriceModifierArrayToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні модифікаторів для категорії ${categoryCode}:`, error);
    throw new Error(`Не вдалося отримати модифікатори: ${error}`);
  }
}

/**
 * Отримання детальної інформації про модифікатор за кодом
 */
export async function getModifierByCode(code: string): Promise<PriceModifier> {
  try {
    const apiResponse = await PricingApiService.getModifierByCode({ code });
    return mapPriceModifierDTOToDomain(apiResponse);
  } catch (error) {
    console.error(`Помилка при отриманні модифікатора з кодом ${code}:`, error);
    throw new Error(`Не вдалося отримати модифікатор: ${error}`);
  }
}
