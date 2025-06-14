// Stage1 Workflow хук - координація підетапів з Orval інтеграцією
// Тонка обгортка над Orval хуками + Zustand workflow стор

import { useMemo } from 'react';

// Orval хуки для Stage1
import {
  useOrderWizardStart,
  useOrderWizardGetCurrentState,
  useOrderWizardCompleteStage1,
  useOrderWizardClientSelected,
} from '@api/main';

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
  const clientSelectedMutation = useOrderWizardClientSelected();

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
      isSelectingClient: clientSelectedMutation.isPending,
      isNavigating: ui.hasUnsavedChanges,
      isSyncing: currentStateQuery.isFetching,
      isLoading:
        startWizardMutation.isPending ||
        completeStage1Mutation.isPending ||
        clientSelectedMutation.isPending,
    }),
    [
      startWizardMutation.isPending,
      completeStage1Mutation.isPending,
      clientSelectedMutation.isPending,
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

      // Композиційні дії (комбінують UI + API)
      selectClient: async (clientId: string, substep: 'client-search' | 'client-creation') => {
        try {
          console.log('🔄 selectClient викликано:', { clientId, substep, sessionId: ui.sessionId });

          // 1. Зберігаємо selectedClientId в UI стані
          ui.setSelectedClientId(clientId);
          console.log('✅ selectedClientId збережено в UI стані');

          // 2. Викликаємо API для переходу з CLIENT_SELECTION до ORDER_INITIALIZATION
          if (ui.sessionId) {
            console.log('🔄 Викликаємо clientSelected API...');
            console.log('🔄 sessionId для API виклику:', ui.sessionId);
            const result = await clientSelectedMutation.mutateAsync({ sessionId: ui.sessionId });
            console.log('🔄 Результат clientSelected API:', result);
            console.log(
              '✅ Client selected API успішно викликано, state machine має перейти до ORDER_INITIALIZATION'
            );
          } else {
            console.error('❌ Немає sessionId для виклику clientSelected API');
            ui.setValidationError('Немає активної сесії для вибору клієнта');
            return false;
          }

          // 3. Оновлюємо UI стан
          console.log('🔄 Оновлюємо UI стан...');
          ui.goToSubstep('basic-order-info');
          ui.markSubstepCompleted(substep);
          ui.setCanProceedToNext(true);
          console.log('✅ UI стан оновлено, перехід до basic-order-info');

          return true;
        } catch (error) {
          console.error('❌ Помилка при виборі клієнта:', error);
          ui.setValidationError('Помилка при виборі клієнта. Спробуйте ще раз.');
          return false;
        }
      },
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
      clientSelected: clientSelectedMutation,
    },

    // Прямий доступ до Orval запитів
    queries: {
      currentState: currentStateQuery,
    },
  };
};

export type UseStage1WorkflowReturn = ReturnType<typeof useStage1Workflow>;
