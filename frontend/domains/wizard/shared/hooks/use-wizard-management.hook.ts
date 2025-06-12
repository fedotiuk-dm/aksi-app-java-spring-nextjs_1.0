'use client';

import { useMemo, useEffect } from 'react';

// Orval API хуки та типи - виправлені імпорти
import {
  // Інформаційні хуки (MainController)
  useOrderWizardHealth,
  useOrderWizardGetCompleteApiMap,
  useOrderWizardGetWorkflow,
  useOrderWizardGetAdaptersInfo,
  useOrderWizardGetStagesStatus,
  useOrderWizardGetSystemStats,

  // Робочі хуки (OrderWizardAdapter в MainController)
  useOrderWizardStart,
  useOrderWizardCompleteStage1,
  useOrderWizardCompleteStage2,
  useOrderWizardCompleteStage3,
  useOrderWizardCompleteOrder,
  useOrderWizardCancelOrder,
} from '@/shared/api/generated/wizard';

// Типи з API - виправлені імпорти
import {
  useWizardManagementStore,
  selectSessionInfo,
  selectSystemState,
  selectLoadingState,
} from '../store/wizard-management.store';

// Типи автоматично виводяться з Orval API хуків через React Query
// Додаткові імпорти типів не потрібні

// Zustand store

// ========== КОНСТАНТИ КОНФІГУРАЦІЇ ==========
const QUERY_CONFIG = {
  HEALTH_CHECK_INTERVAL: 30000, // 30 секунд
  HEALTH_STALE_TIME: 15000, // 15 секунд
  ADAPTERS_INFO_INTERVAL: 60000, // 1 хвилина
  ADAPTERS_STALE_TIME: 30000, // 30 секунд
  STAGES_STATUS_INTERVAL: 30000, // 30 секунд
  STAGES_STATUS_STALE_TIME: 15000, // 15 секунд
  SYSTEM_STATS_INTERVAL: 30000, // 30 секунд
  SYSTEM_STATS_STALE_TIME: 15000, // 15 секунд
  STATIC_DATA_STALE_TIME: 5 * 60 * 1000, // 5 хвилин
  STATIC_DATA_GC_TIME: 10 * 60 * 1000, // 10 хвилин
} as const;

/**
 * Основний композиційний хук для управління візардом замовлень
 *
 * Об'єднує:
 * - UI стан з Zustand (сесія, система, завантаження)
 * - API виклики через Orval (інформаційні та робочі)
 * - React Query оптимізації
 *
 * @returns Об'єкт з групованими даними: ui, data, loading, errors, actions, system
 */
export const useWizardManagement = () => {
  // ========== 1. UI СТАН З ZUSTAND ==========
  // Отримуємо весь стан для уникнення проблем з селекторами
  const store = useWizardManagementStore();

  // Деструктуризація та обчислення селекторів
  const sessionInfo = useMemo(() => selectSessionInfo(store), [store]);
  const systemState = useMemo(() => selectSystemState(store), [store]);
  const loadingState = useMemo(() => selectLoadingState(store), [store]);

  // Actions напряму з стору
  const {
    setCurrentStage,
    setIsHealthy,
    setSystemReady,
    setLastHealthCheck,
    setIsLoading,
    setError,
    resetSession,
    updateSessionInfo,
    markActionCompleted,
  } = store;

  // ========== 2. ІНФОРМАЦІЙНІ API ХУКИ (MainController) ==========
  const healthQuery = useOrderWizardHealth({
    query: {
      refetchInterval: QUERY_CONFIG.HEALTH_CHECK_INTERVAL,
      staleTime: QUERY_CONFIG.HEALTH_STALE_TIME,
    },
  });

  // Обробка health check результатів
  useEffect(() => {
    if (healthQuery.data) {
      // Перевіряємо різні варіанти статусу готовності
      const status = healthQuery.data?.status || '';
      const isHealthy =
        status === 'ready' ||
        status === 'UP' ||
        status.includes('готовий') ||
        status.includes('ready') ||
        status.includes('повністю готовий');
      setIsHealthy(isHealthy);
      setLastHealthCheck(new Date());
    } else if (healthQuery.error) {
      setIsHealthy(false);
      setLastHealthCheck(new Date());
    }
  }, [healthQuery.data, healthQuery.error, setIsHealthy, setLastHealthCheck]);

  const apiMapQuery = useOrderWizardGetCompleteApiMap({
    query: {
      staleTime: QUERY_CONFIG.STATIC_DATA_STALE_TIME,
      gcTime: QUERY_CONFIG.STATIC_DATA_GC_TIME,
    },
  });

  const workflowQuery = useOrderWizardGetWorkflow({
    query: {
      staleTime: QUERY_CONFIG.STATIC_DATA_STALE_TIME,
      gcTime: QUERY_CONFIG.STATIC_DATA_GC_TIME,
    },
  });

  const adaptersInfoQuery = useOrderWizardGetAdaptersInfo({
    query: {
      refetchInterval: QUERY_CONFIG.ADAPTERS_INFO_INTERVAL,
      staleTime: QUERY_CONFIG.ADAPTERS_STALE_TIME,
    },
  });

  const stagesStatusQuery = useOrderWizardGetStagesStatus({
    query: {
      refetchInterval: QUERY_CONFIG.STAGES_STATUS_INTERVAL,
      staleTime: QUERY_CONFIG.STAGES_STATUS_STALE_TIME,
    },
  });

  // Обробка stages status результатів
  useEffect(() => {
    if (stagesStatusQuery.data) {
      // Перевіряємо чи всі стадії готові до роботи
      const isSystemReady = Array.isArray(stagesStatusQuery.data)
        ? stagesStatusQuery.data.every((stage) => stage.status === 'READY')
        : Boolean(stagesStatusQuery.data);
      setSystemReady(isSystemReady);
    }
  }, [stagesStatusQuery.data, setSystemReady]);

  const systemStatsQuery = useOrderWizardGetSystemStats({
    query: {
      refetchInterval: QUERY_CONFIG.SYSTEM_STATS_INTERVAL,
      staleTime: QUERY_CONFIG.SYSTEM_STATS_STALE_TIME,
    },
  });

  // ========== 3. РОБОЧІ API ВИКЛИКИ (OrderWizardAdapter через MainController) ==========
  const startWizardMutation = useOrderWizardStart({
    mutation: {
      onMutate: () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: (data) => {
        // Перевіряємо структуру відповіді API
        if (data && typeof data === 'object' && 'sessionId' in data) {
          updateSessionInfo(data.sessionId as string, 1);
        } else if (data && typeof data === 'string') {
          // Якщо sessionId повертається як рядок
          updateSessionInfo(data, 1);
        }
        setIsLoading(false);
        markActionCompleted();
      },
      onError: (error) => {
        setIsLoading(false);
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? (error.message as string)
            : 'Помилка створення сесії візарда';
        setError(errorMessage);
      },
    },
  });

  const completeStage1Mutation = useOrderWizardCompleteStage1({
    mutation: {
      onMutate: () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: () => {
        setCurrentStage(2);
        setIsLoading(false);
        markActionCompleted();
      },
      onError: (error) => {
        setIsLoading(false);
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? (error.message as string)
            : 'Помилка завершення етапу 1';
        setError(errorMessage);
      },
    },
  });

  const completeStage2Mutation = useOrderWizardCompleteStage2({
    mutation: {
      onMutate: () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: () => {
        setCurrentStage(3);
        setIsLoading(false);
        markActionCompleted();
      },
      onError: (error) => {
        setIsLoading(false);
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? (error.message as string)
            : 'Помилка завершення етапу 2';
        setError(errorMessage);
      },
    },
  });

  const completeStage3Mutation = useOrderWizardCompleteStage3({
    mutation: {
      onMutate: () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: () => {
        setCurrentStage(4);
        setIsLoading(false);
        markActionCompleted();
      },
      onError: (error) => {
        setIsLoading(false);
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? (error.message as string)
            : 'Помилка завершення етапу 3';
        setError(errorMessage);
      },
    },
  });

  const completeOrderMutation = useOrderWizardCompleteOrder({
    mutation: {
      onMutate: () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: () => {
        resetSession();
        setIsLoading(false);
        markActionCompleted();
      },
      onError: (error) => {
        setIsLoading(false);
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? (error.message as string)
            : 'Помилка завершення замовлення';
        setError(errorMessage);
      },
    },
  });

  const cancelOrderMutation = useOrderWizardCancelOrder({
    mutation: {
      onMutate: () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: () => {
        resetSession();
        setIsLoading(false);
        markActionCompleted();
      },
      onError: (error) => {
        setIsLoading(false);
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? (error.message as string)
            : 'Помилка скасування замовлення';
        setError(errorMessage);
      },
    },
  });

  // ========== 4. ОБЧИСЛЕНІ ЗНАЧЕННЯ TA ACTIONS ==========
  const computedValues = useMemo(
    () => ({
      isSystemReady: systemState.isHealthy && systemState.systemReady,
      hasActiveSession: !!sessionInfo.sessionId && sessionInfo.isActive,
      canStartNewSession: systemState.isHealthy && systemState.systemReady && !sessionInfo.isActive,
      canProceedToNextStage: sessionInfo.isActive && !loadingState.isLoading && !loadingState.error,
    }),
    [systemState, sessionInfo, loadingState]
  );

  const actions = useMemo(
    () => ({
      startWizard: () => startWizardMutation.mutate(),
      completeStage1: () => {
        if (sessionInfo.sessionId) {
          completeStage1Mutation.mutate({ sessionId: sessionInfo.sessionId });
        }
      },
      completeStage2: () => {
        if (sessionInfo.sessionId) {
          completeStage2Mutation.mutate({ sessionId: sessionInfo.sessionId });
        }
      },
      completeStage3: () => {
        if (sessionInfo.sessionId) {
          completeStage3Mutation.mutate({ sessionId: sessionInfo.sessionId });
        }
      },
      completeOrder: () => {
        if (sessionInfo.sessionId) {
          completeOrderMutation.mutate({ sessionId: sessionInfo.sessionId });
        }
      },
      cancelOrder: () => {
        if (sessionInfo.sessionId) {
          cancelOrderMutation.mutate({ sessionId: sessionInfo.sessionId });
        }
      },
      resetWizard: resetSession,
      clearError: () => setError(null),
    }),
    [
      startWizardMutation,
      completeStage1Mutation,
      completeStage2Mutation,
      completeStage3Mutation,
      completeOrderMutation,
      cancelOrderMutation,
      resetSession,
      sessionInfo.sessionId,
      setError,
    ]
  );

  // ========== 5. ГРУПУВАННЯ ПОВЕРНЕНИХ ЗНАЧЕНЬ ==========
  return {
    // UI стан
    ui: {
      ...sessionInfo,
      ...loadingState,
      ...computedValues,
    },

    // Дані з API
    data: {
      health: healthQuery.data,
      apiMap: apiMapQuery.data,
      workflow: workflowQuery.data,
      adaptersInfo: adaptersInfoQuery.data,
      stagesStatus: stagesStatusQuery.data,
      systemStats: systemStatsQuery.data,
    },

    // Стан завантаження
    loading: {
      healthCheck: healthQuery.isLoading,
      apiMap: apiMapQuery.isLoading,
      workflow: workflowQuery.isLoading,
      adaptersInfo: adaptersInfoQuery.isLoading,
      stagesStatus: stagesStatusQuery.isLoading,
      systemStats: systemStatsQuery.isLoading,
      wizardActions: loadingState.isLoading,
    },

    // Помилки
    errors: {
      health: healthQuery.error,
      apiMap: apiMapQuery.error,
      workflow: workflowQuery.error,
      adaptersInfo: adaptersInfoQuery.error,
      stagesStatus: stagesStatusQuery.error,
      systemStats: systemStatsQuery.error,
      wizard: loadingState.error,
    },

    // Дії
    actions,

    // Системна інформація
    system: {
      ...systemState,
      lastUpdate: Math.max(
        systemStatsQuery.dataUpdatedAt || 0,
        healthQuery.dataUpdatedAt || 0,
        stagesStatusQuery.dataUpdatedAt || 0
      ),
    },
  };
};

// ========== ТИПИ ДЛЯ ЕКСПОРТУ ==========
export type UseWizardManagementReturn = ReturnType<typeof useWizardManagement>;
