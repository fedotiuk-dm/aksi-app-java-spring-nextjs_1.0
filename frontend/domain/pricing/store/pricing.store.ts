/**
 * Zustand стор для Pricing домену
 * Управляє станом прайс-листа, модифікаторів, розрахунків та фільтрів
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type {
  PriceListItem,
  PriceModifier,
  PriceCalculationResult,
  ServiceCategory,
  PricingOperationErrors,
} from '../types';

/**
 * Стан Pricing домену
 */
interface PricingState {
  // === ДАНІ ===
  // Прайс-лист
  priceListItems: PriceListItem[];
  selectedPriceItem: PriceListItem | null;

  // Модифікатори
  priceModifiers: PriceModifier[];
  selectedModifiers: PriceModifier[];

  // Розрахунки
  currentCalculation: PriceCalculationResult | null;
  calculationHistory: PriceCalculationResult[];

  // === СТАН ЗАВАНТАЖЕННЯ ===
  isLoading: boolean;
  isCalculating: boolean;
  error: string | null;
  calculationError: string | null;

  // === ФІЛЬТРИ ===
  searchKeyword: string;
  selectedCategory: ServiceCategory | null;
  priceRange: { min: number; max: number } | null;
  showActiveOnly: boolean;

  // === НАЛАШТУВАННЯ ===
  settings: {
    autoCalculate: boolean;
    enableValidation: boolean;
    enableHistory: boolean;
    maxHistoryItems: number;
  };
}

/**
 * Дії Pricing домену
 */
interface PricingActions {
  // === ДАНІ ===
  // Прайс-лист
  setPriceListItems: (items: PriceListItem[]) => void;
  addPriceListItem: (item: PriceListItem) => void;
  updatePriceListItem: (id: string, updates: Partial<PriceListItem>) => void;
  removePriceListItem: (id: string) => void;
  setSelectedPriceItem: (item: PriceListItem | null) => void;

  // Модифікатори
  setPriceModifiers: (modifiers: PriceModifier[]) => void;
  addPriceModifier: (modifier: PriceModifier) => void;
  updatePriceModifier: (id: string, updates: Partial<PriceModifier>) => void;
  removePriceModifier: (id: string) => void;

  // Вибрані модифікатори
  setSelectedModifiers: (modifiers: PriceModifier[]) => void;
  addSelectedModifier: (modifier: PriceModifier) => void;
  removeSelectedModifier: (id: string) => void;
  clearSelectedModifiers: () => void;

  // Розрахунки
  setCurrentCalculation: (calculation: PriceCalculationResult | null) => void;
  addToCalculationHistory: (calculation: PriceCalculationResult) => void;
  clearCalculationHistory: () => void;

  // === СТАН ЗАВАНТАЖЕННЯ ===
  setIsLoading: (loading: boolean) => void;
  setIsCalculating: (calculating: boolean) => void;
  setError: (error: string | null) => void;
  setCalculationError: (error: string | null) => void;
  clearErrors: () => void;

  // === ФІЛЬТРИ ===
  setSearchKeyword: (keyword: string) => void;
  setSelectedCategory: (category: ServiceCategory | null) => void;
  setPriceRange: (range: { min: number; max: number } | null) => void;
  setShowActiveOnly: (active: boolean) => void;
  clearFilters: () => void;

  // === НАЛАШТУВАННЯ ===
  updateSettings: (settings: Partial<PricingState['settings']>) => void;

  // === УТИЛІТАРНІ ===
  reset: () => void;
}

/**
 * Початковий стан
 */
const initialState: PricingState = {
  // Дані
  priceListItems: [],
  selectedPriceItem: null,
  priceModifiers: [],
  selectedModifiers: [],
  currentCalculation: null,
  calculationHistory: [],

  // Стан завантаження
  isLoading: false,
  isCalculating: false,
  error: null,
  calculationError: null,

  // Фільтри
  searchKeyword: '',
  selectedCategory: null,
  priceRange: null,
  showActiveOnly: true,

  // Налаштування
  settings: {
    autoCalculate: true,
    enableValidation: true,
    enableHistory: true,
    maxHistoryItems: 50,
  },
};

/**
 * Головний стор Pricing домену
 */
export const usePricingStore = create<PricingState & PricingActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // === ДІЇ З ПРАЙС-ЛИСТОМ ===
    setPriceListItems: (items) =>
      set({
        priceListItems: items,
        error: null,
      }),

    addPriceListItem: (item) =>
      set((state) => ({
        priceListItems: [...state.priceListItems, item],
        error: null,
      })),

    updatePriceListItem: (id, updates) =>
      set((state) => ({
        priceListItems: state.priceListItems.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
        error: null,
      })),

    removePriceListItem: (id) =>
      set((state) => ({
        priceListItems: state.priceListItems.filter((item) => item.id !== id),
        selectedPriceItem: state.selectedPriceItem?.id === id ? null : state.selectedPriceItem,
        error: null,
      })),

    setSelectedPriceItem: (item) =>
      set({
        selectedPriceItem: item,
        error: null,
      }),

    // === ДІЇ З МОДИФІКАТОРАМИ ===
    setPriceModifiers: (modifiers) =>
      set({
        priceModifiers: modifiers,
        error: null,
      }),

    addPriceModifier: (modifier) =>
      set((state) => ({
        priceModifiers: [...state.priceModifiers, modifier],
        error: null,
      })),

    updatePriceModifier: (id, updates) =>
      set((state) => ({
        priceModifiers: state.priceModifiers.map((modifier) =>
          modifier.id === id ? { ...modifier, ...updates } : modifier
        ),
        selectedModifiers: state.selectedModifiers.map((modifier) =>
          modifier.id === id ? { ...modifier, ...updates } : modifier
        ),
        error: null,
      })),

    removePriceModifier: (id) =>
      set((state) => ({
        priceModifiers: state.priceModifiers.filter((modifier) => modifier.id !== id),
        selectedModifiers: state.selectedModifiers.filter((modifier) => modifier.id !== id),
        error: null,
      })),

    // === ДІЇ З ВИБРАНИМИ МОДИФІКАТОРАМИ ===
    setSelectedModifiers: (modifiers) =>
      set({
        selectedModifiers: modifiers,
        error: null,
      }),

    addSelectedModifier: (modifier) =>
      set((state) => {
        // Перевіряємо чи модифікатор вже не вибраний
        const isAlreadySelected = state.selectedModifiers.some((m) => m.id === modifier.id);
        if (isAlreadySelected) return state;

        return {
          selectedModifiers: [...state.selectedModifiers, modifier],
          error: null,
        };
      }),

    removeSelectedModifier: (id) =>
      set((state) => ({
        selectedModifiers: state.selectedModifiers.filter((modifier) => modifier.id !== id),
        error: null,
      })),

    clearSelectedModifiers: () =>
      set({
        selectedModifiers: [],
        error: null,
      }),

    // === ДІЇ З РОЗРАХУНКАМИ ===
    setCurrentCalculation: (calculation) =>
      set({
        currentCalculation: calculation,
        calculationError: null,
      }),

    addToCalculationHistory: (calculation) =>
      set((state) => {
        const { maxHistoryItems } = state.settings;
        const newHistory = [calculation, ...state.calculationHistory];

        // Обмежуємо розмір історії
        const limitedHistory = newHistory.slice(0, maxHistoryItems);

        return {
          calculationHistory: limitedHistory,
          calculationError: null,
        };
      }),

    clearCalculationHistory: () =>
      set({
        calculationHistory: [],
        calculationError: null,
      }),

    // === ДІЇ ЗІ СТАНОМ ЗАВАНТАЖЕННЯ ===
    setIsLoading: (loading) =>
      set({
        isLoading: loading,
        error: loading ? null : get().error,
      }),

    setIsCalculating: (calculating) =>
      set({
        isCalculating: calculating,
        calculationError: calculating ? null : get().calculationError,
      }),

    setError: (error) =>
      set({
        error,
        isLoading: false,
      }),

    setCalculationError: (error) =>
      set({
        calculationError: error,
        isCalculating: false,
      }),

    clearErrors: () =>
      set({
        error: null,
        calculationError: null,
      }),

    // === ДІЇ З ФІЛЬТРАМИ ===
    setSearchKeyword: (keyword) =>
      set({
        searchKeyword: keyword,
        error: null,
      }),

    setSelectedCategory: (category) =>
      set({
        selectedCategory: category,
        error: null,
      }),

    setPriceRange: (range) =>
      set({
        priceRange: range,
        error: null,
      }),

    setShowActiveOnly: (active) =>
      set({
        showActiveOnly: active,
        error: null,
      }),

    clearFilters: () =>
      set({
        searchKeyword: '',
        selectedCategory: null,
        priceRange: null,
        showActiveOnly: true,
        error: null,
      }),

    // === ДІЇ З НАЛАШТУВАННЯМИ ===
    updateSettings: (newSettings) =>
      set((state) => ({
        settings: { ...state.settings, ...newSettings },
        error: null,
      })),

    // === УТИЛІТАРНІ ДІЇ ===
    reset: () =>
      set({
        ...initialState,
      }),
  }))
);

// === СЕЛЕКТОРИ ===

/**
 * Селектори для зручного доступу до даних
 */
export const pricingSelectors = {
  // Прайс-лист
  getPriceListItems: () => usePricingStore.getState().priceListItems,
  getActivePriceListItems: () =>
    usePricingStore.getState().priceListItems.filter((item) => item.isActive),
  getSelectedPriceItem: () => usePricingStore.getState().selectedPriceItem,

  // Модифікатори
  getPriceModifiers: () => usePricingStore.getState().priceModifiers,
  getActiveModifiers: () =>
    usePricingStore.getState().priceModifiers.filter((modifier) => modifier.isActive),
  getSelectedModifiers: () => usePricingStore.getState().selectedModifiers,
  getSelectedModifiersCount: () => usePricingStore.getState().selectedModifiers.length,

  // Модифікатори за категорією
  getModifiersByCategory: (category: ServiceCategory) =>
    usePricingStore
      .getState()
      .priceModifiers.filter((modifier) => modifier.applicableCategories.includes(category)),

  // Розрахунки
  getCurrentCalculation: () => usePricingStore.getState().currentCalculation,
  getCalculationHistory: () => usePricingStore.getState().calculationHistory,

  // Стан завантаження
  getIsLoading: () => usePricingStore.getState().isLoading,
  getIsCalculating: () => usePricingStore.getState().isCalculating,
  getError: () => usePricingStore.getState().error,
  getCalculationError: () => usePricingStore.getState().calculationError,

  // Фільтри
  getSearchKeyword: () => usePricingStore.getState().searchKeyword,
  getSelectedCategory: () => usePricingStore.getState().selectedCategory,
  getPriceRange: () => usePricingStore.getState().priceRange,
  getShowActiveOnly: () => usePricingStore.getState().showActiveOnly,

  // Перевірка активних фільтрів
  hasActiveFilters: () => {
    const state = usePricingStore.getState();
    return !!(
      state.searchKeyword ||
      state.selectedCategory ||
      state.priceRange ||
      !state.showActiveOnly
    );
  },

  // Налаштування
  getSettings: () => usePricingStore.getState().settings,
};

// === СПЕЦІАЛІЗОВАНІ ХУКИ ===

/**
 * Хук для роботи з прайс-листом
 */
export const usePriceListItems = () => {
  return usePricingStore((state) => ({
    items: state.priceListItems,
    selectedItem: state.selectedPriceItem,
    setItems: state.setPriceListItems,
    addItem: state.addPriceListItem,
    updateItem: state.updatePriceListItem,
    removeItem: state.removePriceListItem,
    setSelectedItem: state.setSelectedPriceItem,
  }));
};

/**
 * Хук для роботи з вибраним елементом прайс-листа
 */
export const useSelectedPriceItem = () => {
  return usePricingStore((state) => ({
    selectedItem: state.selectedPriceItem,
    setSelectedItem: state.setSelectedPriceItem,
  }));
};

/**
 * Хук для роботи з модифікаторами
 */
export const usePriceModifiers = () => {
  return usePricingStore((state) => ({
    modifiers: state.priceModifiers,
    selectedModifiers: state.selectedModifiers,
    setModifiers: state.setPriceModifiers,
    addModifier: state.addPriceModifier,
    updateModifier: state.updatePriceModifier,
    removeModifier: state.removePriceModifier,
    setSelectedModifiers: state.setSelectedModifiers,
    addSelectedModifier: state.addSelectedModifier,
    removeSelectedModifier: state.removeSelectedModifier,
    clearSelectedModifiers: state.clearSelectedModifiers,
  }));
};

/**
 * Хук для роботи з вибраними модифікаторами
 */
export const useSelectedModifiers = () => {
  return usePricingStore((state) => ({
    selectedModifiers: state.selectedModifiers,
    selectedCount: state.selectedModifiers.length,
    addModifier: state.addSelectedModifier,
    removeModifier: state.removeSelectedModifier,
    clearModifiers: state.clearSelectedModifiers,
    setModifiers: state.setSelectedModifiers,
  }));
};

/**
 * Хук для роботи з поточним розрахунком
 */
export const useCurrentCalculation = () => {
  return usePricingStore((state) => ({
    currentCalculation: state.currentCalculation,
    calculationHistory: state.calculationHistory,
    setCurrentCalculation: state.setCurrentCalculation,
    addToHistory: state.addToCalculationHistory,
    clearHistory: state.clearCalculationHistory,
  }));
};

/**
 * Хук для роботи зі станом завантаження
 */
export const usePricingLoading = () => {
  return usePricingStore((state) => ({
    isLoading: state.isLoading,
    isCalculating: state.isCalculating,
    setIsLoading: state.setIsLoading,
    setIsCalculating: state.setIsCalculating,
  }));
};

/**
 * Хук для роботи з помилками
 */
export const usePricingError = () => {
  return usePricingStore((state) => ({
    error: state.error,
    calculationError: state.calculationError,
    setError: state.setError,
    setCalculationError: state.setCalculationError,
    clearErrors: state.clearErrors,
  }));
};

/**
 * Хук для роботи з фільтрами
 */
export const usePricingFilters = () => {
  return usePricingStore((state) => ({
    searchKeyword: state.searchKeyword,
    selectedCategory: state.selectedCategory,
    priceRange: state.priceRange,
    showActiveOnly: state.showActiveOnly,
    hasActiveFilters: !!(
      state.searchKeyword ||
      state.selectedCategory ||
      state.priceRange ||
      !state.showActiveOnly
    ),
    setSearchKeyword: state.setSearchKeyword,
    setSelectedCategory: state.setSelectedCategory,
    setPriceRange: state.setPriceRange,
    setShowActiveOnly: state.setShowActiveOnly,
    clearFilters: state.clearFilters,
  }));
};
