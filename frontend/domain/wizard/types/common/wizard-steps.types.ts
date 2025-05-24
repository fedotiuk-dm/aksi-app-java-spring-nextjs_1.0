/**
 * Типи кроків wizard - відповідальність за енуми та константи кроків
 */

/**
 * Основні кроки Order Wizard
 */
export enum WizardStep {
  CLIENT_SELECTION = 'clientSelection',
  BRANCH_SELECTION = 'branchSelection',
  ITEM_MANAGER = 'itemManager',
  ORDER_PARAMETERS = 'orderParameters',
  ORDER_CONFIRMATION = 'orderConfirmation',
}

/**
 * Підкроки Item Wizard (в рамках ITEM_MANAGER)
 */
export enum ItemWizardStep {
  ITEM_BASIC_INFO = 'itemBasicInfo',
  ITEM_PROPERTIES = 'itemProperties',
  DEFECTS_STAINS = 'defectsStains',
  PRICE_CALCULATOR = 'priceCalculator',
  PHOTO_DOCUMENTATION = 'photoDocumentation',
}

/**
 * Тип для всіх можливих кроків
 */
export type AnyWizardStep = WizardStep | ItemWizardStep;
