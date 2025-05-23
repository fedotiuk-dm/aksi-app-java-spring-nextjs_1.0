/**
 * Адаптери для перетворення між OpenAPI DTO та доменними типами
 * Забезпечують інкапсуляцію зовнішніх API та внутрішніх доменних моделей
 */

import { ModifierCategory, ModifierType, RiskLevel } from '../types/pricing.types';

import type {
  PriceListItem,
  PriceModifier,
  ServiceCategory,
  StainType,
  DefectType,
  PriceCalculationRequest,
  PriceCalculationResponse,
  CalculationDetails,
  ApiToDomainAdapter,
  DomainToApiAdapter,
} from '../types/pricing.types';
import type {
  PriceListItemDTO,
  ServiceCategoryDTO,
  StainTypeDTO,
  DefectTypeDTO,
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
  CalculationDetailsDTO,
  PriceModifierDTO,
} from '@/lib/api';

/**
 * Адаптер для перетворення API DTO в доменні типи
 */
export class PricingApiToDomainAdapter implements ApiToDomainAdapter {
  /**
   * Перетворити PriceListItemDTO в PriceListItem
   */
  toPriceListItem(dto: PriceListItemDTO): PriceListItem {
    if (!dto.id) {
      throw new Error('PriceListItemDTO повинен мати ID');
    }

    if (!dto.categoryId) {
      throw new Error('PriceListItemDTO повинен мати categoryId');
    }

    if (!dto.name) {
      throw new Error('PriceListItemDTO повинен мати назву');
    }

    if (!dto.unitOfMeasure) {
      throw new Error('PriceListItemDTO повинен мати одиницю виміру');
    }

    if (dto.basePrice === undefined || dto.basePrice === null) {
      throw new Error('PriceListItemDTO повинен мати базову ціну');
    }

    return {
      id: dto.id,
      categoryId: dto.categoryId,
      catalogNumber: dto.catalogNumber,
      name: dto.name,
      unitOfMeasure: dto.unitOfMeasure,
      basePrice: dto.basePrice,
      priceBlack: dto.priceBlack,
      priceColor: dto.priceColor,
      active: dto.active ?? true,
    };
  }

  /**
   * Перетворити ServiceCategoryDTO в ServiceCategory
   */
  toServiceCategory(dto: ServiceCategoryDTO): ServiceCategory {
    if (!dto.id) {
      throw new Error('ServiceCategoryDTO повинен мати ID');
    }

    if (!dto.code) {
      throw new Error('ServiceCategoryDTO повинен мати код');
    }

    if (!dto.name) {
      throw new Error('ServiceCategoryDTO повинен мати назву');
    }

    return {
      id: dto.id,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      active: dto.active ?? true,
    };
  }

  /**
   * Перетворити PriceModifierDTO в PriceModifier
   */
  toPriceModifier(dto: PriceModifierDTO): PriceModifier {
    // Генеруємо ID та код якщо вони відсутні в DTO
    const id = `modifier_${dto.name?.replace(/\s+/g, '_').toLowerCase() || 'unknown'}`;
    const code = dto.name?.replace(/\s+/g, '_').toUpperCase() || 'UNKNOWN';

    if (!dto.name) {
      throw new Error('PriceModifierDTO повинен мати назву');
    }

    // Перетворюємо строковий тип в enum
    const type = this.mapToModifierType(dto.type);

    if (dto.value === undefined || dto.value === null) {
      throw new Error('PriceModifierDTO повинен мати значення');
    }

    return {
      id,
      code,
      name: dto.name,
      description: dto.description,
      category: ModifierCategory.GENERAL, // За замовчуванням, можна розширити логіку
      appliesTo: [], // Заповнюється на основі бізнес-логіки
      type,
      value: dto.value,
      active: true,
    };
  }

  /**
   * Перетворити StainTypeDTO в StainType
   */
  toStainType(dto: StainTypeDTO): StainType {
    if (!dto.id) {
      throw new Error('StainTypeDTO повинен мати ID');
    }

    if (!dto.code) {
      throw new Error('StainTypeDTO повинен мати код');
    }

    if (!dto.name) {
      throw new Error('StainTypeDTO повинен мати назву');
    }

    const riskLevel = this.mapToRiskLevel(dto.riskLevel);

    return {
      id: dto.id,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      riskLevel,
      active: dto.active ?? true,
    };
  }

  /**
   * Перетворити DefectTypeDTO в DefectType
   */
  toDefectType(dto: DefectTypeDTO): DefectType {
    if (!dto.id) {
      throw new Error('DefectTypeDTO повинен мати ID');
    }

    if (!dto.code) {
      throw new Error('DefectTypeDTO повинен мати код');
    }

    if (!dto.name) {
      throw new Error('DefectTypeDTO повинен мати назву');
    }

    const riskLevel = this.mapToRiskLevel(dto.riskLevel);

    return {
      id: dto.id,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      riskLevel,
      active: dto.active ?? true,
    };
  }

  /**
   * Перетворити PriceCalculationResponseDTO в PriceCalculationResponse
   */
  toPriceCalculationResponse(dto: PriceCalculationResponseDTO): PriceCalculationResponse {
    const basePrice = dto.baseTotalPrice ?? 0;
    const finalAmount = dto.finalTotalPrice ?? basePrice;
    const modifiersAmount = finalAmount - basePrice;

    const calculationDetails = this.toCalculationDetails(dto.calculationDetails);

    return {
      basePrice,
      modifiersAmount,
      urgencyAmount: 0, // Розраховується на основі деталей
      subtotal: finalAmount,
      discountAmount: 0, // Розраховується на основі деталей
      finalAmount,
      calculationDetails,
    };
  }

  /**
   * Перетворити CalculationDetailsDTO[] в CalculationDetails
   */
  private toCalculationDetails(dtos: CalculationDetailsDTO[] | undefined): CalculationDetails {
    if (!dtos || dtos.length === 0) {
      return {
        baseCalculation: '',
        appliedModifiers: [],
        warnings: [],
      };
    }

    const appliedModifiers = dtos
      .filter((dto) => dto.modifierName)
      .map((dto) => `${dto.modifierName}: ${dto.modifierValue || ''}`);

    const baseCalculation = dtos
      .map((dto) => dto.description || '')
      .filter(Boolean)
      .join('; ');

    return {
      baseCalculation,
      appliedModifiers,
      warnings: [],
    };
  }

  /**
   * Перетворити строку в ModifierType
   */
  private mapToModifierType(type: string | undefined): ModifierType {
    switch (type?.toUpperCase()) {
      case 'PERCENTAGE':
        return ModifierType.PERCENTAGE;
      case 'FIXED_AMOUNT':
        return ModifierType.FIXED_AMOUNT;
      case 'MULTIPLIER':
      case 'RANGE':
        return ModifierType.RANGE;
      default:
        return ModifierType.PERCENTAGE;
    }
  }

  /**
   * Перетворити строку в RiskLevel
   */
  private mapToRiskLevel(riskLevel: string | undefined): RiskLevel {
    switch (riskLevel?.toUpperCase()) {
      case 'LOW':
        return RiskLevel.LOW;
      case 'MEDIUM':
        return RiskLevel.MEDIUM;
      case 'HIGH':
        return RiskLevel.HIGH;
      default:
        return RiskLevel.LOW;
    }
  }
}

/**
 * Адаптер для перетворення доменних типів в API DTO
 */
export class PricingDomainToApiAdapter implements DomainToApiAdapter {
  /**
   * Перетворити PriceCalculationRequest в PriceCalculationRequestDTO
   */
  fromPriceCalculationRequest(request: PriceCalculationRequest): PriceCalculationRequestDTO {
    return {
      categoryCode: request.categoryCode,
      itemName: request.itemName,
      quantity: request.quantity,
      color: request.color,
      modifierCodes: request.selectedModifiers,
      expedited: request.isUrgent,
      expeditePercent: request.urgencyLevel,
      discountPercent: request.discountValue,
    };
  }
}

/**
 * Фабрика адаптерів - створює екземпляри адаптерів
 */
export class PricingAdapterFactory {
  private static apiToDomainAdapter: PricingApiToDomainAdapter;
  private static domainToApiAdapter: PricingDomainToApiAdapter;

  /**
   * Отримати адаптер API → Domain
   */
  static getApiToDomainAdapter(): PricingApiToDomainAdapter {
    if (!this.apiToDomainAdapter) {
      this.apiToDomainAdapter = new PricingApiToDomainAdapter();
    }
    return this.apiToDomainAdapter;
  }

  /**
   * Отримати адаптер Domain → API
   */
  static getDomainToApiAdapter(): PricingDomainToApiAdapter {
    if (!this.domainToApiAdapter) {
      this.domainToApiAdapter = new PricingDomainToApiAdapter();
    }
    return this.domainToApiAdapter;
  }
}

/**
 * Утилітарні функції для роботи з адаптерами
 */
export class AdapterUtils {
  /**
   * Безпечне перетворення масиву DTO в масив доменних об'єктів
   */
  static safeMapArray<T, R>(items: T[], mapper: (item: T) => R, defaultValue: R[] = []): R[] {
    try {
      return items?.map(mapper) || defaultValue;
    } catch (error) {
      console.error('Помилка при перетворенні масиву:', error);
      return defaultValue;
    }
  }

  /**
   * Безпечне перетворення одного DTO в доменний об'єкт
   */
  static safeMap<T, R>(
    item: T | undefined | null,
    mapper: (item: T) => R,
    defaultValue?: R
  ): R | undefined {
    try {
      if (!item) {
        return defaultValue;
      }
      return mapper(item);
    } catch (error) {
      console.error("Помилка при перетворенні об'єкта:", error);
      return defaultValue;
    }
  }

  /**
   * Валідація DTO перед перетворенням
   */
  static validateDto<T>(dto: T, requiredFields: (keyof T)[]): void {
    requiredFields.forEach((field) => {
      if (dto[field] === undefined || dto[field] === null) {
        throw new Error(`Обов'язкове поле ${String(field)} відсутнє в DTO`);
      }
    });
  }
}
