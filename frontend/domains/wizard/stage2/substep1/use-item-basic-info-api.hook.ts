/**
 * @fileoverview API хук для домену "Основна інформація про предмет (Substep1)"
 *
 * Відповідальність: тільки API операції через Orval хуки
 * Принцип: Single Responsibility Principle
 */

import { useMemo } from 'react';

// Готові Orval хуки
import {
  useSubstep1GetCategories,
  useSubstep1SelectCategory,
  useSubstep1GetItemsByCategory,
  useSubstep1SelectItem,
  useSubstep1SetQuantity,
  useSubstep1GetCurrentStep,
  useSubstep1CompleteStep,
  useSubstep1ResetStep,
} from '@/shared/api/generated/wizard/aksiApi';

/**
 * Хук для API операцій основної інформації про предмет
 * Інкапсулює всі Orval хуки та мутації
 */
export const useItemBasicInfoAPI = (sessionId: string | null) => {
  // Мутації для дій
  const selectCategoryMutation = useSubstep1SelectCategory({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API Success - Category selected:', data);
      },
      onError: (error) => {
        console.error('💥 API Error - Select category failed:', error);
      },
    },
  });

  const selectItemMutation = useSubstep1SelectItem({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API Success - Item selected:', data);
      },
      onError: (error) => {
        console.error('💥 API Error - Select item failed:', error);
      },
    },
  });

  const setQuantityMutation = useSubstep1SetQuantity({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API Success - Quantity set:', data);
      },
      onError: (error) => {
        console.error('💥 API Error - Set quantity failed:', error);
      },
    },
  });

  const completeStepMutation = useSubstep1CompleteStep({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API Success - Step completed:', data);
      },
      onError: (error) => {
        console.error('💥 API Error - Complete step failed:', error);
      },
    },
  });

  const resetStepMutation = useSubstep1ResetStep({
    mutation: {
      onSuccess: () => {
        console.log('🎉 API Success - Step reset');
      },
      onError: (error) => {
        console.error('💥 API Error - Reset step failed:', error);
      },
    },
  });

  // Запити для отримання даних
  const categoriesQuery = useSubstep1GetCategories({
    query: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  });

  const itemsByCategoryQuery = useSubstep1GetItemsByCategory(sessionId || '', {
    query: {
      enabled: !!sessionId,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  });

  const currentStepQuery = useSubstep1GetCurrentStep(sessionId || '', {
    query: {
      enabled: !!sessionId,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  });

  // API операції з перевіркою sessionId
  const operations = useMemo(
    () => ({
      // Вибір категорії
      selectCategory: async (categoryId: string) => {
        if (!sessionId) throw new Error('No session ID for select category');

        return await selectCategoryMutation.mutateAsync({
          sessionId,
          categoryId,
        });
      },

      // Вибір предмета
      selectItem: async (itemId: string) => {
        if (!sessionId) throw new Error('No session ID for select item');

        return await selectItemMutation.mutateAsync({
          sessionId,
          itemId,
        });
      },

      // Встановлення кількості
      setQuantity: async (quantity: number, unit: string) => {
        if (!sessionId) throw new Error('No session ID for set quantity');

        return await setQuantityMutation.mutateAsync({
          sessionId,
          data: { quantity, unit },
        });
      },

      // Завершення кроку
      completeStep: async () => {
        if (!sessionId) throw new Error('No session ID for complete step');

        return await completeStepMutation.mutateAsync({
          sessionId,
        });
      },

      // Скидання кроку
      resetStep: async () => {
        if (!sessionId) throw new Error('No session ID for reset step');

        return await resetStepMutation.mutateAsync({
          sessionId,
        });
      },
    }),
    [
      sessionId,
      selectCategoryMutation,
      selectItemMutation,
      setQuantityMutation,
      completeStepMutation,
      resetStepMutation,
    ]
  );

  // Групування даних з API
  const data = useMemo(
    () => ({
      categories: categoriesQuery.data?.categories || [],
      itemsByCategory: itemsByCategoryQuery.data?.items || [],
      currentStep: currentStepQuery.data,
    }),
    [categoriesQuery.data, itemsByCategoryQuery.data, currentStepQuery.data]
  );

  // Стани завантаження
  const loading = useMemo(
    () => ({
      isSelectingCategory: selectCategoryMutation.isPending,
      isSelectingItem: selectItemMutation.isPending,
      isSettingQuantity: setQuantityMutation.isPending,
      isCompletingStep: completeStepMutation.isPending,
      isResettingStep: resetStepMutation.isPending,
      isLoadingCategories: categoriesQuery.isFetching,
      isLoadingItems: itemsByCategoryQuery.isFetching,
      isLoadingCurrentStep: currentStepQuery.isFetching,

      // Агреговані стани
      anyLoading:
        selectCategoryMutation.isPending ||
        selectItemMutation.isPending ||
        setQuantityMutation.isPending ||
        completeStepMutation.isPending ||
        resetStepMutation.isPending ||
        categoriesQuery.isFetching ||
        itemsByCategoryQuery.isFetching ||
        currentStepQuery.isFetching,
    }),
    [
      selectCategoryMutation.isPending,
      selectItemMutation.isPending,
      setQuantityMutation.isPending,
      completeStepMutation.isPending,
      resetStepMutation.isPending,
      categoriesQuery.isFetching,
      itemsByCategoryQuery.isFetching,
      currentStepQuery.isFetching,
    ]
  );

  return {
    operations,
    data,
    loading,
  };
};

export type UseItemBasicInfoAPIReturn = ReturnType<typeof useItemBasicInfoAPI>;
