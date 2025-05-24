/**
 * Типи подій XState машини wizard
 *
 * Події організовані за категоріями:
 * - Navigation: переходи між кроками
 * - ItemWizard: управління підвізардом предметів
 * - Validation: валідація даних
 * - StateManagement: збереження та відновлення
 */

import { WizardStep, ItemWizardStep } from '../../shared/types/wizard-common.types';

// Navigation Events
export namespace NavigationEvents {
  export interface NextEvent {
    type: 'NEXT';
  }

  export interface PrevEvent {
    type: 'PREV';
  }

  export interface GotoStepEvent {
    type: 'GOTO_STEP';
    targetStep: WizardStep;
  }
}

// Item Wizard Events
export namespace ItemWizardEvents {
  export interface StartItemWizardEvent {
    type: 'START_ITEM_WIZARD';
  }

  export interface EditItemWizardEvent {
    type: 'EDIT_ITEM_WIZARD';
    itemId: string;
    startStep?: ItemWizardStep;
  }

  export interface NextItemStepEvent {
    type: 'NEXT_ITEM_STEP';
  }

  export interface PrevItemStepEvent {
    type: 'PREV_ITEM_STEP';
  }

  export interface GotoItemStepEvent {
    type: 'GOTO_ITEM_STEP';
    targetItemStep: ItemWizardStep;
  }

  export interface CompleteItemWizardEvent {
    type: 'COMPLETE_ITEM_WIZARD';
  }

  export interface CancelItemWizardEvent {
    type: 'CANCEL_ITEM_WIZARD';
    confirmCancel?: boolean;
  }
}

// Validation Events
export namespace ValidationEvents {
  export interface ValidateStepEvent {
    type: 'VALIDATE_STEP';
    showErrors?: boolean;
  }

  export interface ValidateAllEvent {
    type: 'VALIDATE_ALL';
  }

  export interface ClearValidationEvent {
    type: 'CLEAR_VALIDATION';
    specificErrors?: string[];
  }
}

// State Management Events
export namespace StateManagementEvents {
  export interface SaveDraftEvent {
    type: 'SAVE_DRAFT';
    silent?: boolean;
  }

  export interface AutoSaveEvent {
    type: 'AUTO_SAVE';
  }

  export interface RestoreDraftEvent {
    type: 'RESTORE_DRAFT';
    draftId: string;
  }

  export interface ResetEvent {
    type: 'RESET';
    confirmReset?: boolean;
  }

  export interface CompleteEvent {
    type: 'COMPLETE';
  }
}

// Union type всіх подій
export type WizardEvent =
  | NavigationEvents.NextEvent
  | NavigationEvents.PrevEvent
  | NavigationEvents.GotoStepEvent
  | ItemWizardEvents.StartItemWizardEvent
  | ItemWizardEvents.EditItemWizardEvent
  | ItemWizardEvents.NextItemStepEvent
  | ItemWizardEvents.PrevItemStepEvent
  | ItemWizardEvents.GotoItemStepEvent
  | ItemWizardEvents.CompleteItemWizardEvent
  | ItemWizardEvents.CancelItemWizardEvent
  | ValidationEvents.ValidateStepEvent
  | ValidationEvents.ValidateAllEvent
  | ValidationEvents.ClearValidationEvent
  | StateManagementEvents.SaveDraftEvent
  | StateManagementEvents.AutoSaveEvent
  | StateManagementEvents.RestoreDraftEvent
  | StateManagementEvents.ResetEvent
  | StateManagementEvents.CompleteEvent;

// Event creators для type safety
export namespace EventCreators {
  export const createGotoStepEvent = (targetStep: WizardStep): NavigationEvents.GotoStepEvent => ({
    type: 'GOTO_STEP',
    targetStep,
  });

  export const createGotoItemStepEvent = (
    targetItemStep: ItemWizardStep
  ): ItemWizardEvents.GotoItemStepEvent => ({
    type: 'GOTO_ITEM_STEP',
    targetItemStep,
  });

  export const createEditItemEvent = (
    itemId: string,
    startStep?: ItemWizardStep
  ): ItemWizardEvents.EditItemWizardEvent => ({
    type: 'EDIT_ITEM_WIZARD',
    itemId,
    startStep,
  });

  export const createValidateStepEvent = (
    showErrors?: boolean
  ): ValidationEvents.ValidateStepEvent => ({
    type: 'VALIDATE_STEP',
    showErrors,
  });
}
