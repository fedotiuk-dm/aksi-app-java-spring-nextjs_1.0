/**
 * @fileoverview API функції для рекомендацій модифікаторів
 * @module domain/wizard/adapters/pricing/api
 */

import { ModifierRecommendationService } from '@/lib/api';

import {
  mapModifierFromApiResponse,
  mapRiskWarningFromApiResponse,
} from '../mappers';

import type { WizardPricingOperationResult, WizardModifierInfo, WizardRiskWarning } from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання рекомендованих модифікаторів на основі плям
 * Повертає список рекомендованих модифікаторів цін на основі вказаних типів плям
 */
export async function getRecommendedModifiersForStains(
  stains: string[],
  categoryCode?: string,
  materialType?: string
): Promise<WizardPricingOperationResult<WizardModifierInfo[]>> {
  try {
    const apiResponse = await ModifierRecommendationService.getRecommendedModifiersForStains({
      stains,
      categoryCode,
      materialType,
    });

    const modifiers: WizardModifierInfo[] = Array.isArray(apiResponse)
      ? apiResponse.map(mapModifierFromApiResponse)
      : [];

    return {
      success: true,
      data: modifiers,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати рекомендовані модифікатори для плям: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання попереджень про ризики
 * Повертає список попереджень про ризики на основі вказаних плям, дефектів, матеріалу та категорії
 */
export async function getRiskWarningsForItem(
  stains?: string[],
  defects?: string[],
  materialType?: string,
  categoryCode?: string
): Promise<WizardPricingOperationResult<WizardRiskWarning[]>> {
  try {
    const apiResponse = await ModifierRecommendationService.getRiskWarningsForItem({
      stains,
      defects,
      materialType,
      categoryCode,
    });

    const warnings: WizardRiskWarning[] = Array.isArray(apiResponse)
      ? apiResponse.map(mapRiskWarningFromApiResponse)
      : [];

    return {
      success: true,
      data: warnings,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати попередження про ризики: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання рекомендованих модифікаторів на основі дефектів
 * Повертає список рекомендованих модифікаторів цін на основі вказаних типів дефектів
 */
export async function getRecommendedModifiersForDefects(
  defects: string[],
  categoryCode?: string,
  materialType?: string
): Promise<WizardPricingOperationResult<WizardModifierInfo[]>> {
  try {
    const apiResponse = await ModifierRecommendationService.getRecommendedModifiersForDefects({
      defects,
      categoryCode,
      materialType,
    });

    const modifiers: WizardModifierInfo[] = Array.isArray(apiResponse)
      ? apiResponse.map(mapModifierFromApiResponse)
      : [];

    return {
      success: true,
      data: modifiers,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати рекомендовані модифікатори для дефектів: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
