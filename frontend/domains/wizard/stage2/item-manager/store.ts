// 📋 STAGE2 ITEM MANAGER: Zustand стор для управління предметами замовлення
// Тільки UI стан, API дані керуються React Query

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import {
  ITEM_MANAGER_OPERATIONS,
  ITEM_MANAGER_UI_STATES,
  VIEW_MODES,
  TABLE_CONFIG,
  ITEM_MANAGER_VALIDATION_RULES,
  type ItemManagerOperation,
  type ItemManagerUIState as ItemManagerUIStateType,
  type ViewMode,
} from './constants';

// =================== ТИПИ СТАНУ ===================
interface ItemManagerStoreState {
  // Сесія
  sessionId: string | null;
  orderId: string | null;

  // UI налаштування
  showItemDetails: boolean;
  showPriceDetails: boolean;
  showTableControls: boolean;
  showOperationButtons: boolean;

  // Таблиця стан
  currentViewMode: ViewMode;
  itemsPerPage: number;
  currentPage: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchTerm: string;

  // Вибрані елементи
  selectedItemIds: string[];
  editingItemId: string | null;
  deletingItemId: string | null;

  // UI прапорці
  isTableExpanded: boolean;
  isFiltersExpanded: boolean;
  isActionsExpanded: boolean;
  isWizardActive: boolean;

  // Workflow стан з константами
  currentOperation: ItemManagerOperation;
  operationsCompleted: ItemManagerOperation[];
  currentUIState: ItemManagerUIStateType;

  // Модальні вікна
  showDeleteConfirmation: boolean;
  showProceedConfirmation: boolean;
  showSynchronizeDialog: boolean;

  // Помічники UI
  filteredItemIds: string[];
  totalItemsCount: number;
  canProceedToNextStage: boolean;
}

interface ItemManagerStoreActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;
  setOrderId: (orderId: string | null) => void;

  // UI налаштування
  setShowItemDetails: (show: boolean) => void;
  setShowPriceDetails: (show: boolean) => void;
  setShowTableControls: (show: boolean) => void;
  setShowOperationButtons: (show: boolean) => void;

  // Таблиця
  setCurrentViewMode: (mode: ViewMode) => void;
  setItemsPerPage: (count: number) => void;
  setCurrentPage: (page: number) => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setSearchTerm: (term: string) => void;

  // Вибрані елементи
  setSelectedItemIds: (ids: string[]) => void;
  addSelectedItemId: (id: string) => void;
  removeSelectedItemId: (id: string) => void;
  clearSelectedItems: () => void;
  setEditingItemId: (id: string | null) => void;
  setDeletingItemId: (id: string | null) => void;

  // UI прапорці
  toggleTableExpanded: () => void;
  toggleFiltersExpanded: () => void;
  toggleActionsExpanded: () => void;
  setIsWizardActive: (active: boolean) => void;

  // Workflow з константами
  setCurrentOperation: (operation: ItemManagerOperation) => void;
  markOperationCompleted: (operation: ItemManagerOperation) => void;
  goToNextOperation: () => void;
  goToPreviousOperation: () => void;
  setCurrentUIState: (state: ItemManagerUIStateType) => void;

  // Модальні вікна
  setShowDeleteConfirmation: (show: boolean) => void;
  setShowProceedConfirmation: (show: boolean) => void;
  setShowSynchronizeDialog: (show: boolean) => void;

  // Помічники UI
  setFilteredItemIds: (ids: string[]) => void;
  setTotalItemsCount: (count: number) => void;
  setCanProceedToNextStage: (canProceed: boolean) => void;

  // Скидання
  resetUIState: () => void;
  resetTableState: () => void;
  resetSelections: () => void;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: ItemManagerStoreState = {
  // Сесія
  sessionId: null,
  orderId: null,

  // UI налаштування
  showItemDetails: true,
  showPriceDetails: true,
  showTableControls: true,
  showOperationButtons: true,

  // Таблиця стан
  currentViewMode: VIEW_MODES.TABLE,
  itemsPerPage: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
  currentPage: 0,
  sortBy: TABLE_CONFIG.DEFAULT_SORT_BY,
  sortOrder: 'asc',
  searchTerm: '',

  // Вибрані елементи
  selectedItemIds: [],
  editingItemId: null,
  deletingItemId: null,

  // UI прапорці
  isTableExpanded: true,
  isFiltersExpanded: false,
  isActionsExpanded: true,
  isWizardActive: false,

  // Workflow стан з константами
  currentOperation: ITEM_MANAGER_OPERATIONS.INITIALIZE,
  operationsCompleted: [],
  currentUIState: ITEM_MANAGER_UI_STATES.INITIALIZING,

  // Модальні вікна
  showDeleteConfirmation: false,
  showProceedConfirmation: false,
  showSynchronizeDialog: false,

  // Помічники UI
  filteredItemIds: [],
  totalItemsCount: 0,
  canProceedToNextStage: false,
};

// =================== ZUSTAND СТОР ===================
export const useItemManagerStore = create<ItemManagerStoreState & ItemManagerStoreActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // =================== СЕСІЯ ===================
    setSessionId: (sessionId) => set({ sessionId }),
    setOrderId: (orderId) => set({ orderId }),

    // =================== UI НАЛАШТУВАННЯ ===================
    setShowItemDetails: (showItemDetails) => set({ showItemDetails }),
    setShowPriceDetails: (showPriceDetails) => set({ showPriceDetails }),
    setShowTableControls: (showTableControls) => set({ showTableControls }),
    setShowOperationButtons: (showOperationButtons) => set({ showOperationButtons }),

    // =================== ТАБЛИЦЯ ===================
    setCurrentViewMode: (currentViewMode) => set({ currentViewMode }),
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 0 }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (sortOrder) => set({ sortOrder }),
    setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 0 }),

    // =================== ВИБРАНІ ЕЛЕМЕНТИ ===================
    setSelectedItemIds: (selectedItemIds) => set({ selectedItemIds }),
    addSelectedItemId: (id) =>
      set((state) => ({
        selectedItemIds: state.selectedItemIds.includes(id)
          ? state.selectedItemIds
          : [...state.selectedItemIds, id],
      })),
    removeSelectedItemId: (id) =>
      set((state) => ({
        selectedItemIds: state.selectedItemIds.filter((itemId) => itemId !== id),
      })),
    clearSelectedItems: () => set({ selectedItemIds: [] }),
    setEditingItemId: (editingItemId) => set({ editingItemId }),
    setDeletingItemId: (deletingItemId) => set({ deletingItemId }),

    // =================== UI ПРАПОРЦІ ===================
    toggleTableExpanded: () =>
      set((state) => ({
        isTableExpanded: !state.isTableExpanded,
      })),

    toggleFiltersExpanded: () =>
      set((state) => ({
        isFiltersExpanded: !state.isFiltersExpanded,
      })),

    toggleActionsExpanded: () =>
      set((state) => ({
        isActionsExpanded: !state.isActionsExpanded,
      })),

    setIsWizardActive: (isWizardActive) => set({ isWizardActive }),

    // =================== WORKFLOW З КОНСТАНТАМИ ===================
    setCurrentOperation: (currentOperation) => set({ currentOperation }),

    markOperationCompleted: (operation) =>
      set((state) => ({
        operationsCompleted: state.operationsCompleted.includes(operation)
          ? state.operationsCompleted
          : [...state.operationsCompleted, operation],
      })),

    goToNextOperation: () => {
      const state = get();
      const currentIndex = Object.values(ITEM_MANAGER_OPERATIONS).indexOf(state.currentOperation);
      const nextOperation = Object.values(ITEM_MANAGER_OPERATIONS)[currentIndex + 1];
      if (nextOperation) {
        set({ currentOperation: nextOperation });
      }
    },

    goToPreviousOperation: () => {
      const state = get();
      const currentIndex = Object.values(ITEM_MANAGER_OPERATIONS).indexOf(state.currentOperation);
      const previousOperation = Object.values(ITEM_MANAGER_OPERATIONS)[currentIndex - 1];
      if (previousOperation) {
        set({ currentOperation: previousOperation });
      }
    },

    setCurrentUIState: (currentUIState) => set({ currentUIState }),

    // =================== МОДАЛЬНІ ВІКНА ===================
    setShowDeleteConfirmation: (showDeleteConfirmation) => set({ showDeleteConfirmation }),
    setShowProceedConfirmation: (showProceedConfirmation) => set({ showProceedConfirmation }),
    setShowSynchronizeDialog: (showSynchronizeDialog) => set({ showSynchronizeDialog }),

    // =================== ПОМІЧНИКИ UI ===================
    setFilteredItemIds: (filteredItemIds) => set({ filteredItemIds }),
    setTotalItemsCount: (totalItemsCount) => set({ totalItemsCount }),
    setCanProceedToNextStage: (canProceedToNextStage) => set({ canProceedToNextStage }),

    // =================== СКИДАННЯ ===================
    resetUIState: () => set(initialState),

    resetTableState: () =>
      set({
        currentPage: 0,
        searchTerm: '',
        selectedItemIds: [],
        sortBy: TABLE_CONFIG.DEFAULT_SORT_BY,
        sortOrder: 'asc',
      }),

    resetSelections: () =>
      set({
        selectedItemIds: [],
        editingItemId: null,
        deletingItemId: null,
      }),
  }))
);

// =================== СЕЛЕКТОРИ ===================
export const useItemManagerSelectors = () => {
  const store = useItemManagerStore();

  return {
    // Валідація з константами
    canAddItem: ITEM_MANAGER_VALIDATION_RULES.canAddItem(store.sessionId),
    canEditItem: ITEM_MANAGER_VALIDATION_RULES.canEditItem(store.editingItemId, store.sessionId),
    canDeleteItem: ITEM_MANAGER_VALIDATION_RULES.canDeleteItem(
      store.deletingItemId,
      store.sessionId
    ),
    canCompleteStage: ITEM_MANAGER_VALIDATION_RULES.canCompleteStage(store.totalItemsCount),
    canSynchronize: ITEM_MANAGER_VALIDATION_RULES.canSynchronize(store.sessionId),

    // Обчислені значення
    hasSelectedItems: store.selectedItemIds.length > 0,
    selectedItemsCount: store.selectedItemIds.length,
    isMultipleSelection: store.selectedItemIds.length > 1,
    hasSearchFilter: store.searchTerm.length > 0,
    isInitialized: store.sessionId !== null && store.orderId !== null,
    isReady: store.currentUIState === ITEM_MANAGER_UI_STATES.READY,
    isLoading: store.currentUIState === ITEM_MANAGER_UI_STATES.LOADING,
    isSaving: store.currentUIState === ITEM_MANAGER_UI_STATES.SAVING,
    hasError: store.currentUIState === ITEM_MANAGER_UI_STATES.ERROR,

    // Пагінація
    totalPages: Math.ceil(store.totalItemsCount / store.itemsPerPage),
    hasNextPage: store.currentPage < Math.ceil(store.totalItemsCount / store.itemsPerPage) - 1,
    hasPreviousPage: store.currentPage > 0,
    startIndex: store.currentPage * store.itemsPerPage,
    endIndex: Math.min((store.currentPage + 1) * store.itemsPerPage, store.totalItemsCount),
  };
};

// =================== ТИПИ ===================
export type ItemManagerStore = ItemManagerStoreState & ItemManagerStoreActions;
