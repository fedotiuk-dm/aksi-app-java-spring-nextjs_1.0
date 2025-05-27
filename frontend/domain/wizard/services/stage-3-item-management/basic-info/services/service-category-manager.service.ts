/**
 * @fileoverview Сервіс для керування категоріями послуг
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/service-category-manager
 */

import { PriceListService } from '@/domain/wizard/adapters/pricing/api';

import type { ServiceCategory, BasicInfoOperationResult } from '../types/basic-info.types';


const UNKNOWN_ERROR = 'Невідома помилка при роботі з категоріями послуг';

/**
 * Сервіс для керування категоріями послуг
 */
export class ServiceCategoryManagerService {
  private priceListAdapter: PriceListService;
  private categories: ServiceCategory[] | null = null;

  constructor() {
    this.priceListAdapter = new PriceListService();
  }

  /**
   * Отримання всіх категорій послуг
   * @param forceRefresh Примусове оновлення даних з сервера
   */
  async getAllCategories(forceRefresh = false): Promise<BasicInfoOperationResult<ServiceCategory[]>> {
    try {
      // Якщо дані вже завантажені і не потрібне оновлення, повертаємо їх
      if (this.categories && !forceRefresh) {
        return {
          success: true,
          data: this.categories
        };
      }

      // Отримуємо категорії через адаптер
      const result = await this.priceListAdapter.getServiceCategories();

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося отримати категорії: ${result.error}`
        };
      }

      // Додаємо додаткові властивості для wizard
      const enhancedCategories = result.data.map(category => ({
        ...category,
        unitOfMeasure: this.determineUnitOfMeasure(category.code),
        standardDeliveryDays: category.standardProcessingDays || 3
      }));

      // Зберігаємо в кеші
      this.categories = enhancedCategories;

      return {
        success: true,
        data: enhancedCategories
      };
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
      // Спочатку перевіряємо локальний кеш
      if (this.categories) {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
          return {
            success: true,
            data: category
          };
        }
      }

      // Якщо немає в кеші, завантажуємо всі категорії
      const categoriesResult = await this.getAllCategories(true);

      if (!categoriesResult.success) {
        return {
          success: false,
          error: categoriesResult.error
        };
      }

      const category = categoriesResult.data?.find(c => c.id === categoryId);

      if (!category) {
        return {
          success: false,
          error: `Категорію з ID ${categoryId} не знайдено`
        };
      }

      return {
        success: true,
        data: category
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання категорії за кодом
   * @param categoryCode Код категорії
   */
  async getCategoryByCode(categoryCode: string): Promise<BasicInfoOperationResult<ServiceCategory>> {
    try {
      // Спочатку перевіряємо локальний кеш
      if (this.categories) {
        const category = this.categories.find(c => c.code === categoryCode);
        if (category) {
          return {
            success: true,
            data: category
          };
        }
      }

      // Якщо немає в кеші, завантажуємо всі категорії
      const categoriesResult = await this.getAllCategories(true);

      if (!categoriesResult.success) {
        return {
          success: false,
          error: categoriesResult.error
        };
      }

      const category = categoriesResult.data?.find(c => c.code === categoryCode);

      if (!category) {
        return {
          success: false,
          error: `Категорію з кодом ${categoryCode} не знайдено`
        };
      }

      return {
        success: true,
        data: category
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання тільки активних категорій
   */
  async getActiveCategories(): Promise<BasicInfoOperationResult<ServiceCategory[]>> {
    try {
      const categoriesResult = await this.getAllCategories();

      if (!categoriesResult.success) {
        return {
          success: false,
          error: categoriesResult.error
        };
      }

      const activeCategories = categoriesResult.data?.filter(c => c.active) || [];

      return {
        success: true,
        data: activeCategories
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Очищення кешу категорій
   */
  clearCache(): void {
    this.categories = null;
  }

  /**
   * Визначення одиниці виміру на основі коду категорії
   * @private
   * @param categoryCode Код категорії
   */
  private determineUnitOfMeasure(categoryCode: string): 'pieces' | 'kg' {
    // Тут може бути логіка на основі коду категорії
    // Наприклад, для килимів, ковдр тощо може бути 'kg'
    const kgCategories = ['carpets', 'blankets', 'heavy_textile'];
    return kgCategories.includes(categoryCode) ? 'kg' : 'pieces';
  }
}

// Єдиний екземпляр сервісу для використання в додатку
export const serviceCategoryManagerService = new ServiceCategoryManagerService();
