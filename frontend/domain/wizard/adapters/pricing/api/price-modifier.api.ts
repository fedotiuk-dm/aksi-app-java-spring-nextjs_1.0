/**
 * @fileoverview API функції для роботи з модифікаторами цін
 * @module domain/wizard/adapters/pricing/api
 */

import { PricingApiService } from '@/lib/api';

import {
  mapPriceModifierDTOToDomain,
  mapPriceModifierArrayToDomain,
} from '../mappers';

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
    const apiResponse = await PricingApiService.getModifiersForServiceCategory({ categoryCode });
    const modifiers = mapPriceModifierArrayToDomain(apiResponse);

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
    const apiResponse = await PricingApiService.getModifierByCode({ code });
    const modifier = mapPriceModifierDTOToDomain(apiResponse);

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
  category: "GENERAL" | "TEXTILE" | "LEATHER"
): Promise<WizardPricingOperationResult<WizardPriceModifier[]>> {
  try {
    const apiResponse = await PricingApiService.getModifiersByCategory({ category });
    const modifiers = mapPriceModifierArrayToDomain(apiResponse);

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
 * Пошук модифікаторів з параметрами
 */
export async function searchModifiers(
  params: WizardModifierSearchParams
): Promise<WizardPricingOperationResult<WizardPriceModifier[]>> {
  try {
    // Перетворюємо параметри у формат, який очікує API
    const searchParams: {
      query?: string;
      category?: 'GENERAL' | 'TEXTILE' | 'LEATHER';
      active?: boolean;
      page?: number;
      size?: number;
      sortBy?: string;
      sortDirection?: string;
    } = {
      query: params.searchTerm, // правильна назва параметра - query, а не searchTerm
      active: params.isActive, // правильна назва параметра - active, а не isActive
    };

    // Конвертуємо категорію модифікатора у формат, який очікує API
    // Зауважте, що категорії модифікаторів в домені та API відрізняються
    // Доменні категорії: MATERIAL, COLOR, SIZE, URGENCY, CONDITION, SPECIAL_SERVICE, DISCOUNT
    // API категорії: GENERAL, TEXTILE, LEATHER
    
    // Зараз ми не передаємо категорію модифікатора в API, бо немає прямого маппінгу
    // Для коректної реалізації потрібно буде додати правильний маппінг між типами

    // Додаємо дефолтні значення для пагінації та сортування
    searchParams.page = 0; // Перша сторінка за замовчуванням
    searchParams.size = 20; // Розмір сторінки за замовчуванням
    searchParams.sortBy = 'name'; // Поле сортування за замовчуванням
    searchParams.sortDirection = 'ASC'; // Напрямок сортування за замовчуванням

    const apiResponse = await PricingApiService.searchModifiers(searchParams);
    const modifiers = mapPriceModifierArrayToDomain(apiResponse);

    return {
      success: true,
      data: modifiers,
    };
  } catch (error) {
    return {
      success: false,
      error: `Помилка пошуку модифікаторів: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
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
    // Отримуємо коди модифікаторів (масив рядків)
    const modifierCodes = await PricingApiService.getAvailableModifiersForCategory({ categoryCode });
    
    if (modifierCodes.length === 0) {
      return {
        success: true,
        data: [],
      };
    }
    
    // Отримуємо повну інформацію для кожного модифікатора
    const modifiersPromises = modifierCodes.map(code => getModifierByCode(code));
    const modifiersResults = await Promise.all(modifiersPromises);
    
    // Фільтруємо тільки успішні результати
    const modifiers = modifiersResults
      .filter(result => result.success && result.data)
      .map(result => result.data as WizardPriceModifier);

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
