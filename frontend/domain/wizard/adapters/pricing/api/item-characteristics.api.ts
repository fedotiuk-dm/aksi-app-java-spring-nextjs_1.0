/**
 * @fileoverview API функції для роботи з характеристиками предметів
 * @module domain/wizard/adapters/pricing/api
 */

import { ItemCharacteristicsService } from '@/lib/api';

import {
  mapWearDegreeArrayFromApiResponse,
  mapMaterialArrayFromApiResponse,
  mapFillerTypeArrayFromApiResponse,
  mapColorArrayFromApiResponse,
  mapRiskArrayFromApiResponse,
  mapStainTypeArrayFromItemCharacteristics,
  mapDefectTypeArrayFromItemCharacteristics,
} from '../mappers';

import type {
  WizardPricingOperationResult,
  WizardWearDegree,
  WizardMaterial,
  WizardFillerType,
  WizardColor,
  WizardRisk,
  WizardStainType,
  WizardDefectType,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Отримання доступних ступенів зносу
 * Повертає список всіх доступних ступенів зносу для предметів
 */
export async function getWearDegrees(): Promise<WizardPricingOperationResult<WizardWearDegree[]>> {
  try {
    const apiResponse = await ItemCharacteristicsService.getWearDegrees();

    const wearDegrees = mapWearDegreeArrayFromApiResponse(apiResponse);

    return {
      success: true,
      data: wearDegrees,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати ступені зносу: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання доступних матеріалів
 * Повертає список всіх доступних матеріалів з можливістю фільтрації за категорією
 */
export async function getMaterials(
  category?: string
): Promise<WizardPricingOperationResult<WizardMaterial[]>> {
  try {
    const apiResponse = await ItemCharacteristicsService.getMaterials({ category });

    const materials = mapMaterialArrayFromApiResponse(apiResponse);

    return {
      success: true,
      data: materials,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати матеріали: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання доступних типів наповнювачів
 * Повертає список всіх доступних типів наповнювачів
 */
export async function getFillerTypes(): Promise<WizardPricingOperationResult<WizardFillerType[]>> {
  try {
    const apiResponse = await ItemCharacteristicsService.getFillerTypes();

    const fillerTypes = mapFillerTypeArrayFromApiResponse(apiResponse);

    return {
      success: true,
      data: fillerTypes,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати типи наповнювачів: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання доступних кольорів
 * Повертає список всіх доступних кольорів
 */
export async function getColors(): Promise<WizardPricingOperationResult<WizardColor[]>> {
  try {
    const apiResponse = await ItemCharacteristicsService.getColors();

    const colors = mapColorArrayFromApiResponse(apiResponse);

    return {
      success: true,
      data: colors,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати кольори: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання доступних ризиків
 * Повертає список всіх доступних ризиків
 */
export async function getRisks(): Promise<WizardPricingOperationResult<WizardRisk[]>> {
  try {
    const apiResponse = await ItemCharacteristicsService.getRisks();

    const risks = mapRiskArrayFromApiResponse(apiResponse);

    return {
      success: true,
      data: risks,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати ризики: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання типів плям для характеристик предметів
 * Повертає список типів плям, доступних для вибору при описі предмета
 */
export async function getStainTypesForCharacteristics(): Promise<
  WizardPricingOperationResult<WizardStainType[]>
> {
  try {
    const apiResponse = await ItemCharacteristicsService.getStainTypes1();

    const stainTypes = mapStainTypeArrayFromItemCharacteristics(apiResponse);

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
 * Отримання типів дефектів для характеристик предметів
 * Повертає список типів дефектів, доступних для вибору при описі предмета
 */
export async function getDefectTypesForCharacteristics(): Promise<
  WizardPricingOperationResult<WizardDefectType[]>
> {
  try {
    const apiResponse = await ItemCharacteristicsService.getDefects();

    const defectTypes = mapDefectTypeArrayFromItemCharacteristics(apiResponse);

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
 * Отримання комбінованого списку дефектів та ризиків
 * Повертає список всіх дефектів та ризиків разом
 */
export async function getDefectsAndRisks(): Promise<WizardPricingOperationResult<string[]>> {
  try {
    const apiResponse = await ItemCharacteristicsService.getDefectsAndRisks();

    return {
      success: true,
      data: apiResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати дефекти та ризики: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
