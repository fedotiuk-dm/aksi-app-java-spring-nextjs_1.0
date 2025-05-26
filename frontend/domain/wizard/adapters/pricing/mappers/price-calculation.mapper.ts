/**
 * @fileoverview Маппер для перетворення price calculation DTO ↔ Wizard типи
 * @module domain/wizard/adapters/pricing/mappers
 */

import type {
  WizardPriceCalculationRequest,
  WizardPriceCalculationResponse,
  WizardPriceCalculationDetails,
  WizardAppliedModifier,
  WizardModifierType,
} from '../types';
import type { 
  PriceCalculationRequestDTO, 
  PriceCalculationResponseDTO,
  PriceModifierDTO,
  CalculationDetailsDTO
} from '@/lib/api';

/**
 * Розширений запит для додаткових параметрів
 */
export interface ExtendedWizardPriceCalculationRequest extends WizardPriceCalculationRequest {
  stainCodes?: string[];
  defectCodes?: string[];
  riskCodes?: string[];
  fillerType?: string;
  fillerCompressed?: boolean;
  wearPercentage?: number;
}

/**
 * Перетворює WizardPriceCalculationRequest у PriceCalculationRequestDTO
 */
export function mapPriceCalculationRequestToDTO(
  domainRequest: WizardPriceCalculationRequest | ExtendedWizardPriceCalculationRequest
): PriceCalculationRequestDTO {
  const extendedRequest = domainRequest as ExtendedWizardPriceCalculationRequest;

  return {
    categoryCode: domainRequest.categoryCode,
    itemName: domainRequest.itemName,
    quantity: domainRequest.quantity,
    color: domainRequest.color,
    material: domainRequest.material,
    modifierCodes: domainRequest.modifierCodes,
    expedited: domainRequest.expedited,
    expeditePercent: domainRequest.expeditePercent,
    discountPercent: domainRequest.discountPercent,
    urgencyLevel: domainRequest.urgencyLevel,
    specialInstructions: domainRequest.specialInstructions,

    // Розширені параметри
    stainCodes: extendedRequest.stainCodes,
    defectCodes: extendedRequest.defectCodes,
    riskCodes: extendedRequest.riskCodes,
    fillerType: extendedRequest.fillerType,
    fillerCompressed: extendedRequest.fillerCompressed,
    wearPercentage: extendedRequest.wearPercentage,
  };
}

/**
 * Перетворює PriceCalculationResponseDTO у WizardPriceCalculationResponse
 */
export function mapPriceCalculationResponseToDomain(
  apiResponse: PriceCalculationResponseDTO
): WizardPriceCalculationResponse {
  const appliedModifiers: WizardAppliedModifier[] = (apiResponse.appliedModifiers || []).map(
    (modifier: AppliedModifierDTO) => ({
      code: modifier.code || '',
      name: modifier.name || '',
      type: mapModifierTypeToDomain(modifier.type),
      value: modifier.value || 0,
      amount: modifier.amount || 0,
      description: modifier.description || '',
    })
  );

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
 * Розраховує загальну суму модифікаторів
 */
function calculateModifiersAmount(apiResponse: PriceCalculationResponseDTO): number {
  if (!apiResponse.appliedModifiers || !Array.isArray(apiResponse.appliedModifiers)) {
    return 0;
  }

  return apiResponse.appliedModifiers.reduce((total, modifier) => {
    return total + (modifier.amount || 0);
  }, 0);
}

/**
 * Розраховує суму надбавки за терміновість
 */
function calculateUrgencyAmount(apiResponse: PriceCalculationResponseDTO): number {
  if (!apiResponse.expedited || !apiResponse.expeditePercent) {
    return 0;
  }

  const baseAmount = apiResponse.baseTotalPrice || apiResponse.baseUnitPrice || 0;
  return (baseAmount * apiResponse.expeditePercent) / 100;
}

/**
 * Розраховує суму знижки
 */
function calculateDiscountAmount(apiResponse: PriceCalculationResponseDTO): number {
  if (!apiResponse.discountPercent) {
    return 0;
  }

  const baseAmount = apiResponse.baseTotalPrice || apiResponse.baseUnitPrice || 0;
  return (baseAmount * apiResponse.discountPercent) / 100;
}
