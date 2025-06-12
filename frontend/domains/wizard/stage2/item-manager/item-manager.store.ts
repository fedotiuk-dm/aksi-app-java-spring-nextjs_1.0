import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type {
  ItemSearchFormData,
  ItemFilterFormData,
  ItemManagerSettingsData,
} from './item-manager.schemas';

// UI стан для Item Manager
interface ItemManagerUIState {
  // Сесія та ідентифікатори
  sessionId: string | null;
  currentItemId: string | null;

  // Пошук та фільтрація
  searchTerm: string;
  activeFilters: ItemFilterFormData;

  // UI режими та налаштування
  isAdvancedMode: boolean;
  showItemDetails: boolean;
  isWizardOpen: boolean;
  wizardMode: 'create' | 'edit' | null;

  // Вибрані елементи
  selectedItems: string[];

  // Налаштування
  settings: ItemManagerSettingsData;

  // UI стани
  isLoading: boolean;
  error: string | null;

  // Пагінація
  currentPage: number;
  itemsPerPage: number;

  // Сортування
  sortBy: 'name' | 'price' | 'category' | 'dateAdded';
  sortOrder: 'asc' | 'desc';
}

// Дії для Item Manager
interface ItemManagerUIActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;
  setCurrentItemId: (itemId: string | null) => void;

  // Пошук та фільтрація
  setSearchTerm: (term: string) => void;
  setActiveFilters: (filters: ItemFilterFormData) => void;
  clearFilters: () => void;

  // UI режими
  setAdvancedMode: (enabled: boolean) => void;
  setShowItemDetails: (show: boolean) => void;
  setWizardOpen: (open: boolean, mode?: 'create' | 'edit') => void;
  closeWizard: () => void;

  // Вибір елементів
  selectItem: (itemId: string) => void;
  deselectItem: (itemId: string) => void;
  selectAllItems: (itemIds: string[]) => void;
  clearSelection: () => void;

  // Налаштування
  updateSettings: (settings: Partial<ItemManagerSettingsData>) => void;
  resetSettings: () => void;

  // UI стани
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Пагінація
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;

  // Сортування
  setSorting: (
    sortBy: ItemManagerUIState['sortBy'],
    sortOrder: ItemManagerUIState['sortOrder']
  ) => void;

  // Скидання стану
  resetState: () => void;
}

// Початковий стан
const initialState: ItemManagerUIState = {
  sessionId: null,
  currentItemId: null,
  searchTerm: '',
  activeFilters: {
    sortBy: 'name',
    sortOrder: 'asc',
  },
  isAdvancedMode: false,
  showItemDetails: false,
  isWizardOpen: false,
  wizardMode: null,
  selectedItems: [],
  settings: {
    autoSave: true,
    showAdvancedOptions: false,
    itemsPerPage: 10,
    enableQuickActions: true,
  },
  isLoading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  sortBy: 'name',
  sortOrder: 'asc',
};

export const useItemManagerStore = create<ItemManagerUIState & ItemManagerUIActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Сесія
    setSessionId: (sessionId) => set({ sessionId }),
    setCurrentItemId: (currentItemId) => set({ currentItemId }),

    // Пошук та фільтрація
    setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
    setActiveFilters: (activeFilters) => set({ activeFilters, currentPage: 1 }),
    clearFilters: () =>
      set({
        activeFilters: initialState.activeFilters,
        searchTerm: '',
        currentPage: 1,
      }),

    // UI режими
    setAdvancedMode: (isAdvancedMode) => set({ isAdvancedMode }),
    setShowItemDetails: (showItemDetails) => set({ showItemDetails }),
    setWizardOpen: (isWizardOpen, wizardMode = null) =>
      set({
        isWizardOpen,
        wizardMode: isWizardOpen ? wizardMode : null,
      }),
    closeWizard: () =>
      set({
        isWizardOpen: false,
        wizardMode: null,
        currentItemId: null,
      }),

    // Вибір елементів
    selectItem: (itemId) => {
      const { selectedItems } = get();
      if (!selectedItems.includes(itemId)) {
        set({ selectedItems: [...selectedItems, itemId] });
      }
    },
    deselectItem: (itemId) => {
      const { selectedItems } = get();
      set({ selectedItems: selectedItems.filter((id) => id !== itemId) });
    },
    selectAllItems: (itemIds) => set({ selectedItems: itemIds }),
    clearSelection: () => set({ selectedItems: [] }),

    // Налаштування
    updateSettings: (newSettings) => {
      const { settings } = get();
      const updatedSettings = { ...settings, ...newSettings };
      set({
        settings: updatedSettings,
        itemsPerPage: updatedSettings.itemsPerPage,
      });
    },
    resetSettings: () => set({ settings: initialState.settings }),

    // UI стани
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Пагінація
    setCurrentPage: (currentPage) => set({ currentPage }),
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),

    // Сортування
    setSorting: (sortBy, sortOrder) =>
      set({
        sortBy,
        sortOrder,
        activeFilters: { ...get().activeFilters, sortBy, sortOrder },
        currentPage: 1,
      }),

    // Скидання стану
    resetState: () => set(initialState),
  }))
);
