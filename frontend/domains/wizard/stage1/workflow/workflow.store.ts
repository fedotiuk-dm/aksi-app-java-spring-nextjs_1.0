// Stage1 Workflow Store - ТІЛЬКИ UI стан
// Координація між підетапами Stage1: client-search, client-creation, basic-order-info

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// =================== ТИПИ ===================

// Константи для підетапів
const SUBSTEPS = {
  CLIENT_SEARCH: 'client-search',
  CLIENT_CREATION: 'client-creation',
  BASIC_ORDER_INFO: 'basic-order-info',
} as const;

const SUBSTEP_ORDER = [
  SUBSTEPS.CLIENT_SEARCH,
  SUBSTEPS.CLIENT_CREATION,
  SUBSTEPS.BASIC_ORDER_INFO,
] as const;

interface Stage1WorkflowUIState {
  // Session та workflow
  sessionId: string | null;
  orderId: string | null;
  selectedClientId: string | null;

  // Поточний стан workflow
  currentSubstep: 'client-search' | 'client-creation' | 'basic-order-info';
  isInitialized: boolean;
  isCompleted: boolean;

  // Прогрес виконання
  completedSubsteps: Set<string>;
  canProceedToNext: boolean;

  // Валідація та помилки
  hasValidationErrors: boolean;
  validationMessage: string | null;

  // Збереження прогресу
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;
}

interface Stage1WorkflowUIActions {
  // Ініціалізація
  initializeWorkflow: (sessionId: string, orderId?: string) => void;
  resetWorkflow: () => void;

  // Клієнт
  setSelectedClientId: (clientId: string | null) => void;

  // Навігація між підетапами
  goToSubstep: (substep: Stage1WorkflowUIState['currentSubstep']) => void;
  goToNextSubstep: () => void;
  goToPreviousSubstep: () => void;

  // Прогрес
  markSubstepCompleted: (substep: string) => void;
  markSubstepIncomplete: (substep: string) => void;
  setCanProceedToNext: (canProceed: boolean) => void;

  // Валідація
  setValidationError: (message: string) => void;
  clearValidationError: () => void;

  // Збереження
  markHasUnsavedChanges: () => void;
  markChangesSaved: () => void;

  // Завершення
  completeWorkflow: () => void;
}

// =================== СТОР ===================

export const useStage1WorkflowStore = create<Stage1WorkflowUIState & Stage1WorkflowUIActions>()(
  subscribeWithSelector((set, get) => ({
    // ========== ПОЧАТКОВИЙ СТАН ==========
    sessionId: null,
    orderId: null,
    selectedClientId: null,
    currentSubstep: SUBSTEPS.CLIENT_SEARCH,
    isInitialized: false,
    isCompleted: false,
    completedSubsteps: new Set(),
    canProceedToNext: false,
    hasValidationErrors: false,
    validationMessage: null,
    hasUnsavedChanges: false,
    lastSavedAt: null,

    // ========== ІНІЦІАЛІЗАЦІЯ ==========
    initializeWorkflow: (sessionId: string, orderId?: string) => {
      set({
        sessionId,
        orderId: orderId || null,
        isInitialized: true,
        currentSubstep: SUBSTEPS.CLIENT_SEARCH,
        completedSubsteps: new Set(),
        canProceedToNext: false,
        hasValidationErrors: false,
        validationMessage: null,
        hasUnsavedChanges: false,
        lastSavedAt: new Date(),
      });
    },

    resetWorkflow: () => {
      set({
        sessionId: null,
        orderId: null,
        selectedClientId: null,
        currentSubstep: SUBSTEPS.CLIENT_SEARCH,
        isInitialized: false,
        isCompleted: false,
        completedSubsteps: new Set(),
        canProceedToNext: false,
        hasValidationErrors: false,
        validationMessage: null,
        hasUnsavedChanges: false,
        lastSavedAt: null,
      });
    },

    // ========== НАВІГАЦІЯ ==========
    goToSubstep: (substep) => {
      set({
        currentSubstep: substep,
        hasUnsavedChanges: true,
      });
    },

    goToNextSubstep: () => {
      const { currentSubstep, canProceedToNext } = get();
      if (!canProceedToNext) return;

      const currentIndex = SUBSTEP_ORDER.indexOf(currentSubstep);
      if (currentIndex < SUBSTEP_ORDER.length - 1) {
        set({
          currentSubstep: SUBSTEP_ORDER[currentIndex + 1],
          hasUnsavedChanges: true,
        });
      }
    },

    goToPreviousSubstep: () => {
      const { currentSubstep } = get();

      const currentIndex = SUBSTEP_ORDER.indexOf(currentSubstep);
      if (currentIndex > 0) {
        set({
          currentSubstep: SUBSTEP_ORDER[currentIndex - 1],
          hasUnsavedChanges: true,
        });
      }
    },

    // ========== ПРОГРЕС ==========
    markSubstepCompleted: (substep) => {
      const { completedSubsteps } = get();
      const newCompleted = new Set(completedSubsteps);
      newCompleted.add(substep);

      set({
        completedSubsteps: newCompleted,
        hasUnsavedChanges: true,
      });
    },

    markSubstepIncomplete: (substep) => {
      const { completedSubsteps } = get();
      const newCompleted = new Set(completedSubsteps);
      newCompleted.delete(substep);

      set({
        completedSubsteps: newCompleted,
        hasUnsavedChanges: true,
      });
    },

    setCanProceedToNext: (canProceed) => {
      set({ canProceedToNext: canProceed });
    },

    // ========== ВАЛІДАЦІЯ ==========
    setValidationError: (message) => {
      set({
        hasValidationErrors: true,
        validationMessage: message,
        canProceedToNext: false,
      });
    },

    clearValidationError: () => {
      set({
        hasValidationErrors: false,
        validationMessage: null,
      });
    },

    // ========== ЗБЕРЕЖЕННЯ ==========
    markHasUnsavedChanges: () => {
      set({ hasUnsavedChanges: true });
    },

    markChangesSaved: () => {
      set({
        hasUnsavedChanges: false,
        lastSavedAt: new Date(),
      });
    },

    // ========== ЗАВЕРШЕННЯ ==========
    completeWorkflow: () => {
      set({
        isCompleted: true,
        hasUnsavedChanges: false,
        lastSavedAt: new Date(),
      });
    },

    // ========== КЛІЄНТ ==========
    setSelectedClientId: (clientId: string | null) => {
      set({ selectedClientId: clientId });
    },
  }))
);
