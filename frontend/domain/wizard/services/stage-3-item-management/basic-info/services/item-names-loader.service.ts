/**
 * @fileoverview Сервіс завантаження предметів з прайсу
 * @module domain/wizard/services/stage-3-item-management/basic-info/services/item-names-loader
 */

import { getPriceListItemsByCategory } from '../../../../adapters/pricing/api';
import { BASIC_INFO_LOADER_ERRORS } from '../constants/basic-info-loader.errors';
import {
  itemNameApiResponseSchema,
  type ItemNameApiResponse,
} from '../schemas/api-responses.schemas';
import { ServiceCategory } from '../types/service-categories.types';
import { mapItemNameApiToDomain } from '../utils/api-mappers.utils';

import type { WizardPriceListItem } from '../../../../adapters/pricing/types';
import type { BasicInfoOperationResult } from '../types';
import type { ItemNameOption } from '../types/basic-info-state.types';

/**
 * Сервіс для завантаження предметів з прайсу
 */
export class ItemNamesLoaderService {
  /**
   * Завантаження предметів з прайсу за категорією
   */
  async loadItemsByCategory(
    categoryId: string
  ): Promise<BasicInfoOperationResult<ItemNameOption[]>> {
    try {
      if (!this.validateCategoryId(categoryId)) {
        return { success: false, error: BASIC_INFO_LOADER_ERRORS.INVALID_CATEGORY_ID };
      }

      const adapterResult = await getPriceListItemsByCategory(categoryId);
      if (!adapterResult.success || !adapterResult.data) {
        return {
          success: false,
          error: adapterResult.error || BASIC_INFO_LOADER_ERRORS.LOAD_ITEMS_FAILED,
        };
      }

      return this.processAndValidateItems(adapterResult.data);
    } catch (error) {
      return this.handleError(error, BASIC_INFO_LOADER_ERRORS.LOAD_ITEMS_FAILED);
    }
  }

  /**
   * Пошук предметів за назвою в межах категорії
   */
  async searchItems(
    query: string,
    categoryId: string
  ): Promise<BasicInfoOperationResult<ItemNameOption[]>> {
    try {
      if (!this.validateSearchQuery(query)) {
        return { success: false, error: BASIC_INFO_LOADER_ERRORS.INVALID_SEARCH_QUERY };
      }

      if (!this.validateCategoryId(categoryId)) {
        return { success: false, error: BASIC_INFO_LOADER_ERRORS.INVALID_CATEGORY_ID };
      }

      const adapterResult = await getPriceListItemsByCategory(categoryId);
      if (!adapterResult.success || !adapterResult.data) {
        return {
          success: false,
          error: adapterResult.error || BASIC_INFO_LOADER_ERRORS.SEARCH_ITEMS_FAILED,
        };
      }

      // Фільтруємо результати за запитом
      const filteredItems = adapterResult.data.filter(
        (item: WizardPriceListItem) =>
          item.name && item.name.toLowerCase().includes(query.toLowerCase())
      );

      return this.processAndValidateItems(filteredItems);
    } catch (error) {
      return this.handleError(error, BASIC_INFO_LOADER_ERRORS.SEARCH_ITEMS_FAILED);
    }
  }

  /**
   * Приватні методи
   */
  private validateCategoryId(categoryId: string): boolean {
    return Boolean(
      categoryId && Object.values(ServiceCategory).includes(categoryId as ServiceCategory)
    );
  }

  private validateSearchQuery(query: string): boolean {
    return Boolean(query && typeof query === 'string' && query.trim().length >= 2);
  }

  private processAndValidateItems(
    data: WizardPriceListItem[]
  ): BasicInfoOperationResult<ItemNameOption[]> {
    // Конвертуємо WizardPriceListItem в ItemNameApiResponse для валідації
    const convertedItems: ItemNameApiResponse[] = data.map((item) => ({
      id: item.id,
      name: item.name,
      basePrice: item.basePrice,
      categoryId: item.categoryId,
      categoryCode: item.categoryCode,
      unitOfMeasure: item.unitOfMeasure,
      catalogNumber: parseInt(item.itemNumber) || undefined,
      active: item.isActive,
    }));

    return this.validateItems(convertedItems);
  }

  private validateItems(data: ItemNameApiResponse[]): BasicInfoOperationResult<ItemNameOption[]> {
    const validationResults = data.map((item) => itemNameApiResponseSchema.safeParse(item));
    const invalidItems = validationResults.filter((result) => !result.success);

    if (invalidItems.length > 0) {
      console.warn(BASIC_INFO_LOADER_ERRORS.VALIDATION_FAILED, invalidItems);
    }

    const validItems = validationResults
      .filter((result) => result.success)
      .map((result) => mapItemNameApiToDomain(result.data));

    return { success: true, data: validItems };
  }

  private handleError<T>(error: unknown, defaultMessage: string): BasicInfoOperationResult<T> {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    console.error('Помилка завантаження предметів:', error);
    return { success: false, error: errorMessage };
  }
}

// Експортуємо singleton екземпляр
export const itemNamesLoaderService = new ItemNamesLoaderService();
