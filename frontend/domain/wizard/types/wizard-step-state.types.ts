/**
 * Типи стану кроків wizard - відповідальність за інтерфейси стану валідації та завершення
 */

import { ValidationStatus, StepCompletionStatus } from './wizard-modes.types';

/**
 * Базовий інтерфейс для стану кроку
 */
export interface WizardStepState {
  isValid: boolean;
  isComplete: boolean;
  validationStatus: ValidationStatus;
  completionStatus: StepCompletionStatus;
  errors: string[];
  warnings: string[];
  lastValidated: Date | null;
  lastUpdated: Date | null;
}

/**
 * Розширений стан кроку з додатковими метаданими
 */
export interface ExtendedWizardStepState extends WizardStepState {
  attempts: number;
  timeSpent: number; // в секундах
  hasUnsavedChanges: boolean;
  canBeSkipped: boolean;
}

/**
 * Стан валідації поля
 */
export interface FieldValidationState {
  fieldName: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  lastValidated: Date | null;
}

/**
 * Група валідацій для кроку
 */
export interface StepValidationGroup {
  groupName: string;
  fields: FieldValidationState[];
  isGroupValid: boolean;
  priority: number;
}

/**
 * Детальний стан валідації кроку
 */
export interface DetailedStepValidationState extends WizardStepState {
  validationGroups: StepValidationGroup[];
  criticalErrors: string[];
  nonBlockingWarnings: string[];
  validationProgress: number;
}
