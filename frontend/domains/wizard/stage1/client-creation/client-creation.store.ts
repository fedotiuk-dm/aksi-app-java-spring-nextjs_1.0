/**
 * @fileoverview Zustand стор для домену "Створення клієнта"
 *
 * Керує локальним UI станом для створення нового клієнта
 * НЕ зберігає API дані (це робить React Query)
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { ClientCreationUIFormData } from './client-creation.schemas';

interface ClientCreationUIState {
  // Сесія та навігація
  sessionId: string | null;
  isFormVisible: boolean;
  currentStep: 'basic' | 'communication' | 'source';

  // Форма та валідація
  formData: Partial<ClientCreationUIFormData>;
  isDirty: boolean;
  validationErrors: Record<string, string>;

  // UI стан
  isSubmitting: boolean;
  showDuplicateWarning: boolean;
  duplicateClientId: string | null;

  // Режими
  isAdvancedMode: boolean;
  autoCompleteEnabled: boolean;
}

interface ClientCreationUIActions {
  // Сесія та навігація
  setSessionId: (sessionId: string | null) => void;
  setFormVisible: (visible: boolean) => void;
  setCurrentStep: (step: 'basic' | 'communication' | 'source') => void;

  // Форма
  updateFormData: (data: Partial<ClientCreationUIFormData>) => void;
  resetFormData: () => void;
  setFormField: <K extends keyof ClientCreationUIFormData>(
    field: K,
    value: ClientCreationUIFormData[K]
  ) => void;

  // Валідація
  setValidationError: (field: string, error: string) => void;
  clearValidationErrors: () => void;
  setDirty: (dirty: boolean) => void;

  // UI контроли
  setSubmitting: (submitting: boolean) => void;
  setDuplicateWarning: (show: boolean, clientId?: string) => void;

  // Режими
  toggleAdvancedMode: () => void;
  setAutoCompleteEnabled: (enabled: boolean) => void;

  // Скидання стану
  resetState: () => void;
}

const initialFormData: Partial<ClientCreationUIFormData> = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  communicationChannels: ['PHONE'],
  informationSource: 'GOOGLE',
  sourceDetails: '',
};

const initialState: ClientCreationUIState = {
  // Сесія та навігація
  sessionId: null,
  isFormVisible: false,
  currentStep: 'basic',

  // Форма та валідація
  formData: initialFormData,
  isDirty: false,
  validationErrors: {},

  // UI стан
  isSubmitting: false,
  showDuplicateWarning: false,
  duplicateClientId: null,

  // Режими
  isAdvancedMode: false,
  autoCompleteEnabled: true,
};

export const useClientCreationStore = create<ClientCreationUIState & ClientCreationUIActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Сесія та навігація
    setSessionId: (sessionId) => set({ sessionId }),

    setFormVisible: (isFormVisible) => set({ isFormVisible }),

    setCurrentStep: (currentStep) => set({ currentStep }),

    // Форма
    updateFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
        isDirty: true,
      })),

    resetFormData: () =>
      set({
        formData: initialFormData,
        isDirty: false,
        validationErrors: {},
      }),

    setFormField: (field, value) =>
      set((state) => ({
        formData: { ...state.formData, [field]: value },
        isDirty: true,
      })),

    // Валідація
    setValidationError: (field, error) =>
      set((state) => ({
        validationErrors: { ...state.validationErrors, [field]: error },
      })),

    clearValidationErrors: () => set({ validationErrors: {} }),

    setDirty: (isDirty) => set({ isDirty }),

    // UI контроли
    setSubmitting: (isSubmitting) => set({ isSubmitting }),

    setDuplicateWarning: (showDuplicateWarning, duplicateClientId = undefined) =>
      set({ showDuplicateWarning, duplicateClientId }),

    // Режими
    toggleAdvancedMode: () => {
      const { isAdvancedMode } = get();
      set({ isAdvancedMode: !isAdvancedMode });
    },

    setAutoCompleteEnabled: (autoCompleteEnabled) => set({ autoCompleteEnabled }),

    // Скидання стану
    resetState: () => set(initialState),
  }))
);
