/**
 * @fileoverview Маппер для перетворення одиниць виміру
 * @module domain/wizard/adapters/pricing/mappers
 */

import type { WizardUnitOfMeasure } from '../types';

/**
 * Маппер для одиниць виміру з API відповіді (простий рядок)
 */
export function mapUnitOfMeasureFromApiResponse(apiData: string): WizardUnitOfMeasure {
  return {
    code: apiData.toLowerCase().replace(/\s+/g, '_'),
    name: apiData,
    abbreviation: apiData,
    category: 'GENERAL',
    isDefault: apiData === 'шт',
    conversionFactor: 1,
  };
}

/**
 * Маппер для масиву одиниць виміру з API відповіді
 */
export function mapUnitOfMeasureArrayFromApiResponse(apiResponse: string[]): WizardUnitOfMeasure[] {
  return Array.isArray(apiResponse) ? apiResponse.map(mapUnitOfMeasureFromApiResponse) : [];
}

/**
 * Маппер для перевірки підтримки одиниці виміру з API відповіді
 */
export function mapUnitSupportFromApiResponse(apiResponse: boolean): boolean {
  return apiResponse;
}
