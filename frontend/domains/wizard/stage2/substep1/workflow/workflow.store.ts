// Substep1 Workflow Store - ТІЛЬКИ UI стан
// Мінімальна обгортка для координації substep1 кроків

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Локальні імпорти
import {
  SUBSTEP1_WORKFLOW_STEPS,
  SUBSTEP1_STEP_ORDER,
  SUBSTEP1_VALIDATION_RULES,
  SUBSTEP1_WORKFLOW_LIMITS,
  calculateSubstep1Progress,
  getNextSubstep1Step,
  getPreviousSubstep1Step,
  isFirstSubstep1Step,
  isLastSubstep1Step,
  type Substep1WorkflowStep,
} from './workflow.constants';

// =================== ТИПИ ===================

interface Substep1WorkflowUIState {
  // Базова ідентифікація
  sessionId: string | null;
  orderId: string | null;

  // UI стан workflow (БЕЗ API даних)
  currentStep: Substep1WorkflowStep;

  // Вибори користувача (тільки IDs)
  selectedCategoryId: string | null;
  selectedItemId: string | null;
  enteredQuantity: number | null;

  // UI прапорці
  isWorkflowStarted: boolean;
  canProceedToNext: boolean;
  hasUnsavedChanges: boolean;
}

interface Substep1WorkflowUIActions {
  // Ініціалізація
  initializeWorkflow: (sessionId: string, orderId?: string) => void;
  resetWorkflow: () => void;

  // Кроки workflow
  setCurrentStep: (step: Substep1WorkflowStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Вибори
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedItem: (itemId: string | null) => void;
  setEnteredQuantity: (quantity: number | null) => void;

  // UI стан
  setCanProceedToNext: (canProceed: boolean) => void;
  markHasUnsavedChanges: () => void;
  markChangesSaved: () => void;
}

type Substep1WorkflowStore = Substep1WorkflowUIState & Substep1WorkflowUIActions;

// =================== ПОЧАТКОВИЙ СТАН ===================

const initialState: Substep1WorkflowUIState = {
  sessionId: null,
  orderId: null,
  currentStep: SUBSTEP1_WORKFLOW_STEPS.CATEGORY_SELECTION,
  selectedCategoryId: null,
  selectedItemId: null,
  enteredQuantity: SUBSTEP1_WORKFLOW_LIMITS.MIN_QUANTITY,
  isWorkflowStarted: false,
  canProceedToNext: false,
  hasUnsavedChanges: false,
};

// =================== СТОР ===================

export const useSubstep1WorkflowStore = create<Substep1WorkflowStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Ініціалізація
    initializeWorkflow: (sessionId: string, orderId?: string) => {
      set({
        sessionId,
        orderId: orderId || null,
        isWorkflowStarted: true,
        currentStep: SUBSTEP1_WORKFLOW_STEPS.CATEGORY_SELECTION,
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
      const nextStep = getNextSubstep1Step(currentStep);
      if (nextStep) {
        set({ currentStep: nextStep });
      }
    },

    goToPreviousStep: () => {
      const { currentStep } = get();
      const previousStep = getPreviousSubstep1Step(currentStep);
      if (previousStep) {
        set({ currentStep: previousStep });
      }
    },

    // Вибори
    setSelectedCategory: (categoryId) => {
      set({
        selectedCategoryId: categoryId,
        selectedItemId: null, // Reset наступних вибоків
        enteredQuantity: SUBSTEP1_WORKFLOW_LIMITS.MIN_QUANTITY,
        hasUnsavedChanges: true,
      });
    },

    setSelectedItem: (itemId) => {
      set({
        selectedItemId: itemId,
        enteredQuantity: SUBSTEP1_WORKFLOW_LIMITS.MIN_QUANTITY, // Reset до мінімуму
        hasUnsavedChanges: true,
      });
    },

    setEnteredQuantity: (quantity) => {
      // Валідація з константами
      const validQuantity =
        quantity !== null
          ? Math.max(
              SUBSTEP1_WORKFLOW_LIMITS.MIN_QUANTITY,
              Math.min(SUBSTEP1_WORKFLOW_LIMITS.MAX_QUANTITY, quantity)
            )
          : null;

      set({
        enteredQuantity: validQuantity,
        hasUnsavedChanges: true,
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

// =================== СЕЛЕКТОРИ З КОНСТАНТАМИ ===================

export const useSubstep1WorkflowSelectors = () => {
  const store = useSubstep1WorkflowStore();

  return {
    // Основні селектори
    isInitialized: store.sessionId !== null,
    isCompleted: store.currentStep === SUBSTEP1_WORKFLOW_STEPS.COMPLETED,
    isFirstStep: isFirstSubstep1Step(store.currentStep),
    isLastStep: isLastSubstep1Step(store.currentStep),
    progressPercentage: calculateSubstep1Progress(store.currentStep),

    // Валідація переходів з константами
    canGoToItemSelection: SUBSTEP1_VALIDATION_RULES.canGoToItemSelection(store.selectedCategoryId),
    canGoToQuantityEntry: SUBSTEP1_VALIDATION_RULES.canGoToQuantityEntry(
      store.selectedCategoryId,
      store.selectedItemId
    ),
    canValidate: SUBSTEP1_VALIDATION_RULES.canValidate(
      store.selectedCategoryId,
      store.selectedItemId,
      store.enteredQuantity
    ),
    canComplete: SUBSTEP1_VALIDATION_RULES.canComplete(
      store.selectedCategoryId,
      store.selectedItemId,
      store.enteredQuantity
    ),

    // Навігація з константами
    nextStep: getNextSubstep1Step(store.currentStep),
    previousStep: getPreviousSubstep1Step(store.currentStep),
    canGoNext: getNextSubstep1Step(store.currentStep) !== null,
    canGoBack: getPreviousSubstep1Step(store.currentStep) !== null,

    // Ліміти та валідація
    isQuantityValid:
      store.enteredQuantity !== null &&
      store.enteredQuantity >= SUBSTEP1_WORKFLOW_LIMITS.MIN_QUANTITY &&
      store.enteredQuantity <= SUBSTEP1_WORKFLOW_LIMITS.MAX_QUANTITY,

    // Стан workflow
    ...store,
  };
};
