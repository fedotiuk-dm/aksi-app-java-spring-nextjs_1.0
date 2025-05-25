/**
 * Утиліти розрахунку прогресу - відповідальність за обчислення прогресу проходження wizard
 */

import { getStepIndex, getItemStepIndex } from './wizard-steps-navigation.utils';
import {
  WIZARD_STEPS_ORDER,
  ITEM_WIZARD_STEPS_ORDER,
} from '../constants';
import { WizardStep, ItemWizardStep } from '../types';

/**
 * Розраховує загальний прогрес wizard у відсотках
 */
export const calculateWizardProgress = (
  currentStep: WizardStep,
  completedSteps: WizardStep[]
): number => {
  const currentIndex = getStepIndex(currentStep);
  const completedCount = completedSteps.length;
  const totalSteps = WIZARD_STEPS_ORDER.length;

  // Прогрес = (завершені кроки + прогрес поточного кроку) / загальна кількість
  const currentStepProgress = currentIndex >= 0 ? 0.5 : 0; // 50% за початок кроку
  return ((completedCount + currentStepProgress) / totalSteps) * 100;
};

/**
 * Розраховує прогрес Item Wizard у відсотках
 */
export const calculateItemWizardProgress = (
  currentStep: ItemWizardStep,
  completedSteps: ItemWizardStep[]
): number => {
  const currentIndex = getItemStepIndex(currentStep);
  const completedCount = completedSteps.length;
  const totalSteps = ITEM_WIZARD_STEPS_ORDER.length;

  const currentStepProgress = currentIndex >= 0 ? 0.5 : 0;
  return ((completedCount + currentStepProgress) / totalSteps) * 100;
};

/**
 * Розраховує прогрес конкретного кроку на основі заповнених полів
 */
export const calculateStepProgress = (requiredFields: string[], filledFields: string[]): number => {
  if (requiredFields.length === 0) return 100;

  const filledCount = requiredFields.filter((field) => filledFields.includes(field)).length;
  return (filledCount / requiredFields.length) * 100;
};

/**
 * Розраховує загальний прогрес з урахуванням ваги кроків
 */
export const calculateWeightedProgress = (
  steps: Array<{ step: WizardStep; weight: number; completed: boolean }>
): number => {
  const totalWeight = steps.reduce((sum, step) => sum + step.weight, 0);
  const completedWeight = steps
    .filter((step) => step.completed)
    .reduce((sum, step) => sum + step.weight, 0);

  return totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
};
