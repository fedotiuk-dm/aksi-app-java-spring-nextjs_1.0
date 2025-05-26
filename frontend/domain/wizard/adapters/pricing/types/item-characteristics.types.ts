/**
 * @fileoverview Типи для характеристик предметів
 * @module domain/wizard/adapters/pricing/types/item-characteristics
 */

import type { WizardRiskLevel } from './risk-warning.types';

/**
 * Ступінь зносу предмета
 */
export interface WizardWearDegree {
  readonly code: string;
  readonly name: string;
  readonly percentage: number;
  readonly description: string;
}

/**
 * Тип плями
 */
export interface WizardStainType {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly riskLevel: WizardRiskLevel;
  readonly isActive: boolean;
  readonly recommendedModifiers: string[];
  readonly treatmentNotes: string;
}

/**
 * Тип дефекту
 */
export interface WizardDefectType {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly riskLevel: WizardRiskLevel;
  readonly isActive: boolean;
  readonly recommendedModifiers: string[];
  readonly treatmentNotes: string;
  readonly requiresWarrantyExclusion: boolean;
}

/**
 * Матеріал
 */
export interface WizardMaterial {
  readonly code: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly isActive: boolean;
}

/**
 * Тип наповнювача
 */
export interface WizardFillerType {
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly isActive: boolean;
}

/**
 * Колір
 */
export interface WizardColor {
  readonly code: string;
  readonly name: string;
  readonly hexCode: string;
  readonly isBasic: boolean;
}

/**
 * Ризик
 */
export interface WizardRisk {
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly level: WizardRiskLevel;
  readonly category: string;
}

/**
 * Одиниця виміру
 */
export interface WizardUnitOfMeasure {
  readonly code: string;
  readonly name: string;
  readonly abbreviation: string;
  readonly category: string;
  readonly isDefault: boolean;
  readonly conversionFactor: number;
}
