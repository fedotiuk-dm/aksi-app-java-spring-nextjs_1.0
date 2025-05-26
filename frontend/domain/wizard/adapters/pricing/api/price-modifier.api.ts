/**
 * @fileoverview API функції для роботи з модифікаторами цін
 * @module domain/wizard/adapters/pricing/api
 */

import { PriceCalculationService } from '@/lib/api';

import { mapPriceModifierDTOToDomain, mapPriceModifierArrayToDomain } from '../mappers';

/**
 * Інтерфейс для API відповіді з модифікаторами
 */
interface PriceModifierApiResponse extends Record<string, unknown> {}

import type {
  WizardPricingOperationResult,
  WizardPriceModifier,
  WizardModifierSearchParams,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання модифікаторів для категорії послуг
 */
export async function getModifiersForCategory(
  categoryCode: string
): Promise<WizardPricingOperationResult<WizardPriceModifier[]>> {
  try {
    const apiResponse = await PriceCalculationService.getModifiersForServiceCategory1({
      categoryCode,
    });
    const modifiers = mapPriceModifierArrayToDomain(apiResponse as PriceModifierApiResponse[]);

    return {
      success: true,
      data: modifiers,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати модифікатори: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання модифікатора за кодом
 */
export async function getModifierByCode(
  code: string
): Promise<WizardPricingOperationResult<WizardPriceModifier>> {
  try {
    const apiResponse = await PriceCalculationService.getModifierByCode1({ code });
    const modifier = mapPriceModifierDTOToDomain(apiResponse as PriceModifierApiResponse);

    return {
      success: true,
      data: modifier,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати модифікатор: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання модифікаторів за категорією модифікатора
 */
export async function getModifiersByCategory(
  category: 'GENERAL' | 'TEXTILE' | 'LEATHER'
): Promise<WizardPricingOperationResult<WizardPriceModifier[]>> {
  try {
    const apiResponse = await PriceCalculationService.getModifiersByCategory1({ category });
    const modifiers = mapPriceModifierArrayToDomain(apiResponse as PriceModifierApiResponse[]);

    return {
      success: true,
      data: modifiers,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати модифікатори за категорією: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання модифікаторів за кодами
 */
export async function getModifiersByCodes(
  codes: string[]
): Promise<WizardPricingOperationResult<WizardPriceModifier[]>> {
  try {
    const apiResponse = await PriceCalculationService.getModifiersByCodes({ requestBody: codes });

    // Перетворюємо Record<string, PriceModifierApiResponse> в масив модифікаторів
    const modifiersArray = Object.values(apiResponse as Record<string, PriceModifierApiResponse>);
    const modifiers = mapPriceModifierArrayToDomain(modifiersArray);

    return {
      success: true,
      data: modifiers,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати модифікатори за кодами: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання доступних модифікаторів для категорії
 */
export async function getAvailableModifiersForCategory(
  categoryCode: string
): Promise<WizardPricingOperationResult<WizardPriceModifier[]>> {
  try {
    const apiResponse = await PriceCalculationService.getAvailableModifiersForCategory({
      categoryCode,
    });
    const modifiers = mapPriceModifierArrayToDomain(apiResponse as PriceModifierApiResponse[]);

    return {
      success: true,
      data: modifiers,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати доступні модифікатори: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Пошук модифікаторів з параметрами (спрощена версія)
 */
export async function searchModifiers(
  params: WizardModifierSearchParams
): Promise<WizardPricingOperationResult<WizardPriceModifier[]>> {
  try {
    // Оскільки в новому API немає загального методу пошуку,
    // використовуємо пошук за категорією, якщо вона вказана
    if (params.categoryCode) {
      return await getModifiersForCategory(params.categoryCode);
    }

    // Якщо категорія не вказана, повертаємо порожній результат
    return {
      success: true,
      data: [],
    };
  } catch (error) {
    return {
      success: false,
      error: `Помилка пошуку модифікаторів: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
