// 📋 ПІДЕТАП 2.4: Zustand стор для калькулятора ціни
// Тільки UI стан, API дані керуються React Query

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Локальні імпорти
import {
  SUBSTEP4_UI_STEPS,
  SUBSTEP4_VALIDATION_RULES,
  SUBSTEP4_UI_LIMITS,
  type Substep4UIStep,
} from './constants';

// =================== ТИПИ СТАНУ ===================
interface PriceCalculationUIState {
  // Сесія
  sessionId: string | null;

  // UI навігація
  currentStep: Substep4UIStep;

  // UI налаштування
  showDetailedBreakdown: boolean;
  autoRecalculate: boolean;
  roundingMode: 'up' | 'down' | 'nearest';
  currency: string;

  // Форми стан
  selectedModifiers: string[];
  calculationNotes: string;

  // UI прапорці
  isCalculationExpanded: boolean;
  isModifiersExpanded: boolean;
  showAdvancedOptions: boolean;

  // Історія розрахунків (для UI)
  calculationHistory: Array<{
    id: string;
    timestamp: number;
    basePrice: number;
    finalPrice: number;
    modifiersCount: number;
  }>;
}

interface PriceCalculationUIActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;

  // UI навігація
  setCurrentStep: (step: Substep4UIStep) => void;

  // UI налаштування
  setShowDetailedBreakdown: (show: boolean) => void;
  setAutoRecalculate: (auto: boolean) => void;
  setRoundingMode: (mode: 'up' | 'down' | 'nearest') => void;
  setCurrency: (currency: string) => void;

  // Форми
  setSelectedModifiers: (modifiers: string[]) => void;
  addSelectedModifier: (modifierId: string) => void;
  removeSelectedModifier: (modifierId: string) => void;
  setCalculationNotes: (notes: string) => void;

  // UI прапорці
  toggleCalculationExpanded: () => void;
  toggleModifiersExpanded: () => void;
  toggleAdvancedOptions: () => void;

  // Історія
  addToHistory: (calculation: {
    basePrice: number;
    finalPrice: number;
    modifiersCount: number;
  }) => void;
  clearHistory: () => void;

  // Скидання
  resetUIState: () => void;
  resetForms: () => void;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: PriceCalculationUIState = {
  // Сесія
  sessionId: null,

  // UI навігація
  currentStep: SUBSTEP4_UI_STEPS.MODIFIER_SELECTION,

  // UI налаштування
  showDetailedBreakdown: true,
  autoRecalculate: true,
  roundingMode: 'nearest',
  currency: 'UAH',

  // Форми стан
  selectedModifiers: [],
  calculationNotes: '',

  // UI прапорці
  isCalculationExpanded: true,
  isModifiersExpanded: false,
  showAdvancedOptions: false,

  // Історія
  calculationHistory: [],
};

// =================== ZUSTAND СТОР ===================
export const usePriceCalculationStore = create<
  PriceCalculationUIState & PriceCalculationUIActions
>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    // =================== СЕСІЯ ===================
    setSessionId: (sessionId) => set({ sessionId }),

    // =================== UI НАВІГАЦІЯ ===================
    setCurrentStep: (currentStep) => set({ currentStep }),

    // =================== UI НАЛАШТУВАННЯ ===================
    setShowDetailedBreakdown: (showDetailedBreakdown) => set({ showDetailedBreakdown }),
    setAutoRecalculate: (autoRecalculate) => set({ autoRecalculate }),
    setRoundingMode: (roundingMode) => set({ roundingMode }),
    setCurrency: (currency) => set({ currency }),

    // =================== ФОРМИ ===================
    setSelectedModifiers: (selectedModifiers) => set({ selectedModifiers }),

    addSelectedModifier: (modifierId) =>
      set((state) => {
        // Перевірка ліміту модифікаторів
        if (state.selectedModifiers.length >= SUBSTEP4_VALIDATION_RULES.MAX_MODIFIERS) {
          return state;
        }

        return {
          selectedModifiers: state.selectedModifiers.includes(modifierId)
            ? state.selectedModifiers
            : [...state.selectedModifiers, modifierId],
        };
      }),

    removeSelectedModifier: (modifierId) =>
      set((state) => ({
        selectedModifiers: state.selectedModifiers.filter((id) => id !== modifierId),
      })),

    setCalculationNotes: (calculationNotes) => {
      // Перевірка ліміту довжини
      const trimmedNotes = calculationNotes.slice(0, SUBSTEP4_UI_LIMITS.MAX_NOTES_LENGTH);
      set({ calculationNotes: trimmedNotes });
    },

    // =================== UI ПРАПОРЦІ ===================
    toggleCalculationExpanded: () =>
      set((state) => ({
        isCalculationExpanded: !state.isCalculationExpanded,
      })),

    toggleModifiersExpanded: () =>
      set((state) => ({
        isModifiersExpanded: !state.isModifiersExpanded,
      })),

    toggleAdvancedOptions: () =>
      set((state) => ({
        showAdvancedOptions: !state.showAdvancedOptions,
      })),

    // =================== ІСТОРІЯ ===================
    addToHistory: (calculation) =>
      set((state) => {
        const newEntry = {
          id: `calc_${Date.now()}`,
          timestamp: Date.now(),
          ...calculation,
        };

        // Зберігаємо тільки останні 10 розрахунків
        const updatedHistory = [newEntry, ...state.calculationHistory].slice(0, 10);

        return { calculationHistory: updatedHistory };
      }),

    clearHistory: () => set({ calculationHistory: [] }),

    // =================== СКИДАННЯ ===================
    resetUIState: () => set(initialState),

    resetForms: () =>
      set({
        selectedModifiers: [],
        calculationNotes: '',
      }),
  }))
);

// =================== СЕЛЕКТОРИ ===================
export const usePriceCalculationSelectors = () => {
  const store = usePriceCalculationStore();

  return {
    // Базові селектори
    hasSession: !!store.sessionId,
    hasSelectedModifiers: store.selectedModifiers.length > 0,
    hasHistory: store.calculationHistory.length > 0,

    // Обчислені значення
    modifiersCount: store.selectedModifiers.length,
    latestCalculation: store.calculationHistory[0] || null,
    canAddMoreModifiers: store.selectedModifiers.length < SUBSTEP4_VALIDATION_RULES.MAX_MODIFIERS,

    // UI стан
    isExpanded: store.isCalculationExpanded || store.isModifiersExpanded,
    showAdvanced: store.showAdvancedOptions,

    // Навігація
    currentStep: store.currentStep,
  };
};
