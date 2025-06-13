// Zustand стор для Stage2 Item Manager - Головний екран менеджера предметів
// ТІЛЬКИ UI стан, НЕ API дані (React Query керує API)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// =================== UI СТАН ===================
interface ItemManagerUIState {
  // Сесія
  sessionId: string | null;
  orderId: string | null;

  // UI налаштування таблиці
  showItemDetails: boolean;
  showPriceBreakdown: boolean;
  showModifiers: boolean;
  showPhotos: boolean;

  // Пошук та фільтрація
  searchTerm: string;
  categoryFilter: string | null;
  priceRangeMin: number | null;
  priceRangeMax: number | null;

  // Відображення таблиці
  itemsPerPage: number;
  currentPage: number;
  sortBy: 'name' | 'category' | 'price' | 'quantity';
  sortOrder: 'asc' | 'desc';

  // UI прапорці
  isTableExpanded: boolean;
  isSearchExpanded: boolean;
  isFiltersExpanded: boolean;
  isSummaryExpanded: boolean;

  // Модальні вікна
  isDeleteModalOpen: boolean;
  isProceedModalOpen: boolean;
  isWizardActive: boolean;
  selectedItemForEdit: string | null;
  selectedItemForDelete: string | null;

  // Workflow стан
  currentView: 'table' | 'wizard' | 'summary';
  hasUnsavedChanges: boolean;
  lastSyncTime: Date | null;

  // Помічники UI
  expandedItemIds: string[];
  selectedItemIds: string[];
  draggedItemId: string | null;
}

// =================== UI ДІЇ ===================
interface ItemManagerUIActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;
  setOrderId: (orderId: string | null) => void;

  // UI налаштування
  setShowItemDetails: (show: boolean) => void;
  setShowPriceBreakdown: (show: boolean) => void;
  setShowModifiers: (show: boolean) => void;
  setShowPhotos: (show: boolean) => void;

  // Пошук та фільтрація
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  clearFilters: () => void;

  // Відображення таблиці
  setItemsPerPage: (count: number) => void;
  setCurrentPage: (page: number) => void;
  setSorting: (sortBy: 'name' | 'category' | 'price' | 'quantity', order: 'asc' | 'desc') => void;

  // UI прапорці
  toggleTableExpanded: () => void;
  toggleSearchExpanded: () => void;
  toggleFiltersExpanded: () => void;
  toggleSummaryExpanded: () => void;

  // Модальні вікна
  openDeleteModal: (itemId: string) => void;
  closeDeleteModal: () => void;
  openProceedModal: () => void;
  closeProceedModal: () => void;
  setWizardActive: (active: boolean) => void;
  setSelectedItemForEdit: (itemId: string | null) => void;

  // Workflow
  setCurrentView: (view: 'table' | 'wizard' | 'summary') => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  updateLastSyncTime: () => void;

  // Помічники UI
  toggleItemExpanded: (itemId: string) => void;
  toggleItemSelected: (itemId: string) => void;
  selectAllItems: (itemIds: string[]) => void;
  clearSelection: () => void;
  setDraggedItem: (itemId: string | null) => void;

  // Скидання
  resetUIState: () => void;
  resetFilters: () => void;
  resetModals: () => void;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: ItemManagerUIState = {
  // Сесія
  sessionId: null,
  orderId: null,

  // UI налаштування
  showItemDetails: true,
  showPriceBreakdown: true,
  showModifiers: false,
  showPhotos: false,

  // Пошук та фільтрація
  searchTerm: '',
  categoryFilter: null,
  priceRangeMin: null,
  priceRangeMax: null,

  // Відображення таблиці
  itemsPerPage: 10,
  currentPage: 1,
  sortBy: 'name',
  sortOrder: 'asc',

  // UI прапорці
  isTableExpanded: true,
  isSearchExpanded: false,
  isFiltersExpanded: false,
  isSummaryExpanded: true,

  // Модальні вікна
  isDeleteModalOpen: false,
  isProceedModalOpen: false,
  isWizardActive: false,
  selectedItemForEdit: null,
  selectedItemForDelete: null,

  // Workflow стан
  currentView: 'table',
  hasUnsavedChanges: false,
  lastSyncTime: null,

  // Помічники UI
  expandedItemIds: [],
  selectedItemIds: [],
  draggedItemId: null,
};

// =================== ZUSTAND СТОР ===================
export const useItemManagerStore = create<ItemManagerUIState & ItemManagerUIActions>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    // =================== СЕСІЯ ===================
    setSessionId: (sessionId) => set({ sessionId }),
    setOrderId: (orderId) => set({ orderId }),

    // =================== UI НАЛАШТУВАННЯ ===================
    setShowItemDetails: (showItemDetails) => set({ showItemDetails }),
    setShowPriceBreakdown: (showPriceBreakdown) => set({ showPriceBreakdown }),
    setShowModifiers: (showModifiers) => set({ showModifiers }),
    setShowPhotos: (showPhotos) => set({ showPhotos }),

    // =================== ПОШУК ТА ФІЛЬТРАЦІЯ ===================
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
    setPriceRange: (priceRangeMin, priceRangeMax) => set({ priceRangeMin, priceRangeMax }),
    clearFilters: () =>
      set({
        searchTerm: '',
        categoryFilter: null,
        priceRangeMin: null,
        priceRangeMax: null,
      }),

    // =================== ВІДОБРАЖЕННЯ ТАБЛИЦІ ===================
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

    // =================== UI ПРАПОРЦІ ===================
    toggleTableExpanded: () =>
      set((state) => ({
        isTableExpanded: !state.isTableExpanded,
      })),

    toggleSearchExpanded: () =>
      set((state) => ({
        isSearchExpanded: !state.isSearchExpanded,
      })),

    toggleFiltersExpanded: () =>
      set((state) => ({
        isFiltersExpanded: !state.isFiltersExpanded,
      })),

    toggleSummaryExpanded: () =>
      set((state) => ({
        isSummaryExpanded: !state.isSummaryExpanded,
      })),

    // =================== МОДАЛЬНІ ВІКНА ===================
    openDeleteModal: (itemId) =>
      set({
        isDeleteModalOpen: true,
        selectedItemForDelete: itemId,
      }),

    closeDeleteModal: () =>
      set({
        isDeleteModalOpen: false,
        selectedItemForDelete: null,
      }),

    openProceedModal: () => set({ isProceedModalOpen: true }),
    closeProceedModal: () => set({ isProceedModalOpen: false }),

    setWizardActive: (isWizardActive) => set({ isWizardActive }),
    setSelectedItemForEdit: (selectedItemForEdit) => set({ selectedItemForEdit }),

    // =================== WORKFLOW ===================
    setCurrentView: (currentView) => set({ currentView }),
    setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),
    updateLastSyncTime: () => set({ lastSyncTime: new Date() }),

    // =================== ПОМІЧНИКИ UI ===================
    toggleItemExpanded: (itemId) =>
      set((state) => ({
        expandedItemIds: state.expandedItemIds.includes(itemId)
          ? state.expandedItemIds.filter((id) => id !== itemId)
          : [...state.expandedItemIds, itemId],
      })),

    toggleItemSelected: (itemId) =>
      set((state) => ({
        selectedItemIds: state.selectedItemIds.includes(itemId)
          ? state.selectedItemIds.filter((id) => id !== itemId)
          : [...state.selectedItemIds, itemId],
      })),

    selectAllItems: (itemIds) => set({ selectedItemIds: itemIds }),
    clearSelection: () => set({ selectedItemIds: [] }),
    setDraggedItem: (draggedItemId) => set({ draggedItemId }),

    // =================== СКИДАННЯ ===================
    resetUIState: () => set(initialState),

    resetFilters: () =>
      set({
        searchTerm: '',
        categoryFilter: null,
        priceRangeMin: null,
        priceRangeMax: null,
        currentPage: 1,
      }),

    resetModals: () =>
      set({
        isDeleteModalOpen: false,
        isProceedModalOpen: false,
        selectedItemForEdit: null,
        selectedItemForDelete: null,
      }),
  }))
);

// =================== СЕЛЕКТОРИ ===================
export const useItemManagerSelectors = () => {
  const store = useItemManagerStore();

  return {
    // Базові селектори
    hasSession: !!store.sessionId,
    hasOrder: !!store.orderId,
    hasActiveWizard: store.isWizardActive,
    hasFiltersApplied: !!(
      store.searchTerm ||
      store.categoryFilter ||
      store.priceRangeMin ||
      store.priceRangeMax
    ),

    // Обчислені значення
    hasSelection: store.selectedItemIds.length > 0,
    selectedCount: store.selectedItemIds.length,
    hasExpandedItems: store.expandedItemIds.length > 0,

    // UI стан
    isAnyModalOpen: store.isDeleteModalOpen || store.isProceedModalOpen,
    isAnyExpanded:
      store.isTableExpanded ||
      store.isSearchExpanded ||
      store.isFiltersExpanded ||
      store.isSummaryExpanded,

    // Workflow
    canProceedToNext: store.currentView === 'table' && !store.isWizardActive,
    needsSync: store.hasUnsavedChanges,
    timeSinceLastSync: store.lastSyncTime ? Date.now() - store.lastSyncTime.getTime() : null,

    // Помічники
    isItemExpanded: (itemId: string) => store.expandedItemIds.includes(itemId),
    isItemSelected: (itemId: string) => store.selectedItemIds.includes(itemId),
    isDragging: !!store.draggedItemId,
  };
};
