// 🔍 ПІДЕТАП 1.1: Пошук та вибір існуючого клієнта
// Композиційний хук для роботи з пошуком клієнтів

import { useCallback, useMemo, useEffect, useState } from 'react';

// Готові React Query хуки з Orval для пошуку клієнтів
import {
  useStage1GetClientSearchState,
  useStage1GetSelectedClient,
  useStage1SearchClients,
  useStage1SearchClientsByPhone,
  useStage1SelectClient,
  useStage1CompleteClientSearch,
} from '@/shared/api/generated/stage1';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';

import { useStage1Store } from '../store/stage1.store';
import { useMainStore } from '../../main/store/main.store';
import {
  CLIENT_SEARCH_CRITERIA,
  CLIENT_SEARCH_CRITERIA_NAMES,
  getSearchCriteriaName,
  isValidSearchTerm,
} from '../utils/stage1-mapping';

/**
 * 🔍 Хук для пошуку та вибору існуючого клієнта (підетап 1.1)
 *
 * Функціональність:
 * - Пошук клієнтів за різними критеріями (телефон, ім'я, email, адреса)
 * - Відображення результатів пошуку
 * - Вибір клієнта зі списку
 * - Можливість редагування вибраного клієнта
 */
export const useClientSearch = () => {
  // 1. UI стан з Zustand
  const sessionId = useMainStore((state) => state.sessionId);
  const {
    clientSearchTerm,
    selectedClientId,
    showClientSearchResults,
    isClientSearchMode,
    setClientSearchTerm,
    setSelectedClientId,
    setShowClientSearchResults,
    setClientSearchMode,
  } = useStage1Store();

  // 1.1. Debounced пошуковий термін (затримка 500мс)
  const debouncedSearchTerm = useDebounce(clientSearchTerm, 500);

  // 1.2. Фіктивний sessionId для пошуку клієнтів (коли немає активної сесії візарда)
  const searchSessionId = sessionId || 'search-only-session';

  // 1.3. Стан для відстеження останнього пошукового терміну
  const [lastSearchedTerm, setLastSearchedTerm] = useState<string>('');

  // 1.3. Автоматично активуємо режим пошуку при ініціалізації
  useEffect(() => {
    if (!isClientSearchMode) {
      console.log('🔍 Автоматична активація режиму пошуку клієнтів');
      setClientSearchMode(true);
    }
  }, [isClientSearchMode, setClientSearchMode]);

  // 2. API хуки з Orval - Query (працюють завжди)
  const clientSearchStateQuery = useStage1GetClientSearchState(searchSessionId, {
    query: {
      enabled: true, // Завжди активний
      staleTime: 30000,
    },
  });

  const selectedClientQuery = useStage1GetSelectedClient(searchSessionId, {
    query: {
      enabled: !!selectedClientId,
      staleTime: 60000,
    },
  });

  // 3. API хуки з Orval - Mutations
  const searchClientsMutation = useStage1SearchClients({
    mutation: {
      onSuccess: () => {
        console.log('✅ Пошук клієнтів успішний');
        setShowClientSearchResults(true);
      },
      onError: (error) => {
        console.error('❌ Помилка пошуку клієнтів:', error);
        setShowClientSearchResults(false);
      },
    },
  });

  const searchClientsByPhoneMutation = useStage1SearchClientsByPhone({
    mutation: {
      onSuccess: () => {
        console.log('✅ Пошук клієнтів за телефоном успішний');
        setShowClientSearchResults(true);
      },
      onError: (error) => {
        console.error('❌ Помилка пошуку клієнтів за телефоном:', error);
        setShowClientSearchResults(false);
      },
    },
  });

  const selectClientMutation = useStage1SelectClient({
    mutation: {
      onSuccess: () => {
        console.log('✅ Клієнт вибраний успішно');
        setShowClientSearchResults(false);
      },
      onError: (error) => {
        console.error('❌ Помилка вибору клієнта:', error);
      },
    },
  });

  const completeClientSearchMutation = useStage1CompleteClientSearch({
    mutation: {
      onSuccess: () => {
        console.log('✅ Пошук клієнта завершено');
        setClientSearchMode(false);
      },
      onError: (error) => {
        console.error('❌ Помилка завершення пошуку клієнта:', error);
      },
    },
  });

  // 4. Обробники подій
  const handleSearchClients = useCallback(
    (searchTerm: string, criteria?: string) => {
      if (!isValidSearchTerm(searchTerm)) {
        console.warn('⚠️ Некоректний термін для пошуку');
        return;
      }

      setClientSearchTerm(searchTerm);

      // Вибираємо тип пошуку залежно від критерію
      if (criteria === CLIENT_SEARCH_CRITERIA.PHONE) {
        searchClientsByPhoneMutation.mutate({
          sessionId: searchSessionId,
          params: { phone: searchTerm },
        });
      } else {
        searchClientsMutation.mutate({
          sessionId: searchSessionId,
          data: {
            generalSearchTerm: searchTerm,
          },
        });
      }
    },
    [searchSessionId, searchClientsMutation, searchClientsByPhoneMutation, setClientSearchTerm]
  );

  const handleSelectClient = useCallback(
    (clientId: string) => {
      if (!clientId) {
        console.warn('⚠️ Відсутній clientId для вибору');
        return;
      }

      // Тільки якщо є активна сесія візарда, викликаємо API
      if (sessionId) {
        selectClientMutation.mutate({
          sessionId,
          params: { clientId },
        });
      }

      setSelectedClientId(clientId);
    },
    [sessionId, selectClientMutation, setSelectedClientId]
  );

  const handleCompleteClientSearch = useCallback(() => {
    if (!sessionId) {
      console.warn('⚠️ Відсутній sessionId для завершення пошуку клієнта');
      return;
    }

    completeClientSearchMutation.mutate({
      sessionId,
    });
  }, [sessionId, completeClientSearchMutation]);

  const handleStartClientSearch = useCallback(() => {
    setClientSearchMode(true);
    setShowClientSearchResults(false);
  }, [setClientSearchMode, setShowClientSearchResults]);

  const handleClearSearch = useCallback(() => {
    setClientSearchTerm('');
    setShowClientSearchResults(false);
    setSelectedClientId(null);
    setLastSearchedTerm('');
  }, [setClientSearchTerm, setShowClientSearchResults, setSelectedClientId]);

  // 4.1. Автоматичний пошук при зміні debounced терміну
  useEffect(() => {
    if (
      debouncedSearchTerm &&
      isValidSearchTerm(debouncedSearchTerm) &&
      debouncedSearchTerm !== lastSearchedTerm // Уникаємо дублювання запитів
    ) {
      console.log('🔍 Автоматичний пошук:', debouncedSearchTerm);
      setLastSearchedTerm(debouncedSearchTerm);

      // Визначаємо тип пошуку за форматом
      const isPhoneSearch = /^\+?[0-9\s\-\(\)]{10,}$/.test(debouncedSearchTerm);

      if (isPhoneSearch) {
        searchClientsByPhoneMutation.mutate({
          sessionId: searchSessionId,
          params: { phone: debouncedSearchTerm.replace(/\s|\-|\(|\)/g, '') },
        });
      } else {
        searchClientsMutation.mutate({
          sessionId: searchSessionId,
          data: { generalSearchTerm: debouncedSearchTerm },
        });
      }
    } else if (!debouncedSearchTerm && lastSearchedTerm) {
      // Очищуємо результати пошуку, якщо термін порожній
      setLastSearchedTerm('');
    }
  }, [
    debouncedSearchTerm,
    lastSearchedTerm,
    searchSessionId,
    searchClientsByPhoneMutation,
    searchClientsMutation,
  ]);

  // 5. Computed значення з мемоізацією
  const computed = useMemo(
    () => ({
      // Стан пошуку
      hasSearchTerm: clientSearchTerm.length > 0,
      hasDebouncedSearchTerm: debouncedSearchTerm.length > 0,
      isSearchTermValid: isValidSearchTerm(clientSearchTerm),
      isDebouncedSearchTermValid: isValidSearchTerm(debouncedSearchTerm),
      canSearch: isValidSearchTerm(clientSearchTerm),
      isSearching: searchClientsMutation.isPending || searchClientsByPhoneMutation.isPending,

      // Автоматичний пошук
      isAutoSearchEnabled: true, // Завжди активний
      willAutoSearch: isValidSearchTerm(debouncedSearchTerm),

      // Стан пошуку з API
      searchState: clientSearchStateQuery.data,

      // Результати пошуку з мутацій
      searchResults:
        searchClientsMutation.data?.clients || searchClientsByPhoneMutation.data?.clients || [],
      searchResultsData: searchClientsMutation.data || searchClientsByPhoneMutation.data || null,
      hasSearchResults:
        (searchClientsMutation.data?.clients?.length || 0) > 0 ||
        (searchClientsByPhoneMutation.data?.clients?.length || 0) > 0,

      // Пагінація
      totalElements:
        searchClientsMutation.data?.totalElements ||
        searchClientsByPhoneMutation.data?.totalElements ||
        0,
      totalPages:
        searchClientsMutation.data?.totalPages ||
        searchClientsByPhoneMutation.data?.totalPages ||
        0,
      currentPage:
        searchClientsMutation.data?.pageNumber ||
        searchClientsByPhoneMutation.data?.pageNumber ||
        0,
      pageSize:
        searchClientsMutation.data?.pageSize || searchClientsByPhoneMutation.data?.pageSize || 10,
      hasPrevious:
        searchClientsMutation.data?.hasPrevious ||
        searchClientsByPhoneMutation.data?.hasPrevious ||
        false,
      hasNext:
        searchClientsMutation.data?.hasNext || searchClientsByPhoneMutation.data?.hasNext || false,

      // Вибраний клієнт
      selectedClient: selectedClientQuery.data,
      hasSelectedClient: !!selectedClientId && !!selectedClientQuery.data,

      // Можливість завершити вибір (тільки якщо є активна сесія візарда)
      canCompleteSearch: !!sessionId && !completeClientSearchMutation.isPending,

      // Debounce стан
      isTyping: clientSearchTerm !== debouncedSearchTerm,
    }),
    [
      clientSearchTerm,
      debouncedSearchTerm,
      sessionId,
      clientSearchStateQuery.data,
      searchClientsMutation.data,
      searchClientsByPhoneMutation.data,
      selectedClientQuery.data,
      selectedClientId,
      completeClientSearchMutation.isPending,
      searchClientsMutation.isPending,
      searchClientsByPhoneMutation.isPending,
    ]
  );

  // 6. Групування повернення
  return {
    // UI стан
    ui: {
      searchTerm: clientSearchTerm,
      debouncedSearchTerm,
      selectedClientId,
      showSearchResults: showClientSearchResults,
      isSearchMode: isClientSearchMode,
      isTyping: computed.isTyping,
    },

    // API дані
    data: {
      searchState: computed.searchState,
      selectedClient: computed.selectedClient,
      searchResults: computed.searchResults,
      searchResultsData: computed.searchResultsData,
    },

    // Стани завантаження
    loading: {
      isSearching: computed.isSearching,
      isSelecting: selectClientMutation.isPending,
      isCompleting: completeClientSearchMutation.isPending,
      isLoadingSearchState: clientSearchStateQuery.isLoading,
      isLoadingSelectedClient: selectedClientQuery.isLoading,
      isTyping: computed.isTyping,
    },

    // Дії
    actions: {
      searchClients: handleSearchClients,
      selectClient: handleSelectClient,
      completeSearch: handleCompleteClientSearch,
      clearSearch: handleClearSearch,
      startSearch: handleStartClientSearch,
      setSearchTerm: setClientSearchTerm,
    },

    // Computed значення
    computed,

    // Константи для UI
    constants: {
      searchCriteria: CLIENT_SEARCH_CRITERIA,
      searchCriteriaNames: CLIENT_SEARCH_CRITERIA_NAMES,
      getSearchCriteriaName,
    },
  };
};

export type UseClientSearchReturn = ReturnType<typeof useClientSearch>;
