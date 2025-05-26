/**
 * @fileoverview API функції для роботи з категоріями послуг
 * @module domain/wizard/adapters/pricing/api
 */

import { PriceListService } from '@/lib/api';

import { mapServiceCategoryDTOToDomain, mapServiceCategoryArrayToDomain } from '../mappers';

/**
 * Інтерфейс для API відповіді з категоріями послуг
 */
interface ServiceCategoryApiResponse extends Record<string, unknown> {}

import type { WizardPricingOperationResult, WizardServiceCategory } from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання всіх категорій послуг
 */
export async function getAllServiceCategories(): Promise<
  WizardPricingOperationResult<WizardServiceCategory[]>
> {
  try {
    const apiResponse = await PriceListService.getAllCategories();
    const categories = mapServiceCategoryArrayToDomain(apiResponse as ServiceCategoryApiResponse[]);

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати категорії: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання активних категорій послуг (фільтрація на клієнті)
 */
export async function getActiveServiceCategories(): Promise<
  WizardPricingOperationResult<WizardServiceCategory[]>
> {
  try {
    const result = await getAllServiceCategories();
    if (!result.success) {
      return result;
    }

    // Фільтруємо активні категорії на клієнті
    const activeCategories = result.data?.filter((category) => category.isActive) || [];

    return {
      success: true,
      data: activeCategories,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати активні категорії: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання категорії за ID
 */
export async function getServiceCategoryById(
  id: string
): Promise<WizardPricingOperationResult<WizardServiceCategory>> {
  try {
    const apiResponse = await PriceListService.getCategoryById1({ categoryId: id });
    const category = mapServiceCategoryDTOToDomain(apiResponse as ServiceCategoryApiResponse);

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати категорію: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання категорії за кодом
 */
export async function getServiceCategoryByCode(
  code: string
): Promise<WizardPricingOperationResult<WizardServiceCategory>> {
  try {
    const apiResponse = await PriceListService.getCategoryByCode1({ code });
    const category = mapServiceCategoryDTOToDomain(apiResponse as ServiceCategoryApiResponse);

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати категорію за кодом: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання одиниць вимірювання для категорії
 */
export async function getUnitsOfMeasureForCategory(
  categoryId: string
): Promise<WizardPricingOperationResult<string[]>> {
  try {
    const apiResponse = await PriceListService.getAvailableUnitsOfMeasure({ categoryId });

    return {
      success: true,
      data: (apiResponse as string[]) || [],
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати одиниці вимірювання: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання назв предметів для категорії
 */
export async function getItemNamesForCategory(
  categoryId: string
): Promise<WizardPricingOperationResult<string[]>> {
  try {
    const apiResponse = await PriceListService.getItemNamesByCategory({ categoryId });

    return {
      success: true,
      data: (apiResponse as string[]) || [],
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати назви предметів: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
