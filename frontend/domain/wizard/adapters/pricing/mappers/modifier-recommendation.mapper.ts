/**
 * @fileoverview Маппер для перетворення рекомендацій модифікаторів
 * @module domain/wizard/adapters/pricing/mappers
 */

import { WizardModifierType } from '../../shared';

import type { WizardModifierInfo, WizardRiskWarning } from '../../shared';
import type { ModifierRecommendationDTO } from '@/lib/api';

/**
 * Маппер для модифікаторів з API відповіді
 */
export function mapModifierFromApiResponse(apiData: ModifierRecommendationDTO): WizardModifierInfo {
  return {
    code: apiData.code || '',
    name: apiData.name || '',
    description: apiData.reason || '',
    type: WizardModifierType.PERCENTAGE, // За замовчуванням, можна розширити пізніше
    value: apiData.recommendedValue || 0,
    category: 'GENERAL', // За замовчуванням, можна розширити пізніше
    applicableCategories: [], // Поки що порожній масив
  };
}

/**
 * Маппер для попереджень про ризики з API відповіді (простий рядок)
 */
export function mapRiskWarningFromApiResponse(apiData: string): WizardRiskWarning {
  return {
    type: 'GENERAL',
    severity: 'MEDIUM',
    message: apiData,
    recommendation: `Попередження: ${apiData}`,
  };
}

/**
 * Маппер для масиву модифікаторів з API відповіді
 */
export function mapModifierArrayFromApiResponse(
  apiResponse: ModifierRecommendationDTO[]
): WizardModifierInfo[] {
  return Array.isArray(apiResponse) ? apiResponse.map(mapModifierFromApiResponse) : [];
}

/**
 * Маппер для масиву попереджень про ризики з API відповіді
 */
export function mapRiskWarningArrayFromApiResponse(apiResponse: string[]): WizardRiskWarning[] {
  return Array.isArray(apiResponse) ? apiResponse.map(mapRiskWarningFromApiResponse) : [];
}
