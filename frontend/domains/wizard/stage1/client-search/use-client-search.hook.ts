// Тонка обгортка над Orval хуками для Stage1 Client Search - Пошук та вибір клієнтів
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';

// Orval хуки (готові з бекенду)
import {
  useStage1SearchClients,
  useStage1SearchClientsByPhone,
  useStage1SelectClient,
} from '../../../../shared/api/generated/stage1';

// Локальні імпорти
import { useClientSearchStore } from './client-search.store';

// =================== ТОНКА ОБГОРТКА ===================
export const useClientSearch = () => {
  // UI стан з Zustand
  const uiState = useClientSearchStore();

  // Orval API хуки (без додаткової логіки)
  const searchClientsMutation = useStage1SearchClients();
  const searchByPhoneMutation = useStage1SearchClientsByPhone();
  const selectClientMutation = useStage1SelectClient();

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isSearching: searchClientsMutation.isPending,
      isSearchingByPhone: searchByPhoneMutation.isPending,
      isSelecting: selectClientMutation.isPending,
      isLoading:
        searchClientsMutation.isPending ||
        searchByPhoneMutation.isPending ||
        selectClientMutation.isPending,
    }),
    [
      searchClientsMutation.isPending,
      searchByPhoneMutation.isPending,
      selectClientMutation.isPending,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand)
    ui: uiState,

    // API дані (прямо з Orval)
    data: {
      searchResults: searchClientsMutation.data,
      phoneSearchResults: searchByPhoneMutation.data,
      selectedClient: selectClientMutation.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      searchClients: searchClientsMutation,
      searchByPhone: searchByPhoneMutation,
      selectClient: selectClientMutation,
    },
  };
};

// =================== ТИПИ ===================
export type UseClientSearchReturn = ReturnType<typeof useClientSearch>;
