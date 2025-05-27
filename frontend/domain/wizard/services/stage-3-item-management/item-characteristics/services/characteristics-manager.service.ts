/**
 * @fileoverview Головний сервіс для керування характеристиками предметів
 * @module domain/wizard/services/stage-3-item-management/item-characteristics/services/characteristics-manager
 */

import { characteristicsLoaderService } from './characteristics-loader.service';
import { characteristicsOperationsService } from './characteristics-operations.service';
import { characteristicsValidatorService } from './characteristics-validator.service';
import { ICharacteristicsManagerService } from '../interfaces/item-characteristics.interfaces';

import type {
  CharacteristicsConfig,
  Material,
  Color,
  FillerType,
  WearDegree,
  CharacteristicsOperationResult,
  ItemCharacteristics,
  UpdateCharacteristicsData
} from '../types/item-characteristics.types';
import type { OrderItem } from '@/domain/wizard/types';

const UNKNOWN_ERROR = 'Невідома помилка при керуванні характеристиками';

/**
 * Головний сервіс для керування характеристиками предметів
 * @implements ICharacteristicsManagerService
 */
export class CharacteristicsManagerService implements ICharacteristicsManagerService {
  private loaderService = characteristicsLoaderService;
  private validatorService = characteristicsValidatorService;
  private operationsService = characteristicsOperationsService;

  // Кеш для даних
  private materialsCache: Map<string, { data: Material[], timestamp: number }> = new Map();
  private colorsCache: { data: Color[], timestamp: number } | null = null;
  private fillerTypesCache: Map<string, { data: FillerType[], timestamp: number }> = new Map();
  private wearDegreesCache: { data: WearDegree[], timestamp: number } | null = null;

  private config: CharacteristicsConfig = {
    enableCaching: true,
    cacheTimeout: 5 * 60 * 1000, // 5 хвилин
    autoValidation: true,
    enableCustomColors: true
  };

  /**
   * Налаштування модуля характеристик
   * @param config Часткова конфігурація
   */
  configure(config: Partial<CharacteristicsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Встановлення ID замовлення
   * @param orderId ID замовлення
   */
  setOrderId(orderId: string): void {
    this.operationsService.setOrderId(orderId);
  }

  /**
   * Отримання матеріалів для категорії
   * @param categoryId Ідентифікатор категорії
   * @param forceRefresh Примусове оновлення кешу
   */
  async getMaterialsForCategory(
    categoryId: string,
    forceRefresh = false
  ): Promise<CharacteristicsOperationResult<Material[]>> {
    try {
      // Перевіряємо кеш, якщо кешування включено
      if (this.config.enableCaching && !forceRefresh) {
        const cacheEntry = this.materialsCache.get(categoryId);
        const now = Date.now();

        if (cacheEntry && (now - cacheEntry.timestamp < this.config.cacheTimeout)) {
          return {
            success: true,
            data: cacheEntry.data
          };
        }
      }

      // Завантажуємо матеріали
      const result = await this.loaderService.loadMaterials(categoryId);

      if (!result.success) {
        return result;
      }

      // Зберігаємо в кеш, якщо кешування включено
      if (this.config.enableCaching) {
        this.materialsCache.set(categoryId, {
          data: result.data || [],
          timestamp: Date.now()
        });
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання всіх кольорів
   * @param forceRefresh Примусове оновлення кешу
   */
  async getAllColors(
    forceRefresh = false
  ): Promise<CharacteristicsOperationResult<Color[]>> {
    try {
      // Перевіряємо кеш, якщо кешування включено
      if (this.config.enableCaching && !forceRefresh && this.colorsCache) {
        const now = Date.now();

        if (now - this.colorsCache.timestamp < this.config.cacheTimeout) {
          return {
            success: true,
            data: this.colorsCache.data
          };
        }
      }

      // Завантажуємо кольори
      const result = await this.loaderService.loadColors();

      if (!result.success) {
        return result;
      }

      // Зберігаємо в кеш, якщо кешування включено
      if (this.config.enableCaching) {
        this.colorsCache = {
          data: result.data || [],
          timestamp: Date.now()
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання базових кольорів для швидкого вибору
   */
  async getBasicColors(): Promise<CharacteristicsOperationResult<Color[]>> {
    try {
      const colorsResult = await this.getAllColors();

      if (!colorsResult.success) {
        return colorsResult;
      }

      // Фільтруємо тільки базові кольори
      const basicColors = colorsResult.data?.filter(color => color.isBasic) || [];

      return {
        success: true,
        data: basicColors
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання типів наповнювачів для категорії
   * @param categoryId Ідентифікатор категорії
   * @param forceRefresh Примусове оновлення кешу
   */
  async getFillerTypesForCategory(
    categoryId: string,
    forceRefresh = false
  ): Promise<CharacteristicsOperationResult<FillerType[]>> {
    try {
      // Перевіряємо кеш, якщо кешування включено
      if (this.config.enableCaching && !forceRefresh) {
        const cacheEntry = this.fillerTypesCache.get(categoryId);
        const now = Date.now();

        if (cacheEntry && (now - cacheEntry.timestamp < this.config.cacheTimeout)) {
          return {
            success: true,
            data: cacheEntry.data
          };
        }
      }

      // Завантажуємо типи наповнювачів
      const result = await this.loaderService.loadFillerTypes(categoryId);

      if (!result.success) {
        return result;
      }

      // Зберігаємо в кеш, якщо кешування включено
      if (this.config.enableCaching) {
        this.fillerTypesCache.set(categoryId, {
          data: result.data || [],
          timestamp: Date.now()
        });
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання всіх ступенів зносу
   * @param forceRefresh Примусове оновлення кешу
   */
  async getAllWearDegrees(
    forceRefresh = false
  ): Promise<CharacteristicsOperationResult<WearDegree[]>> {
    try {
      // Перевіряємо кеш, якщо кешування включено
      if (this.config.enableCaching && !forceRefresh && this.wearDegreesCache) {
        const now = Date.now();

        if (now - this.wearDegreesCache.timestamp < this.config.cacheTimeout) {
          return {
            success: true,
            data: this.wearDegreesCache.data
          };
        }
      }

      // Завантажуємо ступені зносу
      const result = await this.loaderService.loadWearDegrees();

      if (!result.success) {
        return result;
      }

      // Зберігаємо в кеш, якщо кешування включено
      if (this.config.enableCaching) {
        this.wearDegreesCache = {
          data: result.data || [],
          timestamp: Date.now()
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання характеристик предмета
   * @param itemId Ідентифікатор предмета
   */
  async getItemCharacteristics(
    itemId: string
  ): Promise<CharacteristicsOperationResult<ItemCharacteristics>> {
    try {
      return await this.operationsService.getItemCharacteristics(itemId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Оновлення характеристик предмета
   * @param itemId Ідентифікатор предмета
   * @param data Дані для оновлення
   * @param skipValidation Пропуск валідації
   */
  async updateItemCharacteristics(
    itemId: string,
    data: UpdateCharacteristicsData,
    skipValidation = false
  ): Promise<CharacteristicsOperationResult<OrderItem>> {
    try {
      // Отримуємо поточний предмет для отримання категорії
      const currentItem = await this.operationsService.getItemCharacteristics(itemId);

      if (!currentItem.success) {
        return {
          success: false,
          error: `Не вдалося отримати поточні характеристики: ${currentItem.error}`
        };
      }

      // Об'єднуємо поточні характеристики з новими для валідації
      const combinedCharacteristics: ItemCharacteristics = {
        ...currentItem.data,
        ...data
      };

      // Отримуємо itemId для отримання категорії
      const itemResult = await this.operationsService['orderItemAdapter'].getOrderItem(itemId);

      if (!itemResult.success || !itemResult.data) {
        return {
          success: false,
          error: `Не вдалося отримати інформацію про предмет: ${itemResult.error}`
        };
      }

      const categoryId = itemResult.data.categoryId;

      // Валідація, якщо потрібна
      if (this.config.autoValidation && !skipValidation) {
        const validationResult = await this.validatorService.validateCharacteristics(
          combinedCharacteristics,
          categoryId
        );

        if (!validationResult.isValid) {
          return {
            success: false,
            error: 'Дані характеристик невалідні',
            data: { validationResult }
          };
        }
      }

      // Оновлення характеристик
      return await this.operationsService.updateItemCharacteristics(itemId, data);
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
    this.materialsCache.clear();
    this.colorsCache = null;
    this.fillerTypesCache.clear();
    this.wearDegreesCache = null;
  }
}

// Єдиний екземпляр сервісу для використання в додатку
export const characteristicsManagerService = new CharacteristicsManagerService();
