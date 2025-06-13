// Тонка обгортка над Orval хуками для substep1 - Основна інформація про предмет
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';

// Orval хуки (готові з бекенду)
import {
  useSubstep1StartSubstep,
  useSubstep1SelectServiceCategory,
  useSubstep1SelectPriceListItem,
  useSubstep1EnterQuantity,
  useSubstep1ValidateAndComplete,
  useSubstep1Reset,
  useSubstep1FinalizeSession,
  useSubstep1GetStatus,
  useSubstep1GetServiceCategories,
  useSubstep1GetItemsForCategory,
} from '@/shared/api/generated/substep1';

// Локальні імпорти
import { useItemBasicInfoStore } from './store';

// =================== ТОНКА ОБГОРТКА ===================
export const useSubstep1ItemBasicInfo = () => {
  // UI стан з Zustand
  const uiState = useItemBasicInfoStore();

  // Orval API хуки (без додаткової логіки)
  const startSubstepMutation = useSubstep1StartSubstep();
  const selectServiceCategoryMutation = useSubstep1SelectServiceCategory();
  const selectPriceListItemMutation = useSubstep1SelectPriceListItem();
  const enterQuantityMutation = useSubstep1EnterQuantity();
  const validateAndCompleteMutation = useSubstep1ValidateAndComplete();
  const resetMutation = useSubstep1Reset();
  const finalizeSessionMutation = useSubstep1FinalizeSession();

  // Запити даних
  const statusQuery = useSubstep1GetStatus(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  const serviceCategoriesQuery = useSubstep1GetServiceCategories({
    query: { enabled: !!uiState.sessionId },
  });

  const itemsForCategoryQuery = useSubstep1GetItemsForCategory(uiState.selectedCategoryId || '', {
    query: { enabled: !!uiState.sessionId && !!uiState.selectedCategoryId },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isStarting: startSubstepMutation.isPending,
      isSelectingCategory: selectServiceCategoryMutation.isPending,
      isSelectingItem: selectPriceListItemMutation.isPending,
      isEnteringQuantity: enterQuantityMutation.isPending,
      isValidating: validateAndCompleteMutation.isPending,
      isResetting: resetMutation.isPending,
      isFinalizing: finalizeSessionMutation.isPending,
      isLoadingStatus: statusQuery.isLoading,
      isLoadingCategories: serviceCategoriesQuery.isLoading,
      isLoadingItems: itemsForCategoryQuery.isLoading,
    }),
    [
      startSubstepMutation.isPending,
      selectServiceCategoryMutation.isPending,
      selectPriceListItemMutation.isPending,
      enterQuantityMutation.isPending,
      validateAndCompleteMutation.isPending,
      resetMutation.isPending,
      finalizeSessionMutation.isPending,
      statusQuery.isLoading,
      serviceCategoriesQuery.isLoading,
      itemsForCategoryQuery.isLoading,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand)
    ui: uiState,

    // API дані (прямо з Orval)
    data: {
      status: statusQuery.data,
      serviceCategories: serviceCategoriesQuery.data,
      itemsForCategory: itemsForCategoryQuery.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      startSubstep: startSubstepMutation,
      selectServiceCategory: selectServiceCategoryMutation,
      selectPriceListItem: selectPriceListItemMutation,
      enterQuantity: enterQuantityMutation,
      validateAndComplete: validateAndCompleteMutation,
      reset: resetMutation,
      finalizeSession: finalizeSessionMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      status: statusQuery,
      serviceCategories: serviceCategoriesQuery,
      itemsForCategory: itemsForCategoryQuery,
    },
  };
};

// =================== ТИПИ ===================
export type UseSubstep1ItemBasicInfoReturn = ReturnType<typeof useSubstep1ItemBasicInfo>;
