/**
 * Типи глобального стану wizard - відповідальність за центральний стан та навігацію
 */

import { SaveState } from './wizard-save-state.types';
import { WizardStepState } from './wizard-step-state.types';
import { WizardContext } from '../common/wizard-context.types';
import { WizardStep, ItemWizardStep } from '../common/wizard-steps.types';

/**
 * XState Context для головної машини
 */
export interface WizardMachineContext {
  currentStep: WizardStep;
  currentItemStep?: ItemWizardStep;
  context: WizardContext;
  progress: number;
  canProceed: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Стан навігації по основних кроках
 */
export interface NavigationState {
  currentStep: WizardStep;
  availableSteps: WizardStep[];
  completedSteps: WizardStep[];
  canGoNext: boolean;
  canGoPrev: boolean;
  progress: number;
  stepHistory: WizardStep[];
}

/**
 * Стан навігації Item Wizard
 */
export interface ItemWizardNavigationState {
  isActive: boolean;
  currentStep: ItemWizardStep;
  completedSteps: ItemWizardStep[];
  canGoNext: boolean;
  canGoPrev: boolean;
  progress: number;
  stepHistory: ItemWizardStep[];
  editingItemId?: string;
}

/**
 * Загальний глобальний стан wizard
 */
export interface WizardGlobalState {
  // Ініціалізація та завантаження
  isInitialized: boolean;
  isLoading: boolean;
  loadingMessage?: string;

  // Навігація
  navigation: NavigationState;
  itemWizardNavigation: ItemWizardNavigationState;

  // Контекст та метадані
  context: WizardContext;

  // Валідація всіх кроків
  stepValidations: Record<WizardStep, WizardStepState>;
  itemStepValidations: Record<ItemWizardStep, WizardStepState>;

  // Збереження
  saveState: SaveState;

  // Стан помилок
  hasErrors: boolean;
  lastError: string | null;
  criticalErrors: string[];

  // Статистика
  sessionStats: {
    startTime: Date;
    stepsCompleted: number;
    validationAttempts: number;
    saveAttempts: number;
  };
}

/**
 * Селектори для роботи з глобальним станом
 */
export interface WizardSelectors {
  getCurrentStep: () => WizardStep;
  getCurrentItemStep: () => ItemWizardStep | undefined;
  getStepValidation: (step: WizardStep) => WizardStepState;
  getItemStepValidation: (step: ItemWizardStep) => WizardStepState;
  getProgress: () => number;
  getItemWizardProgress: () => number;
  canProceedToNext: () => boolean;
  canGoToPrevious: () => boolean;
  getCompletedSteps: () => WizardStep[];
  hasUnsavedChanges: () => boolean;
  isStepAccessible: (step: WizardStep) => boolean;
  getValidationErrors: () => string[];
  getCriticalErrors: () => string[];
}
