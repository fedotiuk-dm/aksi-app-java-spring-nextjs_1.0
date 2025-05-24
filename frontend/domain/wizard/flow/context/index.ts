/**
 * Експорт контексту XState машини wizard
 */

// Типи
export type {
  WizardContext,
  WizardContextInput,
  WizardProgressInfo,
  WizardValidationInfo,
  WizardSessionInfo,
  WizardMetadata,
} from './wizard-context.types';

// Фабричні функції
export {
  createInitialContext,
  createInitialProgressInfo,
  createInitialValidationInfo,
  createInitialSessionInfo,
  createInitialMetadata,
  createViewContext,
  createEditContext,
} from './wizard-context.factory';
