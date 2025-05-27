/**
 * @fileoverview Сервіс для завантаження даних дефектів та ризиків
 * @module domain/wizard/services/stage-3-item-management/defects-and-risks/services/defects-risks-loader.service
 */

import {
  DefectTypesService,
  DefectLocationsService,
  StainTypesService,
  RiskTypesService,
} from '@/lib/api';

import { IDefectsRisksLoader } from '../interfaces';
import {
  DefectsRisksFilters,
  DefectsRisksLoadingState,
  DefectsRisksOperationResult,
  DefectLocation,
  DefectType,
  RiskType,
  StainType,
} from '../types';

/**
 * Сервіс для завантаження дефектів та ризиків
 */
export class DefectsRisksLoaderService implements IDefectsRisksLoader {
  private stainTypeCache: Map<string, StainType[]> = new Map();
  private defectTypeCache: Map<string, DefectType[]> = new Map();
  private riskTypeCache: Map<string, RiskType[]> = new Map();
  private defectLocationCache: Map<string, DefectLocation[]> = new Map();
  private loadingState: DefectsRisksLoadingState = {
    stainTypes: false,
    defectTypes: false,
    riskTypes: false,
    defectLocations: false,
  };

  /**
   * Створити кеш-ключ на основі фільтрів
   * @param filters Фільтри
   * @returns Кеш-ключ
   */
  private createCacheKey(filters?: DefectsRisksFilters): string {
    if (!filters) return 'all';

    const { categoryId, materialId, searchTerm, active } = filters;
    return `${categoryId || ''}_${materialId || ''}_${searchTerm || ''}_${active !== undefined ? active.toString() : ''}`;
  }

  /**
   * Отримати типи плям
   * @param filters Фільтри для пошуку
   * @returns Обіцянка з результатом операції
   */
  async getStainTypes(
    filters?: DefectsRisksFilters
  ): Promise<DefectsRisksOperationResult<StainType[]>> {
    try {
      const cacheKey = this.createCacheKey(filters);

      if (this.stainTypeCache.has(cacheKey)) {
        return {
          success: true,
          data: this.stainTypeCache.get(cacheKey)!,
        };
      }

      this.loadingState.stainTypes = true;

      const params: any = {};
      if (filters?.active !== undefined) params.active = filters.active;
      if (filters?.searchTerm) params.name = filters.searchTerm;
      if (filters?.categoryId) params.categoryId = filters.categoryId;
      if (filters?.materialId) params.materialId = filters.materialId;

      const response = await StainTypesService.getAllStainTypes(params);

      const stainTypes = response.data.map((item) => ({
        id: item.id!,
        code: item.code!,
        name: item.name!,
        description: item.description,
        active: item.active || false,
        sortOrder: item.sortOrder,
      }));

      this.stainTypeCache.set(cacheKey, stainTypes);
      this.loadingState.stainTypes = false;

      return {
        success: true,
        data: stainTypes,
      };
    } catch (error: any) {
      this.loadingState.stainTypes = false;

      return {
        success: false,
        error: error.message || 'Помилка завантаження типів плям',
      };
    }
  }

  /**
   * Отримати типи дефектів
   * @param filters Фільтри для пошуку
   * @returns Обіцянка з результатом операції
   */
  async getDefectTypes(
    filters?: DefectsRisksFilters
  ): Promise<DefectsRisksOperationResult<DefectType[]>> {
    try {
      const cacheKey = this.createCacheKey(filters);

      if (this.defectTypeCache.has(cacheKey)) {
        return {
          success: true,
          data: this.defectTypeCache.get(cacheKey)!,
        };
      }

      this.loadingState.defectTypes = true;

      const params: any = {};
      if (filters?.active !== undefined) params.active = filters.active;
      if (filters?.searchTerm) params.name = filters.searchTerm;
      if (filters?.categoryId) params.categoryId = filters.categoryId;
      if (filters?.materialId) params.materialId = filters.materialId;

      const response = await DefectTypesService.getAllDefectTypes(params);

      const defectTypes = response.data.map((item) => ({
        id: item.id!,
        code: item.code!,
        name: item.name!,
        description: item.description,
        active: item.active || false,
        sortOrder: item.sortOrder,
      }));

      this.defectTypeCache.set(cacheKey, defectTypes);
      this.loadingState.defectTypes = false;

      return {
        success: true,
        data: defectTypes,
      };
    } catch (error: any) {
      this.loadingState.defectTypes = false;

      return {
        success: false,
        error: error.message || 'Помилка завантаження типів дефектів',
      };
    }
  }

  /**
   * Отримати типи ризиків
   * @param filters Фільтри для пошуку
   * @returns Обіцянка з результатом операції
   */
  async getRiskTypes(
    filters?: DefectsRisksFilters
  ): Promise<DefectsRisksOperationResult<RiskType[]>> {
    try {
      const cacheKey = this.createCacheKey(filters);

      if (this.riskTypeCache.has(cacheKey)) {
        return {
          success: true,
          data: this.riskTypeCache.get(cacheKey)!,
        };
      }

      this.loadingState.riskTypes = true;

      const params: any = {};
      if (filters?.active !== undefined) params.active = filters.active;
      if (filters?.searchTerm) params.name = filters.searchTerm;
      if (filters?.categoryId) params.categoryId = filters.categoryId;
      if (filters?.materialId) params.materialId = filters.materialId;

      const response = await RiskTypesService.getAllRiskTypes(params);

      const riskTypes = response.data.map((item) => ({
        id: item.id!,
        code: item.code!,
        name: item.name!,
        description: item.description,
        active: item.active || false,
        sortOrder: item.sortOrder,
      }));

      this.riskTypeCache.set(cacheKey, riskTypes);
      this.loadingState.riskTypes = false;

      return {
        success: true,
        data: riskTypes,
      };
    } catch (error: any) {
      this.loadingState.riskTypes = false;

      return {
        success: false,
        error: error.message || 'Помилка завантаження типів ризиків',
      };
    }
  }

  /**
   * Отримати розташування дефектів
   * @param filters Фільтри для пошуку
   * @returns Обіцянка з результатом операції
   */
  async getDefectLocations(
    filters?: DefectsRisksFilters
  ): Promise<DefectsRisksOperationResult<DefectLocation[]>> {
    try {
      const cacheKey = this.createCacheKey(filters);

      if (this.defectLocationCache.has(cacheKey)) {
        return {
          success: true,
          data: this.defectLocationCache.get(cacheKey)!,
        };
      }

      this.loadingState.defectLocations = true;

      const params: any = {};
      if (filters?.active !== undefined) params.active = filters.active;
      if (filters?.searchTerm) params.name = filters.searchTerm;

      const response = await DefectLocationsService.getAllDefectLocations(params);

      const defectLocations = response.data.map((item) => ({
        id: item.id!,
        code: item.code!,
        name: item.name!,
        active: item.active || false,
        sortOrder: item.sortOrder,
      }));

      this.defectLocationCache.set(cacheKey, defectLocations);
      this.loadingState.defectLocations = false;

      return {
        success: true,
        data: defectLocations,
      };
    } catch (error: any) {
      this.loadingState.defectLocations = false;

      return {
        success: false,
        error: error.message || 'Помилка завантаження розташувань дефектів',
      };
    }
  }

  /**
   * Отримати стан завантаження
   * @returns Стан завантаження
   */
  getLoadingState(): DefectsRisksLoadingState {
    return { ...this.loadingState };
  }

  /**
   * Очистити кеш
   */
  clearCache(): void {
    this.stainTypeCache.clear();
    this.defectTypeCache.clear();
    this.riskTypeCache.clear();
    this.defectLocationCache.clear();
  }
}
