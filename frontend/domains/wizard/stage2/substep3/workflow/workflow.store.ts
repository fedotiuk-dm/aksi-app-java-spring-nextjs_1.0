// Substep3 Workflow Store - ТІЛЬКИ UI стан
// Мінімальна обгортка для координації substep3 кроків (забруднення та дефекти)

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Локальні імпорти
import {
  SUBSTEP3_WORKFLOW_STEPS,
  SUBSTEP3_STEP_ORDER,
  SUBSTEP3_VALIDATION_RULES,
  calculateSubstep3Progress,
  getNextSubstep3Step,
  getPreviousSubstep3Step,
  type Substep3WorkflowStep,
} from './workflow.constants';

// =================== ТИПИ ===================

export interface Substep3WorkflowUIState {
  // Базова ідентифікація
  sessionId: string | null;
  orderId: string | null;
  itemId: string | null;

  // UI стан workflow (БЕЗ API даних)
  currentStep: Substep3WorkflowStep;

  // Вибори користувача (тільки IDs)
  selectedStains: string[];
  selectedDefects: string[];
  defectNotes: string;

  // UI прапорці
  isWorkflowStarted: boolean;
  canProceedToNext: boolean;
  hasUnsavedChanges: boolean;
}

export interface Substep3WorkflowUIActions {
  // Ініціалізація
  initializeWorkflow: (sessionId: string, orderId?: string, itemId?: string) => void;
  resetWorkflow: () => void;

  // Кроки workflow
  setCurrentStep: (step: Substep3WorkflowStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Вибори забруднень та дефектів
  setSelectedStains: (stains: string[]) => void;
  addStain: (stainId: string) => void;
  removeStain: (stainId: string) => void;
  setSelectedDefects: (defects: string[]) => void;
  addDefect: (defectId: string) => void;
  removeDefect: (defectId: string) => void;
  setDefectNotes: (notes: string) => void;

  // UI стан
  setCanProceedToNext: (canProceed: boolean) => void;
  markHasUnsavedChanges: () => void;
  markChangesSaved: () => void;
}

export type Substep3WorkflowStore = Substep3WorkflowUIState & Substep3WorkflowUIActions;

// =================== ПОЧАТКОВИЙ СТАН ===================

const initialState: Substep3WorkflowUIState = {
  sessionId: null,
  orderId: null,
  itemId: null,
  currentStep: SUBSTEP3_WORKFLOW_STEPS.STAIN_SELECTION,
  selectedStains: [],
  selectedDefects: [],
  defectNotes: '',
  isWorkflowStarted: false,
  canProceedToNext: false,
  hasUnsavedChanges: false,
};

// =================== СТОР ===================

export const useSubstep3WorkflowStore = create<Substep3WorkflowStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Ініціалізація
    initializeWorkflow: (sessionId: string, orderId?: string, itemId?: string) => {
      set({
        sessionId,
        orderId: orderId || null,
        itemId: itemId || null,
        isWorkflowStarted: true,
        currentStep: SUBSTEP3_WORKFLOW_STEPS.STAIN_SELECTION,
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
      const nextStep = getNextSubstep3Step(currentStep);
      if (nextStep) {
        set({ currentStep: nextStep });
      }
    },

    goToPreviousStep: () => {
      const { currentStep } = get();
      const previousStep = getPreviousSubstep3Step(currentStep);
      if (previousStep) {
        set({ currentStep: previousStep });
      }
    },

    // Вибори забруднень та дефектів
    setSelectedStains: (stains) => {
      set({
        selectedStains: stains,
        hasUnsavedChanges: true,
      });
    },

    addStain: (stainId) => {
      const { selectedStains } = get();
      if (!selectedStains.includes(stainId)) {
        set({
          selectedStains: [...selectedStains, stainId],
          hasUnsavedChanges: true,
        });
      }
    },

    removeStain: (stainId) => {
      const { selectedStains } = get();
      set({
        selectedStains: selectedStains.filter((id) => id !== stainId),
        hasUnsavedChanges: true,
      });
    },

    setSelectedDefects: (defects) => {
      set({
        selectedDefects: defects,
        hasUnsavedChanges: true,
      });
    },

    addDefect: (defectId) => {
      const { selectedDefects } = get();
      if (!selectedDefects.includes(defectId)) {
        set({
          selectedDefects: [...selectedDefects, defectId],
          hasUnsavedChanges: true,
        });
      }
    },

    removeDefect: (defectId) => {
      const { selectedDefects } = get();
      set({
        selectedDefects: selectedDefects.filter((id) => id !== defectId),
        hasUnsavedChanges: true,
      });
    },

    setDefectNotes: (notes) => {
      set({
        defectNotes: notes,
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

// =================== СЕЛЕКТОРИ ===================

export const useSubstep3WorkflowSelectors = () => {
  const store = useSubstep3WorkflowStore();

  return {
    // Основні селектори
    isInitialized: store.sessionId !== null,
    isCompleted: store.currentStep === SUBSTEP3_WORKFLOW_STEPS.COMPLETED,
    progressPercentage: calculateSubstep3Progress(store.currentStep),

    // Валідація переходів
    canGoToDefectSelection: SUBSTEP3_VALIDATION_RULES.canGoToDefectSelection(store.selectedStains),
    canGoToDefectNotes: SUBSTEP3_VALIDATION_RULES.canGoToDefectNotes(store.selectedDefects),
    canValidate: SUBSTEP3_VALIDATION_RULES.canValidate(
      store.selectedStains,
      store.selectedDefects,
      store.defectNotes
    ),

    // Стан даних
    hasStains: store.selectedStains.length > 0,
    hasDefects: store.selectedDefects.length > 0,
    hasNotes: store.defectNotes.trim().length > 0,
    stainsCount: store.selectedStains.length,
    defectsCount: store.selectedDefects.length,

    // Навігація
    canGoNext: (() => {
      const { currentStep } = store;
      switch (currentStep) {
        case SUBSTEP3_WORKFLOW_STEPS.STAIN_SELECTION:
          return true; // Можна без плям
        case SUBSTEP3_WORKFLOW_STEPS.DEFECT_SELECTION:
          return true; // Можна без дефектів
        case SUBSTEP3_WORKFLOW_STEPS.DEFECT_NOTES:
          return store.selectedDefects.length === 0 || store.defectNotes.trim().length > 0;
        case SUBSTEP3_WORKFLOW_STEPS.VALIDATION:
          return true;
        default:
          return false;
      }
    })(),

    canGoBack: store.currentStep !== SUBSTEP3_WORKFLOW_STEPS.STAIN_SELECTION,

    // Експорт всіх значень стору
    ...store,
  };
};
