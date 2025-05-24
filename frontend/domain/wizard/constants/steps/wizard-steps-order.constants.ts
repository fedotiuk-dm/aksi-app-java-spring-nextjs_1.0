/**
 * Порядок кроків wizard - відповідальність за послідовність виконання кроків
 */

import { WizardStep, ItemWizardStep } from '../../types/common';

/**
 * Порядок основних кроків wizard
 */
export const WIZARD_STEPS_ORDER: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_PARAMETERS,
  WizardStep.ORDER_CONFIRMATION,
] as const;

/**
 * Порядок підкроків Item Wizard
 */
export const ITEM_WIZARD_STEPS_ORDER: ItemWizardStep[] = [
  ItemWizardStep.ITEM_BASIC_INFO,
  ItemWizardStep.ITEM_PROPERTIES,
  ItemWizardStep.DEFECTS_STAINS,
  ItemWizardStep.PRICE_CALCULATOR,
  ItemWizardStep.PHOTO_DOCUMENTATION,
] as const;
