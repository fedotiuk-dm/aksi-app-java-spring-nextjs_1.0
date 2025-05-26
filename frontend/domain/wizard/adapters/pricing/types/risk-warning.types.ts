/**
 * @fileoverview Типи для попереджень про ризики
 * @module domain/wizard/adapters/pricing/types/risk-warning
 */

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
 * Попередження про ризики
 */
export interface WizardRiskWarning {
  id: string;
  type: string;
  level: WizardRiskLevel;
  message: string;
  description?: string;
  recommendations: string[];
}
