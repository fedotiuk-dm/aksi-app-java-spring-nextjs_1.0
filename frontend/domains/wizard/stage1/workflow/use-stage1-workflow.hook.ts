// Stage1 Workflow хук - координація підетапів з Orval інтеграцією
// Тонка обгортка над Orval хуками + Zustand workflow стор

import { useMemo } from 'react';

// Orval хуки для Stage1
import {
  useOrderWizardStart,
  useOrderWizardGetCurrentState,
  useOrderWizardCompleteStage1,
} from '@/shared/api/generated/main';

// Workflow стор
import { useStage1WorkflowStore } from './workflow.store';

/**
 * ТОНКА ОБГОРТКА для Stage1 Workflow
 * Принцип: "бекенд робить все, фронт тільки відображає"
 */
export const useStage1Workflow = () => {
  // ========== ZUSTAND UI СТАН ==========
  const ui = useStage1WorkflowStore();

  // ========== ORVAL МУТАЦІЇ ==========
  const startWizardMutation = useOrderWizardStart();
  const completeStage1Mutation = useOrderWizardCompleteStage1();

  // ========== ORVAL ЗАПИТИ ==========
  const currentStateQuery = useOrderWizardGetCurrentState(ui.sessionId || '', {
    query: {
      enabled: !!ui.sessionId,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 секунд
    },
  });

  // ========== ПРОСТИЙ СТАН ЗАВАНТАЖЕННЯ ==========
  const loading = useMemo(
    () => ({
      isInitializing: startWizardMutation.isPending,
      isCompletingStage: completeStage1Mutation.isPending,
      isNavigating: ui.hasUnsavedChanges,
      isSyncing: currentStateQuery.isFetching,
      isLoading: startWizardMutation.isPending || completeStage1Mutation.isPending,
    }),
    [
      startWizardMutation.isPending,
      completeStage1Mutation.isPending,
      ui.hasUnsavedChanges,
      currentStateQuery.isFetching,
    ]
  );

  // ========== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ==========
  return {
    // UI стан з Zustand
    ui: {
      sessionId: ui.sessionId,
      orderId: ui.orderId,
      selectedClientId: ui.selectedClientId,
      currentSubstep: ui.currentSubstep,
      isInitialized: ui.isInitialized,
      isCompleted: ui.isCompleted,
      completedSubsteps: ui.completedSubsteps,
      canProceedToNext: ui.canProceedToNext,
      hasValidationErrors: ui.hasValidationErrors,
      validationMessage: ui.validationMessage,
      hasUnsavedChanges: ui.hasUnsavedChanges,
      lastSavedAt: ui.lastSavedAt,

      // Дії
      initializeWorkflow: ui.initializeWorkflow,
      resetWorkflow: ui.resetWorkflow,
      setSelectedClientId: ui.setSelectedClientId,
      goToSubstep: ui.goToSubstep,
      goToNextSubstep: ui.goToNextSubstep,
      goToPreviousSubstep: ui.goToPreviousSubstep,
      markSubstepCompleted: ui.markSubstepCompleted,
      markSubstepIncomplete: ui.markSubstepIncomplete,
      setCanProceedToNext: ui.setCanProceedToNext,
      setValidationError: ui.setValidationError,
      clearValidationError: ui.clearValidationError,
      markHasUnsavedChanges: ui.markHasUnsavedChanges,
      markChangesSaved: ui.markChangesSaved,
      completeWorkflow: ui.completeWorkflow,
    },

    // API дані з Orval
    data: {
      currentState: currentStateQuery.data,
    },

    // Стан завантаження
    loading,

    // Прямий доступ до Orval мутацій
    mutations: {
      startWizard: startWizardMutation,
      completeStage1: completeStage1Mutation,
    },

    // Прямий доступ до Orval запитів
    queries: {
      currentState: currentStateQuery,
    },
  };
};

export type UseStage1WorkflowReturn = ReturnType<typeof useStage1Workflow>;
