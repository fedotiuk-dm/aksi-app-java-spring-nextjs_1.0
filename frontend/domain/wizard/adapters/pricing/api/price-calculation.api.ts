/**
 * @fileoverview API функції для розрахунку цін
 * @module domain/wizard/adapters/pricing/api
 */

import { PricingCalculationService } from '@/lib/api';

import { mapPriceCalculationRequestToDTO, mapPriceCalculationResponseToDomain } from '../mappers';
import { WizardRiskLevel } from '../types';

import type {
  WizardPricingOperationResult,
  WizardPriceCalculationRequest,
  WizardPriceCalculationResponse,
  WizardRiskWarning,
  WizardRecommendedModifier,
} from '../types';

/**
 * Інтерфейс для відповіді API з рекомендованими модифікаторами
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
    const apiResponse = await PricingCalculationService.calculatePrice({
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
    const apiResponse = await PricingCalculationService.getBasePrice({
      categoryCode,
      itemName,
      color,
    });

    return {
      success: true,
      data: apiResponse || 0,
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
    const params = {
      categoryCode,
      itemName,
      material,
      color,
    };

    const apiResponse = await PricingCalculationService.getRiskWarnings(params);

    // Оскільки API повертає масив рядків, а не об'єктів,
    // потрібно їх розпарсити як JSON або перетворити у потрібний формат
    const warnings: WizardRiskWarning[] = (apiResponse || []).map((warningJson: string) => {
      try {
        // Припускаємо, що рядки - це JSON об'єкти у текстовому форматі
        const warning = JSON.parse(warningJson);
        return {
          id: warning.id || '',
          type: warning.type || '',
          // Переконуємося, що level має тип WizardRiskLevel
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
          message: warningJson, // Використовуємо оригінальний рядок як повідомлення
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
    const params = {
      categoryCode,
      itemName,
      material,
      color,
    };

    // Отримуємо відповідь з API
    const apiResponse = await PricingCalculationService.getRecommendedModifiers(params);

    // Перетворюємо API відповідь у типізований формат
    const typedResponse = apiResponse.map((item): RecommendedModifierApiItem => {
      // Безпечне приведення типів
      return {
        name: item.name || '',
        description: item.description,
        // Використовуємо дані з PriceModifierDTO та додаємо додаткові поля
        code: typeof item.type === 'string' ? item.type : '', // Як code використовуємо type
        reason: item.description, // Як reason використовуємо description
        priority: 0, // Дефолтне значення
        isRequired: false, // Дефолтне значення
      };
    });

    // Мапимо у доменний формат
    const modifiers: WizardRecommendedModifier[] = typedResponse.map((modifier) => ({
      code: modifier.code || '',
      name: modifier.name || '',
      reason: modifier.reason || '',
      priority: modifier.priority || 0,
      isRequired: modifier.isRequired || false,
    }));

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
