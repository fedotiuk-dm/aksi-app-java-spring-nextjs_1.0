/**
 * @fileoverview API хук для домену "Пошук клієнтів"
 *
 * Відповідальність: тільки API операції через Orval хуки
 * Принцип: Single Responsibility Principle
 */

import { useMemo } from 'react';

// Готові Orval хуки
import {
  useStage1SearchClients,
  useStage1SearchClientsByPhone,
  useStage1SelectClient,
  useStage1InitializeClientSearch,
  useStage1GetClientSearchState,
  useStage1GetSelectedClient,
  useStage1ClearClientSearch,
} from '@/shared/api/generated/wizard/aksiApi';

/**
 * Хук для API операцій пошуку клієнтів
 * Інкапсулює всі Orval хуки та мутації
 */
export const useClientSearchAPI = (sessionId: string | null) => {
  // Мутації для дій
  const searchClientsMutation = useStage1SearchClients({
    mutation: {
      onSuccess: (data) => {
        console.log('🎉 API Success - Search completed:', data);
      },
      onError: (error) => {
        console.error('💥 API Error - Search failed:', error);
      },
      onMutate: (variables) => {
        console.log('🚀 API Mutation starting with variables:', variables);
      },
    },
  });

  const searchByPhoneMutation = useStage1SearchClientsByPhone({
    mutation: {
      onSuccess: (data) => {
        console.log('API Success - Phone search completed:', data);
      },
      onError: (error) => {
        console.error('API Error - Phone search failed:', error);
      },
    },
  });

  const selectClientMutation = useStage1SelectClient({
    mutation: {
      onSuccess: (data) => {
        console.log('API Success - Client selected:', data);
      },
      onError: (error) => {
        console.error('API Error - Client selection failed:', error);
      },
    },
  });

  const initializeMutation = useStage1InitializeClientSearch({
    mutation: {
      onSuccess: (data) => {
        console.log('API Success - Search initialized:', data);
      },
      onError: (error) => {
        console.error('API Error - Initialization failed:', error);
      },
    },
  });

  const clearSearchMutation = useStage1ClearClientSearch({
    mutation: {
      onSuccess: () => {
        console.log('API Success - Search cleared');
      },
      onError: (error) => {
        console.error('API Error - Clear failed:', error);
      },
    },
  });

  // Запити для отримання стану
  const searchStateQuery = useStage1GetClientSearchState(sessionId || '', {
    query: {
      enabled: !!sessionId,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        console.error(
          `❌ API Error: GET /v1/order-wizard/stage1/client-search/session/${sessionId}/state`,
          error
        );
        return failureCount < 2; // Retry максимум 2 рази
      },
    },
  });

  const selectedClientQuery = useStage1GetSelectedClient(sessionId || '', {
    query: {
      enabled: !!sessionId,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        // Перевіряємо різні можливі структури помилки
        const status =
          (error as any)?.status || (error as any)?.response?.status || (error as any)?.code;

        // 404 - це нормально, коли клієнт ще не обраний
        if (status === 404) {
          console.log('ℹ️ No client selected yet (404) - this is normal');
          return false; // Не повторювати запит для 404
        }

        console.error(
          `❌ API Error: GET /v1/order-wizard/stage1/client-search/session/${sessionId}/selected-client`,
          error
        );
        return failureCount < 2; // Повторювати для інших помилок
      },
    },
  });

  // API операції з перевіркою sessionId
  const operations = useMemo(
    () => ({
      // Ініціалізація пошуку
      initializeSearch: async () => {
        return await initializeMutation.mutateAsync();
      },

      // Пошук клієнтів за загальним терміном
      searchClients: async (searchTerm: string) => {
        if (!sessionId) throw new Error('No session ID for client search');

        console.log('🔍 API: Starting search for term:', searchTerm, 'sessionId:', sessionId);

        const result = await searchClientsMutation.mutateAsync({
          sessionId,
          data: {
            generalSearchTerm: searchTerm,
          },
        });

        console.log('✅ API: Search completed, results:', result);
        return result;
      },

      // Пошук за телефоном
      searchByPhone: async (phoneNumber: string) => {
        if (!sessionId) throw new Error('No session ID for phone search');

        return await searchByPhoneMutation.mutateAsync({
          sessionId,
          params: {
            phone: phoneNumber,
          },
        });
      },

      // Вибір клієнта
      selectClient: async (clientId: string) => {
        if (!sessionId) throw new Error('No session ID for client selection');

        return await selectClientMutation.mutateAsync({
          sessionId,
          params: {
            clientId,
          },
        });
      },

      // Очищення пошуку
      clearSearch: async () => {
        if (!sessionId) throw new Error('No session ID for clear search');

        return await clearSearchMutation.mutateAsync({
          sessionId,
        });
      },
    }),
    [
      sessionId,
      initializeMutation,
      searchClientsMutation,
      searchByPhoneMutation,
      selectClientMutation,
      clearSearchMutation,
    ]
  );

  // Групування даних з API
  const data = useMemo(() => {
    const searchResults = searchClientsMutation.data?.clients || [];
    const phoneSearchResults = searchByPhoneMutation.data?.clients || [];
    const allResults = [...searchResults, ...phoneSearchResults];

    console.log('📊 API Data update:', {
      searchResults: searchResults.length,
      phoneSearchResults: phoneSearchResults.length,
      allResults: allResults.length,
      searchState: searchStateQuery.data,
      selectedClient: selectedClientQuery.data,
    });

    return {
      // Результати пошуку з мутацій
      searchResults,
      phoneSearchResults,

      // Дані з запитів
      searchState: searchStateQuery.data,
      selectedClient: selectedClientQuery.data,

      // Комбіновані результати для зручності
      allResults,

      // Метадані
      totalResults: allResults.length,
    };
  }, [
    searchClientsMutation.data,
    searchByPhoneMutation.data,
    searchStateQuery.data,
    selectedClientQuery.data,
  ]);

  // Стани завантаження
  const loading = useMemo(
    () => ({
      isInitializing: initializeMutation.isPending,
      isSearching: searchClientsMutation.isPending,
      isPhoneSearching: searchByPhoneMutation.isPending,
      isSelecting: selectClientMutation.isPending,
      isClearing: clearSearchMutation.isPending,
      isLoadingState: searchStateQuery.isFetching,
      isLoadingSelectedClient: selectedClientQuery.isFetching,

      // Агреговані стани
      anyLoading:
        initializeMutation.isPending ||
        searchClientsMutation.isPending ||
        searchByPhoneMutation.isPending ||
        selectClientMutation.isPending ||
        clearSearchMutation.isPending ||
        searchStateQuery.isFetching ||
        selectedClientQuery.isFetching,
    }),
    [
      initializeMutation.isPending,
      searchClientsMutation.isPending,
      searchByPhoneMutation.isPending,
      selectClientMutation.isPending,
      clearSearchMutation.isPending,
      searchStateQuery.isFetching,
      selectedClientQuery.isFetching,
    ]
  );

  return {
    operations,
    data,
    loading,
  };
};

export type UseClientSearchAPIReturn = ReturnType<typeof useClientSearchAPI>;
