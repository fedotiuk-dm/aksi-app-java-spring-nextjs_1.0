/**
 * @fileoverview API функції для розрахунку цін в контексті pricing
 * @module domain/wizard/adapters/pricing/api
 */

import { PriceCalculationService } from '@/lib/api';

// Імпортуємо спільні типи з shared
import type {
  WizardPriceCalculationRequest,
  WizardPriceCalculationResponse,
  WizardRiskWarning,
} from '../../shared';
import type {
  WizardPricingOperationResult,
  BasePriceApiResponse,
  RiskWarningApiResponse,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Розрахунок ціни предмета (pricing версія)
 */
export async function calculatePriceForPricing(
  request: WizardPriceCalculationRequest
): Promise<WizardPricingOperationResult<WizardPriceCalculationResponse>> {
  try {
    const apiResponse = await PriceCalculationService.calculatePrice({
      requestBody: {
        categoryCode: request.categoryCode,
        itemName: request.itemName,
        quantity: request.quantity,
        color: request.color,
        modifierCodes: request.modifierCodes || [],
        expedited: request.expedited,
        expeditePercent: request.expeditePercent,
        discountPercent: request.discountPercent,
      },
    });

    const response: WizardPriceCalculationResponse = {
      success: true,
      itemName: request.itemName,
      categoryCode: request.categoryCode,
      baseUnitPrice: apiResponse.baseUnitPrice,
      quantity: apiResponse.quantity,
      baseTotalPrice: apiResponse.baseTotalPrice,
      finalUnitPrice: apiResponse.finalUnitPrice,
      finalTotalPrice: apiResponse.finalTotalPrice,
      unitOfMeasure: apiResponse.unitOfMeasure,
    };

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
 * Отримання базової ціни для предмета (pricing версія)
 */
export async function getBasePriceForPricing(
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
 * Отримання попереджень про ризики (pricing версія)
 */
export async function getRiskWarningsForPricing(
  categoryCode: string,
  itemName: string,
  material?: string,
  color?: string
): Promise<WizardPricingOperationResult<WizardRiskWarning[]>> {
  try {
    const apiResponse = await PriceCalculationService.getRiskWarnings({
      categoryCode,
      materialType: material,
      stains: color ? [`color:${color}`] : [],
      defects: [],
    });

    const warnings: WizardRiskWarning[] = [];

    // Обробляємо відповідь API
    if (Array.isArray(apiResponse)) {
      apiResponse.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          const warning = item as RiskWarningApiResponse;
          warnings.push({
            type: warning.type || '',
            severity: (warning.severity as 'LOW' | 'MEDIUM' | 'HIGH') || 'LOW',
            message: warning.message || '',
            recommendation: warning.recommendation,
          });
        }
      });
    }

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
