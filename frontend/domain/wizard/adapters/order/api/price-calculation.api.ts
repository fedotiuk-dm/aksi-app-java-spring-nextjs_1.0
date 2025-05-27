/**
 * @fileoverview API функції для розрахунку цін в контексті замовлень
 * @module domain/wizard/adapters/order/api
 */

import { PriceCalculationService } from '@/lib/api';

// Імпортуємо спільні типи з shared
import { WizardModifierType } from '../../shared';

import type {
  WizardPriceCalculationRequest,
  WizardPriceCalculationResponse,
  WizardModifierInfo,
  WizardRiskWarning,
} from '../../shared';
import type {
  WizardOrderOperationResult,
  WizardModifierResponse,
  WizardRiskWarningResponse,
  WizardBasePriceResponse,
} from '../types';
import type {
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
  RangeModifierValue,
  FixedModifierQuantity,
} from '@/lib/api';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Деталі модифікатора (специфічний для order)
 */
export interface WizardModifierDetail {
  readonly code: string;
  readonly name: string;
  readonly type: WizardModifierType;
  readonly value: number;
  readonly appliedAmount: number;
  readonly description?: string;
}

/**
 * Конвертер типу модифікатора з API в доменний тип
 */
function mapModifierTypeToDomain(apiType?: string): WizardModifierType {
  switch (apiType?.toUpperCase()) {
    case 'PERCENTAGE':
      return WizardModifierType.PERCENTAGE;
    case 'FIXED_AMOUNT':
      return WizardModifierType.FIXED_AMOUNT;
    case 'MULTIPLIER':
      return WizardModifierType.MULTIPLIER;
    default:
      return WizardModifierType.PERCENTAGE;
  }
}

/**
 * Маппер запиту з доменної моделі в API модель
 */
function mapCalculationRequestToAPI(
  request: WizardPriceCalculationRequest
): PriceCalculationRequestDTO {
  return {
    categoryCode: request.categoryCode,
    itemName: request.itemName,
    quantity: request.quantity,
    color: request.color,
    modifierCodes: request.modifierCodes || [],
    rangeModifierValues: request.rangeModifierValues?.map(
      (value): RangeModifierValue => ({
        modifierCode: value.modifierCode,
        value: value.value,
      })
    ),
    fixedModifierQuantities: request.fixedModifierQuantities?.map(
      (quantity): FixedModifierQuantity => ({
        modifierCode: quantity.modifierCode,
        quantity: quantity.quantity,
      })
    ),
    expedited: request.expedited,
    expeditePercent: request.expeditePercent,
    discountPercent: request.discountPercent,
  };
}

/**
 * Маппер відповіді з API моделі в доменну модель
 */
function mapCalculationResponseToDomain(
  apiResponse: PriceCalculationResponseDTO
): WizardPriceCalculationResponse {
  return {
    baseUnitPrice: apiResponse.baseUnitPrice || 0,
    quantity: apiResponse.quantity || 1,
    baseTotalPrice: apiResponse.baseTotalPrice || 0,
    finalUnitPrice: apiResponse.finalUnitPrice || 0,
    finalTotalPrice: apiResponse.finalTotalPrice || 0,
    unitOfMeasure: apiResponse.unitOfMeasure,
    calculationDetails: (apiResponse.calculationDetails || []).map((detail) => ({
      step: detail.step || 0,
      stepName: detail.stepName || '',
      description: detail.description || '',
      modifierCode: detail.modifierCode,
      modifierName: detail.modifierName,
      modifierValue: detail.modifierValue,
      priceBefore: detail.priceBefore || 0,
      priceAfter: detail.priceAfter || 0,
      priceDifference: detail.priceDifference || 0,
    })),
  };
}

/**
 * Маппер базової ціни з API відповіді
 */
function mapBasePriceResponse(apiResponse: Record<string, unknown>): WizardBasePriceResponse {
  return {
    price: typeof apiResponse.price === 'number' ? apiResponse.price : undefined,
    basePrice: typeof apiResponse.basePrice === 'number' ? apiResponse.basePrice : undefined,
    unitOfMeasure:
      typeof apiResponse.unitOfMeasure === 'string' ? apiResponse.unitOfMeasure : undefined,
    categoryCode:
      typeof apiResponse.categoryCode === 'string' ? apiResponse.categoryCode : undefined,
    itemName: typeof apiResponse.itemName === 'string' ? apiResponse.itemName : undefined,
    color: typeof apiResponse.color === 'string' ? apiResponse.color : undefined,
  };
}

/**
 * Маппер модифікатора з API відповіді
 */
function mapModifierResponse(apiModifier: Record<string, unknown>): WizardModifierResponse {
  return {
    code: typeof apiModifier.code === 'string' ? apiModifier.code : undefined,
    name: typeof apiModifier.name === 'string' ? apiModifier.name : undefined,
    description: typeof apiModifier.description === 'string' ? apiModifier.description : undefined,
    type: mapModifierTypeToDomain(apiModifier.type as string),
    value: typeof apiModifier.value === 'number' ? apiModifier.value : undefined,
    category: ['GENERAL', 'TEXTILE', 'LEATHER'].includes(apiModifier.category as string)
      ? (apiModifier.category as 'GENERAL' | 'TEXTILE' | 'LEATHER')
      : undefined,
    applicableCategories: Array.isArray(apiModifier.applicableCategories)
      ? apiModifier.applicableCategories.filter((cat): cat is string => typeof cat === 'string')
      : undefined,
    isRecommended:
      typeof apiModifier.isRecommended === 'boolean' ? apiModifier.isRecommended : undefined,
  };
}

/**
 * Маппер попередження про ризики з API відповіді
 */
function mapRiskWarningResponse(apiWarning: Record<string, unknown>): WizardRiskWarningResponse {
  return {
    type: typeof apiWarning.type === 'string' ? apiWarning.type : undefined,
    severity: ['LOW', 'MEDIUM', 'HIGH'].includes(apiWarning.severity as string)
      ? (apiWarning.severity as 'LOW' | 'MEDIUM' | 'HIGH')
      : undefined,
    message: typeof apiWarning.message === 'string' ? apiWarning.message : undefined,
    recommendation:
      typeof apiWarning.recommendation === 'string' ? apiWarning.recommendation : undefined,
  };
}

/**
 * Розрахунок ціни з модифікаторами
 */
export async function calculatePrice(
  request: WizardPriceCalculationRequest
): Promise<WizardOrderOperationResult<WizardPriceCalculationResponse>> {
  try {
    const apiRequest = mapCalculationRequestToAPI(request);
    const apiResponse = await PriceCalculationService.calculatePrice({
      requestBody: apiRequest,
    });

    const calculation = mapCalculationResponseToDomain(apiResponse);

    return {
      success: true,
      data: calculation,
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
): Promise<WizardOrderOperationResult<number>> {
  try {
    const apiResponse = await PriceCalculationService.getBasePrice({
      categoryCode,
      itemName,
      color,
    });

    const mappedResponse = mapBasePriceResponse(apiResponse);
    const basePrice = mappedResponse.price || mappedResponse.basePrice || 0;

    return {
      success: true,
      data: basePrice,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати базову ціну: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання доступних модифікаторів для категорії
 */
export async function getAvailableModifiersForCategory(
  categoryCode: string
): Promise<WizardOrderOperationResult<WizardModifierInfo[]>> {
  try {
    const apiResponse = await PriceCalculationService.getAvailableModifiersForCategory({
      categoryCode,
    });

    // Перетворюємо Record<string, unknown> в масив модифікаторів
    const modifiers = Array.isArray(apiResponse) ? apiResponse : Object.values(apiResponse);

    const mappedModifiers: WizardModifierInfo[] = [];

    for (const modifier of modifiers) {
      if (typeof modifier === 'object' && modifier !== null) {
        const mappedModifier = mapModifierResponse(modifier as Record<string, unknown>);
        if (mappedModifier.code) {
          mappedModifiers.push({
            code: mappedModifier.code,
            name: mappedModifier.name || '',
            description: mappedModifier.description || '',
            type: mappedModifier.type || WizardModifierType.PERCENTAGE,
            value: mappedModifier.value || 0,
            category: mappedModifier.category || 'GENERAL',
            applicableCategories: mappedModifier.applicableCategories || [],
          });
        }
      }
    }

    return {
      success: true,
      data: mappedModifiers,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати модифікатори: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання рекомендованих модифікаторів
 */
export async function getRecommendedModifiers(
  stains?: string[],
  defects?: string[],
  categoryCode?: string,
  materialType?: string
): Promise<WizardOrderOperationResult<WizardModifierInfo[]>> {
  try {
    const apiResponse = await PriceCalculationService.getRecommendedModifiers({
      stains,
      defects,
      categoryCode,
      materialType,
    });

    const modifiers = Array.isArray(apiResponse) ? apiResponse : Object.values(apiResponse);

    const mappedModifiers: WizardModifierInfo[] = [];

    for (const modifier of modifiers) {
      if (typeof modifier === 'object' && modifier !== null) {
        const mappedModifier = mapModifierResponse(modifier as Record<string, unknown>);
        if (mappedModifier.code) {
          mappedModifiers.push({
            code: mappedModifier.code,
            name: mappedModifier.name || '',
            description: mappedModifier.description || '',
            type: mappedModifier.type || WizardModifierType.PERCENTAGE,
            value: mappedModifier.value || 0,
            category: mappedModifier.category || 'GENERAL',
            applicableCategories: mappedModifier.applicableCategories || [],
            isRecommended: true,
          });
        }
      }
    }

    return {
      success: true,
      data: mappedModifiers,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати рекомендації: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання попереджень про ризики
 */
export async function getRiskWarnings(
  stains?: string[],
  defects?: string[],
  categoryCode?: string,
  materialType?: string
): Promise<WizardOrderOperationResult<WizardRiskWarning[]>> {
  try {
    const apiResponse = await PriceCalculationService.getRiskWarnings({
      stains,
      defects,
      categoryCode,
      materialType,
    });

    const warnings = Array.isArray(apiResponse) ? apiResponse : Object.values(apiResponse);

    const mappedWarnings: WizardRiskWarning[] = [];

    for (const warning of warnings) {
      if (typeof warning === 'object' && warning !== null) {
        const mappedWarning = mapRiskWarningResponse(warning as Record<string, unknown>);
        if (mappedWarning.type && mappedWarning.message) {
          mappedWarnings.push({
            type: mappedWarning.type,
            severity: mappedWarning.severity || 'MEDIUM',
            message: mappedWarning.message,
            recommendation: mappedWarning.recommendation,
          });
        }
      }
    }

    return {
      success: true,
      data: mappedWarnings,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати попередження: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання інформації про модифікатор за кодом
 */
export async function getModifierByCode(
  code: string
): Promise<WizardOrderOperationResult<WizardModifierInfo>> {
  try {
    const apiResponse = await PriceCalculationService.getModifierByCode1({ code });

    const mappedModifier = mapModifierResponse(apiResponse);

    const modifierInfo: WizardModifierInfo = {
      code: mappedModifier.code || '',
      name: mappedModifier.name || '',
      description: mappedModifier.description || '',
      type: mappedModifier.type || WizardModifierType.PERCENTAGE,
      value: mappedModifier.value || 0,
      category: mappedModifier.category || 'GENERAL',
      applicableCategories: mappedModifier.applicableCategories || [],
    };

    return {
      success: true,
      data: modifierInfo,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати інформацію про модифікатор: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
