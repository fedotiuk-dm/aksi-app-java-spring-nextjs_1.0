// Zustand Store для Basic Order Info - ТІЛЬКИ UI стан
// API дані керуються через React Query в Orval хуках

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// =================== ТИПИ ===================

// Константи для кроків
const STEPS = {
  BRANCH_SELECTION: 'branch-selection',
  RECEIPT_GENERATION: 'receipt-generation',
  UNIQUE_TAG_ENTRY: 'unique-tag-entry',
  COMPLETED: 'completed',
} as const;

type StepType = (typeof STEPS)[keyof typeof STEPS];

interface BasicOrderInfoUIState {
  // Базова інформація замовлення
  receiptNumber: string;
  uniqueTag: string;
  selectedBranchId: string | null;

  // UI стани - послідовність кроків
  currentStep: StepType;
  isReceiptNumberGenerated: boolean;
  isUniqueTagScanned: boolean;
  isBranchSelected: boolean;

  // Налаштування
  autoGenerateReceiptNumber: boolean;
  validateOnChange: boolean;
  showAdvancedOptions: boolean;

  // Модалки та діалоги
  showBranchSelectionDialog: boolean;
  showUniqueTagDialog: boolean;
  showValidationDialog: boolean;
  showConfirmDialog: boolean;

  // Стани форм
  isFormDirty: boolean;
  hasValidationErrors: boolean;
}

interface BasicOrderInfoUIActions {
  // Basic order data actions
  setReceiptNumber: (receiptNumber: string) => void;
  setUniqueTag: (uniqueTag: string) => void;
  setSelectedBranchId: (branchId: string | null) => void;

  // Step management actions
  setCurrentStep: (step: StepType) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // UI state actions
  setIsReceiptNumberGenerated: (generated: boolean) => void;
  setIsUniqueTagScanned: (scanned: boolean) => void;
  setIsBranchSelected: (selected: boolean) => void;

  // Settings actions
  setAutoGenerateReceiptNumber: (auto: boolean) => void;
  setValidateOnChange: (validate: boolean) => void;
  setShowAdvancedOptions: (show: boolean) => void;

  // Modal actions
  setShowBranchSelectionDialog: (show: boolean) => void;
  setShowUniqueTagDialog: (show: boolean) => void;
  setShowValidationDialog: (show: boolean) => void;
  setShowConfirmDialog: (show: boolean) => void;

  // Form state actions
  setIsFormDirty: (dirty: boolean) => void;
  setHasValidationErrors: (hasErrors: boolean) => void;

  // Complex actions with step logic
  selectBranchAndProceed: (branchId: string) => void;
  generateReceiptNumberAndProceed: (receiptNumber: string) => void;
  enterUniqueTagAndComplete: (uniqueTag: string) => void;
  clearBasicOrderInfo: () => void;
  markFormDirty: () => void;
  resetToInitialState: () => void;
}

// =================== INITIAL STATE ===================

const initialState: BasicOrderInfoUIState = {
  // Базова інформація замовлення
  receiptNumber: '',
  uniqueTag: '',
  selectedBranchId: null,

  // UI стани - послідовність кроків
  currentStep: STEPS.BRANCH_SELECTION,
  isReceiptNumberGenerated: false,
  isUniqueTagScanned: false,
  isBranchSelected: false,

  // Налаштування
  autoGenerateReceiptNumber: true,
  validateOnChange: true,
  showAdvancedOptions: false,

  // Модалки та діалоги
  showBranchSelectionDialog: false,
  showUniqueTagDialog: false,
  showValidationDialog: false,
  showConfirmDialog: false,

  // Стани форм
  isFormDirty: false,
  hasValidationErrors: false,
};

// =================== STORE ===================

export const useBasicOrderInfoStore = create<BasicOrderInfoUIState & BasicOrderInfoUIActions>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    // Basic order data actions
    setReceiptNumber: (receiptNumber) => set({ receiptNumber, isFormDirty: true }),
    setUniqueTag: (uniqueTag) => set({ uniqueTag, isFormDirty: true }),
    setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId, isFormDirty: true }),

    // Step management actions
    setCurrentStep: (step) => set({ currentStep: step }),
    goToNextStep: () =>
      set((state) => {
        const stepOrder = [
          STEPS.BRANCH_SELECTION,
          STEPS.RECEIPT_GENERATION,
          STEPS.UNIQUE_TAG_ENTRY,
          STEPS.COMPLETED,
        ];
        const currentIndex = stepOrder.indexOf(state.currentStep);
        const nextIndex = Math.min(currentIndex + 1, stepOrder.length - 1);
        return { currentStep: stepOrder[nextIndex] };
      }),
    goToPreviousStep: () =>
      set((state) => {
        const stepOrder = [
          STEPS.BRANCH_SELECTION,
          STEPS.RECEIPT_GENERATION,
          STEPS.UNIQUE_TAG_ENTRY,
          STEPS.COMPLETED,
        ];
        const currentIndex = stepOrder.indexOf(state.currentStep);
        const prevIndex = Math.max(currentIndex - 1, 0);
        return { currentStep: stepOrder[prevIndex] };
      }),

    // UI state actions
    setIsReceiptNumberGenerated: (isReceiptNumberGenerated) => set({ isReceiptNumberGenerated }),
    setIsUniqueTagScanned: (isUniqueTagScanned) => set({ isUniqueTagScanned }),
    setIsBranchSelected: (isBranchSelected) => set({ isBranchSelected }),

    // Settings actions
    setAutoGenerateReceiptNumber: (autoGenerateReceiptNumber) => set({ autoGenerateReceiptNumber }),
    setValidateOnChange: (validateOnChange) => set({ validateOnChange }),
    setShowAdvancedOptions: (showAdvancedOptions) => set({ showAdvancedOptions }),

    // Modal actions
    setShowBranchSelectionDialog: (showBranchSelectionDialog) => set({ showBranchSelectionDialog }),
    setShowUniqueTagDialog: (showUniqueTagDialog) => set({ showUniqueTagDialog }),
    setShowValidationDialog: (showValidationDialog) => set({ showValidationDialog }),
    setShowConfirmDialog: (showConfirmDialog) => set({ showConfirmDialog }),

    // Form state actions
    setIsFormDirty: (isFormDirty) => set({ isFormDirty }),
    setHasValidationErrors: (hasValidationErrors) => set({ hasValidationErrors }),

    // Complex actions with step logic
    selectBranchAndProceed: (branchId) =>
      set({
        selectedBranchId: branchId,
        isBranchSelected: true,
        currentStep: STEPS.RECEIPT_GENERATION,
        isFormDirty: true,
      }),
    generateReceiptNumberAndProceed: (receiptNumber) =>
      set({
        receiptNumber,
        isReceiptNumberGenerated: true,
        currentStep: STEPS.UNIQUE_TAG_ENTRY,
        isFormDirty: true,
      }),
    enterUniqueTagAndComplete: (uniqueTag) =>
      set({
        uniqueTag,
        isUniqueTagScanned: true,
        currentStep: STEPS.COMPLETED,
        isFormDirty: true,
      }),
    clearBasicOrderInfo: () =>
      set({
        receiptNumber: '',
        uniqueTag: '',
        selectedBranchId: null,
        currentStep: STEPS.BRANCH_SELECTION,
        isReceiptNumberGenerated: false,
        isUniqueTagScanned: false,
        isBranchSelected: false,
        isFormDirty: false,
        hasValidationErrors: false,
      }),
    markFormDirty: () => set({ isFormDirty: true }),
    resetToInitialState: () => set(initialState),
  }))
);

// =================== ЕКСПОРТИ ===================

export { STEPS };

// =================== СЕЛЕКТОРИ ===================

// Селектор для перевірки чи можна продовжити
export const useCanProceed = () =>
  useBasicOrderInfoStore(
    (state) =>
      state.receiptNumber.length > 0 &&
      state.uniqueTag.length >= 3 &&
      !!state.selectedBranchId &&
      !state.hasValidationErrors
  );

// Селектор для отримання базових даних замовлення
export const useBasicOrderData = () =>
  useBasicOrderInfoStore((state) => ({
    receiptNumber: state.receiptNumber,
    uniqueTag: state.uniqueTag,
    selectedBranchId: state.selectedBranchId,
  }));
