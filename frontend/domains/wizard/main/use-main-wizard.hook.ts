import { useMemo } from 'react';

import {
  useOrderWizardStart,
  useOrderWizardGoBack,
  useOrderWizardCompleteStage1,
  useOrderWizardCompleteStage2,
  useOrderWizardCompleteStage3,
  useOrderWizardCompleteOrder,
  useOrderWizardCancelOrder,
  useOrderWizardGetCurrentState,
  useOrderWizardGetSessionInfo,
} from '@api/main';

import { useMainWizardStore } from './wizard.store';

/**
 * ТОНКА ОБГОРТКА для Main Wizard
 * Принцип: "бекенд робить все, фронт тільки відображає"
 */
export const useMainWizard = () => {
  // ========== ZUSTAND UI СТАН ==========
  const ui = useMainWizardStore();

  // ========== ORVAL МУТАЦІЇ ==========
  const startWizardMutation = useOrderWizardStart();
  const goBackMutation = useOrderWizardGoBack();
  const completeStage1Mutation = useOrderWizardCompleteStage1();
  const completeStage2Mutation = useOrderWizardCompleteStage2();
  const completeStage3Mutation = useOrderWizardCompleteStage3();
  const completeOrderMutation = useOrderWizardCompleteOrder();
  const cancelOrderMutation = useOrderWizardCancelOrder();

  // ========== ORVAL ЗАПИТИ ==========
  const currentStateQuery = useOrderWizardGetCurrentState(ui.sessionId || '', {
    query: {
      enabled: !!ui.sessionId,
      refetchInterval: 5000,
    },
  });

  const sessionInfoQuery = useOrderWizardGetSessionInfo(ui.sessionId || '', {
    query: {
      enabled: !!ui.sessionId,
      refetchInterval: 10000,
    },
  });

  // ========== ПРОСТИЙ СТАН ЗАВАНТАЖЕННЯ ==========
  const loading = useMemo(
    () => ({
      isStarting: startWizardMutation.isPending,
      isGoingBack: goBackMutation.isPending,
      isCompletingStage:
        completeStage1Mutation.isPending ||
        completeStage2Mutation.isPending ||
        completeStage3Mutation.isPending,
      isCanceling: cancelOrderMutation.isPending,
      isNavigating: ui.isNavigating,
      isSyncing: currentStateQuery.isFetching,
    }),
    [
      startWizardMutation.isPending,
      goBackMutation.isPending,
      completeStage1Mutation.isPending,
      completeStage2Mutation.isPending,
      completeStage3Mutation.isPending,
      cancelOrderMutation.isPending,
      ui.isNavigating,
      currentStateQuery.isFetching,
    ]
  );

  // ========== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ==========
  return {
    // UI стан з Zustand
    ui: {
      sessionId: ui.sessionId,
      currentState: ui.currentState,
      currentStage: ui.currentStage,
      canGoBack: ui.canGoBack,
      isNavigating: ui.isNavigating,
      completedStages: ui.completedStages,
      lastError: ui.lastError,
      showHints: ui.showHints,
      compactMode: ui.compactMode,
      setSessionId: ui.setSessionId,
      setCurrentState: ui.setCurrentState,
      setCurrentStage: ui.setCurrentStage,
      setIsNavigating: ui.setIsNavigating,
      addCompletedStage: ui.addCompletedStage,
      resetWizardState: ui.resetWizardState,
      setLastError: ui.setLastError,
      setShowHints: ui.setShowHints,
      setCompactMode: ui.setCompactMode,
      addActiveSession: ui.addActiveSession,
    },

    // API дані з Orval
    data: {
      backendState: currentStateQuery.data,
      sessionInfo: sessionInfoQuery.data,
    },

    // Стан завантаження
    loading,

    // Прямий доступ до Orval мутацій
    mutations: {
      startWizard: startWizardMutation,
      goBack: goBackMutation,
      completeStage1: completeStage1Mutation,
      completeStage2: completeStage2Mutation,
      completeStage3: completeStage3Mutation,
      completeOrder: completeOrderMutation,
      cancelOrder: cancelOrderMutation,
    },

    // Прямий доступ до Orval запитів
    queries: {
      currentState: currentStateQuery,
      sessionInfo: sessionInfoQuery,
    },
  };
};

export type UseMainWizardReturn = ReturnType<typeof useMainWizard>;
