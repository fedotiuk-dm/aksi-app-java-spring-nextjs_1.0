/**
 * @fileoverview Головний сервіс для керування основною інформацією про предмет
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/basic-info-manager
 */

import { basicInfoOperationsService } from './basic-info-operations.service';
import { basicInfoValidatorService } from './basic-info-validator.service';
import { priceListManagerService } from './price-list-manager.service';
import { serviceCategoryManagerService } from './service-category-manager.service';

import type {
  BasicInfoConfig,
  BasicInfoFilters,
  BasicInfoOperationResult,
  CreateBasicItemData,
  PriceListItem,
  ServiceCategory,
  UpdateBasicInfoData
} from '../types/basic-info.types';
import type { OrderItem } from '@/domain/wizard/types';


const UNKNOWN_ERROR = 'Невідома помилка при операціях з основною інформацією';

/**
 * Головний сервіс для керування основною інформацією про предмет
 */
export class BasicInfoManagerService {
  private categoryManager = serviceCategoryManagerService;
  private priceListManager = priceListManagerService;
  private validator = basicInfoValidatorService;
  private operations = basicInfoOperationsService;

  private config: BasicInfoConfig = {
    enableCaching: true,
    cacheTimeout: 5 * 60 * 1000, // 5 хвилин
    autoValidation: true
  };

  /**
   * Налаштування сервісу
   * @param config Конфігурація
   */
  configure(config: Partial<BasicInfoConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Встановлення ID замовлення
   * @param orderId ID замовлення
   */
  setOrderId(orderId: string): void {
    this.operations.setOrderId(orderId);
  }

  /**
   * Отримання списку категорій послуг
   * @param forceRefresh Примусове оновлення даних з сервера
   */
  async getServiceCategories(
    forceRefresh = false
  ): Promise<BasicInfoOperationResult<ServiceCategory[]>> {
    try {
      return await this.categoryManager.getActiveCategories();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання категорії за ідентифікатором
   * @param categoryId Ідентифікатор категорії
   */
  async getCategoryById(categoryId: string): Promise<BasicInfoOperationResult<ServiceCategory>> {
    try {
      return await this.categoryManager.getCategoryById(categoryId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання прайс-листа для категорії
   * @param categoryId Ідентифікатор категорії
   * @param forceRefresh Примусове оновлення даних з сервера
   */
  async getPriceListByCategory(
    categoryId: string,
    forceRefresh = false
  ): Promise<BasicInfoOperationResult<PriceListItem[]>> {
    try {
      return await this.priceListManager.getPriceListByCategory(categoryId, forceRefresh);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання елемента прайс-листа за ідентифікатором
   * @param itemId Ідентифікатор елемента прайс-листа
   */
  async getPriceListItem(itemId: string): Promise<BasicInfoOperationResult<PriceListItem>> {
    try {
      return await this.priceListManager.getPriceListItem(itemId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Пошук елементів прайс-листа за фільтрами
   * @param filters Фільтри для пошуку
   */
  async searchPriceList(filters: BasicInfoFilters): Promise<BasicInfoOperationResult<PriceListItem[]>> {
    try {
      return await this.priceListManager.searchPriceList(filters);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Створення нового предмета з базовою інформацією
   * @param data Дані для створення
   * @param skipValidation Пропуск валідації
   */
  async createBasicItem(
    data: CreateBasicItemData,
    skipValidation = false
  ): Promise<BasicInfoOperationResult<OrderItem>> {
    try {
      // Валідація, якщо потрібна
      if (this.config.autoValidation && !skipValidation) {
        const validationResult = await this.validator.validateCreateData(data);

        if (!validationResult.isValid) {
          return {
            success: false,
            error: 'Дані для створення предмета невалідні',
            data: { validationResult }
          };
        }
      }

      // Створення предмета
      return await this.operations.createBasicItem(data);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Оновлення основної інформації існуючого предмета
   * @param itemId Ідентифікатор предмета
   * @param data Дані для оновлення
   * @param skipValidation Пропуск валідації
   */
  async updateBasicInfo(
    itemId: string,
    data: UpdateBasicInfoData,
    skipValidation = false
  ): Promise<BasicInfoOperationResult<OrderItem>> {
    try {
      // Валідація, якщо потрібна
      if (this.config.autoValidation && !skipValidation) {
        const validationResult = await this.validator.validateUpdateData(data);

        if (!validationResult.isValid) {
          return {
            success: false,
            error: 'Дані для оновлення предмета невалідні',
            data: { validationResult }
          };
        }
      }

      // Оновлення предмета
      return await this.operations.updateBasicInfo(itemId, data);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Розрахунок базової ціни для предмета
   * @param priceListItemId Ідентифікатор елемента прайс-листа
   * @param quantity Кількість
   */
  async calculateBasePrice(
    priceListItemId: string,
    quantity: number
  ): Promise<BasicInfoOperationResult<number>> {
    try {
      return await this.operations.calculateBasePrice(priceListItemId, quantity);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання дати виконання для категорії
   * @param categoryId Ідентифікатор категорії
   * @param isExpedited Чи потрібне термінове виконання
   */
  async getCompletionDate(
    categoryId: string,
    isExpedited: boolean
  ): Promise<BasicInfoOperationResult<Date>> {
    try {
      return await this.operations.getCompletionDate(categoryId, isExpedited);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Очищення кешу
   */
  clearCache(): void {
    this.categoryManager.clearCache();
    this.priceListManager.clearCache();
  }
}

// Єдиний екземпляр сервісу для використання в додатку
export const basicInfoManagerService = new BasicInfoManagerService();
