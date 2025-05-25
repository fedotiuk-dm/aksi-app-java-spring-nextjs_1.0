/**
 * @fileoverview Маппер для перетворення даних розрахунку цін
 * @module domain/wizard/adapters/pricing
 */

import type {
  PriceCalculationRequest,
  PriceCalculationResponse,
  CalculationDetails,
} from '../../../pricing/types/pricing.types';
import type {
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
  CalculationDetailsDTO,
  RangeModifierValue,
  FixedModifierQuantity,
} from '@/lib/api';

/**
 * Розширений тип запиту з додатковими полями для модифікаторів
 */
export interface ExtendedPriceCalculationRequest extends PriceCalculationRequest {
  readonly rangeModifierValues?: Array<{ modifierCode: string; value: number }>;
  readonly fixedModifierQuantities?: Array<{ modifierCode: string; quantity: number }>;
}

/**
 * Перетворює доменний запит на розрахунок ціни в API формат
 */
export function mapPriceCalculationRequestToDTO(
  domainRequest: PriceCalculationRequest | ExtendedPriceCalculationRequest
): PriceCalculationRequestDTO {
  const extendedRequest = domainRequest as ExtendedPriceCalculationRequest;

  return {
    categoryCode: domainRequest.categoryCode,
    itemName: domainRequest.itemName,
    color: domainRequest.color,
    quantity: domainRequest.quantity,
    modifierCodes: domainRequest.selectedModifiers,
    expedited: domainRequest.isUrgent || false,
    expeditePercent: domainRequest.urgencyLevel || 0,
    discountPercent: domainRequest.discountValue || 0,
    rangeModifierValues: mapRangeModifierValues(extendedRequest.rangeModifierValues),
    fixedModifierQuantities: mapFixedModifierQuantities(extendedRequest.fixedModifierQuantities),
  };
}

/**
 * Перетворює доменні значення діапазонних модифікаторів в API формат
 */
function mapRangeModifierValues(
  domainValues?: Array<{ modifierCode: string; value: number }>
): RangeModifierValue[] {
  if (!domainValues || domainValues.length === 0) {
    return [];
  }

  return domainValues.map((item) => ({
    modifierCode: item.modifierCode,
    value: item.value,
  }));
}

/**
 * Перетворює доменні кількості фіксованих модифікаторів в API формат
 */
function mapFixedModifierQuantities(
  domainQuantities?: Array<{ modifierCode: string; quantity: number }>
): FixedModifierQuantity[] {
  if (!domainQuantities || domainQuantities.length === 0) {
    return [];
  }

  return domainQuantities.map((item) => ({
    modifierCode: item.modifierCode,
    quantity: item.quantity,
  }));
}

/**
 * Перетворює API відповідь розрахунку ціни в доменний тип
 */
export function mapPriceCalculationResponseToDomain(
  apiResponse: PriceCalculationResponseDTO
): PriceCalculationResponse {
  return {
    basePrice: apiResponse.baseUnitPrice || 0,
    modifiersAmount: calculateModifiersAmount(apiResponse),
    urgencyAmount: calculateUrgencyAmount(apiResponse),
    subtotal: apiResponse.baseTotalPrice || 0,
    discountAmount: calculateDiscountAmount(apiResponse),
    finalAmount: apiResponse.finalTotalPrice || 0,
    calculationDetails: mapCalculationDetailsToDomain(apiResponse.calculationDetails || []),
  };
}

/**
 * Перетворює деталі розрахунку з API в доменний тип
 */
export function mapCalculationDetailsToDomain(
  apiDetails: CalculationDetailsDTO[]
): CalculationDetails {
  const appliedModifiers: string[] = [];
  let urgencyDetails: string | undefined;
  let discountDetails: string | undefined;
  const warnings: string[] = [];

  apiDetails.forEach((detail) => {
    const stepName = detail.stepName || '';
    const description = detail.description || '';
    const priceDifference = detail.priceDifference || 0;

    if (stepName.includes('модифікатор') || detail.modifierCode) {
      appliedModifiers.push(`${description}: ${priceDifference}грн`);
    } else if (stepName.includes('терміновість') || stepName.includes('expedite')) {
      urgencyDetails = `${description}: ${priceDifference}грн`;
    } else if (stepName.includes('знижка') || stepName.includes('discount')) {
      discountDetails = `${description}: -${Math.abs(priceDifference)}грн`;
    } else if (stepName.includes('попередження') || stepName.includes('warning')) {
      warnings.push(description);
    }
  });

  const baseStep = apiDetails.find((d) => d.stepName?.includes('базова') || d.step === 1);
  const baseAmount = baseStep?.priceAfter || baseStep?.priceBefore || 0;

  return {
    baseCalculation: `Базова ціна: ${baseAmount}грн`,
    appliedModifiers,
    urgencyDetails,
    discountDetails,
    warnings,
  };
}

/**
 * Розраховує суму модифікаторів з деталей API відповіді
 */
function calculateModifiersAmount(apiResponse: PriceCalculationResponseDTO): number {
  if (!apiResponse.calculationDetails) return 0;

  return apiResponse.calculationDetails
    .filter((detail) => detail.stepName?.includes('модифікатор') || detail.modifierCode)
    .reduce((sum, detail) => sum + (detail.priceDifference || 0), 0);
}

/**
 * Розраховує суму терміновості з деталей API відповіді
 */
function calculateUrgencyAmount(apiResponse: PriceCalculationResponseDTO): number {
  if (!apiResponse.calculationDetails) return 0;

  return apiResponse.calculationDetails
    .filter(
      (detail) => detail.stepName?.includes('терміновість') || detail.stepName?.includes('expedite')
    )
    .reduce((sum, detail) => sum + (detail.priceDifference || 0), 0);
}

/**
 * Розраховує суму знижки з деталей API відповіді
 */
function calculateDiscountAmount(apiResponse: PriceCalculationResponseDTO): number {
  if (!apiResponse.calculationDetails) return 0;

  return apiResponse.calculationDetails
    .filter(
      (detail) => detail.stepName?.includes('знижка') || detail.stepName?.includes('discount')
    )
    .reduce((sum, detail) => sum + Math.abs(detail.priceDifference || 0), 0);
}
