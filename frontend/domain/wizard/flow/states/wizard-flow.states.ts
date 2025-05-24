/**
 * States конфігурація для XState машини wizard
 */

import { WizardStep, ItemWizardStep } from '../../shared/types/wizard-common.types';

// Константи для цілей переходів
const WIZARD_STEP_TARGET = '#wizard.step';
const ITEM_MANAGER_LIST_TARGET = '#wizard.itemManager.list';

// Основні стани wizard
export const wizardStates = {
  [WizardStep.CLIENT_SELECTION]: {
    on: {
      NEXT: {
        target: WizardStep.BRANCH_SELECTION,
        cond: 'canProceedToNextStep',
      },
      GOTO_STEP: {
        target: WIZARD_STEP_TARGET,
        cond: 'canGotoStep',
      },
    },
  },

  [WizardStep.BRANCH_SELECTION]: {
    on: {
      NEXT: {
        target: WizardStep.ITEM_MANAGER,
        cond: 'canProceedToNextStep',
      },
      PREV: {
        target: WizardStep.CLIENT_SELECTION,
        cond: 'canReturnToPrevStep',
      },
      GOTO_STEP: {
        target: WIZARD_STEP_TARGET,
        cond: 'canGotoStep',
      },
    },
  },

  [WizardStep.ITEM_MANAGER]: {
    initial: 'list',
    states: {
      list: {
        on: {
          START_ITEM_WIZARD: 'itemWizard',
          EDIT_ITEM_WIZARD: 'itemWizard',
        },
      },
      itemWizard: {
        initial: ItemWizardStep.ITEM_BASIC_INFO,
        states: {
          [ItemWizardStep.ITEM_BASIC_INFO]: {
            on: {
              NEXT_ITEM_STEP: ItemWizardStep.ITEM_PROPERTIES,
            },
          },
          [ItemWizardStep.ITEM_PROPERTIES]: {
            on: {
              NEXT_ITEM_STEP: ItemWizardStep.DEFECTS_STAINS,
              PREV_ITEM_STEP: ItemWizardStep.ITEM_BASIC_INFO,
            },
          },
          [ItemWizardStep.DEFECTS_STAINS]: {
            on: {
              NEXT_ITEM_STEP: ItemWizardStep.PRICE_CALCULATOR,
              PREV_ITEM_STEP: ItemWizardStep.ITEM_PROPERTIES,
            },
          },
          [ItemWizardStep.PRICE_CALCULATOR]: {
            on: {
              NEXT_ITEM_STEP: ItemWizardStep.PHOTO_DOCUMENTATION,
              PREV_ITEM_STEP: ItemWizardStep.DEFECTS_STAINS,
            },
          },
          [ItemWizardStep.PHOTO_DOCUMENTATION]: {
            on: {
              PREV_ITEM_STEP: ItemWizardStep.PRICE_CALCULATOR,
              COMPLETE_ITEM_WIZARD: ITEM_MANAGER_LIST_TARGET,
              CANCEL_ITEM_WIZARD: ITEM_MANAGER_LIST_TARGET,
            },
          },
        },
      },
    },
    on: {
      NEXT: {
        target: WizardStep.ORDER_PARAMETERS,
        cond: 'canProceedToNextStep',
      },
      PREV: {
        target: WizardStep.BRANCH_SELECTION,
        cond: 'canReturnToPrevStep',
      },
      GOTO_STEP: {
        target: WIZARD_STEP_TARGET,
        cond: 'canGotoStep',
      },
    },
  },

  [WizardStep.ORDER_PARAMETERS]: {
    on: {
      NEXT: {
        target: WizardStep.ORDER_CONFIRMATION,
        cond: 'canProceedToNextStep',
      },
      PREV: {
        target: WizardStep.ITEM_MANAGER,
        cond: 'canReturnToPrevStep',
      },
      GOTO_STEP: {
        target: WIZARD_STEP_TARGET,
        cond: 'canGotoStep',
      },
    },
  },

  [WizardStep.ORDER_CONFIRMATION]: {
    on: {
      PREV: {
        target: WizardStep.ORDER_PARAMETERS,
        cond: 'canReturnToPrevStep',
      },
      COMPLETE: {
        target: 'completed',
        cond: 'canComplete',
      },
    },
  },

  // Фінальний стан
  completed: {
    type: 'final',
  },
};
