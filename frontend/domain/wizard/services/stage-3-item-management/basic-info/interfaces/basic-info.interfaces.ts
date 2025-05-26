/**
 * @fileoverview Інтерфейси для управління основною інформацією про предмет
 * @module domain/wizard/services/stage-3-item-management/basic-info/interfaces
 */

import type {
  BasicInfoOperationResult,
  BasicInfoValidationResult,
  CreateBasicItemData,
  UpdateBasicInfoData,
  BasicInfoFilters,
  ServiceCategory,
  PriceListItem,
} from '../types/basic-info.types';
import type { OrderItem } from '@/domain/wizard/types';

/**
 * Інтерфейс для управління категоріями послуг
 */
export interface IServiceCategoryManager {
  // API операції
  loadCategories(): Promise<BasicInfoOperationResult<ServiceCategory[]>>;
  getCategoryById(id: string): Promise<BasicInfoOperationResult<ServiceCategory>>;
  getCategoryByCode(code: string): Promise<BasicInfoOperationResult<ServiceCategory>>;

  // Локальні операції
  getCachedCategories(): ServiceCategory[];
  findCategoryByName(name: string): ServiceCategory | null;
  searchCategories(filters: BasicInfoFilters): ServiceCategory[];

  // Утиліти
  clearCache(): void;
}

/**
 * Інтерфейс для управління прайс-листом
 */
export interface IPriceListManager {
  // API операції
  loadPriceListByCategory(categoryCode: string): Promise<BasicInfoOperationResult<PriceListItem[]>>;
  getPriceListItemById(itemId: string): Promise<BasicInfoOperationResult<PriceListItem>>;

  // Локальні операції
  getCachedPriceList(categoryCode: string): PriceListItem[];
  findPriceListItem(categoryCode: string, itemName: string): PriceListItem | null;
  searchPriceListItems(categoryCode: string, filters: BasicInfoFilters): PriceListItem[];

  // Утиліти
  clearCache(): void;
}

/**
 * Інтерфейс для валідації основної інформації
 */
export interface IBasicInfoValidator {
  validateBasicInfo(itemData: Partial<OrderItem>): BasicInfoValidationResult;
  validateCategorySelection(categoryId: string): BasicInfoValidationResult;
  validatePriceListSelection(priceListItemId: string): BasicInfoValidationResult;
  validateQuantity(quantity: number, unitOfMeasure: string): BasicInfoValidationResult;
  validateCreateData(data: CreateBasicItemData): BasicInfoValidationResult;
}

/**
 * Головний інтерфейс для управління основною інформацією
 */
export interface IBasicInfoManager {
  // Композиція інших менеджерів
  categoryManager: IServiceCategoryManager;
  priceListManager: IPriceListManager;
  validator: IBasicInfoValidator;

  // Основні операції
  createBasicItem(data: CreateBasicItemData): Promise<BasicInfoOperationResult<Partial<OrderItem>>>;
  updateBasicInfo(
    currentItem: Partial<OrderItem>,
    updates: UpdateBasicInfoData
  ): Promise<BasicInfoOperationResult<Partial<OrderItem>>>;

  // Валідація
  validateItem(itemData: Partial<OrderItem>): BasicInfoValidationResult;
  isReadyForNextSubstage(itemData: Partial<OrderItem>): boolean;

  // Утиліти
  clearAllCaches(): void;
}
