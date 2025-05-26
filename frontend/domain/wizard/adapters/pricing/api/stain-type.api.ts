/**
 * @fileoverview API функції для роботи з типами плям
 * @module domain/wizard/adapters/pricing/api
 */

import { StainTypeService, StainTypeDTO } from '@/lib/api';

import {
  mapStainTypeDTOToDomain,
  mapStainTypeArrayToDomain,
  convertStainRiskLevelToApi,
} from '../mappers';
import { WizardRiskLevel } from '../types/risk-warning.types';

import type { WizardPricingOperationResult, WizardStainType } from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання всіх типів плям
 * Повертає список всіх або тільки активних типів плям з можливістю фільтрації за рівнем ризику
 */
export async function getStainTypes(
  activeOnly: boolean = true,
  riskLevel?: WizardRiskLevel
): Promise<WizardPricingOperationResult<WizardStainType[]>> {
  try {
    // Конвертуємо WizardRiskLevel в API формат
    const apiRiskLevel = riskLevel ? convertStainRiskLevelToApi(riskLevel) : undefined;

    const apiResponse = await StainTypeService.getStainTypes({
      activeOnly,
      riskLevel: apiRiskLevel,
    });

    const stainTypes = mapStainTypeArrayToDomain(apiResponse);

    return {
      success: true,
      data: stainTypes,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати типи плям: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання типу плями за ID
 * Повертає тип плями за вказаним ідентифікатором
 */
export async function getStainTypeById(
  id: string
): Promise<WizardPricingOperationResult<WizardStainType>> {
  try {
    const apiResponse = await StainTypeService.getStainTypeById({ id });

    // API повертає Record<string, any>, тому потрібно перетворити
    const stainType = mapStainTypeDTOToDomain(apiResponse as StainTypeDTO);

    return {
      success: true,
      data: stainType,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати тип плями: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання типу плями за кодом
 * Повертає тип плями за вказаним кодом
 */
export async function getStainTypeByCode(
  code: string
): Promise<WizardPricingOperationResult<WizardStainType>> {
  try {
    const apiResponse = await StainTypeService.getStainTypeByCode({ code });

    // API повертає Record<string, any>, тому потрібно перетворити
    const stainType = mapStainTypeDTOToDomain(apiResponse as StainTypeDTO);

    return {
      success: true,
      data: stainType,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати тип плями за кодом: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Створення нового типу плями
 * Створює новий тип плями з вказаними даними
 */
export async function createStainType(
  stainTypeData: Omit<WizardStainType, 'id'>
): Promise<WizardPricingOperationResult<WizardStainType>> {
  try {
    const requestBody: StainTypeDTO = {
      code: stainTypeData.code,
      name: stainTypeData.name,
      description: stainTypeData.description,
      riskLevel: convertStainRiskLevelToApi(stainTypeData.riskLevel),
      active: stainTypeData.isActive,
    };

    const apiResponse = await StainTypeService.createStainType({ requestBody });

    const stainType = mapStainTypeDTOToDomain(apiResponse);

    return {
      success: true,
      data: stainType,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося створити тип плями: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Оновлення існуючого типу плями
 * Оновлює існуючий тип плями за вказаним ідентифікатором
 */
export async function updateStainType(
  id: string,
  stainTypeData: Partial<Omit<WizardStainType, 'id'>>
): Promise<WizardPricingOperationResult<WizardStainType>> {
  try {
    const requestBody: StainTypeDTO = {
      id,
      code: stainTypeData.code || '',
      name: stainTypeData.name || '',
      description: stainTypeData.description,
      riskLevel: stainTypeData.riskLevel
        ? convertStainRiskLevelToApi(stainTypeData.riskLevel)
        : undefined,
      active: stainTypeData.isActive,
    };

    const apiResponse = await StainTypeService.updateStainType({ id, requestBody });

    const stainType = mapStainTypeDTOToDomain(apiResponse);

    return {
      success: true,
      data: stainType,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося оновити тип плями: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Видалення типу плями
 * Видаляє тип плями за вказаним ідентифікатором
 */
export async function deleteStainType(id: string): Promise<WizardPricingOperationResult<boolean>> {
  try {
    await StainTypeService.deleteStainType({ id });

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося видалити тип плями: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
