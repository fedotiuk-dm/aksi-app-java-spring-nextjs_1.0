/**
 * @fileoverview API функції для роботи з категоріями послуг
 * @module domain/wizard/adapters/pricing/api
 */

import { PricingApiService } from '@/lib/api';

import {
  mapServiceCategoryDTOToDomain,
  mapServiceCategoryArrayToDomain,
} from '../mappers';

import type {
  WizardPricingOperationResult,
  WizardServiceCategory,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання всіх категорій послуг
 */
export async function getAllServiceCategories(): Promise<
  WizardPricingOperationResult<WizardServiceCategory[]>
> {
  try {
    const apiResponse = await PricingApiService.getAllCategories();
    const categories = mapServiceCategoryArrayToDomain(apiResponse);

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
 * Отримання активних категорій послуг
 */
export async function getActiveServiceCategories(): Promise<
  WizardPricingOperationResult<WizardServiceCategory[]>
> {
  try {
    const apiResponse = await PricingApiService.getActiveCategories();
    const categories = mapServiceCategoryArrayToDomain(apiResponse);

    return {
      success: true,
      data: categories,
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
    const apiResponse = await PricingApiService.getCategoryById({ id });
    const category = mapServiceCategoryDTOToDomain(apiResponse);

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
    const apiResponse = await PricingApiService.getCategoryByCode({ code });
    const category = mapServiceCategoryDTOToDomain(apiResponse);

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
 * Отримання матеріалів для категорії
 */
export async function getMaterialsForCategory(
  categoryCode: string
): Promise<WizardPricingOperationResult<string[]>> {
  try {
    const apiResponse = await PricingApiService.getMaterialsForCategory({ categoryCode });

    return {
      success: true,
      data: apiResponse || [],
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати матеріали: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
