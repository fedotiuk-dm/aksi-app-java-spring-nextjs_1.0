/**
 * @fileoverview Сервіс завантаження категорій послуг
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/service-categories-loader
 */

import { getAllServiceCategories } from '../../../../adapters/pricing/api/service-category.api';
import { BASIC_INFO_LOADER_ERRORS } from '../constants/basic-info-loader.errors';
import {
  serviceCategoryApiResponseSchema,
  type ServiceCategoryApiResponse,
} from '../schemas/api-responses.schemas';
import { mapServiceCategoryApiToDomain } from '../utils/api-mappers.utils';

import type { BasicInfoOperationResult } from '../types';
import type { ServiceCategoryInfo } from '../types/service-categories.types';

/**
 * Сервіс для завантаження категорій послуг
 */
export class ServiceCategoriesLoaderService {
  /**
   * Завантаження всіх категорій послуг
   */
  async loadServiceCategories(): Promise<BasicInfoOperationResult<ServiceCategoryInfo[]>> {
    try {
      const adapterResult = await getAllServiceCategories();
      if (!adapterResult.success || !adapterResult.data) {
        return {
          success: false,
          error: adapterResult.error || BASIC_INFO_LOADER_ERRORS.LOAD_CATEGORIES_FAILED,
        };
      }

      return this.validateAndProcessCategories(adapterResult.data);
    } catch (error) {
      return this.handleError(error, BASIC_INFO_LOADER_ERRORS.LOAD_CATEGORIES_FAILED);
    }
  }

  /**
   * Приватні методи
   */
  private validateAndProcessCategories(
    data: ServiceCategoryApiResponse[]
  ): BasicInfoOperationResult<ServiceCategoryInfo[]> {
    const validationResults = data.map((item) => serviceCategoryApiResponseSchema.safeParse(item));
    const invalidItems = validationResults.filter((result) => !result.success);

    if (invalidItems.length > 0) {
      console.warn(BASIC_INFO_LOADER_ERRORS.VALIDATION_FAILED, invalidItems);
    }

    const validCategories = validationResults
      .filter((result) => result.success)
      .map((result) => mapServiceCategoryApiToDomain(result.data));

    return { success: true, data: validCategories };
  }

  private handleError<T>(error: unknown, defaultMessage: string): BasicInfoOperationResult<T> {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    console.error('Помилка завантаження категорій:', error);
    return { success: false, error: errorMessage };
  }
}

// Експортуємо singleton екземпляр
export const serviceCategoriesLoaderService = new ServiceCategoriesLoaderService();
