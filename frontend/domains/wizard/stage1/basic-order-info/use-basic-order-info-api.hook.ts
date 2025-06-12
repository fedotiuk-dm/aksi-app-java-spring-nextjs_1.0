/**
 * @fileoverview API хук для домену "Основна інформація про замовлення"
 *
 * Відповідальність: тільки API операції з backend
 * Принцип: Single Responsibility Principle
 */

import { useCallback } from 'react';
import React from 'react';

// Orval API хуки та типи
import {
  useStage1InitializeBasicOrder,
  useStage1GetBasicOrderData,
  useStage1GetBasicOrderState,
  useStage1UpdateBasicOrder,
  useStage1ValidateBasicOrder,
  useStage1SelectBranch,
  useStage1CompleteBasicOrder,
  useStage1CancelBasicOrder,
  useStage1ResetBasicOrder,
  useStage1StartBasicOrderWorkflow,
  useStage1GetBranchesForSession,
  useStage1AreBranchesLoaded,
  useStage1GenerateReceiptNumber,
  useStage1SetUniqueTag,
  type Stage1UpdateBasicOrderMutationBody,
} from '@/shared/api/generated/wizard/aksiApi';

// Імпорт типу філії
import type { BasicOrderUIFormData } from './basic-order-info.schemas';
import type { BranchLocationDTO } from '@/shared/api/generated/wizard/aksiApi.schemas';

const SESSION_ID_REQUIRED_ERROR = 'Session ID is required';

/**
 * Хук для API операцій основної інформації замовлення
 * Інкапсулює всі серверні взаємодії
 */
export const useBasicOrderInfoAPI = (sessionId: string | null) => {
  // API мутації (викликаються на верхньому рівні)
  const initializeBasicOrderMutation = useStage1InitializeBasicOrder();
  const updateBasicOrderMutation = useStage1UpdateBasicOrder();
  const validateBasicOrderMutation = useStage1ValidateBasicOrder();
  const selectBranchMutation = useStage1SelectBranch();
  const completeBasicOrderMutation = useStage1CompleteBasicOrder();
  const cancelBasicOrderMutation = useStage1CancelBasicOrder();
  const resetBasicOrderMutation = useStage1ResetBasicOrder();
  const startWorkflowMutation = useStage1StartBasicOrderWorkflow();
  const generateReceiptNumberMutation = useStage1GenerateReceiptNumber();
  const setUniqueTagMutation = useStage1SetUniqueTag();

  // API запити для даних (викликаються на верхньому рівні з sessionId)
  const basicOrderDataQuery = useStage1GetBasicOrderData(sessionId || '', {
    query: {
      enabled: !!sessionId,
      refetchOnWindowFocus: false,
    },
  });

  const basicOrderStateQuery = useStage1GetBasicOrderState(sessionId || '', {
    query: {
      enabled: !!sessionId,
      refetchInterval: 2000, // Поллінг для відстеження стану workflow
      refetchOnWindowFocus: false,
    },
  });

  // API запити для філій
  const branchesQuery = useStage1GetBranchesForSession(sessionId || '', {
    query: {
      enabled: !!sessionId && sessionId.length > 10, // Перевіряємо що sessionId валідний
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // Філії кешуються на 5 хвилин
      retry: 1, // Зменшуємо кількість повторів
      retryDelay: 1000, // Затримка між повторами
    },
  });

  const branchesLoadedQuery = useStage1AreBranchesLoaded(sessionId || '', {
    query: {
      enabled: !!sessionId && sessionId.length > 10, // Перевіряємо що sessionId валідний
      refetchOnWindowFocus: false,
      retry: 1, // Зменшуємо кількість повторів
      retryDelay: 1000, // Затримка між повторами
    },
  });

  // Кастомна обробка даних філій (API повертає масив, але Orval генерує неправильний тип)
  const processedBranchesData = React.useMemo(() => {
    const rawData = branchesQuery.data;

    // API повертає масив філій напряму
    if (Array.isArray(rawData)) {
      return rawData as BranchLocationDTO[];
    }

    // Якщо дані приходять як об'єкт, шукаємо масив всередині
    if (rawData && typeof rawData === 'object') {
      const dataObject = rawData as Record<string, unknown>;
      const possibleArrays = [
        dataObject.branches,
        dataObject.data,
        dataObject.items,
        dataObject.content,
      ];

      for (const possibleArray of possibleArrays) {
        if (Array.isArray(possibleArray)) {
          return possibleArray as BranchLocationDTO[];
        }
      }
    }

    return [];
  }, [branchesQuery.data]);

  // Методи для оновлення даних
  const refreshBranches = useCallback(async () => {
    if (!sessionId) return;

    try {
      return await branchesQuery.refetch();
    } catch (error) {
      console.error('Failed to refresh branches:', error);
      throw error;
    }
  }, [sessionId, branchesQuery]);

  // Обгортки для мутацій з error handling
  const initializeBasicOrder = useCallback(async () => {
    try {
      return await initializeBasicOrderMutation.mutateAsync();
    } catch (error) {
      console.error('API Error - Failed to initialize basic order:', error);
      throw error;
    }
  }, [initializeBasicOrderMutation]);

  const updateBasicOrderData = useCallback(
    async (data: Partial<BasicOrderUIFormData>) => {
      if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

      try {
        return await updateBasicOrderMutation.mutateAsync({
          sessionId,
          data: data as Stage1UpdateBasicOrderMutationBody,
        });
      } catch (error) {
        console.error('API Error - Failed to update basic order data:', error);
        throw error;
      }
    },
    [sessionId, updateBasicOrderMutation]
  );

  const validateBasicOrder = useCallback(async () => {
    if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

    try {
      return await validateBasicOrderMutation.mutateAsync({ sessionId });
    } catch (error) {
      console.error('API Error - Failed to validate basic order:', error);
      throw error;
    }
  }, [sessionId, validateBasicOrderMutation]);

  const selectBranch = useCallback(
    async (branchId: string) => {
      if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

      try {
        return await selectBranchMutation.mutateAsync({
          sessionId,
          params: { branchId },
        });
      } catch (error) {
        console.error('API Error - Failed to select branch:', error);
        throw error;
      }
    },
    [sessionId, selectBranchMutation]
  );

  const completeBasicOrder = useCallback(async () => {
    if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

    try {
      return await completeBasicOrderMutation.mutateAsync({ sessionId });
    } catch (error) {
      console.error('API Error - Failed to complete basic order:', error);
      throw error;
    }
  }, [sessionId, completeBasicOrderMutation]);

  const cancelBasicOrder = useCallback(async () => {
    if (!sessionId) return;

    try {
      return await cancelBasicOrderMutation.mutateAsync({ sessionId });
    } catch (error) {
      console.error('API Error - Failed to cancel basic order:', error);
      throw error;
    }
  }, [sessionId, cancelBasicOrderMutation]);

  const resetBasicOrder = useCallback(async () => {
    if (!sessionId) return;

    try {
      return await resetBasicOrderMutation.mutateAsync({ sessionId });
    } catch (error) {
      console.error('API Error - Failed to reset basic order:', error);
      throw error;
    }
  }, [sessionId, resetBasicOrderMutation]);

  const startWorkflow = useCallback(async () => {
    if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

    try {
      return await startWorkflowMutation.mutateAsync();
    } catch (error) {
      console.error('API Error - Failed to start workflow:', error);
      throw error;
    }
  }, [sessionId, startWorkflowMutation]);

  const generateReceiptNumber = useCallback(
    async (branchCode: string) => {
      if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

      try {
        console.log('🌐 API виклик генерації номера квитанції:', { sessionId, branchCode });

        const result = await generateReceiptNumberMutation.mutateAsync({
          sessionId,
          params: { branchCode },
        });

        console.log('🌐 API відповідь генерації номера квитанції:', result);
        return result;
      } catch (error) {
        console.error('API Error - Failed to generate receipt number:', error);
        throw error;
      }
    },
    [sessionId, generateReceiptNumberMutation]
  );

  const setUniqueTag = useCallback(
    async (uniqueTag: string) => {
      if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

      try {
        return await setUniqueTagMutation.mutateAsync({
          sessionId,
          params: { uniqueTag },
        });
      } catch (error) {
        console.error('API Error - Failed to set unique tag:', error);
        throw error;
      }
    },
    [sessionId, setUniqueTagMutation]
  );

  const refreshBasicOrderData = useCallback(async () => {
    if (!sessionId) return;
    try {
      await basicOrderDataQuery.refetch();
    } catch (error) {
      console.error('API Error - Failed to refresh basic order data:', error);
    }
  }, [sessionId, basicOrderDataQuery]);

  return {
    // Операції
    operations: {
      initializeBasicOrder,
      updateBasicOrderData,
      validateBasicOrder,
      selectBranch,
      completeBasicOrder,
      cancelBasicOrder,
      resetBasicOrder,
      startWorkflow,
      generateReceiptNumber,
      setUniqueTag,
      refreshBranches,
      refreshBasicOrderData,
    },

    // Стани завантаження
    loading: {
      isInitializing: initializeBasicOrderMutation.isPending,
      isUpdating: updateBasicOrderMutation.isPending,
      isValidating: validateBasicOrderMutation.isPending,
      isSelectingBranch: selectBranchMutation.isPending,
      isCompleting: completeBasicOrderMutation.isPending,
      isCancelling: cancelBasicOrderMutation.isPending,
      isResetting: resetBasicOrderMutation.isPending,
      isStartingWorkflow: startWorkflowMutation.isPending,
      isGeneratingReceiptNumber: generateReceiptNumberMutation.isPending,
      isSettingUniqueTag: setUniqueTagMutation.isPending,
      isLoadingOrderData: basicOrderDataQuery.isFetching,
      isLoadingOrderState: basicOrderStateQuery.isFetching,
      isLoadingBranches: branchesQuery.isFetching,
      isLoadingBranchesStatus: branchesLoadedQuery.isFetching,
    },

    // API дані
    data: {
      basicOrderData: basicOrderDataQuery.data,
      orderState: basicOrderStateQuery.data,
      completedOrder: completeBasicOrderMutation.data,
      branches: processedBranchesData,
      areBranchesLoaded: branchesLoadedQuery.data,
    },
  };
};

export type UseBasicOrderInfoAPIReturn = ReturnType<typeof useBasicOrderInfoAPI>;
