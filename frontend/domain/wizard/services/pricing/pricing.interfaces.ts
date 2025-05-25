/**
 * @fileoverview Інтерфейси сервісів ціноутворення
 * @module domain/wizard/services/pricing/interfaces
 */

import type { BaseService, OperationResult, ValidationOperationResult } from '../interfaces';

/**
 * Доменна модель розрахунку ціни
 */
export interface PriceCalculationDomain {
  basePrice: number;
  modifiers: PriceModifierDomain[];
  discounts: PriceDiscountDomain[];
  totalPrice: number;
  breakdown: PriceBreakdownDomain;
}

/**
 * Доменна модель модифікатора ціни
 */
export interface PriceModifierDomain {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED' | 'MULTIPLIER';
  value: number;
  appliedAmount: number;
  category?: string;
  description?: string;
}

/**
 * Доменна модель знижки
 */
export interface PriceDiscountDomain {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  appliedAmount: number;
  conditions?: string[];
}

/**
 * Доменна модель деталізації ціни
 */
export interface PriceBreakdownDomain {
  basePrice: number;
  modifiersTotal: number;
  discountsTotal: number;
  subtotal: number;
  finalPrice: number;
  steps: PriceCalculationStepDomain[];
}

/**
 * Доменна модель кроку розрахунку
 */
export interface PriceCalculationStepDomain {
  stepNumber: number;
  description: string;
  operation: 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE';
  value: number;
  runningTotal: number;
}

/**
 * Запит на розрахунок ціни
 */
export interface PriceCalculationRequest {
  serviceId: string;
  quantity: number;
  unitOfMeasure: 'PIECE' | 'KG';
  modifierIds: string[];
  discountType?: 'EVERCARD' | 'SOCIAL' | 'MILITARY' | 'OTHER';
  discountValue?: number;
  expediteType?: 'STANDARD' | 'EXPRESS_48H' | 'EXPRESS_24H';
  itemSpecifics?: {
    material?: string;
    color?: string;
    wearDegree?: string;
    hasStains?: boolean;
    hasDefects?: boolean;
  };
}

/**
 * Доменна модель елемента прайс-листа
 */
export interface PriceListItemDomain {
  id: string;
  serviceId: string;
  serviceName: string;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  unitOfMeasure: 'PIECE' | 'KG';
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Доменна модель категорії послуг
 */
export interface ServiceCategoryDomain {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Інтерфейс сервісу розрахунку цін
 */
export interface IPriceCalculationService extends BaseService {
  calculatePrice(
    request: PriceCalculationRequest
  ): Promise<OperationResult<PriceCalculationDomain>>;
  validateCalculationRequest(
    request: PriceCalculationRequest
  ): ValidationOperationResult<PriceCalculationRequest>;
  recalculateWithModifiers(
    baseCalculation: PriceCalculationDomain,
    modifierIds: string[]
  ): Promise<OperationResult<PriceCalculationDomain>>;
  applyDiscount(
    calculation: PriceCalculationDomain,
    discountType: string,
    discountValue?: number
  ): Promise<OperationResult<PriceCalculationDomain>>;
}

/**
 * Інтерфейс сервісу модифікаторів цін
 */
export interface IPriceModifierService extends BaseService {
  getAvailableModifiers(serviceId: string): Promise<OperationResult<PriceModifierDomain[]>>;
  getModifierById(id: string): Promise<OperationResult<PriceModifierDomain | null>>;
  validateModifierCombination(modifierIds: string[]): Promise<OperationResult<boolean>>;
  calculateModifierImpact(
    basePrice: number,
    modifierIds: string[]
  ): Promise<OperationResult<{ total: number; breakdown: PriceModifierDomain[] }>>;
}

/**
 * Інтерфейс сервісу прайс-листа
 */
export interface IPriceListService extends BaseService {
  getPriceListItems(categoryId?: string): Promise<OperationResult<PriceListItemDomain[]>>;
  getPriceListItemById(id: string): Promise<OperationResult<PriceListItemDomain | null>>;
  searchPriceListItems(query: string): Promise<OperationResult<PriceListItemDomain[]>>;
  getServiceCategories(): Promise<OperationResult<ServiceCategoryDomain[]>>;
  getCategoryById(id: string): Promise<OperationResult<ServiceCategoryDomain | null>>;
}

/**
 * Інтерфейс сервісу знижок
 */
export interface IPriceDiscountService extends BaseService {
  getAvailableDiscounts(): Promise<OperationResult<PriceDiscountDomain[]>>;
  validateDiscountEligibility(
    discountType: string,
    serviceIds: string[]
  ): Promise<OperationResult<boolean>>;
  calculateDiscountAmount(
    discountType: string,
    totalAmount: number,
    discountValue?: number
  ): Promise<OperationResult<number>>;
}

/**
 * Інтерфейс сервісу валідації цін
 */
export interface IPriceValidationService extends BaseService {
  validatePriceCalculation(
    calculation: PriceCalculationDomain
  ): ValidationOperationResult<PriceCalculationDomain>;
  validateBusinessRules(
    request: PriceCalculationRequest
  ): ValidationOperationResult<PriceCalculationRequest>;
  checkPriceConsistency(
    calculations: PriceCalculationDomain[]
  ): Promise<OperationResult<{ isConsistent: boolean; issues: string[] }>>;
}
