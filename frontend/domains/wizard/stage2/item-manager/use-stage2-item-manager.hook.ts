// Тонка обгортка над Orval хуками для Stage2 Item Manager - Головний екран менеджера предметів
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';

// Orval хуки (готові з бекенду)
import {
  useStage2InitializeItemManager,
  useStage2GetCurrentManager,
  useStage2StartNewItemWizard,
  useStage2StartEditItemWizard,
  useStage2CloseWizard,
  useStage2AddItemToOrder,
  useStage2UpdateItemInOrder,
  useStage2DeleteItemFromOrder,
  useStage2SynchronizeManager,
  useStage2CompleteStage,
  useStage2ResetSession,
  useStage2TerminateSession,
  useStage2ValidateCurrentState,
  useStage2GetCurrentState,
  useStage2CheckReadinessToProceed,
} from '@/shared/api/generated/stage2';

// Локальні імпорти
import { useItemManagerStore } from './store';

// =================== ТОНКА ОБГОРТКА ===================
export const useStage2ItemManager = () => {
  // UI стан з Zustand
  const uiState = useItemManagerStore();

  // Orval API хуки (без додаткової логіки)
  const initializeManagerMutation = useStage2InitializeItemManager();
  const startNewWizardMutation = useStage2StartNewItemWizard();
  const startEditWizardMutation = useStage2StartEditItemWizard();
  const closeWizardMutation = useStage2CloseWizard();
  const addItemMutation = useStage2AddItemToOrder();
  const updateItemMutation = useStage2UpdateItemInOrder();
  const deleteItemMutation = useStage2DeleteItemFromOrder();
  const synchronizeManagerMutation = useStage2SynchronizeManager();
  const completeStageMutation = useStage2CompleteStage();
  const resetSessionMutation = useStage2ResetSession();
  const terminateSessionMutation = useStage2TerminateSession();

  // Запити даних
  const currentManagerQuery = useStage2GetCurrentManager(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const validationQuery = useStage2ValidateCurrentState(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const currentStateQuery = useStage2GetCurrentState(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const readinessCheckQuery = useStage2CheckReadinessToProceed(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isInitializing: initializeManagerMutation.isPending,
      isStartingNewWizard: startNewWizardMutation.isPending,
      isStartingEditWizard: startEditWizardMutation.isPending,
      isClosingWizard: closeWizardMutation.isPending,
      isAddingItem: addItemMutation.isPending,
      isUpdatingItem: updateItemMutation.isPending,
      isDeletingItem: deleteItemMutation.isPending,
      isSynchronizing: synchronizeManagerMutation.isPending,
      isCompleting: completeStageMutation.isPending,
      isResetting: resetSessionMutation.isPending,
      isTerminating: terminateSessionMutation.isPending,
      isLoadingManager: currentManagerQuery.isLoading,
      isValidating: validationQuery.isLoading,
      isLoadingState: currentStateQuery.isLoading,
      isCheckingReadiness: readinessCheckQuery.isLoading,
    }),
    [
      initializeManagerMutation.isPending,
      startNewWizardMutation.isPending,
      startEditWizardMutation.isPending,
      closeWizardMutation.isPending,
      addItemMutation.isPending,
      updateItemMutation.isPending,
      deleteItemMutation.isPending,
      synchronizeManagerMutation.isPending,
      completeStageMutation.isPending,
      resetSessionMutation.isPending,
      terminateSessionMutation.isPending,
      currentManagerQuery.isLoading,
      validationQuery.isLoading,
      currentStateQuery.isLoading,
      readinessCheckQuery.isLoading,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand)
    ui: uiState,

    // API дані (прямо з Orval)
    data: {
      currentManager: currentManagerQuery.data,
      validation: validationQuery.data,
      currentState: currentStateQuery.data,
      readinessCheck: readinessCheckQuery.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      initializeManager: initializeManagerMutation,
      startNewWizard: startNewWizardMutation,
      startEditWizard: startEditWizardMutation,
      closeWizard: closeWizardMutation,
      addItem: addItemMutation,
      updateItem: updateItemMutation,
      deleteItem: deleteItemMutation,
      synchronizeManager: synchronizeManagerMutation,
      completeStage: completeStageMutation,
      resetSession: resetSessionMutation,
      terminateSession: terminateSessionMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      currentManager: currentManagerQuery,
      validation: validationQuery,
      currentState: currentStateQuery,
      readinessCheck: readinessCheckQuery,
    },
  };
};

// =================== ТИПИ ===================
export type UseStage2ItemManagerReturn = ReturnType<typeof useStage2ItemManager>;
