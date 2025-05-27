/**
 * @fileoverview Інтерфейс для навігації в item wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard/interfaces/item-navigation
 */

import type { ItemOperationResult } from '../types/item-operation-result.types';
import type { ItemWizardStep } from '../types/item-wizard-steps.types';
import type { ItemWizardState } from '../types/item-wizard-state.types';

/**
 * Інтерфейс для навігації в item wizard
 */
export interface IItemNavigationService {
  /**
   * Отримання першого кроку
   */
  getFirstStep(): ItemWizardStep;

  /**
   * Отримання останнього кроку
   */
  getLastStep(): ItemWizardStep;

  /**
   * Отримання наступного кроку
   */
  getNextStep(currentStep: ItemWizardStep): ItemOperationResult<ItemWizardStep>;

  /**
   * Отримання попереднього кроку
   */
  getPreviousStep(currentStep: ItemWizardStep): ItemOperationResult<ItemWizardStep>;

  /**
   * Перевірка можливості переходу до кроку
   */
  canGoToStep(targetStep: ItemWizardStep, currentState: ItemWizardState): boolean;

  /**
   * Отримання всіх доступних кроків
   */
  getAvailableSteps(currentState: ItemWizardState): ItemWizardStep[];
}
