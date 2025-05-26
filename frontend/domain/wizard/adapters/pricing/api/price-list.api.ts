/**
 * @fileoverview API функції для роботи з прайс-листом
 * @module domain/wizard/adapters/pricing/api
 */

import { PricingApiService, PricingPriceListService } from '@/lib/api';

import {
  mapPriceListItemDTOToDomain,
  mapPriceListItemArrayToDomain,
} from '../mappers';

import type {
  WizardPricingOperationResult,
  WizardPriceListItem,
  WizardPriceListSearchParams,
  WizardPriceListSearchResult,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання елемента прайс-листа за ID
 */
export async function getPriceListItemById(
  itemId: string
): Promise<WizardPricingOperationResult<WizardPriceListItem>> {
  try {
    const apiResponse = await PricingPriceListService.getItemById({ itemId });
    const item = mapPriceListItemDTOToDomain(apiResponse);

    return {
      success: true,
      data: item,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати елемент прайс-листа: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання елементів прайс-листа за категорією
 */
export async function getPriceListItemsByCategory(
  categoryCode: string
): Promise<WizardPricingOperationResult<WizardPriceListItem[]>> {
  try {
    const apiResponse = await PricingPriceListService.getItemsByCategoryCode({ categoryCode });
    const items = mapPriceListItemArrayToDomain(apiResponse);

    return {
      success: true,
      data: items,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати прайс-лист для категорії: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Альтернативний метод отримання елементів через PricingApiService
 */
export async function getPriceListItemsByCategoryAlt(
  categoryCode: string
): Promise<WizardPricingOperationResult<WizardPriceListItem[]>> {
  try {
    const apiResponse = await PricingApiService.getItemsByCategoryCode({ categoryCode });
    const items = mapPriceListItemArrayToDomain(apiResponse);

    return {
      success: true,
      data: items,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати прайс-лист (альт): ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Допоміжна функція для фільтрації елементів прайс-листа
 */
function applyFilters(
  items: WizardPriceListItem[],
  params: WizardPriceListSearchParams
): WizardPriceListItem[] {
  let filteredItems = [...items]; // Копіюємо масив, щоб не змінювати оригінал

  // Фільтр за текстом
  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
    );
  }

  // Фільтр за активністю
  if (params.isActive !== undefined) {
    filteredItems = filteredItems.filter((item) => item.isActive === params.isActive);
  }

  // Фільтр за мінімальною ціною
  if (params.minPrice !== undefined && params.minPrice !== null) {
    const minPrice = params.minPrice;
    filteredItems = filteredItems.filter((item) => item.basePrice >= minPrice);
  }

  // Фільтр за максимальною ціною
  if (params.maxPrice !== undefined && params.maxPrice !== null) {
    const maxPrice = params.maxPrice;
    filteredItems = filteredItems.filter((item) => item.basePrice <= maxPrice);
  }

  // Фільтр за одиницею вимірювання
  if (params.unitOfMeasure) {
    filteredItems = filteredItems.filter((item) => item.unitOfMeasure === params.unitOfMeasure);
  }

  return filteredItems;
}

/**
 * Пошук елементів прайс-листа з фільтрацією
 */
export async function searchPriceListItems(
  params: WizardPriceListSearchParams
): Promise<WizardPricingOperationResult<WizardPriceListSearchResult>> {
  try {
    // Якщо категорія не вказана, повертаємо порожній результат
    if (!params.categoryCode) {
      return {
        success: true,
        data: {
          items: [],
          totalCount: 0,
          hasMore: false,
        },
      };
    }

    // Якщо вказана категорія, отримуємо елементи за категорією
    const result = await getPriceListItemsByCategory(params.categoryCode);
    if (!result.success) {
      return {
        success: false,
        error: result.error
      };
    }

    // Застосовуємо фільтри через винесену функцію
    const filteredItems = applyFilters(result.data || [], params);

    return {
      success: true,
      data: {
        items: filteredItems,
        totalCount: filteredItems.length,
        hasMore: false,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Помилка пошуку прайс-листа: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
