/**
 * @fileoverview API функції для розрахунку цін
 * @module domain/wizard/adapters/pricing
 */

import { PricingCalculationService } from '@/lib/api';

import {
  mapPriceCalculationRequestToDTO,
  mapPriceCalculationResponseToDomain,
} from './price-calculation.mapper';

import type {
  PriceCalculationRequest,
  PriceCalculationResponse,
} from '../../../pricing/types/pricing.types';
import type { PriceModifierDTO } from '@/lib/api';

/**
 * Тип для рекомендованих модифікаторів
 */
export interface RecommendedModifier {
  code: string;
  name: string;
  description?: string;
  percentage?: number;
  fixedAmount?: number;
}

/**
 * Розрахунок ціни предмета з урахуванням модифікаторів
 */
export async function calculatePrice(
  request: PriceCalculationRequest
): Promise<PriceCalculationResponse> {
  try {
    const apiRequest = mapPriceCalculationRequestToDTO(request);
    const apiResponse = await PricingCalculationService.calculatePrice({
      requestBody: apiRequest,
    });
    return mapPriceCalculationResponseToDomain(apiResponse);
  } catch (error) {
    console.error('Помилка при розрахунку ціни:', error);
    throw new Error(`Не вдалося розрахувати ціну: ${error}`);
  }
}

/**
 * Отримання базової ціни для предмета
 */
export async function getBasePrice(
  categoryCode: string,
  itemName: string,
  color?: string
): Promise<number> {
  try {
    return await PricingCalculationService.getBasePrice({
      categoryCode,
      itemName,
      color,
    });
  } catch (error) {
    console.error('Помилка при отриманні базової ціни:', error);
    throw new Error(`Не вдалося отримати базову ціну: ${error}`);
  }
}

/**
 * Отримання попереджень про ризики
 */
export async function getRiskWarnings(params: {
  stains?: string[];
  defects?: string[];
  categoryCode?: string;
  materialType?: string;
}): Promise<string[]> {
  try {
    return await PricingCalculationService.getRiskWarnings(params);
  } catch (error) {
    console.error('Помилка при отриманні попереджень про ризики:', error);
    throw new Error(`Не вдалося отримати попередження: ${error}`);
  }
}

/**
 * Отримання рекомендованих модифікаторів
 */
export async function getRecommendedModifiers(params: {
  stains?: string[];
  defects?: string[];
  categoryCode?: string;
  materialType?: string;
}): Promise<PriceModifierDTO[]> {
  try {
    return await PricingCalculationService.getRecommendedModifiers(params);
  } catch (error) {
    console.error('Помилка при отриманні рекомендованих модифікаторів:', error);
    throw new Error(`Не вдалося отримати модифікатори: ${error}`);
  }
}
