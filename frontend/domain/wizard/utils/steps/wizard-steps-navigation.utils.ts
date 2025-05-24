/**
 * Утилітарні функції навігації кроків wizard - відповідальність за логіку навігації
 */

import { REQUIRED_STEPS, WIZARD_STEPS_ORDER, ITEM_WIZARD_STEPS_ORDER } from '../../constants/steps';
import { WizardStep, ItemWizardStep } from '../../types/common';

/**
 * Отримує індекс кроку в порядку виконання
 */
export const getStepIndex = (step: WizardStep): number => {
  return WIZARD_STEPS_ORDER.indexOf(step);
};

/**
 * Отримує індекс підкроку Item Wizard в порядку виконання
 */
export const getItemStepIndex = (step: ItemWizardStep): number => {
  return ITEM_WIZARD_STEPS_ORDER.indexOf(step);
};

/**
 * Отримує наступний крок або null якщо поточний крок останній
 */
export const getNextStep = (currentStep: WizardStep): WizardStep | null => {
  const currentIndex = getStepIndex(currentStep);
  const nextIndex = currentIndex + 1;
  return nextIndex < WIZARD_STEPS_ORDER.length ? WIZARD_STEPS_ORDER[nextIndex] : null;
};

/**
 * Отримує попередній крок або null якщо поточний крок перший
 */
export const getPrevStep = (currentStep: WizardStep): WizardStep | null => {
  const currentIndex = getStepIndex(currentStep);
  const prevIndex = currentIndex - 1;
  return prevIndex >= 0 ? WIZARD_STEPS_ORDER[prevIndex] : null;
};

/**
 * Перевіряє чи є крок обов'язковим
 */
export const isStepRequired = (step: WizardStep): boolean => {
  return REQUIRED_STEPS.includes(step);
};

/**
 * Розраховує прогрес виконання wizard у відсотках
 */
export const calculateProgress = (currentStep: WizardStep): number => {
  const currentIndex = getStepIndex(currentStep);
  return ((currentIndex + 1) / WIZARD_STEPS_ORDER.length) * 100;
};
