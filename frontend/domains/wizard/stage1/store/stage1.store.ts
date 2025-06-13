// 🔥 ЕТАП 2: ZUSTAND UI СТАН - wizard/stage1 domain
// Тільки UI стан, НЕ API дані (це робить React Query)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { CreateClientRequest, BasicOrderInfoDTO } from '@/shared/api/generated/stage1';

// 📋 UI стан (НЕ API дані - це робить React Query)
interface Stage1UIState {
  // UI флаги для різних підетапів
  isClientSearchMode: boolean;
  isClientCreateMode: boolean;
  isBasicOrderInfoMode: boolean;

  // UI контроли
  showClientSearchResults: boolean;
  showClientForm: boolean;
  showBasicOrderForm: boolean;
  showDebugMode: boolean;
  isCompact: boolean;

  // Форми стани
  clientSearchTerm: string;
  selectedClientId: string | null;
  selectedBranchId: string | null;
  uniqueTag: string;
  receiptNumber: string;

  // Збережені дані форм для відновлення
  clientCreateFormData: Partial<CreateClientRequest> | null;
  basicOrderInfoFormData: Partial<BasicOrderInfoDTO> | null;
}

// 🎯 UI дії
interface Stage1UIActions {
  // Режими роботи
  setClientSearchMode: (enabled: boolean) => void;
  setClientCreateMode: (enabled: boolean) => void;
  setBasicOrderInfoMode: (enabled: boolean) => void;

  // UI контроли
  setShowClientSearchResults: (show: boolean) => void;
  setShowClientForm: (show: boolean) => void;
  setShowBasicOrderForm: (show: boolean) => void;
  toggleDebugMode: () => void;
  toggleCompactMode: () => void;

  // Форми дані
  setClientSearchTerm: (term: string) => void;
  setSelectedClientId: (id: string | null) => void;
  setSelectedBranchId: (id: string | null) => void;
  setUniqueTag: (tag: string) => void;
  setReceiptNumber: (number: string) => void;

  // Збережені дані форм
  setClientCreateFormData: (data: Partial<CreateClientRequest> | null) => void;
  setBasicOrderInfoFormData: (data: Partial<BasicOrderInfoDTO> | null) => void;

  // Скидання
  reset: () => void;
  resetClientSearch: () => void;
  resetClientForm: () => void;
  resetBasicOrder: () => void;
}

// 🔍 Селектори для оптимізації
export const stage1Selectors = {
  hasSelectedClient: (state: Stage1UIState & Stage1UIActions) => !!state.selectedClientId,
  hasSelectedBranch: (state: Stage1UIState & Stage1UIActions) => !!state.selectedBranchId,
  hasUniqueTag: (state: Stage1UIState & Stage1UIActions) => !!state.uniqueTag.trim(),
  hasReceiptNumber: (state: Stage1UIState & Stage1UIActions) => !!state.receiptNumber.trim(),
  isReadyForNextStage: (state: Stage1UIState & Stage1UIActions) =>
    !!state.selectedClientId && !!state.selectedBranchId && !!state.uniqueTag.trim(),
};

// 🏪 Zustand store
export const useStage1Store = create<Stage1UIState & Stage1UIActions>()(
  subscribeWithSelector((set) => ({
    // 📊 Початковий стан
    isClientSearchMode: false,
    isClientCreateMode: false,
    isBasicOrderInfoMode: false,
    showClientSearchResults: false,
    showClientForm: false,
    showBasicOrderForm: false,
    showDebugMode: false,
    isCompact: false,
    clientSearchTerm: '',
    selectedClientId: null,
    selectedBranchId: null,
    uniqueTag: '',
    receiptNumber: '',
    clientCreateFormData: null,
    basicOrderInfoFormData: null,

    // 🎬 Дії
    setClientSearchMode: (isClientSearchMode) => set({ isClientSearchMode }),
    setClientCreateMode: (isClientCreateMode) => set({ isClientCreateMode }),
    setBasicOrderInfoMode: (isBasicOrderInfoMode) => set({ isBasicOrderInfoMode }),

    setShowClientSearchResults: (showClientSearchResults) => set({ showClientSearchResults }),
    setShowClientForm: (showClientForm) => set({ showClientForm }),
    setShowBasicOrderForm: (showBasicOrderForm) => set({ showBasicOrderForm }),
    toggleDebugMode: () => set((state) => ({ showDebugMode: !state.showDebugMode })),
    toggleCompactMode: () => set((state) => ({ isCompact: !state.isCompact })),

    setClientSearchTerm: (clientSearchTerm) => set({ clientSearchTerm }),
    setSelectedClientId: (selectedClientId) => set({ selectedClientId }),
    setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId }),
    setUniqueTag: (uniqueTag) => set({ uniqueTag }),
    setReceiptNumber: (receiptNumber) => set({ receiptNumber }),

    setClientCreateFormData: (clientCreateFormData) => set({ clientCreateFormData }),
    setBasicOrderInfoFormData: (basicOrderInfoFormData) => set({ basicOrderInfoFormData }),

    // 🧹 Скидання стану
    reset: () =>
      set({
        isClientSearchMode: false,
        isClientCreateMode: false,
        isBasicOrderInfoMode: false,
        showClientSearchResults: false,
        showClientForm: false,
        showBasicOrderForm: false,
        showDebugMode: false,
        isCompact: false,
        clientSearchTerm: '',
        selectedClientId: null,
        selectedBranchId: null,
        uniqueTag: '',
        receiptNumber: '',
        clientCreateFormData: null,
        basicOrderInfoFormData: null,
      }),

    resetClientSearch: () =>
      set({
        clientSearchTerm: '',
        selectedClientId: null,
        showClientSearchResults: false,
      }),

    resetClientForm: () =>
      set({
        showClientForm: false,
      }),

    resetBasicOrder: () =>
      set({
        selectedBranchId: null,
        uniqueTag: '',
        receiptNumber: '',
        showBasicOrderForm: false,
      }),
  }))
);
