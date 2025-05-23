import { WizardStep } from './wizard-steps.types';

/**
 * Wizard Validation Types
 * Типи пов'язані з валідацією wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки типи валідації
 * - Interface Segregation: малі специфічні інтерфейси
 */

/**
 * Результат валідації кроку (Domain Value Object)
 */
export interface StepValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
  readonly canProceed: boolean;
}

/**
 * Контракт для wizard navigation service
 */
export interface IWizardNavigationService {
  canNavigateToStep(step: WizardStep): boolean;
  validateNavigation(from: WizardStep, to: WizardStep): StepValidationResult;
  getNextStep(currentStep: WizardStep): WizardStep | null;
  getPreviousStep(currentStep: WizardStep): WizardStep | null;
  getStepsByOrder(): WizardStep[];
}

/**
 * Контракт для wizard validation service
 */
export interface IWizardValidationService {
  validateStep(step: WizardStep, data?: unknown): StepValidationResult;
  validateTransition(from: WizardStep, to: WizardStep): StepValidationResult;
  getRequiredSteps(): WizardStep[];
  isStepComplete(step: WizardStep): boolean;
}
