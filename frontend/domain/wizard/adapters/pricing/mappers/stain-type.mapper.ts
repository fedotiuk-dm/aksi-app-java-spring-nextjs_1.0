/**
 * @fileoverview Маппер для перетворення типів плям
 * @module domain/wizard/adapters/pricing/mappers
 */

import { StainTypeDTO } from '@/lib/api';

import { WizardRiskLevel } from '../types/risk-warning.types';

import type { WizardStainType } from '../types';

/**
 * Конвертер рівня ризику з API в доменний тип (для плям)
 */
export function convertStainRiskLevelFromApi(
  apiRiskLevel?: StainTypeDTO.riskLevel
): WizardRiskLevel {
  switch (apiRiskLevel) {
    case StainTypeDTO.riskLevel.LOW:
      return WizardRiskLevel.LOW;
    case StainTypeDTO.riskLevel.MEDIUM:
      return WizardRiskLevel.MEDIUM;
    case StainTypeDTO.riskLevel.HIGH:
      return WizardRiskLevel.HIGH;
    default:
      return WizardRiskLevel.LOW;
  }
}

/**
 * Конвертер рівня ризику з доменного типу в API (для плям)
 */
export function convertStainRiskLevelToApi(riskLevel: WizardRiskLevel): StainTypeDTO.riskLevel {
  switch (riskLevel) {
    case WizardRiskLevel.LOW:
      return StainTypeDTO.riskLevel.LOW;
    case WizardRiskLevel.MEDIUM:
      return StainTypeDTO.riskLevel.MEDIUM;
    case WizardRiskLevel.HIGH:
      return StainTypeDTO.riskLevel.HIGH;
    case WizardRiskLevel.CRITICAL:
      return StainTypeDTO.riskLevel.HIGH; // CRITICAL мапимо в HIGH для API
    default:
      return StainTypeDTO.riskLevel.LOW;
  }
}

/**
 * Маппер з API моделі в доменну модель
 */
export function mapStainTypeDTOToDomain(apiStainType: StainTypeDTO): WizardStainType {
  return {
    id: apiStainType.id || '',
    code: apiStainType.code || '',
    name: apiStainType.name || '',
    description: apiStainType.description || '',
    riskLevel: convertStainRiskLevelFromApi(apiStainType.riskLevel),
    isActive: apiStainType.active ?? true,
    recommendedModifiers: [], // API не містить цього поля, залишаємо порожнім
    treatmentNotes: '', // API не містить цього поля, залишаємо порожнім
  };
}

/**
 * Маппер з доменної моделі в API модель для створення
 */
export function mapStainTypeToCreateDTO(stainTypeData: Omit<WizardStainType, 'id'>): StainTypeDTO {
  return {
    code: stainTypeData.code,
    name: stainTypeData.name,
    description: stainTypeData.description,
    riskLevel: convertStainRiskLevelToApi(stainTypeData.riskLevel),
    active: stainTypeData.isActive,
  };
}

/**
 * Маппер з доменної моделі в API модель для оновлення
 */
export function mapStainTypeToUpdateDTO(
  id: string,
  stainTypeData: Partial<Omit<WizardStainType, 'id'>>
): StainTypeDTO {
  return {
    id,
    code: stainTypeData.code || '',
    name: stainTypeData.name || '',
    description: stainTypeData.description,
    riskLevel: stainTypeData.riskLevel
      ? convertStainRiskLevelToApi(stainTypeData.riskLevel)
      : undefined,
    active: stainTypeData.isActive,
  };
}

/**
 * Маппер для масиву типів плям з API відповіді
 */
export function mapStainTypeArrayToDomain(apiStainTypes: StainTypeDTO[]): WizardStainType[] {
  return apiStainTypes.map(mapStainTypeDTOToDomain);
}
