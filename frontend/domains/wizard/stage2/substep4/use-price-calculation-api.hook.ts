/**
 * @fileoverview API хук для роботи з Orval операціями Substep4 Price Calculation
 *
 * Відповідальність: тільки API операції через Orval хуки
 * Принцип: Single Responsibility Principle
 */

import { useCallback, useMemo } from 'react';

import {
  useSubstep4InitializeSubstep,
  useSubstep4CalculateBasePrice,
  useSubstep4CalculatePrice,
  useSubstep4CalculateFinalPrice,
  useSubstep4AddModifier,
  useSubstep4RemoveModifier,
  useSubstep4ConfirmCalculation,
  useSubstep4ResetCalculation,
  useSubstep4GetCurrentData,
  useSubstep4GetCurrentState,
  useSubstep4GetAvailableModifiers,
  useSubstep4GetRecommendedModifiers,
  useSubstep4GetAvailableEvents,
  useSubstep4ValidateCurrentState,
  useSubstep4ValidateDetailed,
  useSubstep4SessionExists,
  useSubstep4RemoveSession,
} from '@/shared/api/generated/wizard/aksiApi';

/**
 * Інтерфейс для API операцій Substep4
 */
export interface UsePriceCalculationApiReturn {
  // Мутації
  mutations: {
    initializeSubstep: ReturnType<typeof useSubstep4InitializeSubstep>;
    calculateBasePrice: ReturnType<typeof useSubstep4CalculateBasePrice>;
    calculatePrice: ReturnType<typeof useSubstep4CalculatePrice>;
    calculateFinalPrice: ReturnType<typeof useSubstep4CalculateFinalPrice>;
    addModifier: ReturnType<typeof useSubstep4AddModifier>;
    removeModifier: ReturnType<typeof useSubstep4RemoveModifier>;
    confirmCalculation: ReturnType<typeof useSubstep4ConfirmCalculation>;
    resetCalculation: ReturnType<typeof useSubstep4ResetCalculation>;
    removeSession: ReturnType<typeof useSubstep4RemoveSession>;
  };

  // Запити
  queries: {
    getCurrentData: ReturnType<typeof useSubstep4GetCurrentData>;
    getCurrentState: ReturnType<typeof useSubstep4GetCurrentState>;
    getAvailableModifiers: ReturnType<typeof useSubstep4GetAvailableModifiers>;
    getRecommendedModifiers: ReturnType<typeof useSubstep4GetRecommendedModifiers>;
    getAvailableEvents: ReturnType<typeof useSubstep4GetAvailableEvents>;
    validateCurrentState: ReturnType<typeof useSubstep4ValidateCurrentState>;
    validateDetailed: ReturnType<typeof useSubstep4ValidateDetailed>;
    sessionExists: ReturnType<typeof useSubstep4SessionExists>;
  };

  // Загальні стани
  isAnyLoading: boolean;
  hasAnyError: boolean;
  allErrors: any[];

  // Утиліти
  refetchAll: () => Promise<void>;
  refetchData: () => Promise<void>;
  refetchValidation: () => Promise<void>;
}

/**
 * Хук для роботи з API операціями Substep4 Price Calculation
 */
export const usePriceCalculationApi = (sessionId: string | null): UsePriceCalculationApiReturn => {
  // Мутації
  const initializeSubstepMutation = useSubstep4InitializeSubstep();
  const calculateBasePriceMutation = useSubstep4CalculateBasePrice();
  const calculatePriceMutation = useSubstep4CalculatePrice();
  const calculateFinalPriceMutation = useSubstep4CalculateFinalPrice();
  const addModifierMutation = useSubstep4AddModifier();
  const removeModifierMutation = useSubstep4RemoveModifier();
  const confirmCalculationMutation = useSubstep4ConfirmCalculation();
  const resetCalculationMutation = useSubstep4ResetCalculation();
  const removeSessionMutation = useSubstep4RemoveSession();

  // Запити для отримання даних
  const getCurrentDataQuery = useSubstep4GetCurrentData(sessionId || '', {
    query: {
      enabled: !!sessionId,
      staleTime: 30000, // 30 секунд
      refetchOnWindowFocus: false,
    },
  });

  const getCurrentStateQuery = useSubstep4GetCurrentState(sessionId || '', {
    query: {
      enabled: !!sessionId,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  });

  const getAvailableModifiersQuery = useSubstep4GetAvailableModifiers(
    { categoryCode: 'DEFAULT' }, // Потрібно передати categoryCode
    {
      query: {
        enabled: !!sessionId,
        staleTime: 300000, // 5 хвилин (модифікатори змінюються рідко)
        refetchOnWindowFocus: false,
      },
    }
  );

  const getRecommendedModifiersQuery = useSubstep4GetRecommendedModifiers(
    { categoryCode: 'DEFAULT', itemName: 'DEFAULT' }, // Потрібно передати categoryCode та itemName
    {
      query: {
        enabled: !!sessionId,
        staleTime: 60000, // 1 хвилина
        refetchOnWindowFocus: false,
      },
    }
  );

  const getAvailableEventsQuery = useSubstep4GetAvailableEvents(sessionId || '', {
    query: {
      enabled: !!sessionId,
      staleTime: 60000,
      refetchOnWindowFocus: false,
    },
  });

  // Запити для валідації
  const validateCurrentStateQuery = useSubstep4ValidateCurrentState(sessionId || '', {
    query: {
      enabled: !!sessionId,
      staleTime: 10000, // 10 секунд (валідація має бути свіжою)
      refetchOnWindowFocus: true,
    },
  });

  const validateDetailedQuery = useSubstep4ValidateDetailed(sessionId || '', {
    query: {
      enabled: !!sessionId,
      staleTime: 10000,
      refetchOnWindowFocus: true,
    },
  });

  // Запит для перевірки сесії
  const sessionExistsQuery = useSubstep4SessionExists(sessionId || '', {
    query: {
      enabled: !!sessionId,
      staleTime: 60000,
      refetchOnWindowFocus: false,
    },
  });

  // Обчислені значення для загальних станів
  const isAnyLoading = useMemo(
    () =>
      initializeSubstepMutation.isPending ||
      calculateBasePriceMutation.isPending ||
      calculatePriceMutation.isPending ||
      calculateFinalPriceMutation.isPending ||
      addModifierMutation.isPending ||
      removeModifierMutation.isPending ||
      confirmCalculationMutation.isPending ||
      resetCalculationMutation.isPending ||
      removeSessionMutation.isPending ||
      getCurrentDataQuery.isLoading ||
      getCurrentStateQuery.isLoading ||
      getAvailableModifiersQuery.isLoading ||
      getRecommendedModifiersQuery.isLoading ||
      getAvailableEventsQuery.isLoading ||
      validateCurrentStateQuery.isLoading ||
      validateDetailedQuery.isLoading ||
      sessionExistsQuery.isLoading,
    [
      initializeSubstepMutation.isPending,
      calculateBasePriceMutation.isPending,
      calculatePriceMutation.isPending,
      calculateFinalPriceMutation.isPending,
      addModifierMutation.isPending,
      removeModifierMutation.isPending,
      confirmCalculationMutation.isPending,
      resetCalculationMutation.isPending,
      removeSessionMutation.isPending,
      getCurrentDataQuery.isLoading,
      getCurrentStateQuery.isLoading,
      getAvailableModifiersQuery.isLoading,
      getRecommendedModifiersQuery.isLoading,
      getAvailableEventsQuery.isLoading,
      validateCurrentStateQuery.isLoading,
      validateDetailedQuery.isLoading,
      sessionExistsQuery.isLoading,
    ]
  );

  const allErrors = useMemo(
    () =>
      [
        initializeSubstepMutation.error,
        calculateBasePriceMutation.error,
        calculatePriceMutation.error,
        calculateFinalPriceMutation.error,
        addModifierMutation.error,
        removeModifierMutation.error,
        confirmCalculationMutation.error,
        resetCalculationMutation.error,
        removeSessionMutation.error,
        getCurrentDataQuery.error,
        getCurrentStateQuery.error,
        getAvailableModifiersQuery.error,
        getRecommendedModifiersQuery.error,
        getAvailableEventsQuery.error,
        validateCurrentStateQuery.error,
        validateDetailedQuery.error,
        sessionExistsQuery.error,
      ].filter(Boolean),
    [
      initializeSubstepMutation.error,
      calculateBasePriceMutation.error,
      calculatePriceMutation.error,
      calculateFinalPriceMutation.error,
      addModifierMutation.error,
      removeModifierMutation.error,
      confirmCalculationMutation.error,
      resetCalculationMutation.error,
      removeSessionMutation.error,
      getCurrentDataQuery.error,
      getCurrentStateQuery.error,
      getAvailableModifiersQuery.error,
      getRecommendedModifiersQuery.error,
      getAvailableEventsQuery.error,
      validateCurrentStateQuery.error,
      validateDetailedQuery.error,
      sessionExistsQuery.error,
    ]
  );

  const hasAnyError = useMemo(() => allErrors.length > 0, [allErrors]);

  // Утиліти для refetch
  const refetchAll = useCallback(async () => {
    await Promise.all([
      getCurrentDataQuery.refetch(),
      getCurrentStateQuery.refetch(),
      getAvailableModifiersQuery.refetch(),
      getRecommendedModifiersQuery.refetch(),
      getAvailableEventsQuery.refetch(),
      validateCurrentStateQuery.refetch(),
      validateDetailedQuery.refetch(),
      sessionExistsQuery.refetch(),
    ]);
  }, [
    getCurrentDataQuery,
    getCurrentStateQuery,
    getAvailableModifiersQuery,
    getRecommendedModifiersQuery,
    getAvailableEventsQuery,
    validateCurrentStateQuery,
    validateDetailedQuery,
    sessionExistsQuery,
  ]);

  const refetchData = useCallback(async () => {
    await Promise.all([
      getCurrentDataQuery.refetch(),
      getCurrentStateQuery.refetch(),
      getAvailableModifiersQuery.refetch(),
      getRecommendedModifiersQuery.refetch(),
    ]);
  }, [
    getCurrentDataQuery,
    getCurrentStateQuery,
    getAvailableModifiersQuery,
    getRecommendedModifiersQuery,
  ]);

  const refetchValidation = useCallback(async () => {
    await Promise.all([validateCurrentStateQuery.refetch(), validateDetailedQuery.refetch()]);
  }, [validateCurrentStateQuery, validateDetailedQuery]);

  return {
    // Мутації
    mutations: {
      initializeSubstep: initializeSubstepMutation,
      calculateBasePrice: calculateBasePriceMutation,
      calculatePrice: calculatePriceMutation,
      calculateFinalPrice: calculateFinalPriceMutation,
      addModifier: addModifierMutation,
      removeModifier: removeModifierMutation,
      confirmCalculation: confirmCalculationMutation,
      resetCalculation: resetCalculationMutation,
      removeSession: removeSessionMutation,
    },

    // Запити
    queries: {
      getCurrentData: getCurrentDataQuery,
      getCurrentState: getCurrentStateQuery,
      getAvailableModifiers: getAvailableModifiersQuery,
      getRecommendedModifiers: getRecommendedModifiersQuery,
      getAvailableEvents: getAvailableEventsQuery,
      validateCurrentState: validateCurrentStateQuery,
      validateDetailed: validateDetailedQuery,
      sessionExists: sessionExistsQuery,
    },

    // Загальні стани
    isAnyLoading,
    hasAnyError,
    allErrors,

    // Утиліти
    refetchAll,
    refetchData,
    refetchValidation,
  };
};
