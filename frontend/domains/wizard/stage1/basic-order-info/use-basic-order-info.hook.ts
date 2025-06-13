// Тонка обгортка над Orval хуками для Stage1 Basic Order Info - Базова інформація замовлення
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';

// Orval хуки (готові з бекенду)
import {
  useStage1GetBasicOrderData,
  useStage1UpdateBasicOrder,
  useStage1StartBasicOrderWorkflow,
  useStage1ValidateBasicOrder,
  useStage1GetBasicOrderState,
  useStage1InitializeBasicOrder,
  useStage1CompleteBasicOrder,
  useStage1ResetBasicOrder,
  useStage1CancelBasicOrder,
  useStage1ClearBasicOrderErrors,
} from '../../../../shared/api/generated/stage1';

// Локальні імпорти
import { useBasicOrderInfoStore } from './basic-order-info.store';

// =================== ТОНКА ОБГОРТКА ===================
export const useBasicOrderInfo = () => {
  // UI стан з Zustand
  const uiState = useBasicOrderInfoStore();

  // Orval API хуки (без додаткової логіки)
  const updateBasicOrderMutation = useStage1UpdateBasicOrder();
  const startWorkflowMutation = useStage1StartBasicOrderWorkflow();
  const validateBasicOrderMutation = useStage1ValidateBasicOrder();
  const initializeBasicOrderMutation = useStage1InitializeBasicOrder();
  const completeBasicOrderMutation = useStage1CompleteBasicOrder();
  const resetBasicOrderMutation = useStage1ResetBasicOrder();
  const cancelBasicOrderMutation = useStage1CancelBasicOrder();
  const clearErrorsMutation = useStage1ClearBasicOrderErrors();

  // Запити даних
  const basicOrderDataQuery = useStage1GetBasicOrderData(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const basicOrderStateQuery = useStage1GetBasicOrderState(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isUpdating: updateBasicOrderMutation.isPending,
      isStartingWorkflow: startWorkflowMutation.isPending,
      isValidating: validateBasicOrderMutation.isPending,
      isInitializing: initializeBasicOrderMutation.isPending,
      isCompleting: completeBasicOrderMutation.isPending,
      isResetting: resetBasicOrderMutation.isPending,
      isCancelling: cancelBasicOrderMutation.isPending,
      isClearingErrors: clearErrorsMutation.isPending,
      isLoadingData: basicOrderDataQuery.isLoading,
      isLoadingState: basicOrderStateQuery.isLoading,
      isLoading:
        updateBasicOrderMutation.isPending ||
        startWorkflowMutation.isPending ||
        validateBasicOrderMutation.isPending ||
        initializeBasicOrderMutation.isPending ||
        completeBasicOrderMutation.isPending ||
        resetBasicOrderMutation.isPending ||
        cancelBasicOrderMutation.isPending ||
        clearErrorsMutation.isPending,
    }),
    [
      updateBasicOrderMutation.isPending,
      startWorkflowMutation.isPending,
      validateBasicOrderMutation.isPending,
      initializeBasicOrderMutation.isPending,
      completeBasicOrderMutation.isPending,
      resetBasicOrderMutation.isPending,
      cancelBasicOrderMutation.isPending,
      clearErrorsMutation.isPending,
      basicOrderDataQuery.isLoading,
      basicOrderStateQuery.isLoading,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand)
    ui: uiState,

    // API дані (прямо з Orval)
    data: {
      basicOrderData: basicOrderDataQuery.data,
      basicOrderState: basicOrderStateQuery.data,
      workflowResult: startWorkflowMutation.data,
      validationResult: validateBasicOrderMutation.data,
      initializationResult: initializeBasicOrderMutation.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      updateBasicOrder: updateBasicOrderMutation,
      startWorkflow: startWorkflowMutation,
      validateBasicOrder: validateBasicOrderMutation,
      initializeBasicOrder: initializeBasicOrderMutation,
      completeBasicOrder: completeBasicOrderMutation,
      resetBasicOrder: resetBasicOrderMutation,
      cancelBasicOrder: cancelBasicOrderMutation,
      clearErrors: clearErrorsMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      basicOrderData: basicOrderDataQuery,
      basicOrderState: basicOrderStateQuery,
    },
  };
};

// =================== ТИПИ ===================
export type UseBasicOrderInfoReturn = ReturnType<typeof useBasicOrderInfo>;
