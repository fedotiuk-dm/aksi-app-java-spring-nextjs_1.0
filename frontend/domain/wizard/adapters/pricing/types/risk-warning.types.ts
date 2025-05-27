/**
 * @fileoverview Типи для попереджень про ризики
 * @module domain/wizard/adapters/pricing/types/risk-warning
 */

/**
 * Рівень ризику (специфічний для pricing)
 */
export enum WizardRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}
