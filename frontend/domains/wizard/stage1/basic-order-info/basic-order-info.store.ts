/**
 * @fileoverview Zustand стор для домену "Основна інформація про замовлення"
 *
 * Керує локальним UI станом для роботи з основною інформацією замовлення
 * НЕ зберігає API дані (це робить React Query)
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type {
  BasicOrderUIFormData,
  BranchSelectionUIFormData,
  WorkflowStateData,
  BranchDisplayData,
} from './basic-order-info.schemas';

interface BasicOrderInfoUIState {
  // Сесія та workflow
  sessionId: string | null;
  isWorkflowActive: boolean;
  currentStep: WorkflowStateData['currentStep'];

  // Основна форма замовлення
  orderFormData: Partial<BasicOrderUIFormData>;
  isDirty: boolean;
  validationErrors: Record<string, string>;

  // Вибір філії
  branchFormData: Partial<BranchSelectionUIFormData>;
  availableBranches: BranchDisplayData[];
  filteredBranches: BranchDisplayData[];
  selectedBranch: BranchDisplayData | null;

  // UI стан
  isSubmitting: boolean;
  showBranchSelector: boolean;
  showReceiptGenerator: boolean;
  autoGenerateReceipt: boolean;

  // Режими та налаштування
  isAdvancedMode: boolean;
  autoSaveEnabled: boolean;
  showValidationHints: boolean;
}

interface BasicOrderInfoUIActions {
  // Сесія та workflow
  setSessionId: (sessionId: string | null) => void;
  setWorkflowActive: (active: boolean) => void;
  setCurrentStep: (step: WorkflowStateData['currentStep']) => void;

  // Основна форма замовлення
  updateOrderFormData: (data: Partial<BasicOrderUIFormData>) => void;
  resetOrderFormData: () => void;
  setOrderFormField: <K extends keyof BasicOrderUIFormData>(
    field: K,
    value: BasicOrderUIFormData[K]
  ) => void;

  // Вибір філії
  updateBranchFormData: (data: Partial<BranchSelectionUIFormData>) => void;
  setAvailableBranches: (branches: BranchDisplayData[]) => void;
  filterBranches: (searchTerm: string) => void;
  selectBranch: (branch: BranchDisplayData | null) => void;

  // Валідація
  setValidationError: (field: string, error: string) => void;
  clearValidationErrors: () => void;
  setDirty: (dirty: boolean) => void;

  // UI контроли
  setSubmitting: (submitting: boolean) => void;
  setBranchSelectorVisible: (visible: boolean) => void;
  setReceiptGeneratorVisible: (visible: boolean) => void;
  setAutoGenerateReceipt: (auto: boolean) => void;

  // Режими та налаштування
  toggleAdvancedMode: () => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setShowValidationHints: (show: boolean) => void;

  // Скидання стану
  resetState: () => void;
}

const initialOrderFormData: Partial<BasicOrderUIFormData> = {
  receiptNumber: '',
  uniqueTag: '',
  selectedBranchId: '',
  description: '',
  priority: 'NORMAL' as const,
  notes: '',
};

const initialBranchFormData: Partial<BranchSelectionUIFormData> = {
  selectedBranchId: '',
  searchTerm: '',
};

const initialState: BasicOrderInfoUIState = {
  // Сесія та workflow
  sessionId: null,
  isWorkflowActive: false,
  currentStep: 'init',

  // Основна форма замовлення
  orderFormData: initialOrderFormData,
  isDirty: false,
  validationErrors: {},

  // Вибір філії
  branchFormData: initialBranchFormData,
  availableBranches: [],
  filteredBranches: [],
  selectedBranch: null,

  // UI стан
  isSubmitting: false,
  showBranchSelector: false,
  showReceiptGenerator: false,
  autoGenerateReceipt: true,

  // Режими та налаштування
  isAdvancedMode: false,
  autoSaveEnabled: true,
  showValidationHints: true,
};

export const useBasicOrderInfoStore = create<BasicOrderInfoUIState & BasicOrderInfoUIActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Сесія та workflow
    setSessionId: (sessionId) => set({ sessionId }),

    setWorkflowActive: (isWorkflowActive) => set({ isWorkflowActive }),

    setCurrentStep: (currentStep) => set({ currentStep }),

    // Основна форма замовлення
    updateOrderFormData: (data) =>
      set((state) => ({
        orderFormData: { ...state.orderFormData, ...data },
        isDirty: true,
      })),

    resetOrderFormData: () =>
      set({
        orderFormData: initialOrderFormData,
        isDirty: false,
        validationErrors: {},
      }),

    setOrderFormField: (field, value) =>
      set((state) => ({
        orderFormData: { ...state.orderFormData, [field]: value },
        isDirty: true,
      })),

    // Вибір філії
    updateBranchFormData: (data) =>
      set((state) => ({
        branchFormData: { ...state.branchFormData, ...data },
      })),

    setAvailableBranches: (availableBranches) =>
      set({
        availableBranches,
        filteredBranches: availableBranches,
      }),

    filterBranches: (searchTerm) => {
      const { availableBranches } = get();
      set({
        filteredBranches: searchTerm
          ? availableBranches.filter(
              (branch) =>
                branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.address?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : availableBranches,
      });
    },

    selectBranch: (selectedBranch) =>
      set((state) => ({
        selectedBranch,
        orderFormData: {
          ...state.orderFormData,
          selectedBranchId: selectedBranch?.id || '',
        },
        branchFormData: {
          ...state.branchFormData,
          selectedBranchId: selectedBranch?.id || '',
        },
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

    setBranchSelectorVisible: (showBranchSelector) => set({ showBranchSelector }),

    setReceiptGeneratorVisible: (showReceiptGenerator) => set({ showReceiptGenerator }),

    setAutoGenerateReceipt: (autoGenerateReceipt) => set({ autoGenerateReceipt }),

    // Режими та налаштування
    toggleAdvancedMode: () => {
      const { isAdvancedMode } = get();
      set({ isAdvancedMode: !isAdvancedMode });
    },

    setAutoSaveEnabled: (autoSaveEnabled) => set({ autoSaveEnabled }),

    setShowValidationHints: (showValidationHints) => set({ showValidationHints }),

    // Скидання стану
    resetState: () => set(initialState),
  }))
);
