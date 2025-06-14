// Substep4 Workflow Store - ТІЛЬКИ UI стан
// Мінімальна обгортка для координації substep4 кроків (розрахунок ціни)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Локальні імпорти
import {
  SUBSTEP4_WORKFLOW_STEPS,
  SUBSTEP4_STEP_ORDER,
  SUBSTEP4_VALIDATION_RULES,
  SUBSTEP4_WORKFLOW_LIMITS,
  calculateSubstep4Progress,
  getNextSubstep4Step,
  getPreviousSubstep4Step,
  isFirstSubstep4Step,
  isLastSubstep4Step,
  type Substep4WorkflowStep,
} from './workflow.constants';

// =================== ТИПИ ===================

export interface Substep4WorkflowUIState {
  // Базова ідентифікація
  sessionId: string | null;
  orderId: string | null;
  itemId: string | null;

  // UI стан workflow (БЕЗ API даних)
  currentStep: Substep4WorkflowStep;

  // Розрахунок ціни (тільки UI стан)
  basePrice: number | null;
  selectedModifiers: string[];
  modifierValues: Record<string, number>; // Для range модифікаторів
  modifierQuantities: Record<string, number>; // Для fixed модифікаторів
  finalPrice: number | null;
  calculationValid: boolean;

  // UI прапорці
  isWorkflowStarted: boolean;
  canProceedToNext: boolean;
  hasUnsavedChanges: boolean;
}

export interface Substep4WorkflowUIActions {
  // Ініціалізація
  initializeWorkflow: (sessionId: string, orderId?: string, itemId?: string) => void;
  resetWorkflow: () => void;

  // Кроки workflow
  setCurrentStep: (step: Substep4WorkflowStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: Substep4WorkflowStep) => void;

  // Розрахунок ціни
  setBasePrice: (price: number | null) => void;
  setSelectedModifiers: (modifiers: string[]) => void;
  addModifier: (modifierId: string) => void;
  removeModifier: (modifierId: string) => void;
  setModifierValue: (modifierId: string, value: number) => void;
  setModifierQuantity: (modifierId: string, quantity: number) => void;
  setFinalPrice: (price: number | null) => void;
  setCalculationValid: (valid: boolean) => void;

  // UI стан
  setCanProceedToNext: (canProceed: boolean) => void;
  markHasUnsavedChanges: () => void;
  markChangesSaved: () => void;
}

export type Substep4WorkflowStore = Substep4WorkflowUIState & Substep4WorkflowUIActions;

// =================== ПОЧАТКОВИЙ СТАН ===================

const initialState: Substep4WorkflowUIState = {
  sessionId: null,
  orderId: null,
  itemId: null,
  currentStep: SUBSTEP4_WORKFLOW_STEPS.BASE_PRICE_CALCULATION,
  basePrice: null,
  selectedModifiers: [],
  modifierValues: {},
  modifierQuantities: {},
  finalPrice: null,
  calculationValid: false,
  isWorkflowStarted: false,
  canProceedToNext: false,
  hasUnsavedChanges: false,
};

// =================== СТОР ===================

export const useSubstep4WorkflowStore = create<Substep4WorkflowStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Ініціалізація
    initializeWorkflow: (sessionId: string, orderId?: string, itemId?: string) => {
      set({
        sessionId,
        orderId: orderId || null,
        itemId: itemId || null,
        isWorkflowStarted: true,
        currentStep: SUBSTEP4_WORKFLOW_STEPS.BASE_PRICE_CALCULATION,
        hasUnsavedChanges: false,
      });
    },

    resetWorkflow: () => {
      set(initialState);
    },

    // Кроки workflow
    setCurrentStep: (step) => {
      set({ currentStep: step });
    },

    goToNextStep: () => {
      const { currentStep } = get();
      const nextStep = getNextSubstep4Step(currentStep);
      if (nextStep) {
        set({ currentStep: nextStep });
      }
    },

    goToPreviousStep: () => {
      const { currentStep } = get();
      const previousStep = getPreviousSubstep4Step(currentStep);
      if (previousStep) {
        set({ currentStep: previousStep });
      }
    },

    goToStep: (step) => {
      set({ currentStep: step });
    },

    // Розрахунок ціни
    setBasePrice: (price) => {
      set({
        basePrice: price,
        hasUnsavedChanges: true,
      });
    },

    setSelectedModifiers: (modifiers) => {
      set({
        selectedModifiers: modifiers,
        hasUnsavedChanges: true,
      });
    },

    addModifier: (modifierId) => {
      const { selectedModifiers } = get();
      if (!selectedModifiers.includes(modifierId)) {
        set({
          selectedModifiers: [...selectedModifiers, modifierId],
          hasUnsavedChanges: true,
        });
      }
    },

    removeModifier: (modifierId) => {
      const { selectedModifiers, modifierValues, modifierQuantities } = get();
      const newModifierValues = { ...modifierValues };
      const newModifierQuantities = { ...modifierQuantities };
      delete newModifierValues[modifierId];
      delete newModifierQuantities[modifierId];

      set({
        selectedModifiers: selectedModifiers.filter((id) => id !== modifierId),
        modifierValues: newModifierValues,
        modifierQuantities: newModifierQuantities,
        hasUnsavedChanges: true,
      });
    },

    setModifierValue: (modifierId, value) => {
      const { modifierValues } = get();
      set({
        modifierValues: {
          ...modifierValues,
          [modifierId]: value,
        },
        hasUnsavedChanges: true,
      });
    },

    setModifierQuantity: (modifierId, quantity) => {
      const { modifierQuantities } = get();
      set({
        modifierQuantities: {
          ...modifierQuantities,
          [modifierId]: quantity,
        },
        hasUnsavedChanges: true,
      });
    },

    setFinalPrice: (price) => {
      set({
        finalPrice: price,
        hasUnsavedChanges: true,
      });
    },

    setCalculationValid: (valid) => {
      set({
        calculationValid: valid,
      });
    },

    // UI стан
    setCanProceedToNext: (canProceed) => {
      set({ canProceedToNext: canProceed });
    },

    markHasUnsavedChanges: () => {
      set({ hasUnsavedChanges: true });
    },

    markChangesSaved: () => {
      set({ hasUnsavedChanges: false });
    },
  }))
);

// =================== СЕЛЕКТОРИ ===================

export const useSubstep4WorkflowSelectors = () => {
  const store = useSubstep4WorkflowStore();

  return {
    // Основні селектори
    isInitialized: store.sessionId !== null,
    isCompleted: store.currentStep === SUBSTEP4_WORKFLOW_STEPS.COMPLETED,
    progressPercentage: calculateSubstep4Progress(store.currentStep),

    // Валідація переходів
    canGoToModifierSelection: SUBSTEP4_VALIDATION_RULES.canGoToModifierSelection(store.basePrice),
    canGoToModifierConfiguration: SUBSTEP4_VALIDATION_RULES.canGoToModifierConfiguration(
      store.selectedModifiers
    ),
    canGoToFinalCalculation: SUBSTEP4_VALIDATION_RULES.canGoToFinalCalculation(true), // Спрощено для UI
    canValidate: SUBSTEP4_VALIDATION_RULES.canValidate(store.finalPrice, store.calculationValid),

    // Стан даних
    hasBasePrice: store.basePrice !== null && store.basePrice > 0,
    hasModifiers: store.selectedModifiers.length > 0,
    hasFinalPrice: store.finalPrice !== null && store.finalPrice > 0,
    modifiersCount: store.selectedModifiers.length,

    // Розрахунки
    priceIncrease:
      store.basePrice !== null && store.finalPrice !== null
        ? store.finalPrice - store.basePrice
        : null,
    priceIncreasePercentage:
      store.basePrice !== null && store.finalPrice !== null && store.basePrice > 0
        ? Math.round(((store.finalPrice - store.basePrice) / store.basePrice) * 100)
        : null,

    // Навігація
    canGoNext: (() => {
      const { currentStep } = store;
      switch (currentStep) {
        case SUBSTEP4_WORKFLOW_STEPS.BASE_PRICE_CALCULATION:
          return store.basePrice !== null && store.basePrice > 0;
        case SUBSTEP4_WORKFLOW_STEPS.MODIFIER_SELECTION:
          return true; // Можна без модифікаторів
        case SUBSTEP4_WORKFLOW_STEPS.MODIFIER_CONFIGURATION:
          return true; // Конфігурація завершена
        case SUBSTEP4_WORKFLOW_STEPS.FINAL_CALCULATION:
          return store.finalPrice !== null && store.finalPrice > 0;
        case SUBSTEP4_WORKFLOW_STEPS.VALIDATION:
          return store.calculationValid;
        default:
          return false;
      }
    })(),

    canGoBack: store.currentStep !== SUBSTEP4_WORKFLOW_STEPS.BASE_PRICE_CALCULATION,

    // Експорт всіх значень стору
    ...store,
  };
};
