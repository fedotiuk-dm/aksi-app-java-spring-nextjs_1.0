/**
 * @fileoverview Головний менеджер для управління основною інформацією про предмет
 * @module domain/wizard/services/stage-3-item-management/basic-info/services
 */

import { basicInfoValidatorService } from './basic-info-validator.service';
import { priceListManagerService } from './price-list-manager.service';
import { serviceCategoryManagerService } from './service-category-manager.service';

import type { IBasicInfoManager } from '../interfaces/basic-info.interfaces';
import type {
  BasicInfoOperationResult,
  BasicInfoValidationResult,
  CreateBasicItemData,
  UpdateBasicInfoData,
  ServiceCategory,
  PriceListItem,
} from '../types/basic-info.types';
import type { OrderItem } from '@/domain/wizard/types';

/**
 * Головний менеджер для управління основною інформацією про предмет
 */
export class BasicInfoManagerService implements IBasicInfoManager {
  private readonly UNKNOWN_ERROR = 'Невідома помилка';

  // Композиція сервісів
  public readonly categoryManager = serviceCategoryManagerService;
  public readonly priceListManager = priceListManagerService;
  public readonly validator = basicInfoValidatorService;

  // === Основні операції ===

  /**
   * Створення базового предмета
   */
  async createBasicItem(
    data: CreateBasicItemData
  ): Promise<BasicInfoOperationResult<Partial<OrderItem>>> {
    try {
      // Спочатку валідуємо вхідні дані
      const validation = this.validator.validateCreateData(data);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Помилки валідації: ${validation.errors.join(', ')}`,
        };
      }

      // Отримуємо категорію
      const categoryResult = await this.categoryManager.getCategoryById(data.categoryId);
      if (!categoryResult.success || !categoryResult.data) {
        return {
          success: false,
          error: categoryResult.error || 'Не вдалося отримати категорію',
        };
      }

      // Отримуємо елемент прайс-листа
      const priceListItemResult = await this.priceListManager.getPriceListItemById(
        data.priceListItemId
      );
      if (!priceListItemResult.success || !priceListItemResult.data) {
        return {
          success: false,
          error: priceListItemResult.error || 'Не вдалося отримати елемент прайс-листа',
        };
      }

      const category = categoryResult.data;
      const priceListItem = priceListItemResult.data;

      // Створюємо базовий предмет
      const basicItem: Partial<OrderItem> = {
        category: category.code,
        name: data.customName || priceListItem.name,
        quantity: data.quantity,
        unitOfMeasure: priceListItem.unitOfMeasure,
        basePrice: priceListItem.basePrice,
        finalPrice: priceListItem.basePrice * data.quantity,
        // Додаткові поля будуть заповнені в наступних підетапах
        material: '',
        color: '',
        stains: [],
        defects: [],
        modifiers: [],
        photos: [],
      };

      // Фінальна валідація створеного предмета
      const finalValidation = this.validator.validateBasicInfo(basicItem);
      if (!finalValidation.isValid) {
        return {
          success: false,
          error: `Помилки при створенні предмета: ${finalValidation.errors.join(', ')}`,
        };
      }

      return {
        success: true,
        data: basicItem,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка створення предмета: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Оновлення основної інформації предмета
   */
  async updateBasicInfo(
    currentItem: Partial<OrderItem>,
    updates: UpdateBasicInfoData
  ): Promise<BasicInfoOperationResult<Partial<OrderItem>>> {
    try {
      let updatedItem = { ...currentItem };

      // Оновлення категорії та елемента прайс-листа
      if (updates.categoryId && updates.priceListItemId) {
        // Отримуємо нову категорію
        const categoryResult = await this.categoryManager.getCategoryById(updates.categoryId);
        if (!categoryResult.success || !categoryResult.data) {
          return {
            success: false,
            error: categoryResult.error || 'Не вдалося отримати нову категорію',
          };
        }

        // Отримуємо новий елемент прайс-листа
        const priceListItemResult = await this.priceListManager.getPriceListItemById(
          updates.priceListItemId
        );
        if (!priceListItemResult.success || !priceListItemResult.data) {
          return {
            success: false,
            error: priceListItemResult.error || 'Не вдалося отримати новий елемент прайс-листа',
          };
        }

        const category = categoryResult.data;
        const priceListItem = priceListItemResult.data;

        updatedItem.category = category.code;
        updatedItem.name = updates.customName || priceListItem.name;
        updatedItem.unitOfMeasure = priceListItem.unitOfMeasure;
        updatedItem.basePrice = priceListItem.basePrice;
      }

      // Оновлення кількості
      if (updates.quantity !== undefined) {
        updatedItem.quantity = updates.quantity;
      }

      // Оновлення користувацької назви
      if (updates.customName !== undefined) {
        updatedItem.name = updates.customName;
      }

      // Перерахунок фінальної ціни
      if (updatedItem.basePrice && updatedItem.quantity) {
        updatedItem.finalPrice = updatedItem.basePrice * updatedItem.quantity;
      }

      // Валідація оновленого предмета
      const validation = this.validator.validateBasicInfo(updatedItem);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Помилки валідації: ${validation.errors.join(', ')}`,
        };
      }

      return {
        success: true,
        data: updatedItem,
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка оновлення предмета: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  // === Валідація ===

  /**
   * Валідація предмета
   */
  validateItem(itemData: Partial<OrderItem>): BasicInfoValidationResult {
    return this.validator.validateBasicInfo(itemData);
  }

  /**
   * Перевірка готовності до наступного підетапу
   */
  isReadyForNextSubstage(itemData: Partial<OrderItem>): boolean {
    const validation = this.validateItem(itemData);
    return validation.isValid;
  }

  // === Утиліти ===

  /**
   * Очищення всіх кешів
   */
  clearAllCaches(): void {
    this.categoryManager.clearCache();
    this.priceListManager.clearCache();
  }

  // === Додаткові утилітарні методи ===

  /**
   * Завантаження початкових даних (категорії)
   */
  async loadInitialData(): Promise<
    BasicInfoOperationResult<{
      categories: ServiceCategory[];
    }>
  > {
    try {
      const categoriesResult = await this.categoryManager.loadCategories();
      if (!categoriesResult.success) {
        return {
          success: false,
          error: categoriesResult.error,
        };
      }

      return {
        success: true,
        data: {
          categories: categoriesResult.data || [],
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Помилка завантаження початкових даних: ${error instanceof Error ? error.message : this.UNKNOWN_ERROR}`,
      };
    }
  }

  /**
   * Завантаження прайс-листа для категорії
   */
  async loadPriceListForCategory(
    categoryCode: string
  ): Promise<BasicInfoOperationResult<PriceListItem[]>> {
    return await this.priceListManager.loadPriceListByCategory(categoryCode);
  }

  /**
   * Пошук категорій
   */
  searchCategories(searchTerm: string): ServiceCategory[] {
    return this.categoryManager.searchCategories({ searchTerm });
  }

  /**
   * Пошук елементів прайс-листа
   */
  searchPriceListItems(categoryCode: string, searchTerm: string): PriceListItem[] {
    return this.priceListManager.searchPriceListItems(categoryCode, { searchTerm });
  }

  /**
   * Отримання активних категорій
   */
  getActiveCategories(): ServiceCategory[] {
    return this.categoryManager.getActiveCategories();
  }

  /**
   * Отримання активних елементів прайс-листа
   */
  getActivePriceListItems(categoryCode: string): PriceListItem[] {
    return this.priceListManager.getActivePriceListItems(categoryCode);
  }

  /**
   * Отримання діапазону цін для категорії
   */
  getPriceRange(categoryCode: string): { min: number; max: number } | null {
    return this.priceListManager.getPriceRange(categoryCode);
  }

  /**
   * Перевірка чи категорія має елементи прайс-листа
   */
  categoryHasPriceList(categoryCode: string): boolean {
    return this.priceListManager.getCacheSize(categoryCode) > 0;
  }

  /**
   * Отримання статистики кешу
   */
  getCacheStats(): {
    categories: number;
    priceListCategories: number;
  } {
    return {
      categories: this.categoryManager.getCacheSize(),
      priceListCategories: this.priceListManager.getCachedCategories().length,
    };
  }
}

// Експорт екземпляра сервісу (Singleton)
export const basicInfoManagerService = new BasicInfoManagerService();
