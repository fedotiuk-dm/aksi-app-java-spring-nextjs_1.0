// Zustand Store для Client Creation - ТІЛЬКИ UI стан
// API дані керуються через React Query в Orval хуках

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// =================== ТИПИ ===================

interface ClientCreationUIState {
  // Session та workflow
  sessionId: string | null;

  // Форма створення
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;

  // Валідація
  validateOnChange: boolean;
  showValidationErrors: boolean;
  hasValidationErrors: boolean;

  // Налаштування
  autoSave: boolean;
  confirmBeforeCreate: boolean;

  // UI стани
  isFormDirty: boolean;
  showConfirmDialog: boolean;
  showValidationDialog: boolean;

  // Модалки
  showSuccessDialog: boolean;
  showErrorDialog: boolean;
}

interface ClientCreationUIActions {
  // Session management
  setSessionId: (sessionId: string | null) => void;

  // Form data actions
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setPhone: (phone: string) => void;
  setEmail: (email: string) => void;
  setAddress: (address: string) => void;

  // Validation actions
  setValidateOnChange: (validate: boolean) => void;
  setShowValidationErrors: (show: boolean) => void;
  setHasValidationErrors: (hasErrors: boolean) => void;

  // Settings actions
  setAutoSave: (autoSave: boolean) => void;
  setConfirmBeforeCreate: (confirm: boolean) => void;

  // UI actions
  setIsFormDirty: (dirty: boolean) => void;
  setShowConfirmDialog: (show: boolean) => void;
  setShowValidationDialog: (show: boolean) => void;

  // Modal actions
  setShowSuccessDialog: (show: boolean) => void;
  setShowErrorDialog: (show: boolean) => void;

  // Complex actions
  clearForm: () => void;
  markFormDirty: () => void;
  resetToInitialState: () => void;
}

// =================== INITIAL STATE ===================

const initialState: ClientCreationUIState = {
  // Session та workflow
  sessionId: null,

  // Форма створення
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',

  // Валідація
  validateOnChange: true,
  showValidationErrors: true,
  hasValidationErrors: false,

  // Налаштування
  autoSave: true,
  confirmBeforeCreate: false,

  // UI стани
  isFormDirty: false,
  showConfirmDialog: false,
  showValidationDialog: false,

  // Модалки
  showSuccessDialog: false,
  showErrorDialog: false,
};

// =================== STORE ===================

export const useClientCreationStore = create<ClientCreationUIState & ClientCreationUIActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Session management
    setSessionId: (sessionId) => set({ sessionId }),

    // Form data actions
    setFirstName: (firstName) => set({ firstName, isFormDirty: true }),
    setLastName: (lastName) => set({ lastName, isFormDirty: true }),
    setPhone: (phone) => set({ phone, isFormDirty: true }),
    setEmail: (email) => set({ email, isFormDirty: true }),
    setAddress: (address) => set({ address, isFormDirty: true }),

    // Validation actions
    setValidateOnChange: (validateOnChange) => set({ validateOnChange }),
    setShowValidationErrors: (showValidationErrors) => set({ showValidationErrors }),
    setHasValidationErrors: (hasValidationErrors) => set({ hasValidationErrors }),

    // Settings actions
    setAutoSave: (autoSave) => set({ autoSave }),
    setConfirmBeforeCreate: (confirmBeforeCreate) => set({ confirmBeforeCreate }),

    // UI actions
    setIsFormDirty: (isFormDirty) => set({ isFormDirty }),
    setShowConfirmDialog: (showConfirmDialog) => set({ showConfirmDialog }),
    setShowValidationDialog: (showValidationDialog) => set({ showValidationDialog }),

    // Modal actions
    setShowSuccessDialog: (showSuccessDialog) => set({ showSuccessDialog }),
    setShowErrorDialog: (showErrorDialog) => set({ showErrorDialog }),

    // Complex actions
    clearForm: () =>
      set({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        isFormDirty: false,
        hasValidationErrors: false,
      }),

    markFormDirty: () => set({ isFormDirty: true }),

    resetToInitialState: () => set(initialState),
  }))
);

// =================== СЕЛЕКТОРИ ===================

// Селектор для перевірки чи форма заповнена
export const useIsFormValid = () =>
  useClientCreationStore(
    (state) => state.firstName.length >= 2 && state.lastName.length >= 2 && state.phone.length >= 10
  );

// Селектор для перевірки чи можна створити клієнта
export const useCanCreateClient = () =>
  useClientCreationStore(
    (state) =>
      state.firstName.length >= 2 &&
      state.lastName.length >= 2 &&
      state.phone.length >= 10 &&
      !state.hasValidationErrors
  );

// Селектор для отримання даних форми
export const useFormData = () =>
  useClientCreationStore((state) => ({
    firstName: state.firstName,
    lastName: state.lastName,
    phone: state.phone,
    email: state.email,
    address: state.address,
  }));
