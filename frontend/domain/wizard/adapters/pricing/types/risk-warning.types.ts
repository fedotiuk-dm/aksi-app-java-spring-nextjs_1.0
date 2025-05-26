/**
 * @fileoverview Типи для попереджень про ризики
 * @module domain/wizard/adapters/pricing/types/risk-warning
 */

import type { WizardModifierType, WizardModifierCategory } from './price-modifier.types';

/**
 * Рівень ризику
 */
export enum WizardRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Інформація про модифікатор ціни
 */
export interface WizardModifierInfo {
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly type: WizardModifierType;
  readonly value: number;
  readonly category: WizardModifierCategory;
  readonly applicableCategories: string[];
}

/**
 * Попередження про ризики
 */
export interface WizardRiskWarning {
  readonly id: string;
  readonly type: string;
  readonly level: WizardRiskLevel;
  readonly message: string;
  readonly description?: string;
  readonly recommendations: string[];
}
