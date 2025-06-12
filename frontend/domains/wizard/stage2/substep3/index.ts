/**
 * @fileoverview Публічне API домену "Дефекти та плями (Substep3)"
 *
 * Експортує тільки необхідні компоненти для використання в UI
 * Принцип: Interface Segregation Principle
 */

// Головний композиційний хук
export { useDefectsStains } from './use-defects-stains.hook';
export type { UseDefectsStainsReturn } from './use-defects-stains.hook';

// Схеми та типи для UI компонентів (якщо потрібні)
export {
  defectsStainsFormSchema,
  stainSelectionSchema,
  defectSelectionSchema,
  defectNotesSchema,
  riskAssessmentSchema,
} from './defects-stains.schemas';

export type {
  DefectsStainsFormData,
  StainSelectionData,
  DefectSelectionData,
  DefectNotesData,
  RiskAssessmentData,
} from './defects-stains.schemas';
