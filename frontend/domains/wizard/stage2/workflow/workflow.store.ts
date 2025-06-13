// Zustand стор для Stage2 Workflow - ТОНКА ОБГОРТКА
// ТІЛЬКИ UI стан для workflow, НЕ API дані

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  Stage2WorkflowState,
  Stage2WorkflowEvent,
  STAGE2_WORKFLOW_STATES,
  STAGE2_WORKFLOW_EVENTS,
  STAGE2_WORKFLOW_TRANSITIONS,
} from './workflow.constants';

// =================== UI СТАН WORKFLOW ===================
interface Stage2WorkflowUIState {
  // Основний стан
  currentState: Stage2WorkflowState;
  sessionId: string | null;
  orderId: string | null;

  // Поточний предмет
  currentItemId: string | null;
  isEditMode: boolean;

  // Підетапи та навігація
  currentSubstep: 'substep1' | 'substep2' | 'substep3' | 'substep4' | 'substep5' | null;
  completedSubsteps: Set<string>;
  substepHistory: string[]; // Для навігації назад

  // Прогрес збереження
  hasUnsavedChanges: boolean;
  lastSavedSubstep: string | null;

  // Валідація переходів
  canProceedToNext: boolean;
  canGoBack: boolean;

  // UI прапорці
  showProgressBar: boolean;
  showSubstepNavigation: boolean;
  showBackButton: boolean;
  showSaveButton: boolean;
  isTransitioning: boolean;
}

// =================== ДІЇ WORKFLOW ===================
interface Stage2WorkflowUIActions {
  // Основні дії
  setState: (state: Stage2WorkflowState) => void;
  setSessionId: (sessionId: string | null) => void;
  setOrderId: (orderId: string | null) => void;
  reset: () => void;

  // Робота з предметами
  setCurrentItem: (itemId: string | null, isEdit?: boolean) => void;
  clearCurrentItem: () => void;

  // Навігація між підетапами
  goToSubstep: (substep: Stage2WorkflowUIState['currentSubstep']) => void;
  goToNextSubstep: () => void;
  goToPreviousSubstep: () => void;
  markSubstepCompleted: (substep: string) => void;
  markSubstepIncomplete: (substep: string) => void;
  resetSubsteps: () => void;

  // Збереження прогресу
  markHasUnsavedChanges: () => void;
  markChangesSaved: (substep: string) => void;

  // Валідація переходів
  setCanProceedToNext: (canProceed: boolean) => void;
  setCanGoBack: (canGoBack: boolean) => void;

  // UI контроль
  setShowProgressBar: (show: boolean) => void;
  setShowSubstepNavigation: (show: boolean) => void;
  setShowBackButton: (show: boolean) => void;
  setShowSaveButton: (show: boolean) => void;
  setIsTransitioning: (isTransitioning: boolean) => void;

  // Комплексні дії для workflow
  startItemWizard: (itemId?: string) => void;
  completeItemWizard: () => void;
  cancelItemWizard: () => void;

  // Workflow events
  triggerEvent: (event: Stage2WorkflowEvent) => void;
  canTriggerEvent: (event: Stage2WorkflowEvent) => boolean;

  // Методи для початку створення предметів
  startNewItem: () => void;
  startEditItem: (itemId: string) => void;
  proceedToCharacteristics: () => void;
  proceedToStainsDefects: () => void;
  proceedToPriceCalculation: () => void;
  proceedToPhotoDocumentation: () => void;
  confirmItem: () => void;
  cancelItem: () => void;
  returnToManager: () => void;
  completeStage: () => void;

  // Перевірки можливості виконання дій
  canStartNewItem: () => boolean;
  canStartEditItem: () => boolean;
  canConfirmItem: () => boolean;
  canCompleteStage: () => boolean;
}

// =================== ПОЧАТКОВИЙ СТАН ===================
const initialState: Stage2WorkflowUIState = {
  currentState: STAGE2_WORKFLOW_STATES.NOT_STARTED,
  sessionId: null,
  orderId: null,
  currentItemId: null,
  isEditMode: false,
  currentSubstep: null,
  completedSubsteps: new Set(),
  substepHistory: [],
  hasUnsavedChanges: false,
  lastSavedSubstep: null,
  canProceedToNext: false,
  canGoBack: false,
  showProgressBar: true,
  showSubstepNavigation: false,
  showBackButton: false,
  showSaveButton: false,
  isTransitioning: false,
};

// =================== ZUSTAND СТОР ===================
export const useStage2WorkflowStore = create<Stage2WorkflowUIState & Stage2WorkflowUIActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Основні дії
    setState: (currentState) => set({ currentState }),
    setSessionId: (sessionId) => set({ sessionId }),
    setOrderId: (orderId) => set({ orderId }),
    reset: () => set(initialState),

    // Робота з предметами
    setCurrentItem: (currentItemId, isEditMode = false) => set({ currentItemId, isEditMode }),
    clearCurrentItem: () =>
      set({
        currentItemId: null,
        isEditMode: false,
        currentSubstep: null,
        substepHistory: [],
        hasUnsavedChanges: false,
      }),

    // Навігація між підетапами
    goToSubstep: (substep) => {
      const state = get();
      const newHistory = state.currentSubstep
        ? [...state.substepHistory, state.currentSubstep]
        : state.substepHistory;

      set({
        currentSubstep: substep,
        substepHistory: newHistory,
        canGoBack: newHistory.length > 0,
        showBackButton: newHistory.length > 0,
      });
    },

    goToNextSubstep: () => {
      const state = get();
      const substeps = ['substep1', 'substep2', 'substep3', 'substep4', 'substep5'];
      const currentIndex = state.currentSubstep ? substeps.indexOf(state.currentSubstep) : -1;

      if (currentIndex !== -1 && currentIndex < substeps.length - 1) {
        const nextSubstep = substeps[currentIndex + 1] as Stage2WorkflowUIState['currentSubstep'];
        get().goToSubstep(nextSubstep);
      }
    },

    goToPreviousSubstep: () => {
      const state = get();
      if (state.substepHistory.length > 0) {
        const previousSubstep = state.substepHistory[
          state.substepHistory.length - 1
        ] as Stage2WorkflowUIState['currentSubstep'];
        const newHistory = state.substepHistory.slice(0, -1);

        set({
          currentSubstep: previousSubstep,
          substepHistory: newHistory,
          canGoBack: newHistory.length > 0,
          showBackButton: newHistory.length > 0,
        });
      }
    },

    markSubstepCompleted: (substep) =>
      set((state) => ({
        completedSubsteps: new Set([...state.completedSubsteps, substep]),
      })),

    markSubstepIncomplete: (substep) =>
      set((state) => {
        const newCompleted = new Set(state.completedSubsteps);
        newCompleted.delete(substep);
        return { completedSubsteps: newCompleted };
      }),

    resetSubsteps: () =>
      set({
        currentSubstep: null,
        completedSubsteps: new Set(),
        substepHistory: [],
        hasUnsavedChanges: false,
        lastSavedSubstep: null,
      }),

    // Збереження прогресу
    markHasUnsavedChanges: () =>
      set({
        hasUnsavedChanges: true,
        showSaveButton: true,
      }),

    markChangesSaved: (substep) =>
      set({
        hasUnsavedChanges: false,
        lastSavedSubstep: substep,
        showSaveButton: false,
      }),

    // Валідація переходів
    setCanProceedToNext: (canProceedToNext) => set({ canProceedToNext }),
    setCanGoBack: (canGoBack) => set({ canGoBack }),

    // UI контроль
    setShowProgressBar: (showProgressBar) => set({ showProgressBar }),
    setShowSubstepNavigation: (showSubstepNavigation) => set({ showSubstepNavigation }),
    setShowBackButton: (showBackButton) => set({ showBackButton }),
    setShowSaveButton: (showSaveButton) => set({ showSaveButton }),
    setIsTransitioning: (isTransitioning) => set({ isTransitioning }),

    // Комплексні дії для workflow
    startItemWizard: (itemId) =>
      set({
        currentItemId: itemId || null,
        isEditMode: !!itemId,
        currentSubstep: 'substep1',
        substepHistory: [],
        completedSubsteps: new Set(),
        hasUnsavedChanges: false,
        showSubstepNavigation: true,
        showProgressBar: true,
        canGoBack: false,
        showBackButton: false,
      }),

    completeItemWizard: () =>
      set({
        currentItemId: null,
        isEditMode: false,
        currentSubstep: null,
        substepHistory: [],
        hasUnsavedChanges: false,
        showSubstepNavigation: false,
        showBackButton: false,
        showSaveButton: false,
      }),

    cancelItemWizard: () => {
      set({
        currentItemId: null,
        isEditMode: false,
        currentSubstep: null,
        substepHistory: [],
        hasUnsavedChanges: false,
        showSubstepNavigation: false,
        showBackButton: false,
        showSaveButton: false,
      });
    },

    // Workflow events
    triggerEvent: (event) => {
      const state = get();
      const transitions = STAGE2_WORKFLOW_TRANSITIONS[state.currentState] as Record<
        string,
        Stage2WorkflowState
      >;
      if (transitions && transitions[event]) {
        set({ currentState: transitions[event] });
      }
    },

    canTriggerEvent: (event) => {
      const state = get();
      const transitions = STAGE2_WORKFLOW_TRANSITIONS[state.currentState] as Record<
        string,
        Stage2WorkflowState
      >;
      return !!(transitions && transitions[event]);
    },

    // Методи для початку створення предметів
    startNewItem: () => {
      const { triggerEvent } = get();
      triggerEvent(STAGE2_WORKFLOW_EVENTS.START_NEW_ITEM);
      set({
        currentSubstep: 'substep1',
        currentItemId: null,
        hasUnsavedChanges: false,
      });
    },

    startEditItem: (itemId: string) => {
      const { triggerEvent } = get();
      triggerEvent(STAGE2_WORKFLOW_EVENTS.START_EDIT_ITEM);
      set({
        currentSubstep: 'substep1',
        currentItemId: itemId,
        hasUnsavedChanges: false,
      });
    },

    proceedToCharacteristics: () => {
      const { triggerEvent } = get();
      triggerEvent(STAGE2_WORKFLOW_EVENTS.PROCEED_TO_CHARACTERISTICS);
      set({ currentSubstep: 'substep2' });
    },

    proceedToStainsDefects: () => {
      const { triggerEvent } = get();
      triggerEvent(STAGE2_WORKFLOW_EVENTS.PROCEED_TO_STAINS_DEFECTS);
      set({ currentSubstep: 'substep3' });
    },

    proceedToPriceCalculation: () => {
      const { triggerEvent } = get();
      triggerEvent(STAGE2_WORKFLOW_EVENTS.PROCEED_TO_PRICE_CALCULATION);
      set({ currentSubstep: 'substep4' });
    },

    proceedToPhotoDocumentation: () => {
      const { triggerEvent } = get();
      triggerEvent(STAGE2_WORKFLOW_EVENTS.PROCEED_TO_PHOTO_DOCUMENTATION);
      set({ currentSubstep: 'substep5' });
    },

    confirmItem: () => {
      const { triggerEvent } = get();
      triggerEvent(STAGE2_WORKFLOW_EVENTS.CONFIRM_ITEM);
      set({
        currentItemId: null,
        currentSubstep: 'substep1',
        hasUnsavedChanges: false,
      });
    },

    cancelItem: () => {
      const { triggerEvent } = get();
      triggerEvent(STAGE2_WORKFLOW_EVENTS.CANCEL_ITEM);
      set({
        currentItemId: null,
        currentSubstep: 'substep1',
        hasUnsavedChanges: false,
      });
    },

    returnToManager: () => {
      const { triggerEvent } = get();
      triggerEvent(STAGE2_WORKFLOW_EVENTS.RETURN_TO_MANAGER);
    },

    completeStage: () => {
      const { triggerEvent } = get();
      triggerEvent(STAGE2_WORKFLOW_EVENTS.COMPLETE_STAGE);
    },

    // Перевірки можливості виконання дій
    canStartNewItem: () => {
      const state = get();
      return state.currentState === STAGE2_WORKFLOW_STATES.NOT_STARTED;
    },

    canStartEditItem: () => {
      const state = get();
      return state.currentState === STAGE2_WORKFLOW_STATES.NOT_STARTED;
    },

    canConfirmItem: () => {
      const state = get();
      return state.currentState === STAGE2_WORKFLOW_STATES.ITEM_WIZARD_ACTIVE;
    },

    canCompleteStage: () => {
      const state = get();
      return (
        state.currentState === STAGE2_WORKFLOW_STATES.ITEMS_MANAGER_SCREEN &&
        state.completedSubsteps.size > 0
      );
    },
  }))
);

// =================== РОЗШИРЕНІ СЕЛЕКТОРИ ===================
export const useStage2WorkflowSelectors = () => {
  const store = useStage2WorkflowStore();

  return {
    // Стан
    isNotStarted: store.currentState === STAGE2_WORKFLOW_STATES.NOT_STARTED,
    isInitializing: store.currentState === STAGE2_WORKFLOW_STATES.INITIALIZING,
    isOnManagerScreen: store.currentState === STAGE2_WORKFLOW_STATES.ITEMS_MANAGER_SCREEN,
    isInItemWizard: store.currentState === STAGE2_WORKFLOW_STATES.ITEM_WIZARD_ACTIVE,
    isCompleted: store.currentState === STAGE2_WORKFLOW_STATES.COMPLETED,

    // Предмети
    hasCurrentItem: !!store.currentItemId,
    isEditingItem: store.isEditMode,
    isAddingNewItem: !store.isEditMode && !!store.currentItemId,

    // Підетапи та навігація
    isInSubsteps: !!store.currentSubstep,
    currentSubstepIndex: store.currentSubstep
      ? ['substep1', 'substep2', 'substep3', 'substep4', 'substep5'].indexOf(store.currentSubstep) +
        1
      : 0,
    totalSubsteps: 5,
    completedSubstepsCount: store.completedSubsteps.size,
    isFirstSubstep: store.currentSubstep === 'substep1',
    isLastSubstep: store.currentSubstep === 'substep5',

    // Прогрес
    progressPercentage: store.currentSubstep
      ? ((['substep1', 'substep2', 'substep3', 'substep4', 'substep5'].indexOf(
          store.currentSubstep
        ) +
          1) /
          5) *
        100
      : 0,

    // Збереження
    needsSaving: store.hasUnsavedChanges,
    lastSaved: store.lastSavedSubstep,

    // Навігація
    canNavigateNext: store.canProceedToNext && store.currentSubstep !== 'substep5',
    canNavigateBack: store.canGoBack && store.currentSubstep !== 'substep1',
    canCompleteWizard: store.canCompleteStage(),

    // UI
    shouldShowProgress: store.showProgressBar,
    shouldShowSubstepNav: store.showSubstepNavigation,
    shouldShowBackBtn: store.showBackButton,
    shouldShowSaveBtn: store.showSaveButton,
  };
};
