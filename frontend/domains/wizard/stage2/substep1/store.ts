// 📋 ПІДЕТАП 2.1: Zustand стор для основної інформації про предмет
// Тільки UI стан, API дані керуються React Query

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import {
  SUBSTEP1_UI_STEPS,
  SUBSTEP1_VALIDATION_RULES,
  SUBSTEP1_LIMITS,
  type Substep1UIStep,
  type UnitOfMeasure,
} from './constants';

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
  unitOfMeasure: UnitOfMeasure | null;
  validationNotes: string;

  // UI прапорці
  isCategoryExpanded: boolean;
  isItemExpanded: boolean;
  isQuantityExpanded: boolean;
  isValidationExpanded: boolean;

  // Workflow стан з константами
  currentStep: Substep1UIStep;
  stepsCompleted: Substep1UIStep[];

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
  setUnitOfMeasure: (unit: UnitOfMeasure | null) => void;

  // Форми - Валідація
  setValidationNotes: (notes: string) => void;

  // UI прапорці
  toggleCategoryExpanded: () => void;
  toggleItemExpanded: () => void;
  toggleQuantityExpanded: () => void;
  toggleValidationExpanded: () => void;

  // Workflow з константами
  setCurrentStep: (step: Substep1UIStep) => void;
  markStepCompleted: (step: Substep1UIStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

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
  quantity: SUBSTEP1_LIMITS.MIN_QUANTITY,
  unitOfMeasure: null,
  validationNotes: '',

  // UI прапорці
  isCategoryExpanded: true,
  isItemExpanded: false,
  isQuantityExpanded: false,
  isValidationExpanded: false,

  // Workflow стан з константами
  currentStep: SUBSTEP1_UI_STEPS.CATEGORY_SELECTION,
  stepsCompleted: [],

  // Помічники UI
  searchTerm: '',
  filteredCategories: [],
  filteredItems: [],
};

// =================== ZUSTAND СТОР ===================
export const useItemBasicInfoStore = create<ItemBasicInfoUIState & ItemBasicInfoUIActions>()(
  subscribeWithSelector((set, get) => ({
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

    // =================== WORKFLOW З КОНСТАНТАМИ ===================
    setCurrentStep: (currentStep) => set({ currentStep }),

    markStepCompleted: (step) =>
      set((state) => ({
        stepsCompleted: state.stepsCompleted.includes(step)
          ? state.stepsCompleted
          : [...state.stepsCompleted, step],
      })),

    goToNextStep: () => {
      const state = get();
      const currentIndex = Object.values(SUBSTEP1_UI_STEPS).indexOf(state.currentStep);
      const nextStep = Object.values(SUBSTEP1_UI_STEPS)[currentIndex + 1];
      if (nextStep) {
        set({ currentStep: nextStep });
      }
    },

    goToPreviousStep: () => {
      const state = get();
      const currentIndex = Object.values(SUBSTEP1_UI_STEPS).indexOf(state.currentStep);
      const previousStep = Object.values(SUBSTEP1_UI_STEPS)[currentIndex - 1];
      if (previousStep) {
        set({ currentStep: previousStep });
      }
    },

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
        quantity: SUBSTEP1_LIMITS.MIN_QUANTITY,
        unitOfMeasure: null,
        validationNotes: '',
      }),
  }))
);

// =================== СЕЛЕКТОРИ З КОНСТАНТАМИ ===================
export const useItemBasicInfoSelectors = () => {
  const store = useItemBasicInfoStore();

  return {
    // Базові селектори
    hasSession: !!store.sessionId,
    hasCategorySelected: !!store.selectedCategoryId,
    hasItemSelected: !!store.selectedItemId,
    hasQuantityEntered: store.quantity >= SUBSTEP1_LIMITS.MIN_QUANTITY && !!store.unitOfMeasure,
    hasValidationNotes: !!store.validationNotes.trim(),

    // Валідація з константами
    canGoToItemSelection: SUBSTEP1_VALIDATION_RULES.canGoToItemSelection(store.selectedCategoryId),
    canGoToQuantityEntry: SUBSTEP1_VALIDATION_RULES.canGoToQuantityEntry(store.selectedItemId),
    canValidate: SUBSTEP1_VALIDATION_RULES.canValidate(store.quantity),
    canComplete: SUBSTEP1_VALIDATION_RULES.canComplete(
      store.selectedCategoryId,
      store.selectedItemId,
      store.quantity
    ),

    // Обчислені значення
    completedStepsCount: store.stepsCompleted.length,
    totalSteps: Object.keys(SUBSTEP1_UI_STEPS).length,

    // UI стан
    isAnyExpanded:
      store.isCategoryExpanded ||
      store.isItemExpanded ||
      store.isQuantityExpanded ||
      store.isValidationExpanded,

    // Workflow з константами
    isStepCompleted: (step: Substep1UIStep) => store.stepsCompleted.includes(step),
    canProceedToNext: SUBSTEP1_VALIDATION_RULES.canComplete(
      store.selectedCategoryId,
      store.selectedItemId,
      store.quantity
    ),

    // Прогрес
    progressPercentage: Math.round(
      (store.stepsCompleted.length / Object.keys(SUBSTEP1_UI_STEPS).length) * 100
    ),

    // Пошук
    hasSearchResults: store.filteredCategories.length > 0 || store.filteredItems.length > 0,
    isSearching: store.searchTerm.length >= SUBSTEP1_LIMITS.MIN_SEARCH_LENGTH,

    // Поточний крок
    currentStep: store.currentStep,
    isCurrentStep: (step: Substep1UIStep) => store.currentStep === step,
  };
};

// =================== ТИПИ ДЛЯ ЕКСПОРТУ ===================
export type ItemBasicInfoStore = ItemBasicInfoUIState & ItemBasicInfoUIActions;
