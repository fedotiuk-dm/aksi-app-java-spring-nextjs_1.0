/**
 * @fileoverview Маппер для перетворення характеристик предметів
 * @module domain/wizard/adapters/pricing/mappers
 */

import { WizardRiskLevel } from '../types/risk-warning.types';

import type {
  WizardWearDegree,
  WizardStainType,
  WizardDefectType,
  WizardMaterial,
  WizardFillerType,
  WizardColor,
  WizardRisk,
} from '../types';

/**
 * Маппер для ступенів зносу з API відповіді (простий рядок)
 */
export function mapWearDegreeFromApiResponse(apiData: string): WizardWearDegree {
  return {
    code: apiData,
    name: apiData,
    percentage: parseInt(apiData.replace('%', '')) || 0,
    description: `Ступінь зносу ${apiData}`,
  };
}

/**
 * Маппер для матеріалів з API відповіді (простий рядок)
 */
export function mapMaterialFromApiResponse(apiData: string): WizardMaterial {
  return {
    code: apiData.toLowerCase().replace(/\s+/g, '_'),
    name: apiData,
    category: 'GENERAL',
    description: `Матеріал: ${apiData}`,
    isActive: true,
  };
}

/**
 * Маппер для типів наповнювачів з API відповіді (простий рядок)
 */
export function mapFillerTypeFromApiResponse(apiData: string): WizardFillerType {
  return {
    code: apiData.toLowerCase().replace(/\s+/g, '_'),
    name: apiData,
    description: `Тип наповнювача: ${apiData}`,
    isActive: true,
  };
}

/**
 * Маппер для кольорів з API відповіді (простий рядок)
 */
export function mapColorFromApiResponse(apiData: string): WizardColor {
  return {
    code: apiData.toLowerCase().replace(/\s+/g, '_'),
    name: apiData,
    hexCode: '',
    isBasic: true,
  };
}

/**
 * Маппер для ризиків з API відповіді (простий рядок)
 */
export function mapRiskFromApiResponse(apiData: string): WizardRisk {
  return {
    code: apiData.toLowerCase().replace(/\s+/g, '_'),
    name: apiData,
    description: `Ризик: ${apiData}`,
    level: WizardRiskLevel.MEDIUM,
    category: 'GENERAL',
  };
}

/**
 * Маппер для типів плям з API відповіді (простий рядок для item-characteristics)
 */
export function mapStainTypeFromItemCharacteristics(apiData: string): WizardStainType {
  return {
    id: apiData.toLowerCase().replace(/\s+/g, '_'),
    code: apiData.toLowerCase().replace(/\s+/g, '_'),
    name: apiData,
    description: `Тип плями: ${apiData}`,
    riskLevel: WizardRiskLevel.MEDIUM,
    isActive: true,
    recommendedModifiers: [],
    treatmentNotes: '',
  };
}

/**
 * Маппер для типів дефектів з API відповіді (простий рядок для item-characteristics)
 */
export function mapDefectTypeFromItemCharacteristics(apiData: string): WizardDefectType {
  return {
    id: apiData.toLowerCase().replace(/\s+/g, '_'),
    code: apiData.toLowerCase().replace(/\s+/g, '_'),
    name: apiData,
    description: `Тип дефекту: ${apiData}`,
    riskLevel: WizardRiskLevel.MEDIUM,
    isActive: true,
    recommendedModifiers: [],
    treatmentNotes: '',
    requiresWarrantyExclusion: false,
  };
}

/**
 * Маппери для масивів
 */
export function mapWearDegreeArrayFromApiResponse(apiResponse: string[]): WizardWearDegree[] {
  return Array.isArray(apiResponse) ? apiResponse.map(mapWearDegreeFromApiResponse) : [];
}

export function mapMaterialArrayFromApiResponse(apiResponse: string[]): WizardMaterial[] {
  return Array.isArray(apiResponse) ? apiResponse.map(mapMaterialFromApiResponse) : [];
}

export function mapFillerTypeArrayFromApiResponse(apiResponse: string[]): WizardFillerType[] {
  return Array.isArray(apiResponse) ? apiResponse.map(mapFillerTypeFromApiResponse) : [];
}

export function mapColorArrayFromApiResponse(apiResponse: string[]): WizardColor[] {
  return Array.isArray(apiResponse) ? apiResponse.map(mapColorFromApiResponse) : [];
}

export function mapRiskArrayFromApiResponse(apiResponse: string[]): WizardRisk[] {
  return Array.isArray(apiResponse) ? apiResponse.map(mapRiskFromApiResponse) : [];
}

export function mapStainTypeArrayFromItemCharacteristics(apiResponse: string[]): WizardStainType[] {
  return Array.isArray(apiResponse) ? apiResponse.map(mapStainTypeFromItemCharacteristics) : [];
}

export function mapDefectTypeArrayFromItemCharacteristics(
  apiResponse: string[]
): WizardDefectType[] {
  return Array.isArray(apiResponse) ? apiResponse.map(mapDefectTypeFromItemCharacteristics) : [];
}
