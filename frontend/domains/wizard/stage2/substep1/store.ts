// 📋 ПІДЕТАП 2.1: Zustand стор для основної інформації про предмет
// Тільки UI стан, API дані керуються React Query

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// =================== ТИПИ СТАНУ ===================
interface ItemBasicInfoUIState {
  // Сесія
  sessionId: string | null;

  // UI налаштування
  showCategoryDetails: boolean;
  showPriceDetails: boolean;
  showQuantityHelper: boolean;
  showValidationSummary: boolean;

  // Форми стан
  selectedCategoryId: string | null;
  selectedCategoryName: string;
  selectedItemId: string | null;
  selectedItemName: string;
  selectedItemBasePrice: number | null;
  quantity: number;
  unitOfMeasure: 'PIECES' | 'KILOGRAMS' | null;
  validationNotes: string;

  // UI прапорці
  isCategoryExpanded: boolean;
  isItemExpanded: boolean;
  isQuantityExpanded: boolean;
  isValidationExpanded: boolean;

  // Workflow стан
  currentStep: 'category' | 'item' | 'quantity' | 'validation' | 'completed';
  stepsCompleted: string[];

  // Помічники UI
  searchTerm: string;
  filteredCategories: string[];
  filteredItems: string[];
}

interface ItemBasicInfoUIActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;

  // UI налаштування
  setShowCategoryDetails: (show: boolean) => void;
  setShowPriceDetails: (show: boolean) => void;
  setShowQuantityHelper: (show: boolean) => void;
  setShowValidationSummary: (show: boolean) => void;

  // Форми - Категорія
  setSelectedCategoryId: (categoryId: string | null) => void;
  setSelectedCategoryName: (categoryName: string) => void;

  // Форми - Предмет
  setSelectedItemId: (itemId: string | null) => void;
  setSelectedItemName: (itemName: string) => void;
  setSelectedItemBasePrice: (price: number | null) => void;

  // Форми - Кількість
  setQuantity: (quantity: number) => void;
  setUnitOfMeasure: (unit: 'PIECES' | 'KILOGRAMS' | null) => void;

  // Форми - Валідація
  setValidationNotes: (notes: string) => void;

  // UI прапорці
  toggleCategoryExpanded: () => void;
  toggleItemExpanded: () => void;
  toggleQuantityExpanded: () => void;
  toggleValidationExpanded: () => void;

  // Workflow
  setCurrentStep: (step: 'category' | 'item' | 'quantity' | 'validation' | 'completed') => void;
  markStepCompleted: (step: string) => void;

  // Помічники UI
  setSearchTerm: (term: string) => void;
  setFilteredCategories: (categories: string[]) => void;
  setFilteredItems: (items: string[]) => void;

  // Скидання
  resetUIState: () => void;
  resetForms: () => void;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: ItemBasicInfoUIState = {
  // Сесія
  sessionId: null,

  // UI налаштування
  showCategoryDetails: true,
  showPriceDetails: true,
  showQuantityHelper: true,
  showValidationSummary: false,

  // Форми стан
  selectedCategoryId: null,
  selectedCategoryName: '',
  selectedItemId: null,
  selectedItemName: '',
  selectedItemBasePrice: null,
  quantity: 1,
  unitOfMeasure: null,
  validationNotes: '',

  // UI прапорці
  isCategoryExpanded: true,
  isItemExpanded: false,
  isQuantityExpanded: false,
  isValidationExpanded: false,

  // Workflow стан
  currentStep: 'category',
  stepsCompleted: [],

  // Помічники UI
  searchTerm: '',
  filteredCategories: [],
  filteredItems: [],
};

// =================== ZUSTAND СТОР ===================
export const useItemBasicInfoStore = create<ItemBasicInfoUIState & ItemBasicInfoUIActions>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    // =================== СЕСІЯ ===================
    setSessionId: (sessionId) => set({ sessionId }),

    // =================== UI НАЛАШТУВАННЯ ===================
    setShowCategoryDetails: (showCategoryDetails) => set({ showCategoryDetails }),
    setShowPriceDetails: (showPriceDetails) => set({ showPriceDetails }),
    setShowQuantityHelper: (showQuantityHelper) => set({ showQuantityHelper }),
    setShowValidationSummary: (showValidationSummary) => set({ showValidationSummary }),

    // =================== ФОРМИ - КАТЕГОРІЯ ===================
    setSelectedCategoryId: (selectedCategoryId) => set({ selectedCategoryId }),
    setSelectedCategoryName: (selectedCategoryName) => set({ selectedCategoryName }),

    // =================== ФОРМИ - ПРЕДМЕТ ===================
    setSelectedItemId: (selectedItemId) => set({ selectedItemId }),
    setSelectedItemName: (selectedItemName) => set({ selectedItemName }),
    setSelectedItemBasePrice: (selectedItemBasePrice) => set({ selectedItemBasePrice }),

    // =================== ФОРМИ - КІЛЬКІСТЬ ===================
    setQuantity: (quantity) => set({ quantity }),
    setUnitOfMeasure: (unitOfMeasure) => set({ unitOfMeasure }),

    // =================== ФОРМИ - ВАЛІДАЦІЯ ===================
    setValidationNotes: (validationNotes) => set({ validationNotes }),

    // =================== UI ПРАПОРЦІ ===================
    toggleCategoryExpanded: () =>
      set((state) => ({
        isCategoryExpanded: !state.isCategoryExpanded,
      })),

    toggleItemExpanded: () =>
      set((state) => ({
        isItemExpanded: !state.isItemExpanded,
      })),

    toggleQuantityExpanded: () =>
      set((state) => ({
        isQuantityExpanded: !state.isQuantityExpanded,
      })),

    toggleValidationExpanded: () =>
      set((state) => ({
        isValidationExpanded: !state.isValidationExpanded,
      })),

    // =================== WORKFLOW ===================
    setCurrentStep: (currentStep) => set({ currentStep }),

    markStepCompleted: (step) =>
      set((state) => ({
        stepsCompleted: state.stepsCompleted.includes(step)
          ? state.stepsCompleted
          : [...state.stepsCompleted, step],
      })),

    // =================== ПОМІЧНИКИ UI ===================
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setFilteredCategories: (filteredCategories) => set({ filteredCategories }),
    setFilteredItems: (filteredItems) => set({ filteredItems }),

    // =================== СКИДАННЯ ===================
    resetUIState: () => set(initialState),

    resetForms: () =>
      set({
        selectedCategoryId: null,
        selectedCategoryName: '',
        selectedItemId: null,
        selectedItemName: '',
        selectedItemBasePrice: null,
        quantity: 1,
        unitOfMeasure: null,
        validationNotes: '',
      }),
  }))
);

// =================== СЕЛЕКТОРИ ===================
export const useItemBasicInfoSelectors = () => {
  const store = useItemBasicInfoStore();

  return {
    // Базові селектори
    hasSession: !!store.sessionId,
    hasCategorySelected: !!store.selectedCategoryId,
    hasItemSelected: !!store.selectedItemId,
    hasQuantityEntered: store.quantity > 0 && !!store.unitOfMeasure,
    hasValidationNotes: !!store.validationNotes.trim(),

    // Обчислені значення
    completedStepsCount: store.stepsCompleted.length,
    totalSteps: 4, // category, item, quantity, validation

    // UI стан
    isAnyExpanded:
      store.isCategoryExpanded ||
      store.isItemExpanded ||
      store.isQuantityExpanded ||
      store.isValidationExpanded,

    // Workflow
    isStepCompleted: (step: string) => store.stepsCompleted.includes(step),
    canProceedToNext:
      store.selectedCategoryId && store.selectedItemId && store.quantity > 0 && store.unitOfMeasure,

    // Прогрес
    progressPercentage: Math.round((store.stepsCompleted.length / 4) * 100),

    // Пошук
    hasSearchResults: store.filteredCategories.length > 0 || store.filteredItems.length > 0,
    isSearching: !!store.searchTerm.trim(),
  };
};
