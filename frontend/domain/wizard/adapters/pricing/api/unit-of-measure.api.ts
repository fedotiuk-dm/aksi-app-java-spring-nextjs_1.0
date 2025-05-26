/**
 * @fileoverview API функції для роботи з одиницями виміру
 * @module domain/wizard/adapters/pricing/api
 */

import { UnitOfMeasureService } from '@/lib/api';

import {
  mapUnitOfMeasureFromApiResponse,
  mapUnitOfMeasureArrayFromApiResponse,
  mapUnitSupportFromApiResponse,
} from '../mappers';

import type { WizardPricingOperationResult, WizardUnitOfMeasure } from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання рекомендованої одиниці виміру для предмета
 * Повертає рекомендовану одиницю виміру на основі категорії та назви предмета
 */
export async function getRecommendedUnitOfMeasure(
  categoryId: string,
  itemName: string
): Promise<WizardPricingOperationResult<WizardUnitOfMeasure>> {
  try {
    const apiResponse = await UnitOfMeasureService.getRecommendedUnitOfMeasure({
      categoryId,
      itemName,
    });

    const unitOfMeasure = mapUnitOfMeasureFromApiResponse(apiResponse);

    return {
      success: true,
      data: unitOfMeasure,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати рекомендовану одиницю виміру: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Перевірка підтримки одиниці виміру для предмета
 * Перевіряє, чи підтримується вказана одиниця виміру для конкретного предмета
 */
export async function isUnitSupportedForItem(
  categoryId: string,
  itemName: string,
  unitOfMeasure: string
): Promise<WizardPricingOperationResult<boolean>> {
  try {
    const apiResponse = await UnitOfMeasureService.isUnitSupportedForItem({
      categoryId,
      itemName,
      unitOfMeasure,
    });

    // API тепер повертає boolean безпосередньо
    const isSupported = mapUnitSupportFromApiResponse(apiResponse);

    return {
      success: true,
      data: isSupported,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося перевірити підтримку одиниці виміру: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання всіх доступних одиниць виміру для категорії
 * Повертає список всіх одиниць виміру, доступних для вказаної категорії
 */
export async function getAvailableUnitsForCategory(
  categoryId: string
): Promise<WizardPricingOperationResult<WizardUnitOfMeasure[]>> {
  try {
    const apiResponse = await UnitOfMeasureService.getAvailableUnitsForCategory({
      categoryId,
    });

    const units: WizardUnitOfMeasure[] = Array.isArray(apiResponse)
      ? mapUnitOfMeasureArrayFromApiResponse(apiResponse)
      : [];

    return {
      success: true,
      data: units,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати доступні одиниці виміру: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
