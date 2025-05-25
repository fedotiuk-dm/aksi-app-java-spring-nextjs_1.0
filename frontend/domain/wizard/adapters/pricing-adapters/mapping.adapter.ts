/**
 * @fileoverview Адаптер маппінгу pricing даних API ↔ Domain
 * @module domain/wizard/adapters/pricing-adapters
 */

import type {
  ServiceCategoryDTO,
  PriceListItemDTO,
  PriceModifierDTO,
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
  CalculationDetailsDTO,
  StainTypeDTO,
  DefectTypeDTO,
} from '@/lib/api';

/**
 * Доменні типи для ціноутворення
 */
export interface ServiceCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
  active: boolean;
  standardProcessingDays: number;
  items: PriceListItem[];
}

export interface PriceListItem {
  id: string;
  categoryId: string;
  catalogNumber: number;
  name: string;
  unitOfMeasure: string;
  basePrice: number;
  priceBlack?: number;
  priceColor?: number;
  active: boolean;
}

export interface PriceModifier {
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'MULTIPLIER';
  value: number;
  amount: number;
}

export interface PriceCalculationRequest {
  categoryCode: string;
  itemName: string;
  color?: string;
  quantity: number;
  modifierCodes?: string[];
  expedited?: boolean;
  expeditePercent?: number;
  discountPercent?: number;
}

export interface PriceCalculationResponse {
  baseUnitPrice: number;
  quantity: number;
  baseTotalPrice: number;
  unitOfMeasure: string;
  finalUnitPrice: number;
  finalTotalPrice: number;
  calculationDetails: CalculationDetail[];
}

export interface CalculationDetail {
  step: number;
  stepName: string;
  description: string;
  priceBefore: number;
  priceAfter: number;
  priceDifference: number;
  modifierName?: string;
  modifierCode?: string;
  modifierValue?: string;
}

export interface StainType {
  id: string;
  code: string;
  name: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  active: boolean;
}

export interface DefectType {
  id: string;
  code: string;
  name: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  active: boolean;
}

/**
 * Адаптер для маппінгу pricing даних між API та Domain
 *
 * Відповідальність:
 * - Перетворення API моделей у доменні типи
 * - Нормалізація даних ціноутворення
 * - Валідація та очищення даних
 */
export class PricingMappingAdapter {
  /**
   * Перетворює API категорію послуг у доменний тип
   */
  static serviceCategoryToDomain(apiCategory: ServiceCategoryDTO): ServiceCategory {
    return {
      id: apiCategory.id || '',
      code: apiCategory.code || '',
      name: apiCategory.name || '',
      description: apiCategory.description || '',
      sortOrder: apiCategory.sortOrder || 0,
      active: apiCategory.active ?? true,
      standardProcessingDays: apiCategory.standardProcessingDays || 2,
      items: (apiCategory.items || []).map(this.priceListItemToDomain),
    };
  }

  /**
   * Перетворює API елемент прайс-листа у доменний тип
   */
  static priceListItemToDomain(apiItem: PriceListItemDTO): PriceListItem {
    return {
      id: apiItem.id || '',
      categoryId: apiItem.categoryId || '',
      catalogNumber: apiItem.catalogNumber || 0,
      name: apiItem.name || '',
      unitOfMeasure: apiItem.unitOfMeasure || 'шт',
      basePrice: apiItem.basePrice || 0,
      priceBlack: apiItem.priceBlack,
      priceColor: apiItem.priceColor,
      active: apiItem.active ?? true,
    };
  }

  /**
   * Перетворює API модифікатор ціни у доменний тип
   */
  static priceModifierToDomain(apiModifier: PriceModifierDTO): PriceModifier {
    return {
      name: apiModifier.name || '',
      description: apiModifier.description || '',
      type: (apiModifier.type as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'MULTIPLIER') || 'PERCENTAGE',
      value: apiModifier.value || 0,
      amount: apiModifier.amount || 0,
    };
  }

  /**
   * Перетворює доменний запит розрахунку у API формат
   */
  static priceCalculationRequestToApi(
    domainRequest: PriceCalculationRequest
  ): PriceCalculationRequestDTO {
    return {
      categoryCode: domainRequest.categoryCode,
      itemName: domainRequest.itemName,
      color: domainRequest.color,
      quantity: domainRequest.quantity,
      modifierCodes: domainRequest.modifierCodes,
      expedited: domainRequest.expedited,
      expeditePercent: domainRequest.expeditePercent,
      discountPercent: domainRequest.discountPercent,
    };
  }

  /**
   * Перетворює API відповідь розрахунку у доменний тип
   */
  static priceCalculationResponseToDomain(
    apiResponse: PriceCalculationResponseDTO
  ): PriceCalculationResponse {
    return {
      baseUnitPrice: apiResponse.baseUnitPrice || 0,
      quantity: apiResponse.quantity || 1,
      baseTotalPrice: apiResponse.baseTotalPrice || 0,
      unitOfMeasure: apiResponse.unitOfMeasure || 'шт',
      finalUnitPrice: apiResponse.finalUnitPrice || 0,
      finalTotalPrice: apiResponse.finalTotalPrice || 0,
      calculationDetails: (apiResponse.calculationDetails || []).map(
        this.calculationDetailToDomain
      ),
    };
  }

  /**
   * Перетворює API деталь розрахунку у доменний тип
   */
  static calculationDetailToDomain(apiDetail: CalculationDetailsDTO): CalculationDetail {
    return {
      step: apiDetail.step || 0,
      stepName: apiDetail.stepName || '',
      description: apiDetail.description || '',
      priceBefore: apiDetail.priceBefore || 0,
      priceAfter: apiDetail.priceAfter || 0,
      priceDifference: apiDetail.priceDifference || 0,
      modifierName: apiDetail.modifierName,
      modifierCode: apiDetail.modifierCode,
      modifierValue: apiDetail.modifierValue,
    };
  }

  /**
   * Перетворює API тип плями у доменний тип
   */
  static stainTypeToDomain(apiStain: StainTypeDTO): StainType {
    return {
      id: apiStain.id || '',
      code: apiStain.code || '',
      name: apiStain.name || '',
      description: apiStain.description || '',
      riskLevel: (apiStain.riskLevel as 'LOW' | 'MEDIUM' | 'HIGH') || 'LOW',
      active: apiStain.active ?? true,
    };
  }

  /**
   * Перетворює API тип дефекту у доменний тип
   */
  static defectTypeToDomain(apiDefect: DefectTypeDTO): DefectType {
    return {
      id: apiDefect.id || '',
      code: apiDefect.code || '',
      name: apiDefect.name || '',
      description: apiDefect.description || '',
      riskLevel: (apiDefect.riskLevel as 'LOW' | 'MEDIUM' | 'HIGH') || 'LOW',
      active: apiDefect.active ?? true,
    };
  }

  /**
   * Перетворює масив API категорій у доменні типи
   */
  static serviceCategoriesToDomain(apiCategories: ServiceCategoryDTO[]): ServiceCategory[] {
    return apiCategories.map(this.serviceCategoryToDomain);
  }

  /**
   * Перетворює масив API модифікаторів у доменні типи
   */
  static priceModifiersToDomain(apiModifiers: PriceModifierDTO[]): PriceModifier[] {
    return apiModifiers.map(this.priceModifierToDomain);
  }

  /**
   * Перетворює масив API типів плям у доменні типи
   */
  static stainTypesToDomain(apiStains: StainTypeDTO[]): StainType[] {
    return apiStains.map(this.stainTypeToDomain);
  }

  /**
   * Перетворює масив API типів дефектів у доменні типи
   */
  static defectTypesToDomain(apiDefects: DefectTypeDTO[]): DefectType[] {
    return apiDefects.map(this.defectTypeToDomain);
  }
}
