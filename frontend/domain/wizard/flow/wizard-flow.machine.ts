/**
 * Головна XState машина для Order Wizard
 * Управління переходами між кроками та станом wizard
 */

import { createMachine, assign } from 'xstate';

import { WizardStep, ItemWizardStep, WizardMode } from '../shared/types/wizard-common.types';
import { generateSessionId } from '../shared/utils/wizard.utils';

// Типи для машини
type WizardContext = {
  currentStep: WizardStep;
  currentItemStep?: ItemWizardStep;
  mode: WizardMode;
  progress: number;
  canProceed: boolean;
  errors: string[];
  warnings: string[];
  sessionId: string;
};

type WizardEvent =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GOTO_STEP'; targetStep: WizardStep }
  | { type: 'GOTO_ITEM_STEP'; targetItemStep: ItemWizardStep }
  | { type: 'START_ITEM_WIZARD' }
  | { type: 'COMPLETE_ITEM_WIZARD' }
  | { type: 'CANCEL_ITEM_WIZARD' }
  | { type: 'VALIDATE_STEP' }
  | { type: 'SAVE_DRAFT' }
  | { type: 'AUTO_SAVE' }
  | { type: 'RESET' }
  | { type: 'COMPLETE' };

// Константи для переходів
const ITEMS_LIST_TARGET = '#orderWizard.itemsManager.itemsList';

// Початковий контекст
const initialContext: WizardContext = {
  currentStep: WizardStep.CLIENT_SELECTION,
  currentItemStep: undefined,
  mode: WizardMode.CREATE,
  progress: 0,
  canProceed: false,
  errors: [],
  warnings: [],
  sessionId: generateSessionId(),
};

export const wizardFlowMachine = createMachine(
  {
    id: 'orderWizard',

    context: initialContext,

    initial: 'clientInfo',

    types: {
      context: {} as WizardContext,
      events: {} as WizardEvent,
    },

    states: {
      // Стан 1: Вибір/створення клієнта
      clientInfo: {
        entry: assign({
          currentStep: WizardStep.CLIENT_SELECTION,
          currentItemStep: undefined,
        }),

        on: {
          NEXT: 'branchSelection',
          VALIDATE_STEP: { actions: 'validateCurrentStep' },
          SAVE_DRAFT: { actions: 'saveDraft' },
        },
      },

      // Стан 2: Вибір філії
      branchSelection: {
        entry: assign({
          currentStep: WizardStep.BRANCH_SELECTION,
          currentItemStep: undefined,
        }),

        on: {
          NEXT: 'itemsManager',
          PREV: 'clientInfo',
          VALIDATE_STEP: { actions: 'validateCurrentStep' },
          SAVE_DRAFT: { actions: 'saveDraft' },
        },
      },

      // Стан 3: Управління предметами
      itemsManager: {
        entry: assign({
          currentStep: WizardStep.ITEM_MANAGER,
          currentItemStep: undefined,
        }),

        initial: 'itemsList',

        states: {
          itemsList: {
            on: {
              START_ITEM_WIZARD: 'itemWizard',
            },
          },

          itemWizard: {
            initial: 'itemBasicInfo',

            states: {
              // Підстан 1: Основна інформація про предмет
              itemBasicInfo: {
                entry: assign({
                  currentItemStep: ItemWizardStep.ITEM_BASIC_INFO,
                }),

                on: {
                  NEXT: 'itemProperties',
                  CANCEL_ITEM_WIZARD: ITEMS_LIST_TARGET,
                },
              },

              // Підстан 2: Властивості предмета
              itemProperties: {
                entry: assign({
                  currentItemStep: ItemWizardStep.ITEM_PROPERTIES,
                }),

                on: {
                  NEXT: 'defectsStains',
                  PREV: 'itemBasicInfo',
                  CANCEL_ITEM_WIZARD: ITEMS_LIST_TARGET,
                },
              },

              // Підстан 3: Дефекти та плями
              defectsStains: {
                entry: assign({
                  currentItemStep: ItemWizardStep.DEFECTS_STAINS,
                }),

                on: {
                  NEXT: 'priceCalculator',
                  PREV: 'itemProperties',
                  CANCEL_ITEM_WIZARD: ITEMS_LIST_TARGET,
                },
              },

              // Підстан 4: Розрахунок ціни
              priceCalculator: {
                entry: assign({
                  currentItemStep: ItemWizardStep.PRICE_CALCULATOR,
                }),

                on: {
                  NEXT: 'photoDocumentation',
                  PREV: 'defectsStains',
                  CANCEL_ITEM_WIZARD: ITEMS_LIST_TARGET,
                },
              },

              // Підстан 5: Фотодокументація
              photoDocumentation: {
                entry: assign({
                  currentItemStep: ItemWizardStep.PHOTO_DOCUMENTATION,
                }),

                on: {
                  COMPLETE_ITEM_WIZARD: ITEMS_LIST_TARGET,
                  PREV: 'priceCalculator',
                  CANCEL_ITEM_WIZARD: ITEMS_LIST_TARGET,
                },
              },
            },

            on: {
              GOTO_ITEM_STEP: [
                {
                  target: '.itemBasicInfo',
                  guard: ({ event }) => event.targetItemStep === ItemWizardStep.ITEM_BASIC_INFO,
                },
                {
                  target: '.itemProperties',
                  guard: ({ event }) => event.targetItemStep === ItemWizardStep.ITEM_PROPERTIES,
                },
                {
                  target: '.defectsStains',
                  guard: ({ event }) => event.targetItemStep === ItemWizardStep.DEFECTS_STAINS,
                },
                {
                  target: '.priceCalculator',
                  guard: ({ event }) => event.targetItemStep === ItemWizardStep.PRICE_CALCULATOR,
                },
                {
                  target: '.photoDocumentation',
                  guard: ({ event }) => event.targetItemStep === ItemWizardStep.PHOTO_DOCUMENTATION,
                },
              ],
            },

            exit: assign({
              currentItemStep: undefined,
            }),
          },
        },

        on: {
          NEXT: 'orderParams',
          PREV: 'branchSelection',
          VALIDATE_STEP: { actions: 'validateCurrentStep' },
          SAVE_DRAFT: { actions: 'saveDraft' },
        },
      },

      // Стан 4: Параметри замовлення
      orderParams: {
        entry: assign({
          currentStep: WizardStep.ORDER_PARAMETERS,
          currentItemStep: undefined,
        }),

        on: {
          NEXT: 'confirmation',
          PREV: 'itemsManager',
          VALIDATE_STEP: { actions: 'validateCurrentStep' },
          SAVE_DRAFT: { actions: 'saveDraft' },
        },
      },

      // Стан 5: Підтвердження
      confirmation: {
        entry: assign({
          currentStep: WizardStep.ORDER_CONFIRMATION,
          currentItemStep: undefined,
        }),

        on: {
          COMPLETE: 'completed',
          PREV: 'orderParams',
          VALIDATE_STEP: { actions: 'validateCurrentStep' },
        },
      },

      // Завершений стан
      completed: {
        type: 'final',
      },
    },

    on: {
      // Глобальні події
      RESET: {
        target: 'clientInfo',
        actions: 'resetWizard',
      },
      GOTO_STEP: [
        {
          target: 'clientInfo',
          guard: ({ event }) => event.targetStep === WizardStep.CLIENT_SELECTION,
        },
        {
          target: 'branchSelection',
          guard: ({ event }) => event.targetStep === WizardStep.BRANCH_SELECTION,
        },
        {
          target: 'itemsManager',
          guard: ({ event }) => event.targetStep === WizardStep.ITEM_MANAGER,
        },
        {
          target: 'orderParams',
          guard: ({ event }) => event.targetStep === WizardStep.ORDER_PARAMETERS,
        },
        {
          target: 'confirmation',
          guard: ({ event }) => event.targetStep === WizardStep.ORDER_CONFIRMATION,
        },
      ],
      AUTO_SAVE: { actions: 'autoSave' },
    },
  },
  {
    // Actions (будуть реалізовані в окремому файлі)
    actions: {
      validateCurrentStep: () => {},
      saveDraft: () => {},
      autoSave: () => {},
      resetWizard: assign(initialContext),
    },
  }
);
