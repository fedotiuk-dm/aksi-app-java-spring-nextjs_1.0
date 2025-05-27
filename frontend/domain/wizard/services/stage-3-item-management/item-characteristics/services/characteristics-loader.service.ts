/**
 * @fileoverview Сервіс для завантаження характеристик предметів
 * @module domain/wizard/services/stage-3-item-management/item-characteristics/services/characteristics-loader
 */

import { ItemCharacteristicsService } from '@/domain/wizard/adapters/pricing/api';

import { ICharacteristicsLoaderService } from '../interfaces/item-characteristics.interfaces';

import type {
  Material,
  Color,
  FillerType,
  WearDegree,
  CharacteristicsOperationResult,
  CharacteristicsFilters
} from '../types/item-characteristics.types';

const UNKNOWN_ERROR = 'Невідома помилка при завантаженні характеристик';

/**
 * Сервіс для завантаження характеристик предметів
 * @implements ICharacteristicsLoaderService
 */
export class CharacteristicsLoaderService implements ICharacteristicsLoaderService {
  private adapter: ItemCharacteristicsService;

  constructor() {
    this.adapter = new ItemCharacteristicsService();
  }

  /**
   * Отримання списку матеріалів
   * @param categoryId Опційний ідентифікатор категорії для фільтрації
   */
  async loadMaterials(categoryId?: string): Promise<CharacteristicsOperationResult<Material[]>> {
    try {
      const result = await this.adapter.getMaterials(categoryId);

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося завантажити матеріали: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання списку кольорів
   */
  async loadColors(): Promise<CharacteristicsOperationResult<Color[]>> {
    try {
      const result = await this.adapter.getColors();

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося завантажити кольори: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання списку типів наповнювачів
   * @param categoryId Опційний ідентифікатор категорії для фільтрації
   */
  async loadFillerTypes(categoryId?: string): Promise<CharacteristicsOperationResult<FillerType[]>> {
    try {
      const result = await this.adapter.getFillerTypes(categoryId);

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося завантажити типи наповнювачів: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання списку ступенів зносу
   */
  async loadWearDegrees(): Promise<CharacteristicsOperationResult<WearDegree[]>> {
    try {
      const result = await this.adapter.getWearDegrees();

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося завантажити ступені зносу: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Отримання всіх характеристик для категорії
   * @param categoryId Ідентифікатор категорії
   */
  async loadAllCharacteristicsForCategory(categoryId: string): Promise<CharacteristicsOperationResult<{
    materials: Material[];
    colors: Color[];
    fillerTypes: FillerType[];
    wearDegrees: WearDegree[];
  }>> {
    try {
      // Завантажуємо характеристики паралельно для оптимізації
      const [materialsResult, colorsResult, fillerTypesResult, wearDegreesResult] = await Promise.all([
        this.loadMaterials(categoryId),
        this.loadColors(),
        this.loadFillerTypes(categoryId),
        this.loadWearDegrees()
      ]);

      // Перевіряємо успішність завантаження
      if (!materialsResult.success) {
        return {
          success: false,
          error: materialsResult.error
        };
      }

      if (!colorsResult.success) {
        return {
          success: false,
          error: colorsResult.error
        };
      }

      if (!fillerTypesResult.success) {
        return {
          success: false,
          error: fillerTypesResult.error
        };
      }

      if (!wearDegreesResult.success) {
        return {
          success: false,
          error: wearDegreesResult.error
        };
      }

      return {
        success: true,
        data: {
          materials: materialsResult.data || [],
          colors: colorsResult.data || [],
          fillerTypes: fillerTypesResult.data || [],
          wearDegrees: wearDegreesResult.data || []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }

  /**
   * Пошук характеристик за фільтрами
   * @param filters Фільтри для пошуку
   */
  async searchCharacteristics(filters: CharacteristicsFilters): Promise<CharacteristicsOperationResult<{
    materials?: Material[];
    colors?: Color[];
    fillerTypes?: FillerType[];
    wearDegrees?: WearDegree[];
  }>> {
    try {
      // Підготовка запиту до адаптера
      const searchParams = {
        categoryId: filters.categoryId,
        materialCode: filters.materialCode,
        colorCode: filters.colorCode,
        fillerTypeCode: filters.fillerTypeCode,
        searchTerm: filters.searchTerm,
        active: filters.active ?? true
      };

      const result = await this.adapter.searchCharacteristics(searchParams);

      if (!result.success) {
        return {
          success: false,
          error: `Не вдалося виконати пошук характеристик: ${result.error}`
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : UNKNOWN_ERROR
      };
    }
  }
}

// Експортуємо єдиний екземпляр сервісу
export const characteristicsLoaderService = new CharacteristicsLoaderService();
