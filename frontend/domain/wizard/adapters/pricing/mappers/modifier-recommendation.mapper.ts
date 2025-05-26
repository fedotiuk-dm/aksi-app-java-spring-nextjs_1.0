/**
 * @fileoverview Маппер для перетворення рекомендацій модифікаторів
 * @module domain/wizard/adapters/pricing/mappers
 */

import { WizardModifierType, WizardModifierCategory } from '../types/price-modifier.types';
import { WizardRiskLevel } from '../types/risk-warning.types';

import type { WizardModifierInfo, WizardRiskWarning } from '../types';
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
    category: WizardModifierCategory.CONDITION, // За замовчуванням, можна розширити пізніше
    applicableCategories: [], // Поки що порожній масив
  };
}

/**
 * Маппер для попереджень про ризики з API відповіді (простий рядок)
 */
export function mapRiskWarningFromApiResponse(apiData: string): WizardRiskWarning {
  return {
    id: apiData.toLowerCase().replace(/\s+/g, '_'),
    type: 'GENERAL',
    level: WizardRiskLevel.MEDIUM,
    message: apiData,
    description: `Попередження: ${apiData}`,
    recommendations: [],
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
