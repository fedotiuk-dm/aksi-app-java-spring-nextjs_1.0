// XState v5 типи для wizard navigation (SRP)
// Імпортуємо доменні концепти з types
import { WizardStep, ItemWizardStep } from '../types';

// XState v5 Context - мінімальний для navigation
export interface WizardMachineContext {
  currentStep: WizardStep;
  currentSubStep?: ItemWizardStep;
}

// XState v5 Events - тільки для navigation
export type WizardMachineEvent =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO_STEP'; step: WizardStep }
  | { type: 'START_ITEM_WIZARD' }
  | { type: 'COMPLETE_ITEM_WIZARD' }
  | { type: 'CANCEL_ITEM_WIZARD' }
  | { type: 'NEXT_ITEM_STEP' }
  | { type: 'PREV_ITEM_STEP' }
  | { type: 'COMPLETE_WIZARD' }
  | { type: 'RESET' };

// Helper types для type safety
export type NavigationDirection = 'next' | 'prev';

export interface WizardProgress {
  currentStepIndex: number;
  totalSteps: number;
  percentComplete: number;
  stepsCompleted: WizardStep[];
}
