// 📋 STAGE2 WORKFLOW: Zustand стор для координації підетапів
// Тільки UI стан, API дані керуються React Query

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  STAGE2_WORKFLOW_UI_STATES,
  STAGE2_WORKFLOW_OPERATIONS,
  STAGE2_SUBSTEPS,
  STAGE2_SUBSTEP_ORDER,
  STAGE2_WORKFLOW_VALIDATION_RULES,
  STAGE2_WORKFLOW_LIMITS,
  type Stage2WorkflowUIState,
  type Stage2WorkflowOperation,
  type Stage2Substep,
} from './constants';

// =================== ТИПИ СТАНУ ===================
interface WorkflowStoreState {
  // Сесія
  sessionId: string | null;
  orderId: string | null;

  // UI налаштування
  showSubstepProgress: boolean;
  showWorkflowControls: boolean;
  showItemWizard: boolean;
  showNavigationButtons: boolean;

  // Workflow стан з константами
  currentUIState: Stage2WorkflowUIState;
  currentOperation: Stage2WorkflowOperation;
  operationsCompleted: Stage2WorkflowOperation[];

  // Підетапи навігація
  currentSubstep: Stage2Substep;
  substepsCompleted: Stage2Substep[];
  activeItemId: string | null;
  isWizardActive: boolean;

  // UI прапорці
  isProgressExpanded: boolean;
  isControlsExpanded: boolean;
  isNavigationExpanded: boolean;

  // Помічники UI
  totalItemsCount: number;
  canProceedToNextStage: boolean;
  hasUnsavedChanges: boolean;

  // Модальні вікна
  showCompleteStageConfirmation: boolean;
  showCloseWizardConfirmation: boolean;
  showNavigationConfirmation: boolean;
}

interface WorkflowStoreActions {
  // Сесія
  setSessionId: (sessionId: string | null) => void;
  setOrderId: (orderId: string | null) => void;

  // UI налаштування
  setShowSubstepProgress: (show: boolean) => void;
  setShowWorkflowControls: (show: boolean) => void;
  setShowItemWizard: (show: boolean) => void;
  setShowNavigationButtons: (show: boolean) => void;

  // Workflow стан з константами
  setCurrentUIState: (state: Stage2WorkflowUIState) => void;
  setCurrentOperation: (operation: Stage2WorkflowOperation) => void;
  markOperationCompleted: (operation: Stage2WorkflowOperation) => void;
  goToNextOperation: () => void;
  goToPreviousOperation: () => void;

  // Підетапи навігація
  setCurrentSubstep: (substep: Stage2Substep) => void;
  markSubstepCompleted: (substep: Stage2Substep) => void;
  goToNextSubstep: () => void;
  goToPreviousSubstep: () => void;
  setActiveItemId: (itemId: string | null) => void;
  setIsWizardActive: (active: boolean) => void;

  // UI прапорці
  toggleProgressExpanded: () => void;
  toggleControlsExpanded: () => void;
  toggleNavigationExpanded: () => void;

  // Помічники UI
  setTotalItemsCount: (count: number) => void;
  setCanProceedToNextStage: (canProceed: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;

  // Модальні вікна
  setShowCompleteStageConfirmation: (show: boolean) => void;
  setShowCloseWizardConfirmation: (show: boolean) => void;
  setShowNavigationConfirmation: (show: boolean) => void;

  // Скидання
  resetUIState: () => void;
  resetWorkflowState: () => void;
  resetSubstepsState: () => void;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: WorkflowStoreState = {
  // Сесія
  sessionId: null,
  orderId: null,

  // UI налаштування
  showSubstepProgress: true,
  showWorkflowControls: true,
  showItemWizard: false,
  showNavigationButtons: true,

  // Workflow стан з константами
  currentUIState: STAGE2_WORKFLOW_UI_STATES.INITIALIZING,
  currentOperation: STAGE2_WORKFLOW_OPERATIONS.INITIALIZE,
  operationsCompleted: [],

  // Підетапи навігація
  currentSubstep: STAGE2_SUBSTEPS.SUBSTEP1,
  substepsCompleted: [],
  activeItemId: null,
  isWizardActive: false,

  // UI прапорці
  isProgressExpanded: true,
  isControlsExpanded: true,
  isNavigationExpanded: false,

  // Помічники UI
  totalItemsCount: 0,
  canProceedToNextStage: false,
  hasUnsavedChanges: false,

  // Модальні вікна
  showCompleteStageConfirmation: false,
  showCloseWizardConfirmation: false,
  showNavigationConfirmation: false,
};

// =================== ZUSTAND СТОР ===================
export const useStage2WorkflowStore = create<WorkflowStoreState & WorkflowStoreActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // =================== СЕСІЯ ===================
    setSessionId: (sessionId) => set({ sessionId }),
    setOrderId: (orderId) => set({ orderId }),

    // =================== UI НАЛАШТУВАННЯ ===================
    setShowSubstepProgress: (showSubstepProgress) => set({ showSubstepProgress }),
    setShowWorkflowControls: (showWorkflowControls) => set({ showWorkflowControls }),
    setShowItemWizard: (showItemWizard) => set({ showItemWizard }),
    setShowNavigationButtons: (showNavigationButtons) => set({ showNavigationButtons }),

    // =================== WORKFLOW СТАН З КОНСТАНТАМИ ===================
    setCurrentUIState: (currentUIState) => set({ currentUIState }),
    setCurrentOperation: (currentOperation) => set({ currentOperation }),

    markOperationCompleted: (operation) =>
      set((state) => ({
        operationsCompleted: state.operationsCompleted.includes(operation)
          ? state.operationsCompleted
          : [...state.operationsCompleted, operation],
      })),

    goToNextOperation: () => {
      const state = get();
      const currentIndex = Object.values(STAGE2_WORKFLOW_OPERATIONS).indexOf(
        state.currentOperation
      );
      const nextOperation = Object.values(STAGE2_WORKFLOW_OPERATIONS)[currentIndex + 1];
      if (nextOperation) {
        set({ currentOperation: nextOperation });
      }
    },

    goToPreviousOperation: () => {
      const state = get();
      const currentIndex = Object.values(STAGE2_WORKFLOW_OPERATIONS).indexOf(
        state.currentOperation
      );
      const previousOperation = Object.values(STAGE2_WORKFLOW_OPERATIONS)[currentIndex - 1];
      if (previousOperation) {
        set({ currentOperation: previousOperation });
      }
    },

    // =================== ПІДЕТАПИ НАВІГАЦІЯ ===================
    setCurrentSubstep: (currentSubstep) => set({ currentSubstep }),

    markSubstepCompleted: (substep) =>
      set((state) => ({
        substepsCompleted: state.substepsCompleted.includes(substep)
          ? state.substepsCompleted
          : [...state.substepsCompleted, substep],
      })),

    goToNextSubstep: () => {
      const state = get();
      const currentIndex = STAGE2_SUBSTEP_ORDER.indexOf(state.currentSubstep);
      const nextSubstep = STAGE2_SUBSTEP_ORDER[currentIndex + 1];
      if (nextSubstep) {
        set({ currentSubstep: nextSubstep });
      }
    },

    goToPreviousSubstep: () => {
      const state = get();
      const currentIndex = STAGE2_SUBSTEP_ORDER.indexOf(state.currentSubstep);
      const previousSubstep = STAGE2_SUBSTEP_ORDER[currentIndex - 1];
      if (previousSubstep) {
        set({ currentSubstep: previousSubstep });
      }
    },

    setActiveItemId: (activeItemId) => set({ activeItemId }),
    setIsWizardActive: (isWizardActive) => set({ isWizardActive }),

    // =================== UI ПРАПОРЦІ ===================
    toggleProgressExpanded: () =>
      set((state) => ({
        isProgressExpanded: !state.isProgressExpanded,
      })),

    toggleControlsExpanded: () =>
      set((state) => ({
        isControlsExpanded: !state.isControlsExpanded,
      })),

    toggleNavigationExpanded: () =>
      set((state) => ({
        isNavigationExpanded: !state.isNavigationExpanded,
      })),

    // =================== ПОМІЧНИКИ UI ===================
    setTotalItemsCount: (totalItemsCount) => set({ totalItemsCount }),
    setCanProceedToNextStage: (canProceedToNextStage) => set({ canProceedToNextStage }),
    setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),

    // =================== МОДАЛЬНІ ВІКНА ===================
    setShowCompleteStageConfirmation: (showCompleteStageConfirmation) =>
      set({ showCompleteStageConfirmation }),
    setShowCloseWizardConfirmation: (showCloseWizardConfirmation) =>
      set({ showCloseWizardConfirmation }),
    setShowNavigationConfirmation: (showNavigationConfirmation) =>
      set({ showNavigationConfirmation }),

    // =================== СКИДАННЯ ===================
    resetUIState: () => set(initialState),

    resetWorkflowState: () =>
      set({
        currentUIState: STAGE2_WORKFLOW_UI_STATES.INITIALIZING,
        currentOperation: STAGE2_WORKFLOW_OPERATIONS.INITIALIZE,
        operationsCompleted: [],
      }),

    resetSubstepsState: () =>
      set({
        currentSubstep: STAGE2_SUBSTEPS.SUBSTEP1,
        substepsCompleted: [],
        activeItemId: null,
        isWizardActive: false,
      }),
  }))
);

// =================== СЕЛЕКТОРИ ===================
export const useStage2WorkflowSelectors = () => {
  const store = useStage2WorkflowStore();

  return {
    // Валідація з константами
    canInitialize: STAGE2_WORKFLOW_VALIDATION_RULES.canInitialize(store.sessionId),
    canStartNewItem: STAGE2_WORKFLOW_VALIDATION_RULES.canStartNewItem(store.sessionId),
    canStartEditItem: STAGE2_WORKFLOW_VALIDATION_RULES.canStartEditItem(
      store.sessionId,
      store.activeItemId
    ),
    canCloseWizard: STAGE2_WORKFLOW_VALIDATION_RULES.canCloseWizard(store.sessionId),
    canCompleteStage: STAGE2_WORKFLOW_VALIDATION_RULES.canCompleteStage(
      store.sessionId,
      store.totalItemsCount
    ),
    canSynchronize: STAGE2_WORKFLOW_VALIDATION_RULES.canSynchronize(store.sessionId),

    // Обчислені значення
    isInitialized: store.sessionId !== null && store.orderId !== null,
    isReady: store.currentUIState === STAGE2_WORKFLOW_UI_STATES.READY,
    isLoading: store.currentUIState === STAGE2_WORKFLOW_UI_STATES.LOADING,
    isSaving: store.currentUIState === STAGE2_WORKFLOW_UI_STATES.SAVING,
    hasError: store.currentUIState === STAGE2_WORKFLOW_UI_STATES.ERROR,

    // Прогрес
    substepProgress: Math.round(
      ((STAGE2_SUBSTEP_ORDER.indexOf(store.currentSubstep) + 1) / STAGE2_SUBSTEP_ORDER.length) * 100
    ),
    operationProgress: Math.round(
      ((Object.values(STAGE2_WORKFLOW_OPERATIONS).indexOf(store.currentOperation) + 1) /
        Object.values(STAGE2_WORKFLOW_OPERATIONS).length) *
        100
    ),

    // Навігація
    isFirstSubstep: store.currentSubstep === STAGE2_SUBSTEPS.SUBSTEP1,
    isLastSubstep: store.currentSubstep === STAGE2_SUBSTEPS.SUBSTEP5,
    hasNextSubstep:
      STAGE2_SUBSTEP_ORDER.indexOf(store.currentSubstep) < STAGE2_SUBSTEP_ORDER.length - 1,
    hasPreviousSubstep: STAGE2_SUBSTEP_ORDER.indexOf(store.currentSubstep) > 0,

    // Стан предметів
    hasItems: store.totalItemsCount > 0,
    hasMinimumItems: store.totalItemsCount >= STAGE2_WORKFLOW_LIMITS.MIN_ITEMS_COUNT,
    hasMaximumItems: store.totalItemsCount >= STAGE2_WORKFLOW_LIMITS.MAX_ITEMS_COUNT,
    canAddMoreItems: store.totalItemsCount < STAGE2_WORKFLOW_LIMITS.MAX_ITEMS_COUNT,

    // Workflow стан
    isWizardMode: store.isWizardActive,
    hasActiveItem: store.activeItemId !== null,
    needsConfirmation: store.hasUnsavedChanges,
  };
};

// =================== ТИПИ ===================
export type Stage2WorkflowStore = WorkflowStoreState & WorkflowStoreActions;
