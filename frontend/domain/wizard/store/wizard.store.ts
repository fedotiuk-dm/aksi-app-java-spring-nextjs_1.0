/**
 * @fileoverview Zustand store для wizard - відповідальність за бізнес-стан
 * @module domain/wizard/store
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { WizardMode } from '../types';

import type { ClientSearchResult, WizardContext } from '../types';

/**
 * Інтерфейс стану wizard store
 */
interface WizardState {
  // Wizard context
  isInitialized: boolean;
  context: WizardContext | null;
  mode: WizardMode;

  // Loading states
  isLoading: boolean;
  isItemWizardActive: boolean;

  // Client selection state
  selectedClientId: string | null;
  selectedClient: ClientSearchResult | null;
  isNewClient: boolean;

  // Changes tracking
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;

  // Error handling
  errors: string[];
  warnings: string[];
}

/**
 * Інтерфейс дій wizard store
 */
interface WizardActions {
  // Initialization
  initialize: (context: WizardContext) => { success: boolean; errors?: string[] };
  setMode: (mode: WizardMode) => void;

  // Loading actions
  setLoading: (loading: boolean) => void;

  // Client selection actions
  setSelectedClient: (client: ClientSearchResult) => void;
  clearSelectedClient: () => void;
  setNewClientFlag: (isNew: boolean) => void;

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
 * Початковий стан wizard
 */
const initialState: WizardState = {
  isInitialized: false,
  context: null,
  mode: WizardMode.CREATE,
  isLoading: false,
  isItemWizardActive: false,
  selectedClientId: null,
  selectedClient: null,
  isNewClient: false,
  hasUnsavedChanges: false,
  lastSavedAt: null,
  errors: [],
  warnings: [],
};

/**
 * Zustand store для wizard бізнес-стану
 *
 * Принципи:
 * - SRP: тільки бізнес-стан, не навігація (це в XState)
 * - Immutable updates
 * - Типізований API
 */
export const useWizardStore = create<WizardState & WizardActions>()(
  devtools(
    (set) => ({
      // Initial state
      ...initialState,

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
            'wizard/initialize'
          );
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка ініціалізації';
          set(
            (state) => ({ errors: [...state.errors, errorMessage] }),
            false,
            'wizard/initializeError'
          );
          return { success: false, errors: [errorMessage] };
        }
      },

      setMode: (mode) => set({ mode }, false, 'wizard/setMode'),

      // Loading actions
      setLoading: (loading) => set({ isLoading: loading }, false, 'wizard/setLoading'),

      // Client selection actions
      setSelectedClient: (client) =>
        set(
          { selectedClient: client, selectedClientId: client.id },
          false,
          'wizard/setSelectedClient'
        ),
      clearSelectedClient: () =>
        set(
          { selectedClient: null, selectedClientId: null, isNewClient: false },
          false,
          'wizard/clearSelectedClient'
        ),
      setNewClientFlag: (isNew) => set({ isNewClient: isNew }, false, 'wizard/setNewClientFlag'),

      // Item wizard actions
      startItemWizard: () => set({ isItemWizardActive: true }, false, 'wizard/startItemWizard'),

      completeItemWizard: () =>
        set({ isItemWizardActive: false }, false, 'wizard/completeItemWizard'),

      // Changes tracking
      markUnsavedChanges: () =>
        set({ hasUnsavedChanges: true }, false, 'wizard/markUnsavedChanges'),

      markSaved: () =>
        set({ hasUnsavedChanges: false, lastSavedAt: new Date() }, false, 'wizard/markSaved'),

      // Error handling
      addError: (error) =>
        set((state) => ({ errors: [...state.errors, error] }), false, 'wizard/addError'),

      addWarning: (warning) =>
        set((state) => ({ warnings: [...state.warnings, warning] }), false, 'wizard/addWarning'),

      clearErrors: () => set({ errors: [] }, false, 'wizard/clearErrors'),

      clearWarnings: () => set({ warnings: [] }, false, 'wizard/clearWarnings'),

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
          'wizard/completeWizard'
        ),

      resetWizard: () => set(initialState, false, 'wizard/resetWizard'),
    }),
    {
      name: 'wizard-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

export type WizardStore = ReturnType<typeof useWizardStore>;
