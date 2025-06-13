// Zustand Store для Client Search - ТІЛЬКИ UI стан
// API дані керуються через React Query в Orval хуках

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// =================== ТИПИ ===================

interface ClientSearchUIState {
  // Session та workflow
  sessionId: string | null;

  // Пошук
  searchTerm: string;
  searchType: 'name' | 'phone' | 'email';
  isSearchActive: boolean;

  // Фільтри
  showActiveOnly: boolean;
  sortBy: 'name' | 'phone' | 'createdAt';
  sortOrder: 'asc' | 'desc';

  // Вибір клієнта
  selectedClientId: string | null;
  confirmSelection: boolean;

  // Відображення
  showDetails: boolean;
  itemsPerPage: number;
  currentPage: number;

  // UI стани
  showFilters: boolean;
  showSearchHistory: boolean;

  // Модалки та діалоги
  showSelectionConfirmDialog: boolean;
  showSearchHelpDialog: boolean;
}

interface ClientSearchUIActions {
  // Session management
  setSessionId: (sessionId: string | null) => void;

  // Search actions
  setSearchTerm: (term: string) => void;
  setSearchType: (type: 'name' | 'phone' | 'email') => void;
  setIsSearchActive: (active: boolean) => void;
  clearSearch: () => void;

  // Filter actions
  setShowActiveOnly: (show: boolean) => void;
  setSortBy: (sortBy: 'name' | 'phone' | 'createdAt') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  resetFilters: () => void;

  // Selection actions
  setSelectedClientId: (id: string | null) => void;
  setConfirmSelection: (confirm: boolean) => void;
  clearSelection: () => void;

  // Display actions
  setShowDetails: (show: boolean) => void;
  setItemsPerPage: (count: number) => void;
  setCurrentPage: (page: number) => void;

  // UI actions
  setShowFilters: (show: boolean) => void;
  setShowSearchHistory: (show: boolean) => void;

  // Modal actions
  setShowSelectionConfirmDialog: (show: boolean) => void;
  setShowSearchHelpDialog: (show: boolean) => void;

  // Complex actions
  performQuickSearch: (term: string, type?: 'name' | 'phone' | 'email') => void;
  selectClientAndConfirm: (clientId: string) => void;
  resetToInitialState: () => void;
}

// =================== INITIAL STATE ===================

const initialState: ClientSearchUIState = {
  // Session та workflow
  sessionId: null,

  // Пошук
  searchTerm: '',
  searchType: 'name',
  isSearchActive: false,

  // Фільтри
  showActiveOnly: true,
  sortBy: 'name',
  sortOrder: 'asc',

  // Вибір клієнта
  selectedClientId: null,
  confirmSelection: false,

  // Відображення
  showDetails: true,
  itemsPerPage: 10,
  currentPage: 1,

  // UI стани
  showFilters: false,
  showSearchHistory: false,

  // Модалки та діалоги
  showSelectionConfirmDialog: false,
  showSearchHelpDialog: false,
};

// =================== STORE ===================

export const useClientSearchStore = create<ClientSearchUIState & ClientSearchUIActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Session management
    setSessionId: (sessionId) => set({ sessionId }),

    // Search actions
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setSearchType: (searchType) => set({ searchType }),
    setIsSearchActive: (isSearchActive) => set({ isSearchActive }),
    clearSearch: () =>
      set({
        searchTerm: '',
        isSearchActive: false,
        currentPage: 1,
      }),

    // Filter actions
    setShowActiveOnly: (showActiveOnly) => set({ showActiveOnly }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (sortOrder) => set({ sortOrder }),
    resetFilters: () =>
      set({
        showActiveOnly: true,
        sortBy: 'name',
        sortOrder: 'asc',
        currentPage: 1,
      }),

    // Selection actions
    setSelectedClientId: (selectedClientId) => set({ selectedClientId }),
    setConfirmSelection: (confirmSelection) => set({ confirmSelection }),
    clearSelection: () =>
      set({
        selectedClientId: null,
        confirmSelection: false,
        showSelectionConfirmDialog: false,
      }),

    // Display actions
    setShowDetails: (showDetails) => set({ showDetails }),
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
    setCurrentPage: (currentPage) => set({ currentPage }),

    // UI actions
    setShowFilters: (showFilters) => set({ showFilters }),
    setShowSearchHistory: (showSearchHistory) => set({ showSearchHistory }),

    // Modal actions
    setShowSelectionConfirmDialog: (showSelectionConfirmDialog) =>
      set({ showSelectionConfirmDialog }),
    setShowSearchHelpDialog: (showSearchHelpDialog) => set({ showSearchHelpDialog }),

    // Complex actions
    performQuickSearch: (term, type = 'name') =>
      set({
        searchTerm: term,
        searchType: type,
        isSearchActive: true,
        currentPage: 1,
      }),

    selectClientAndConfirm: (clientId) =>
      set({
        selectedClientId: clientId,
        confirmSelection: true,
        showSelectionConfirmDialog: true,
      }),

    resetToInitialState: () => set(initialState),
  }))
);

// =================== СЕЛЕКТОРИ ===================

// Селектор для перевірки чи є активний пошук
export const useHasActiveSearch = () =>
  useClientSearchStore((state) => state.isSearchActive && state.searchTerm.length >= 2);

// Селектор для перевірки чи вибрано клієнта
export const useHasSelectedClient = () => useClientSearchStore((state) => !!state.selectedClientId);

// Селектор для отримання параметрів пошуку
export const useSearchParams = () =>
  useClientSearchStore((state) => ({
    searchTerm: state.searchTerm,
    searchType: state.searchType,
    showActiveOnly: state.showActiveOnly,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  }));

// Селектор для отримання параметрів відображення
export const useDisplayParams = () =>
  useClientSearchStore((state) => ({
    showDetails: state.showDetails,
    itemsPerPage: state.itemsPerPage,
    currentPage: state.currentPage,
  }));
