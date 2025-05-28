/**
 * @fileoverview Базовий Zustand store для загальних станів wizard
 * @module domain/wizard/store/base
 * @author AKSI Team
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { WizardMode } from '../../types/wizard-modes.types';
import { WizardStep, ItemWizardStep } from '../../types/wizard-steps.types';

import type { WizardContext } from '../../types/wizard-context.types';

/**
 * Базовий стан wizard (навігація, помилки, завантаження)
 */
interface WizardBaseState {
  // Initialization
  isInitialized: boolean;
  context: WizardContext | null;
  mode: WizardMode;

  // Navigation state (синхронізується з XState)
  currentStep: WizardStep;
  currentSubStep: ItemWizardStep | undefined;
  completedSteps: WizardStep[];

  // Loading states
  isLoading: boolean;
  isItemWizardActive: boolean;

  // Changes tracking
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;

  // Error handling
  errors: string[];
  warnings: string[];
}

/**
 * Базові дії wizard
 */
interface WizardBaseActions {
  // Initialization
  initialize: (context: WizardContext) => { success: boolean; errors?: string[] };
  setMode: (mode: WizardMode) => void;

  // Navigation actions (синхронізується з XState)
  setCurrentStep: (step: WizardStep) => void;
  setCurrentSubStep: (subStep: ItemWizardStep | undefined) => void;
  addCompletedStep: (step: WizardStep) => void;
  removeCompletedStep: (step: WizardStep) => void;

  // Loading actions
  setLoading: (loading: boolean) => void;

  // Item wizard actions
  startItemWizard: () => void;
  completeItemWizard: () => void;

  // Changes tracking
  markUnsavedChanges: () => void;
  markSaved: () => void;

  // Error handling
  addError: (error: string) => void;
  addWarning: (warning: string) => void;
  clearErrors: () => void;
  clearWarnings: () => void;

  // Global actions
  completeWizard: () => void;
  resetWizard: () => void;
}

/**
 * Початковий базовий стан
 */
const initialBaseState: WizardBaseState = {
  isInitialized: false,
  context: null,
  mode: WizardMode.CREATE,
  currentStep: WizardStep.CLIENT_SELECTION,
  currentSubStep: undefined,
  completedSteps: [],
  isLoading: false,
  isItemWizardActive: false,
  hasUnsavedChanges: false,
  lastSavedAt: null,
  errors: [],
  warnings: [],
};

/**
 * Базовий Zustand store для загальних станів wizard
 *
 * Відповідальність:
 * - Ініціалізація та режим wizard
 * - Навігаційні стани (синхронізується з XState)
 * - Стани завантаження
 * - Відстеження змін
 * - Обробка помилок та попереджень
 * - Глобальні дії (завершення, скидання)
 */
export const useWizardBaseStore = create<WizardBaseState & WizardBaseActions>()(
  devtools(
    (set) => ({
      // Initial state
      ...initialBaseState,

      // Initialization
      initialize: (context) => {
        try {
          set(
            {
              isInitialized: true,
              context,
              mode: context.mode,
              errors: [],
              warnings: [],
            },
            false,
            'wizardBase/initialize'
          );
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка ініціалізації';
          set(
            (state) => ({ errors: [...state.errors, errorMessage] }),
            false,
            'wizardBase/initializeError'
          );
          return { success: false, errors: [errorMessage] };
        }
      },

      setMode: (mode) => set({ mode }, false, 'wizardBase/setMode'),

      // Navigation actions
      setCurrentStep: (step) => set({ currentStep: step }, false, 'wizardBase/setCurrentStep'),
      setCurrentSubStep: (subStep) =>
        set({ currentSubStep: subStep }, false, 'wizardBase/setCurrentSubStep'),
      addCompletedStep: (step) =>
        set(
          (state) => ({
            completedSteps: state.completedSteps.includes(step)
              ? state.completedSteps
              : [...state.completedSteps, step],
          }),
          false,
          'wizardBase/addCompletedStep'
        ),
      removeCompletedStep: (step) =>
        set(
          (state) => ({
            completedSteps: state.completedSteps.filter((s) => s !== step),
          }),
          false,
          'wizardBase/removeCompletedStep'
        ),

      // Loading actions
      setLoading: (loading) => set({ isLoading: loading }, false, 'wizardBase/setLoading'),

      // Item wizard actions
      startItemWizard: () => set({ isItemWizardActive: true }, false, 'wizardBase/startItemWizard'),
      completeItemWizard: () =>
        set({ isItemWizardActive: false }, false, 'wizardBase/completeItemWizard'),

      // Changes tracking
      markUnsavedChanges: () =>
        set({ hasUnsavedChanges: true }, false, 'wizardBase/markUnsavedChanges'),
      markSaved: () =>
        set({ hasUnsavedChanges: false, lastSavedAt: new Date() }, false, 'wizardBase/markSaved'),

      // Error handling
      addError: (error) =>
        set((state) => ({ errors: [...state.errors, error] }), false, 'wizardBase/addError'),
      addWarning: (warning) =>
        set(
          (state) => ({ warnings: [...state.warnings, warning] }),
          false,
          'wizardBase/addWarning'
        ),
      clearErrors: () => set({ errors: [] }, false, 'wizardBase/clearErrors'),
      clearWarnings: () => set({ warnings: [] }, false, 'wizardBase/clearWarnings'),

      // Global actions
      completeWizard: () =>
        set(
          {
            hasUnsavedChanges: false,
            isItemWizardActive: false,
            errors: [],
            warnings: [],
          },
          false,
          'wizardBase/completeWizard'
        ),

      resetWizard: () => set(initialBaseState, false, 'wizardBase/resetWizard'),
    }),
    {
      name: 'wizard-base-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type WizardBaseStore = ReturnType<typeof useWizardBaseStore>;
