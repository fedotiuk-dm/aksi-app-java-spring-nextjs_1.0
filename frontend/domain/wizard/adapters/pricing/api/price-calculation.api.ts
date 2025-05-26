/**
 * @fileoverview API функції для розрахунку цін
 * @module domain/wizard/adapters/pricing/api
 */

import { PriceCalculationService } from '@/lib/api';

import { mapPriceCalculationRequestToDTO, mapPriceCalculationResponseToDomain } from '../mappers';

import type {
  WizardPricingOperationResult,
  WizardPriceCalculationRequest,
  WizardPriceCalculationResponse,
  WizardRiskWarning,
  WizardRecommendedModifier,
  WizardRiskLevel,
} from '../types';

/**
 * Інтерфейс для відповіді API з базовою ціною
 */
interface BasePriceApiResponse {
  basePrice?: number;
  [key: string]: unknown;
}

/**
 * Інтерфейс для відповіді API з попередженнями про ризики
 */
interface RiskWarningApiResponse {
  id?: string;
  type?: string;
  level?: string;
  message?: string;
  description?: string;
  recommendations?: string[];
}

/**
 * Інтерфейс для відповіді API з рекомендованими модифікаторами
 */
interface RecommendedModifierApiResponse {
  name?: string;
  description?: string;
  type?: string;
  code?: string;
  [key: string]: unknown;
}

/**
 * Інтерфейс для внутрішнього використання
 */
interface RecommendedModifierApiItem {
  name: string;
  description?: string;
  code?: string;
  reason?: string;
  priority?: number;
  isRequired?: boolean;
}

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Розрахунок ціни предмета
 */
export async function calculatePrice(
  request: WizardPriceCalculationRequest
): Promise<WizardPricingOperationResult<WizardPriceCalculationResponse>> {
  try {
    const apiRequest = mapPriceCalculationRequestToDTO(request);
    const apiResponse = await PriceCalculationService.calculatePrice({
      requestBody: apiRequest,
    });
    const response = mapPriceCalculationResponseToDomain(apiResponse);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося розрахувати ціну: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання базової ціни для предмета
 */
export async function getBasePrice(
  categoryCode: string,
  itemName: string,
  color?: string
): Promise<WizardPricingOperationResult<number>> {
  try {
    const apiResponse = await PriceCalculationService.getBasePrice({
      categoryCode,
      itemName,
      color,
    });

    const typedResponse = apiResponse as BasePriceApiResponse;

    return {
      success: true,
      data: Number(typedResponse?.basePrice || 0),
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати базову ціну: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання попереджень про ризики
 */
export async function getRiskWarnings(
  categoryCode: string,
  itemName: string,
  material?: string,
  color?: string
): Promise<WizardPricingOperationResult<WizardRiskWarning[]>> {
  try {
    const apiResponse = await PriceCalculationService.getRiskWarnings({
      categoryCode,
      materialType: material,
      stains: color ? [`color:${color}`] : [], // Використовуємо колір як плямy
      defects: [],
    });

    const typedResponse = apiResponse as Record<string, unknown>;

    // Оскільки API повертає Record<string, any>, перетворюємо його в масив
    const warningsData = Array.isArray(typedResponse)
      ? typedResponse
      : Object.values(typedResponse).filter(
          (item) => typeof item === 'string' || typeof item === 'object'
        );

    const warnings: WizardRiskWarning[] = warningsData.map((warningData: unknown) => {
      if (typeof warningData === 'string') {
        try {
          // Припускаємо, що рядки - це JSON об'єкти у текстовому форматі
          const warning = JSON.parse(warningData) as RiskWarningApiResponse;
          return {
            id: warning.id || '',
            type: warning.type || '',
            level: (warning.level as WizardRiskLevel) || 'LOW',
            message: warning.message || '',
            description: warning.description,
            recommendations: warning.recommendations || [],
          };
        } catch {
          // Якщо не вдалося розпарсити JSON, створюємо базовий об'єкт
          return {
            id: '',
            type: '',
            level: 'LOW' as WizardRiskLevel,
            message: warningData,
            description: undefined,
            recommendations: [],
          };
        }
      } else if (typeof warningData === 'object' && warningData !== null) {
        const warning = warningData as RiskWarningApiResponse;
        return {
          id: warning.id || '',
          type: warning.type || '',
          level: (warning.level as WizardRiskLevel) || 'LOW',
          message: warning.message || '',
          description: warning.description,
          recommendations: warning.recommendations || [],
        };
      } else {
        return {
          id: '',
          type: '',
          level: 'LOW' as WizardRiskLevel,
          message: String(warningData),
          description: undefined,
          recommendations: [],
        };
      }
    });

    return {
      success: true,
      data: warnings,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати попередження: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання рекомендованих модифікаторів
 */
export async function getRecommendedModifiers(
  categoryCode: string,
  itemName: string,
  material?: string,
  color?: string
): Promise<WizardPricingOperationResult<WizardRecommendedModifier[]>> {
  try {
    // Отримуємо відповідь з API
    const apiResponse = await PriceCalculationService.getRecommendedModifiers({
      categoryCode,
      materialType: material,
      stains: color ? [`color:${color}`] : [], // Використовуємо колір як пляму
      defects: [],
    });

    const typedResponse = apiResponse as Record<string, unknown>;

    // Перетворюємо Record в масив
    const modifiersData = Array.isArray(typedResponse)
      ? typedResponse
      : Object.values(typedResponse);

    // Перетворюємо API відповідь у типізований формат
    const typedModifiers = modifiersData.map((item: unknown): RecommendedModifierApiItem => {
      const modifier = item as RecommendedModifierApiResponse;

      return {
        name: modifier.name || '',
        description: modifier.description,
        code: modifier.type || modifier.code || '',
        reason: modifier.description || '',
        priority: 0,
        isRequired: false,
      };
    });

    // Мапимо у доменний формат
    const modifiers: WizardRecommendedModifier[] = typedModifiers.map(
      (modifier: RecommendedModifierApiItem) => ({
        code: modifier.code || '',
        name: modifier.name || '',
        reason: modifier.reason || '',
        priority: modifier.priority || 0,
        isRequired: modifier.isRequired || false,
      })
    );

    return {
      success: true,
      data: modifiers,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати рекомендації: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
