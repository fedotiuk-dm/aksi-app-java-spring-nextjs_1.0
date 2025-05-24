/**
 * Типи контексту XState машини wizard
 */

import { WizardStep, ItemWizardStep, WizardMode } from '../../shared/types/wizard-common.types';

// Головний контекст XState машини
export interface WizardContext {
  currentStep: WizardStep;
  currentItemStep?: ItemWizardStep;
  mode: WizardMode;
  progress: WizardProgressInfo;
  validation: WizardValidationInfo;
  session: WizardSessionInfo;
  metadata: WizardMetadata;
}

// Прогрес виконання wizard
export interface WizardProgressInfo {
  percentage: number;
  completedSteps: WizardStep[];
  completedItemSteps: ItemWizardStep[];
  canProceed: boolean;
  isLastStep: boolean;
}

// Валідація wizard
export interface WizardValidationInfo {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  isValidating: boolean;
  lastValidated?: Date;
}

// Сесія wizard
export interface WizardSessionInfo {
  sessionId: string;
  startedAt: Date;
  lastActivity?: Date;
  hasUnsavedChanges: boolean;
  autoSaveInterval: number;
}

// Метадані wizard
export interface WizardMetadata {
  customData?: Record<string, unknown>;
  returnUrl?: string;
  isPersistent: boolean;
  orderId?: string;
}

// Вхідні параметри для створення контексту
export interface WizardContextInput {
  initialStep?: WizardStep;
  mode?: WizardMode;
  orderId?: string;
  sessionId?: string;
  returnUrl?: string;
  isPersistent?: boolean;
}
