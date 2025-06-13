// Zustand Store для Basic Order Info - ТІЛЬКИ UI стан
// API дані керуються через React Query в Orval хуках

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// =================== ТИПИ ===================

interface BasicOrderInfoUIState {
  // Session та workflow
  sessionId: string | null;

  // Базова інформація замовлення
  receiptNumber: string;
  uniqueTag: string;
  selectedBranchId: string | null;

  // UI стани
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
  // Session management
  setSessionId: (sessionId: string | null) => void;

  // Basic order data actions
  setReceiptNumber: (receiptNumber: string) => void;
  setUniqueTag: (uniqueTag: string) => void;
  setSelectedBranchId: (branchId: string | null) => void;

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

  // Complex actions
  clearBasicOrderInfo: () => void;
  markFormDirty: () => void;
  resetToInitialState: () => void;
}

// =================== INITIAL STATE ===================

const initialState: BasicOrderInfoUIState = {
  // Session та workflow
  sessionId: null,

  // Базова інформація замовлення
  receiptNumber: '',
  uniqueTag: '',
  selectedBranchId: null,

  // UI стани
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
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Session management
    setSessionId: (sessionId) => set({ sessionId }),

    // Basic order data actions
    setReceiptNumber: (receiptNumber) => set({ receiptNumber, isFormDirty: true }),
    setUniqueTag: (uniqueTag) => set({ uniqueTag, isFormDirty: true }),
    setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId, isFormDirty: true }),

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

    // Complex actions
    clearBasicOrderInfo: () =>
      set({
        receiptNumber: '',
        uniqueTag: '',
        selectedBranchId: null,
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
