import { useCallback, useMemo } from 'react';

import { useStage2Store } from '../store/stage2.store';

import type { OrderItemDTO } from '../../../lib/api/generated/models/OrderItemDTO';
import type { UseStage2ManagerReturn } from '../types/stage2.types';

/**
 * Хук для управління Stage 2 - Item Manager
 *
 * Відповідальність:
 * - Надання інтерфейсу для роботи з менеджером предметів
 * - Обгортка над Zustand стором з мемоізацією
 * - Інкапсуляція логіки управління предметами
 */
export const useStage2Manager = (): UseStage2ManagerReturn => {
  // Витягуємо потрібні дані та методи зі стору
  const {
    manager,
    currentState,
    isLoading,
    error,
    totalAmount,
    itemCount,
    canProceedToNextStage,

    // Методи управління
    initializeManager,
    refreshManager,
    terminateSession,
    resetSession,

    // Методи для предметів
    addItem,
    updateItem,
    deleteItem,

    // Валідація
    validateCurrentState,
    checkReadiness,
    completeStage2,

    // Утиліти
    clearError,
  } = useStage2Store();

  // Логування для відстеження стану
  console.log('📊 useStage2Manager state:', {
    currentState,
    isLoading,
    error,
    hasManager: !!manager,
    sessionId: manager?.sessionId,
  });

  // Мемоізовані обчислювані значення
  const addedItems = useMemo((): OrderItemDTO[] => {
    return manager?.addedItems || [];
  }, [manager?.addedItems]);

  // Мемоізовані методи для уникнення перерендерів
  const memoizedInitializeManager = useCallback(
    async (orderId: string) => {
      await initializeManager(orderId);
    },
    [initializeManager]
  );

  const memoizedRefreshManager = useCallback(async () => {
    await refreshManager();
  }, [refreshManager]);

  const memoizedTerminateSession = useCallback(async () => {
    await terminateSession();
  }, [terminateSession]);

  const memoizedResetSession = useCallback(async () => {
    await resetSession();
  }, [resetSession]);

  const memoizedAddItem = useCallback(
    async (item: OrderItemDTO) => {
      await addItem(item);
    },
    [addItem]
  );

  const memoizedUpdateItem = useCallback(
    async (itemId: string, item: OrderItemDTO) => {
      await updateItem(itemId, item);
    },
    [updateItem]
  );

  const memoizedDeleteItem = useCallback(
    async (itemId: string) => {
      await deleteItem(itemId);
    },
    [deleteItem]
  );

  const memoizedValidateCurrentState = useCallback(async () => {
    return await validateCurrentState();
  }, [validateCurrentState]);

  const memoizedCheckReadiness = useCallback(async () => {
    return await checkReadiness();
  }, [checkReadiness]);

  const memoizedCompleteStage2 = useCallback(async () => {
    await completeStage2();
  }, [completeStage2]);

  const memoizedClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // Стан
    manager,
    currentState,
    isLoading,
    error,

    // Статистики
    totalAmount,
    itemCount,
    canProceedToNextStage,
    addedItems,

    // Методи управління
    initializeManager: memoizedInitializeManager,
    refreshManager: memoizedRefreshManager,
    terminateSession: memoizedTerminateSession,
    resetSession: memoizedResetSession,

    // Методи для предметів
    addItem: memoizedAddItem,
    updateItem: memoizedUpdateItem,
    deleteItem: memoizedDeleteItem,

    // Валідація
    validateCurrentState: memoizedValidateCurrentState,
    checkReadiness: memoizedCheckReadiness,
    completeStage2: memoizedCompleteStage2,

    // Утиліти
    clearError: memoizedClearError,
  };
};
