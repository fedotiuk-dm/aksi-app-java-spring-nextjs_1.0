'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type WizardStep = 'client' | 'orderInfo' | 'review';

interface OrderWizardState {
  // Основний стан процесу
  currentStep: WizardStep;
  sessionId: string | null;

  // UI флаги
  isDirty: boolean;
  isLoading: boolean;
  autosaveError: string | null;

  // Допоміжні UI стани для клієнта
  isClientSearchOpen: boolean;
  isClientCreateOpen: boolean;
  showValidationErrors: boolean;

  // Дії для управління процесом
  setCurrentStep: (step: WizardStep) => void;
  setSessionId: (sessionId: string | null) => void;

  // Дії для UI флагів
  setLoading: (loading: boolean) => void;
  setDirty: (dirty: boolean) => void;
  setAutosaveError: (error: string | null) => void;

  // Дії для допоміжних UI станів
  setClientSearchOpen: (open: boolean) => void;
  setClientCreateOpen: (open: boolean) => void;
  setShowValidationErrors: (show: boolean) => void;

  // Навігація між кроками
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoNext: () => boolean;
  canGoBack: () => boolean;

  // Скидання стану
  reset: () => void;
}

const initialState = {
  currentStep: 'client' as WizardStep,
  sessionId: null,
  isDirty: false,
  isLoading: false,
  autosaveError: null,
  isClientSearchOpen: true,
  isClientCreateOpen: false,
  showValidationErrors: false,
};

export const useOrderWizardStore = create<OrderWizardState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Основні дії
      setCurrentStep: (step) => set({ currentStep: step }),
      setSessionId: (sessionId) => set({ sessionId }),

      // UI флаги
      setLoading: (isLoading) => set({ isLoading }),
      setDirty: (isDirty) => set({ isDirty }),
      setAutosaveError: (autosaveError) => set({ autosaveError }),

      // Допоміжні UI стани
      setClientSearchOpen: (isClientSearchOpen) =>
        set({
          isClientSearchOpen,
          isClientCreateOpen: isClientSearchOpen ? false : get().isClientCreateOpen,
        }),
      setClientCreateOpen: (isClientCreateOpen) =>
        set({
          isClientCreateOpen,
          isClientSearchOpen: isClientCreateOpen ? false : get().isClientSearchOpen,
        }),
      setShowValidationErrors: (showValidationErrors) => set({ showValidationErrors }),

      // Навігація
      goToNextStep: () => {
        const { currentStep } = get();
        switch (currentStep) {
          case 'client':
            set({ currentStep: 'orderInfo' });
            break;
          case 'orderInfo':
            set({ currentStep: 'review' });
            break;
          default:
            break;
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get();
        switch (currentStep) {
          case 'review':
            set({ currentStep: 'orderInfo' });
            break;
          case 'orderInfo':
            set({ currentStep: 'client' });
            break;
          default:
            break;
        }
      },

      canGoNext: () => {
        const { currentStep, sessionId, isLoading } = get();

        if (isLoading) return false;
        if (!sessionId) return false;

        // Перевірки будуть в RHF через валідацію Orval схем
        switch (currentStep) {
          case 'client':
            return true;
          case 'orderInfo':
            return true;
          case 'review':
            return false; // Останній крок
          default:
            return false;
        }
      },

      canGoBack: () => {
        const { currentStep, isLoading } = get();

        if (isLoading) return false;

        return currentStep !== 'client';
      },

      // Скидання стану
      reset: () => set(initialState),
    }),
    {
      name: 'order-wizard-store',
    }
  )
);
