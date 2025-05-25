/**
 * Утиліти валідації кроків - відповідальність за перевірку валідності кроків wizard
 */

import { ValidationStatus, WizardStep } from '../types';
import { WizardStepState } from '../types';

/**
 * Перевіряє валідність конкретного кроку
 */
export const isStepValid = (
  step: WizardStep,
  stepValidations: Record<WizardStep, WizardStepState>
): boolean => {
  const validation = stepValidations[step];
  return validation?.isValid === true && validation?.validationStatus === ValidationStatus.VALID;
};

/**
 * Отримує всі помилки валідації зі всіх кроків
 */
export const getAllValidationErrors = (
  stepValidations: Record<WizardStep, WizardStepState>
): string[] => {
  const errors: string[] = [];

  Object.values(stepValidations).forEach((validation) => {
    if (validation.errors && Array.isArray(validation.errors)) {
      errors.push(...validation.errors);
    }
  });

  return errors;
};

/**
 * Перевіряє можливість переходу на наступний крок
 */
export const canProceedToNextStep = (
  currentStep: WizardStep,
  stepValidations: Record<WizardStep, WizardStepState>
): boolean => {
  return isStepValid(currentStep, stepValidations);
};

/**
 * Отримує помилки валідації конкретного кроку
 */
export const getStepValidationErrors = (
  step: WizardStep,
  stepValidations: Record<WizardStep, WizardStepState>
): string[] => {
  const validation = stepValidations[step];
  return validation?.errors || [];
};

/**
 * Перевіряє чи всі обов'язкові кроки пройдені валідацію
 */
export const areRequiredStepsValid = (
  requiredSteps: WizardStep[],
  stepValidations: Record<WizardStep, WizardStepState>
): boolean => {
  return requiredSteps.every((step) => isStepValid(step, stepValidations));
};

/**
 * Отримує кількість валідних кроків
 */
export const getValidStepsCount = (
  stepValidations: Record<WizardStep, WizardStepState>
): number => {
  return Object.values(stepValidations).reduce((count, validation) => {
    return validation.isValid ? count + 1 : count;
  }, 0);
};

/**
 * Перевіряє чи є критичні помилки, які блокують продовження
 */
export const hasCriticalErrors = (
  stepValidations: Record<WizardStep, WizardStepState>
): boolean => {
  return Object.values(stepValidations).some(
    (validation) => validation.validationStatus === ValidationStatus.INVALID
  );
};
