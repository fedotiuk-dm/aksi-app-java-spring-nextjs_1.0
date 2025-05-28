import { setup, assign } from 'xstate';

import { WizardMachineContext, WizardMachineEvent } from './machine-types';
import { WizardStep } from '../types/wizard-steps.types';

/**
 * XState v5 машина для wizard navigation
 *
 * Принцип: ТІЛЬКИ навігація між станами
 * Бізнес-логіка: в domain hooks (Zustand + TanStack Query + Zod)
 *
 * Дотримання SOLID:
 * - SRP: тільки navigation logic
 * - OCP: можна додавати нові стани без зміни існуючих
 * - DIP: не залежить від конкретних domain implementations
 */
export const wizardMachine = setup({
  types: {
    context: {} as WizardMachineContext,
    events: {} as WizardMachineEvent,
    tags: {} as 'loading' | 'validating' | 'saving',
  },

  actions: {
    updateStep: assign(({ event }) => {
      if (event.type === 'GO_TO_STEP') {
        return { currentStep: event.step };
      }
      return {};
    }),

    updateSubStep: assign(({ event }) => {
      if (event.type === 'NEXT_ITEM_STEP' || event.type === 'PREV_ITEM_STEP') {
        // Конкретна логіка буде в domain hooks
        return {};
      }
      return {};
    }),

    reset: assign(() => ({
      currentStep: WizardStep.CLIENT_SELECTION,
      currentSubStep: undefined,
    })),
  },

  guards: {
    canProceed: () => true, // Реальна валідація в domain hooks
    canGoBack: ({ context }) => context.currentStep !== WizardStep.CLIENT_SELECTION,
    canComplete: () => true, // Реальна валідація в domain hooks
  },
}).createMachine({
  id: 'wizard',
  initial: 'clientSelection',

  context: {
    currentStep: WizardStep.CLIENT_SELECTION,
    currentSubStep: undefined,
  },

  states: {
    clientSelection: {
      on: {
        NEXT: {
          target: 'branchSelection',
          guard: 'canProceed',
          actions: 'updateStep',
        },
      },
    },

    branchSelection: {
      on: {
        NEXT: {
          target: 'itemManager',
          guard: 'canProceed',
          actions: 'updateStep',
        },
        PREV: {
          target: 'clientSelection',
          guard: 'canGoBack',
          actions: 'updateStep',
        },
      },
    },

    itemManager: {
      initial: 'itemList',
      states: {
        itemList: {
          on: {
            START_ITEM_WIZARD: 'itemWizard',
          },
        },

        itemWizard: {
          initial: 'basicInfo',
          states: {
            basicInfo: { on: { NEXT_ITEM_STEP: 'properties' } },
            properties: {
              on: {
                NEXT_ITEM_STEP: 'defects',
                PREV_ITEM_STEP: 'basicInfo',
              },
            },
            defects: {
              on: {
                NEXT_ITEM_STEP: 'pricing',
                PREV_ITEM_STEP: 'properties',
              },
            },
            pricing: {
              on: {
                NEXT_ITEM_STEP: 'photos',
                PREV_ITEM_STEP: 'defects',
              },
            },
            photos: {
              on: {
                COMPLETE_ITEM_WIZARD: '#wizard.itemManager.itemList',
                CANCEL_ITEM_WIZARD: '#wizard.itemManager.itemList',
                PREV_ITEM_STEP: 'pricing',
              },
            },
          },
        },
      },
      on: {
        NEXT: {
          target: 'orderParameters',
          guard: 'canProceed',
          actions: 'updateStep',
        },
        PREV: {
          target: 'branchSelection',
          guard: 'canGoBack',
          actions: 'updateStep',
        },
      },
    },

    orderParameters: {
      on: {
        NEXT: {
          target: 'confirmation',
          guard: 'canProceed',
          actions: 'updateStep',
        },
        PREV: {
          target: 'itemManager',
          guard: 'canGoBack',
          actions: 'updateStep',
        },
      },
    },

    confirmation: {
      on: {
        COMPLETE_WIZARD: {
          target: 'completed',
          guard: 'canComplete',
          actions: 'updateStep',
        },
        PREV: {
          target: 'orderParameters',
          guard: 'canGoBack',
          actions: 'updateStep',
        },
      },
    },

    completed: {
      type: 'final',
    },
  },

  on: {
    RESET: {
      target: '.clientSelection',
      actions: 'reset',
    },

    GO_TO_STEP: {
      target: '.clientSelection', // Будемо обробляти динамічно в domain hook
      actions: 'updateStep',
    },
  },
});

export type WizardMachine = typeof wizardMachine;
