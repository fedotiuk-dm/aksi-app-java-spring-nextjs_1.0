/**
 * @fileoverview Навігаційний сервіс для wizard - тільки крок за кроком
 * @module domain/wizard/machines/wizard-navigation
 */

import { WizardStep, ItemWizardStep } from '../types';

/**
 * Результат навігаційної операції
 */
export interface NavigationResult {
  success: boolean;
  currentStep: WizardStep;
  currentSubStep?: ItemWizardStep;
  canProceed: boolean;
  canGoBack: boolean;
}

/**
 * Навігаційний сервіс для wizard
 * 🚦 Відповідає ТІЛЬКИ за навігацію крок за кроком
 *
 * Принцип мінімалізму: тільки логіка переходів між кроками
 */
export class WizardNavigationService {
  /**
   * Переходи між основними кроками wizard
   */
  static getNextStep(currentStep: WizardStep): WizardStep | null {
    const stepOrder: WizardStep[] = [
      WizardStep.CLIENT_SELECTION,
      WizardStep.BRANCH_SELECTION,
      WizardStep.ITEM_MANAGER,
      WizardStep.ORDER_PARAMETERS,
      WizardStep.CONFIRMATION,
    ];

    const currentIndex = stepOrder.indexOf(currentStep);
    const nextIndex = currentIndex + 1;

    return nextIndex < stepOrder.length ? stepOrder[nextIndex] : null;
  }

  static getPreviousStep(currentStep: WizardStep): WizardStep | null {
    const stepOrder: WizardStep[] = [
      WizardStep.CLIENT_SELECTION,
      WizardStep.BRANCH_SELECTION,
      WizardStep.ITEM_MANAGER,
      WizardStep.ORDER_PARAMETERS,
      WizardStep.CONFIRMATION,
    ];

    const currentIndex = stepOrder.indexOf(currentStep);
    const prevIndex = currentIndex - 1;

    return prevIndex >= 0 ? stepOrder[prevIndex] : null;
  }

  /**
   * Переходи між підкроками Item Wizard
   */
  static getNextSubStep(currentSubStep: ItemWizardStep): ItemWizardStep | null {
    const subStepOrder: ItemWizardStep[] = [
      ItemWizardStep.BASIC_INFO,
      ItemWizardStep.PROPERTIES,
      ItemWizardStep.DEFECTS,
      ItemWizardStep.PRICING,
      ItemWizardStep.PHOTOS,
    ];

    const currentIndex = subStepOrder.indexOf(currentSubStep);
    const nextIndex = currentIndex + 1;

    return nextIndex < subStepOrder.length ? subStepOrder[nextIndex] : null;
  }

  static getPreviousSubStep(currentSubStep: ItemWizardStep): ItemWizardStep | null {
    const subStepOrder: ItemWizardStep[] = [
      ItemWizardStep.BASIC_INFO,
      ItemWizardStep.PROPERTIES,
      ItemWizardStep.DEFECTS,
      ItemWizardStep.PRICING,
      ItemWizardStep.PHOTOS,
    ];

    const currentIndex = subStepOrder.indexOf(currentSubStep);
    const prevIndex = currentIndex - 1;

    return prevIndex >= 0 ? subStepOrder[prevIndex] : null;
  }

  /**
   * Розрахунок прогресу wizard
   */
  static calculateProgress(currentStep: WizardStep): {
    percent: number;
    stepIndex: number;
    totalSteps: number;
  } {
    const mainSteps = [
      WizardStep.CLIENT_SELECTION,
      WizardStep.BRANCH_SELECTION,
      WizardStep.ITEM_MANAGER,
      WizardStep.ORDER_PARAMETERS,
      WizardStep.CONFIRMATION,
    ];

    const currentIndex = mainSteps.indexOf(currentStep);
    const totalSteps = mainSteps.length;
    const percent = Math.round((currentIndex / (totalSteps - 1)) * 100);

    return {
      percent,
      stepIndex: currentIndex,
      totalSteps,
    };
  }

  /**
   * Перевірка можливості переходу
   */
  static canNavigateNext(currentStep: WizardStep): boolean {
    return this.getNextStep(currentStep) !== null;
  }

  static canNavigateBack(currentStep: WizardStep): boolean {
    return this.getPreviousStep(currentStep) !== null;
  }

  /**
   * Перевірка доступності кроку на основі завершених кроків
   */
  static isStepAccessible(targetStep: WizardStep, completedSteps: WizardStep[]): boolean {
    const stepOrder: WizardStep[] = [
      WizardStep.CLIENT_SELECTION,
      WizardStep.BRANCH_SELECTION,
      WizardStep.ITEM_MANAGER,
      WizardStep.ORDER_PARAMETERS,
      WizardStep.CONFIRMATION,
    ];

    const targetIndex = stepOrder.indexOf(targetStep);
    if (targetIndex === -1) return false;

    // Перший крок завжди доступний
    if (targetIndex === 0) return true;

    // Крок доступний якщо попередній крок завершений
    const previousStep = stepOrder[targetIndex - 1];
    return completedSteps.includes(previousStep);
  }
}
