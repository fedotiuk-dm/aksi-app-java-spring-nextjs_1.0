/**
 * @fileoverview Маппер для перетворення price calculation DTO ↔ Wizard типи
 * @module domain/wizard/adapters/pricing/mappers
 */

import { WizardModifierType } from '../types/price-modifier.types';

import type {
  WizardPriceCalculationRequest,
  WizardPriceCalculationResponse,
  WizardPriceCalculationDetails,
  WizardAppliedModifier,
} from '../types';
import type { PriceCalculationRequestDTO } from '@/lib/api';

/**
 * Інтерфейси для API відповідей з розрахунку цін
 */

interface CalculationDetailsApiResponse extends Record<string, unknown> {
  modifierCode?: string;
  modifierName?: string;
  modifierValue?: string;
  priceDifference?: number;
  description?: string;
}

interface PriceCalculationResponseApiResponse extends Record<string, unknown> {
  baseUnitPrice?: number;
  quantity?: number;
  baseTotalPrice?: number;
  finalTotalPrice?: number;
  itemName?: string;
  categoryCode?: string;
  categoryName?: string;
  unitOfMeasure?: string | { value?: string };
  calculationDetails?: CalculationDetailsApiResponse[];
  warnings?: string[];
  recommendations?: string[];
  expedited?: boolean;
  expeditePercent?: number;
  discountPercent?: number;
}

/**
 * Перетворює WizardPriceCalculationRequest у PriceCalculationRequestDTO
 */
export function mapPriceCalculationRequestToDTO(
  domainRequest: WizardPriceCalculationRequest
): PriceCalculationRequestDTO {
  return {
    categoryCode: domainRequest.categoryCode || '',
    itemName: domainRequest.itemName || '',
    quantity: domainRequest.quantity || 1,
    color: domainRequest.color,
    modifierCodes: domainRequest.modifierCodes || [],
    expedited: domainRequest.expedited || false,
    expeditePercent: domainRequest.expeditePercent || 0,
    discountPercent: domainRequest.discountPercent || 0,
  };
}

/**
 * Перетворює PriceCalculationResponseApiResponse у WizardPriceCalculationResponse
 */
export function mapPriceCalculationResponseToDomain(
  apiResponse: PriceCalculationResponseApiResponse
): WizardPriceCalculationResponse {
  // Отримуємо модифікатори з calculationDetails, якщо вони є
  const appliedModifiers: WizardAppliedModifier[] = (apiResponse.calculationDetails || [])
    .filter((detail: CalculationDetailsApiResponse) => detail.modifierCode) // Тільки записи з модифікаторами
    .map((detail: CalculationDetailsApiResponse) => ({
      code: detail.modifierCode || '',
      name: detail.modifierName || '',
      type: mapModifierTypeToDomain(
        detail.modifierValue?.includes('%') ? 'PERCENTAGE' : 'FIXED_AMOUNT'
      ),
      value: parseModifierValue(detail.modifierValue || '0'),
      amount: detail.priceDifference || 0,
      description: detail.description || '',
    }));

  const calculation: WizardPriceCalculationDetails = {
    basePrice: apiResponse.baseUnitPrice || 0,
    quantity: apiResponse.quantity || 1,
    subtotal: apiResponse.baseTotalPrice || 0,
    modifiersAmount: calculateModifiersAmount(apiResponse),
    urgencyAmount: calculateUrgencyAmount(apiResponse),
    discountAmount: calculateDiscountAmount(apiResponse),
    finalPrice: apiResponse.finalTotalPrice || 0,
    appliedModifiers,
  };

  return {
    success: true,
    itemName: apiResponse.itemName || '',
    categoryCode: apiResponse.categoryCode || '',
    categoryName: apiResponse.categoryName || '',
    unitOfMeasure: typeof apiResponse.unitOfMeasure === 'string' ? apiResponse.unitOfMeasure : 'шт',
    calculation,
    warnings: apiResponse.warnings || [],
    recommendations: apiResponse.recommendations || [],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Перетворює тип модифікатора з API у доменний тип
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
 * Парсить значення модифікатора з рядка
 */
function parseModifierValue(valueStr: string): number {
  if (!valueStr) return 0;

  // Якщо значення містить %, витягуємо числову частину
  if (valueStr.includes('%')) {
    return parseFloat(valueStr.replace('%', ''));
  }

  // Спроба конвертації рядка в число
  const numValue = parseFloat(valueStr);
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Розраховує загальну суму модифікаторів
 */
function calculateModifiersAmount(apiResponse: PriceCalculationResponseApiResponse): number {
  if (!apiResponse.calculationDetails || !Array.isArray(apiResponse.calculationDetails)) {
    return 0;
  }

  // Сума різниць цін для всіх кроків, пов'язаних з модифікаторами
  return apiResponse.calculationDetails
    .filter((detail: CalculationDetailsApiResponse) => detail.modifierCode) // Тільки записи з модифікаторами
    .reduce((total, detail: CalculationDetailsApiResponse) => {
      return total + (detail.priceDifference || 0);
    }, 0);
}

/**
 * Розраховує суму надбавки за терміновість
 */
function calculateUrgencyAmount(apiResponse: PriceCalculationResponseApiResponse): number {
  if (!apiResponse.expedited || !apiResponse.expeditePercent) {
    return 0;
  }

  const baseAmount = apiResponse.baseTotalPrice || apiResponse.baseUnitPrice || 0;
  return (baseAmount * apiResponse.expeditePercent) / 100;
}

/**
 * Розраховує суму знижки
 */
function calculateDiscountAmount(apiResponse: PriceCalculationResponseApiResponse): number {
  if (!apiResponse.discountPercent) {
    return 0;
  }

  const baseAmount = apiResponse.baseTotalPrice || apiResponse.baseUnitPrice || 0;
  return (baseAmount * apiResponse.discountPercent) / 100;
}
