/**
 * @fileoverview Інтерфейси для сервісів роботи з основною інформацією про предмет
 * @module domain/wizard/services/stage-3-item-management/basic-info/interfaces
 */

import type {
  ServiceCategory,
  PriceListItem,
  BasicInfoOperationResult,
  BasicInfoFilters,
  BasicInfoValidationResult,
  CreateBasicItemData,
  UpdateBasicInfoData
} from '../types/basic-info.types';
import type { OrderItem } from '@/domain/wizard/types';

/**
 * Інтерфейс для сервісу завантаження основних даних для предмета
 */
export interface IBasicInfoLoaderService {
  /**
   * Отримання списку категорій послуг
   */
  loadServiceCategories(): Promise<BasicInfoOperationResult<ServiceCategory[]>>;

  /**
   * Отримання прайс-листа для вибраної категорії
   * @param categoryId Ідентифікатор категорії
   */
  loadPriceListByCategory(categoryId: string): Promise<BasicInfoOperationResult<PriceListItem[]>>;

  /**
   * Отримання елемента прайс-листа за ідентифікатором
   * @param itemId Ідентифікатор елемента прайс-листа
   */
  getPriceListItem(itemId: string): Promise<BasicInfoOperationResult<PriceListItem>>;

  /**
   * Пошук елементів прайс-листа за фільтрами
   * @param filters Фільтри для пошуку
   */
  searchPriceList(filters: BasicInfoFilters): Promise<BasicInfoOperationResult<PriceListItem[]>>;
}

/**
 * Інтерфейс для сервісу валідації основної інформації про предмет
 */
export interface IBasicInfoValidatorService {
  /**
   * Валідація даних для створення нового предмета
   * @param data Дані для створення
   */
  validateCreateData(data: CreateBasicItemData): Promise<BasicInfoValidationResult>;

  /**
   * Валідація даних для оновлення предмета
   * @param data Дані для оновлення
   */
  validateUpdateData(data: UpdateBasicInfoData): Promise<BasicInfoValidationResult>;

  /**
   * Перевірка коректності кількості для вибраної одиниці виміру
   * @param quantity Кількість
   * @param unitOfMeasure Одиниця виміру
   */
  validateQuantity(quantity: number, unitOfMeasure: string): BasicInfoValidationResult;

  /**
   * Перевірка наявності категорії
   * @param categoryId Ідентифікатор категорії
   * @param categories Список категорій
   */
  isCategoryValid(categoryId: string, categories: ServiceCategory[]): boolean;

  /**
   * Перевірка наявності елемента прайс-листа
   * @param itemId Ідентифікатор елемента прайс-листа
   * @param priceListItems Список елементів прайс-листа
   */
  isPriceListItemValid(itemId: string, priceListItems: PriceListItem[]): boolean;
}

/**
 * Інтерфейс для сервісу операцій з основною інформацією про предмет
 */
export interface IBasicInfoOperationsService {
  /**
   * Створення нового предмета з базовою інформацією
   * @param data Дані для створення
   */
  createBasicItem(data: CreateBasicItemData): Promise<BasicInfoOperationResult<OrderItem>>;

  /**
   * Оновлення основної інформації існуючого предмета
   * @param itemId Ідентифікатор предмета
   * @param data Дані для оновлення
   */
  updateBasicInfo(itemId: string, data: UpdateBasicInfoData): Promise<BasicInfoOperationResult<OrderItem>>;

  /**
   * Розрахунок базової ціни для предмета
   * @param priceListItemId Ідентифікатор елемента прайс-листа
   * @param quantity Кількість
   */
  calculateBasePrice(priceListItemId: string, quantity: number): Promise<BasicInfoOperationResult<number>>;

  /**
   * Отримання дати виконання для категорії
   * @param categoryId Ідентифікатор категорії
   * @param isExpedited Чи потрібне термінове виконання
   */
  getCompletionDate(categoryId: string, isExpedited: boolean): Promise<BasicInfoOperationResult<Date>>;
}
