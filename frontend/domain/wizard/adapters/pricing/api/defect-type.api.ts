/**
 * @fileoverview API функції для роботи з типами дефектів
 * @module domain/wizard/adapters/pricing/api
 */

import { DefectTypeService, DefectTypeDTO } from '@/lib/api';

import {
  mapDefectTypeDTOToDomain,
  mapDefectTypeArrayToDomain,
  convertDefectRiskLevelToApi,
} from '../mappers';
import { WizardRiskLevel } from '../types/risk-warning.types';

import type { WizardPricingOperationResult, WizardDefectType } from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання всіх типів дефектів
 * Повертає список всіх або тільки активних типів дефектів з можливістю фільтрації за рівнем ризику
 */
export async function getDefectTypes(
  activeOnly: boolean = true,
  riskLevel?: WizardRiskLevel
): Promise<WizardPricingOperationResult<WizardDefectType[]>> {
  try {
    // Конвертуємо WizardRiskLevel в API формат
    const apiRiskLevel = riskLevel ? convertDefectRiskLevelToApi(riskLevel) : undefined;

    const apiResponse = await DefectTypeService.getDefectTypes({
      activeOnly,
      riskLevel: apiRiskLevel,
    });

    const defectTypes = mapDefectTypeArrayToDomain(apiResponse);

    return {
      success: true,
      data: defectTypes,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати типи дефектів: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання типу дефекту за ID
 * Повертає тип дефекту за вказаним ідентифікатором
 */
export async function getDefectTypeById(
  id: string
): Promise<WizardPricingOperationResult<WizardDefectType>> {
  try {
    const apiResponse = await DefectTypeService.getDefectTypeById({ id });

    // API повертає Record<string, any>, тому потрібно перетворити
    const defectType = mapDefectTypeDTOToDomain(apiResponse as DefectTypeDTO);

    return {
      success: true,
      data: defectType,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати тип дефекту: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання типу дефекту за кодом
 * Повертає тип дефекту за вказаним кодом
 */
export async function getDefectTypeByCode(
  code: string
): Promise<WizardPricingOperationResult<WizardDefectType>> {
  try {
    const apiResponse = await DefectTypeService.getDefectTypeByCode({ code });

    // API повертає Record<string, any>, тому потрібно перетворити
    const defectType = mapDefectTypeDTOToDomain(apiResponse as DefectTypeDTO);

    return {
      success: true,
      data: defectType,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати тип дефекту за кодом: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Створення нового типу дефекту
 * Створює новий тип дефекту з вказаними даними
 */
export async function createDefectType(
  defectTypeData: Omit<WizardDefectType, 'id'>
): Promise<WizardPricingOperationResult<WizardDefectType>> {
  try {
    const requestBody: DefectTypeDTO = {
      code: defectTypeData.code,
      name: defectTypeData.name,
      description: defectTypeData.description,
      riskLevel: convertDefectRiskLevelToApi(defectTypeData.riskLevel),
      active: defectTypeData.isActive,
    };

    const apiResponse = await DefectTypeService.createDefectType({ requestBody });

    const defectType = mapDefectTypeDTOToDomain(apiResponse);

    return {
      success: true,
      data: defectType,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося створити тип дефекту: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Оновлення існуючого типу дефекту
 * Оновлює існуючий тип дефекту за вказаним ідентифікатором
 */
export async function updateDefectType(
  id: string,
  defectTypeData: Partial<Omit<WizardDefectType, 'id'>>
): Promise<WizardPricingOperationResult<WizardDefectType>> {
  try {
    const requestBody: DefectTypeDTO = {
      id,
      code: defectTypeData.code || '',
      name: defectTypeData.name || '',
      description: defectTypeData.description,
      riskLevel: defectTypeData.riskLevel
        ? convertDefectRiskLevelToApi(defectTypeData.riskLevel)
        : undefined,
      active: defectTypeData.isActive,
    };

    const apiResponse = await DefectTypeService.updateDefectType({ id, requestBody });

    const defectType = mapDefectTypeDTOToDomain(apiResponse);

    return {
      success: true,
      data: defectType,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося оновити тип дефекту: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Видалення типу дефекту
 * Видаляє тип дефекту за вказаним ідентифікатором
 */
export async function deleteDefectType(id: string): Promise<WizardPricingOperationResult<boolean>> {
  try {
    await DefectTypeService.deleteDefectType({ id });

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося видалити тип дефекту: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
