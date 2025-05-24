/**
 * Головна XState машина для управління flow Order Wizard
 */

import { createMachine } from 'xstate';

import { createInitialContext } from './context';
import { wizardStates } from './states';

/**
 * Головна XState машина wizard
 */
export const wizardFlowMachine = createMachine({
  id: 'wizard',
  initial: 'clientSelection',
  context: createInitialContext(),
  states: {
    ...wizardStates,
    // Фінальний стан
    completed: {
      type: 'final' as const,
    },
  },
  on: {
    // Глобальні події доступні з будь-якого стану
    RESET: {
      target: '.clientSelection',
    },
    VALIDATE_STEP: {
      // Валідація поточного кроку
    },
    SAVE_DRAFT: {
      // Збереження чернетки
    },
    AUTO_SAVE: {
      // Автозбереження
    },
  },
});

export type WizardFlowMachine = typeof wizardFlowMachine;
