/**
 * Основні типи для домену Pricing
 * Визначають структури даних для роботи з ціноутворенням та розрахунками
 */

import type {
  PriceListItemDTO,
  PriceModifierDTO,
  ServiceCategoryDTO,
  StainTypeDTO,
  DefectTypeDTO,
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
} from '@/lib/api';

// ============= БАЗОВІ ТИПИ =============

export type PriceListItemId = string;
export type ServiceCategoryId = string;
export type ServiceCategoryCode = string;
export type ModifierCode = string;

// ============= СУТНОСТІ =============

/**
 * Елемент прайс-листа
 */
export interface PriceListItem {
  readonly id: PriceListItemId;
  readonly categoryId: ServiceCategoryId;
  readonly catalogNumber?: number;
  readonly name: string;
  readonly unitOfMeasure: string;
  readonly basePrice: number;
  readonly priceBlack?: number;
  readonly priceColor?: number;
  readonly active: boolean;
}

/**
 * Категорія послуг
 */
export interface ServiceCategory {
  readonly id: ServiceCategoryId;
  readonly code: ServiceCategoryCode;
  readonly name: string;
  readonly description?: string;
  readonly active: boolean;
}

/**
 * Модифікатор ціни
 */
export interface PriceModifier {
  readonly id: string;
  readonly code: ModifierCode;
  readonly name: string;
  readonly description?: string;
  readonly category: ModifierCategory;
  readonly appliesTo: string[];
  readonly type: ModifierType;
  readonly value: number;
  readonly active: boolean;
}

/**
 * Тип забруднення
 */
export interface StainType {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly riskLevel: RiskLevel;
  readonly active: boolean;
}

/**
 * Тип дефекту
 */
export interface DefectType {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly riskLevel: RiskLevel;
  readonly active: boolean;
}

// ============= ПЕРЕЛІЧЕННЯ =============

export enum ModifierCategory {
  GENERAL = 'GENERAL',
  TEXTILE = 'TEXTILE',
  LEATHER = 'LEATHER',
}

export enum ModifierType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  RANGE = 'RANGE',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum ColorType {
  BLACK = 'BLACK',
  COLOR = 'COLOR',
}

// ============= ЗАПИТИ ТА ВІДПОВІДІ =============

/**
 * Запит на розрахунок ціни
 */
export interface PriceCalculationRequest {
  readonly categoryCode: ServiceCategoryCode;
  readonly itemName: string;
  readonly quantity: number;
  readonly color?: string;
  readonly selectedModifiers: ModifierCode[];
  readonly stains: string[];
  readonly defects: string[];
  readonly isUrgent?: boolean;
  readonly urgencyLevel?: number;
  readonly discountType?: string;
  readonly discountValue?: number;
}

/**
 * Відповідь з розрахунком ціни
 */
export interface PriceCalculationResponse {
  readonly basePrice: number;
  readonly modifiersAmount: number;
  readonly urgencyAmount: number;
  readonly subtotal: number;
  readonly discountAmount: number;
  readonly finalAmount: number;
  readonly calculationDetails: CalculationDetails;
}

/**
 * Деталі розрахунку
 */
export interface CalculationDetails {
  readonly baseCalculation: string;
  readonly appliedModifiers: string[];
  readonly urgencyDetails?: string;
  readonly discountDetails?: string;
  readonly warnings: string[];
}

// ============= СТАН ДОМЕНУ =============

/**
 * Стан кешу для прайс-листа
 */
export interface PriceListState {
  readonly items: Record<ServiceCategoryCode, PriceListItem[]>;
  readonly categories: ServiceCategory[];
  readonly modifiers: Record<ModifierCategory, PriceModifier[]>;
  readonly stainTypes: StainType[];
  readonly defectTypes: DefectType[];
  readonly isLoading: boolean;
  readonly lastUpdated?: Date;
  readonly errors: Record<string, string>;
}

/**
 * Стан розрахунку ціни
 */
export interface PriceCalculationState {
  readonly currentRequest?: PriceCalculationRequest;
  readonly currentResponse?: PriceCalculationResponse;
  readonly isCalculating: boolean;
  readonly calculationHistory: PriceCalculationResponse[];
  readonly errors: Record<string, string>;
}

// ============= ДІЇ =============

/**
 * Дії для управління прайс-листом
 */
export interface PriceListActions {
  loadCategories(): Promise<void>;
  loadPriceListItems(categoryCode: ServiceCategoryCode): Promise<void>;
  loadModifiers(category: ModifierCategory): Promise<void>;
  loadStainTypes(): Promise<void>;
  loadDefectTypes(): Promise<void>;
  refreshCache(): Promise<void>;
  clearErrors(): void;
}

/**
 * Дії для розрахунку цін
 */
export interface PriceCalculationActions {
  calculatePrice(request: PriceCalculationRequest): Promise<void>;
  clearCalculation(): void;
  saveCalculationToHistory(): void;
  clearHistory(): void;
  clearErrors(): void;
}

// ============= АДАПТЕРИ ДЛЯ OPENAPI =============

/**
 * Адаптер для перетворення API DTO в доменні типи
 */
export interface ApiToDomainAdapter {
  toPriceListItem(dto: PriceListItemDTO): PriceListItem;
  toServiceCategory(dto: ServiceCategoryDTO): ServiceCategory;
  toPriceModifier(dto: PriceModifierDTO): PriceModifier;
  toStainType(dto: StainTypeDTO): StainType;
  toDefectType(dto: DefectTypeDTO): DefectType;
  toPriceCalculationResponse(dto: PriceCalculationResponseDTO): PriceCalculationResponse;
}

/**
 * Адаптер для перетворення доменних типів в API DTO
 */
export interface DomainToApiAdapter {
  fromPriceCalculationRequest(request: PriceCalculationRequest): PriceCalculationRequestDTO;
}

// ============= СЕРВІСНІ ТИПИ =============

/**
 * Параметри пошуку модифікаторів
 */
export interface ModifierSearchParams {
  readonly query?: string;
  readonly category?: ModifierCategory;
  readonly active?: boolean;
  readonly page?: number;
  readonly size?: number;
  readonly sortBy?: string;
  readonly sortDirection?: 'ASC' | 'DESC';
}

/**
 * Параметри отримання рекомендацій
 */
export interface RecommendationParams {
  readonly stains?: string[];
  readonly defects?: string[];
  readonly categoryCode?: ServiceCategoryCode;
  readonly materialType?: string;
}

/**
 * Результат валідації
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
}
