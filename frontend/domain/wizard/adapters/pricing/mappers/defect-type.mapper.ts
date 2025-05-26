/**
 * @fileoverview Маппер для перетворення типів дефектів
 * @module domain/wizard/adapters/pricing/mappers
 */

import { DefectTypeDTO } from '@/lib/api';

import { WizardRiskLevel } from '../types/risk-warning.types';

import type { WizardDefectType } from '../types';

/**
 * Конвертер рівня ризику з API в доменний тип (для дефектів)
 */
export function convertDefectRiskLevelFromApi(
  apiRiskLevel?: DefectTypeDTO.riskLevel
): WizardRiskLevel {
  switch (apiRiskLevel) {
    case DefectTypeDTO.riskLevel.LOW:
      return WizardRiskLevel.LOW;
    case DefectTypeDTO.riskLevel.MEDIUM:
      return WizardRiskLevel.MEDIUM;
    case DefectTypeDTO.riskLevel.HIGH:
      return WizardRiskLevel.HIGH;
    default:
      return WizardRiskLevel.LOW;
  }
}

/**
 * Конвертер рівня ризику з доменного типу в API (для дефектів)
 */
export function convertDefectRiskLevelToApi(riskLevel: WizardRiskLevel): DefectTypeDTO.riskLevel {
  switch (riskLevel) {
    case WizardRiskLevel.LOW:
      return DefectTypeDTO.riskLevel.LOW;
    case WizardRiskLevel.MEDIUM:
      return DefectTypeDTO.riskLevel.MEDIUM;
    case WizardRiskLevel.HIGH:
      return DefectTypeDTO.riskLevel.HIGH;
    case WizardRiskLevel.CRITICAL:
      return DefectTypeDTO.riskLevel.HIGH; // CRITICAL мапимо в HIGH для API
    default:
      return DefectTypeDTO.riskLevel.LOW;
  }
}

/**
 * Маппер з API моделі в доменну модель
 */
export function mapDefectTypeDTOToDomain(apiDefectType: DefectTypeDTO): WizardDefectType {
  return {
    id: apiDefectType.id || '',
    code: apiDefectType.code || '',
    name: apiDefectType.name || '',
    description: apiDefectType.description || '',
    riskLevel: convertDefectRiskLevelFromApi(apiDefectType.riskLevel),
    isActive: apiDefectType.active ?? true,
    recommendedModifiers: [], // API не містить цього поля, залишаємо порожнім
    treatmentNotes: '', // API не містить цього поля, залишаємо порожнім
    requiresWarrantyExclusion: false, // API не містить цього поля, залишаємо false
  };
}

/**
 * Маппер з доменної моделі в API модель для створення
 */
export function mapDefectTypeToCreateDTO(
  defectTypeData: Omit<WizardDefectType, 'id'>
): DefectTypeDTO {
  return {
    code: defectTypeData.code,
    name: defectTypeData.name,
    description: defectTypeData.description,
    riskLevel: convertDefectRiskLevelToApi(defectTypeData.riskLevel),
    active: defectTypeData.isActive,
  };
}

/**
 * Маппер з доменної моделі в API модель для оновлення
 */
export function mapDefectTypeToUpdateDTO(
  id: string,
  defectTypeData: Partial<Omit<WizardDefectType, 'id'>>
): DefectTypeDTO {
  return {
    id,
    code: defectTypeData.code || '',
    name: defectTypeData.name || '',
    description: defectTypeData.description,
    riskLevel: defectTypeData.riskLevel
      ? convertDefectRiskLevelToApi(defectTypeData.riskLevel)
      : undefined,
    active: defectTypeData.isActive,
  };
}

/**
 * Маппер для масиву типів дефектів з API відповіді
 */
export function mapDefectTypeArrayToDomain(apiDefectTypes: DefectTypeDTO[]): WizardDefectType[] {
  return apiDefectTypes.map(mapDefectTypeDTOToDomain);
}
