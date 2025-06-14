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
  useStage1GetBranchesForSession,
  useStage1SelectBranch,
  useStage1GenerateReceiptNumber,
} from '../../../../shared/api/generated/stage1';

// Локальні імпорти
import { useStage1Workflow } from '../workflow';

import { useBasicOrderInfoStore } from './basic-order-info.store';

// Workflow для отримання sessionId

// =================== ТОНКА ОБГОРТКА ===================
export const useBasicOrderInfo = () => {
  // UI стан з Zustand
  const uiState = useBasicOrderInfoStore();

  // Workflow для sessionId
  const workflow = useStage1Workflow();
  const sessionId = workflow.ui.sessionId;

  // Orval API хуки (без додаткової логіки)
  const updateBasicOrderMutation = useStage1UpdateBasicOrder();
  const startWorkflowMutation = useStage1StartBasicOrderWorkflow();
  const validateBasicOrderMutation = useStage1ValidateBasicOrder();
  const initializeBasicOrderMutation = useStage1InitializeBasicOrder();
  const completeBasicOrderMutation = useStage1CompleteBasicOrder();
  const resetBasicOrderMutation = useStage1ResetBasicOrder();
  const cancelBasicOrderMutation = useStage1CancelBasicOrder();
  const clearErrorsMutation = useStage1ClearBasicOrderErrors();
  const selectBranchMutation = useStage1SelectBranch();
  const generateReceiptNumberMutation = useStage1GenerateReceiptNumber();

  // Запити даних
  const basicOrderDataQuery = useStage1GetBasicOrderData(sessionId || '', {
    query: { enabled: !!sessionId },
  });

  const basicOrderStateQuery = useStage1GetBasicOrderState(sessionId || '', {
    query: { enabled: !!sessionId },
  });

  const branchesQuery = useStage1GetBranchesForSession(sessionId || '', {
    query: { enabled: !!sessionId },
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
      isSelectingBranch: selectBranchMutation.isPending,
      isGeneratingReceiptNumber: generateReceiptNumberMutation.isPending,
      isLoadingData: basicOrderDataQuery.isLoading,
      isLoadingState: basicOrderStateQuery.isLoading,
      isLoadingBranches: branchesQuery.isLoading,
      isLoading:
        updateBasicOrderMutation.isPending ||
        startWorkflowMutation.isPending ||
        validateBasicOrderMutation.isPending ||
        initializeBasicOrderMutation.isPending ||
        completeBasicOrderMutation.isPending ||
        resetBasicOrderMutation.isPending ||
        cancelBasicOrderMutation.isPending ||
        clearErrorsMutation.isPending ||
        selectBranchMutation.isPending ||
        generateReceiptNumberMutation.isPending,
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
      selectBranchMutation.isPending,
      generateReceiptNumberMutation.isPending,
      basicOrderDataQuery.isLoading,
      basicOrderStateQuery.isLoading,
      branchesQuery.isLoading,
    ]
  );

  // Обчислені значення для правильної послідовності
  const computed = useMemo(
    () => ({
      // Крок 1: Вибір філії
      canSelectBranch: !!sessionId,
      isBranchSelected: !!uiState.selectedBranchId,

      // Крок 2: Генерація номера квитанції (після вибору філії)
      canGenerateReceiptNumber: !!uiState.selectedBranchId,
      isReceiptNumberGenerated: !!uiState.receiptNumber && uiState.isReceiptNumberGenerated,

      // Крок 3: Введення унікальної мітки (після генерації номера)
      canEnterUniqueTag: !!uiState.receiptNumber && uiState.isReceiptNumberGenerated,
      isUniqueTagEntered: !!uiState.uniqueTag && uiState.uniqueTag.length >= 3,

      // Загальна готовність
      canProceedToNextStage:
        !!uiState.selectedBranchId &&
        !!uiState.receiptNumber &&
        uiState.isReceiptNumberGenerated &&
        !!uiState.uniqueTag &&
        uiState.uniqueTag.length >= 3 &&
        !uiState.hasValidationErrors,

      hasSessionId: !!sessionId,
    }),
    [
      sessionId,
      uiState.selectedBranchId,
      uiState.receiptNumber,
      uiState.isReceiptNumberGenerated,
      uiState.uniqueTag,
      uiState.hasValidationErrors,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand + sessionId з workflow)
    ui: {
      ...uiState,
      sessionId,
    },

    // API дані (прямо з Orval)
    data: {
      basicOrderData: basicOrderDataQuery.data,
      basicOrderState: basicOrderStateQuery.data,
      branches: branchesQuery.data,
      workflowResult: startWorkflowMutation.data,
      validationResult: validateBasicOrderMutation.data,
      initializationResult: initializeBasicOrderMutation.data,
    },

    // Стан завантаження
    loading,

    // Обчислені значення
    computed,

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
      selectBranch: selectBranchMutation,
      generateReceiptNumber: generateReceiptNumberMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      basicOrderData: basicOrderDataQuery,
      basicOrderState: basicOrderStateQuery,
      branches: branchesQuery,
    },

    // Workflow
    workflow,
  };
};

// =================== ТИПИ ===================
export type UseBasicOrderInfoReturn = ReturnType<typeof useBasicOrderInfo>;
