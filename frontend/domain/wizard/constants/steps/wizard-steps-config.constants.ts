/**
 * Конфігурація поведінки кроків wizard - відповідальність за правила та обмеження
 */

import { WizardStep, ItemWizardStep } from '../../types/common';

/**
 * Обов'язкові кроки (не можна пропустити)
 */
export const REQUIRED_STEPS: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_CONFIRMATION,
] as const;

/**
 * Обов'язкові підкроки Item Wizard
 */
export const REQUIRED_ITEM_STEPS: ItemWizardStep[] = [
  ItemWizardStep.ITEM_BASIC_INFO,
  ItemWizardStep.ITEM_PROPERTIES,
  ItemWizardStep.PRICE_CALCULATOR,
] as const;

/**
 * Кроки що можуть мати незбережені зміни
 */
export const STEPS_WITH_UNSAVED_CHANGES: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_PARAMETERS,
] as const;

/**
 * Кроки які потребують API валідації
 */
export const STEPS_WITH_API_VALIDATION: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
] as const;
