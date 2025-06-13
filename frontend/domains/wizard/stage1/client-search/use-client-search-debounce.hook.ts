/**
 * Простий хук для пошуку клієнтів з debounce
 */
import { useEffect, useRef } from 'react';

// Простий debounce хук
import { useDebounceSearch } from '../../../../shared/lib/hooks/useDebounce';

// Базовий хук
import { useClientSearch } from './use-client-search.hook';

// Workflow
import { useStage1Workflow } from '../workflow';

export const useClientSearchDebounce = () => {
  const workflow = useStage1Workflow();
  const baseSearch = useClientSearch();
  const initRef = useRef(false);

  // Автоматична ініціалізація workflow ОДИН РАЗ
  useEffect(() => {
    if (!initRef.current && !workflow.ui.sessionId && !workflow.loading.isInitializing) {
      initRef.current = true;
      workflow.mutations.startWizard
        .mutateAsync()
        .then((response) => {
          // Оновлюємо стор після успішної ініціалізації
          if (response?.sessionId) {
            workflow.ui.initializeWorkflow(response.sessionId);
          }
        })
        .catch(console.error);
    }
  }, [workflow.ui.sessionId, workflow.loading.isInitializing]);

  // Простий пошук без складних залежностей
  const performSearch = async (searchTerm: string) => {
    if (!workflow.ui.sessionId) return;

    baseSearch.ui.setIsSearchActive(true);

    try {
      const isPhone = /^[\+]?[0-9\(\)\-\s]+$/.test(searchTerm);

      if (isPhone) {
        await baseSearch.mutations.searchByPhone.mutateAsync({
          sessionId: workflow.ui.sessionId,
          params: { phone: searchTerm.replace(/\D/g, '') },
        });
      } else {
        await baseSearch.mutations.searchClients.mutateAsync({
          sessionId: workflow.ui.sessionId,
          data: { generalSearchTerm: searchTerm },
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      baseSearch.ui.setIsSearchActive(false);
    }
  };

  // Debounce пошук
  const debounce = useDebounceSearch(baseSearch.ui.searchTerm, performSearch, 500, 2);

  return {
    // UI стан
    ui: {
      ...baseSearch.ui,
      sessionId: workflow.ui.sessionId,
      workflowInitialized: workflow.ui.isInitialized,
    },

    // Дані
    data: {
      ...baseSearch.data,
      workflowState: workflow.data.currentState,
    },

    // Завантаження
    loading: {
      ...baseSearch.loading,
      isInitializingWorkflow: workflow.loading.isInitializing,
    },

    // Обчислені значення
    computed: {
      hasResults: (baseSearch.data.searchResults?.clients?.length || 0) > 0,
      hasValidSearchTerm: baseSearch.ui.searchTerm.length >= 2,
      hasSessionId: !!workflow.ui.sessionId,
      canSearch: !!workflow.ui.sessionId && baseSearch.ui.searchTerm.length >= 2,
    },

    // Дії
    actions: {
      searchWithDebounce: (term: string) => baseSearch.ui.setSearchTerm(term),
      forceSearch: debounce.forceSearch,
      cancelSearch: debounce.cancelSearch,
      clearSearch: () => {
        baseSearch.ui.setSearchTerm('');
        debounce.cancelSearch();
      },
    },

    // Debounce стан
    debounce: {
      debouncedSearchTerm: debounce.debouncedSearchTerm,
      isSearching: debounce.isSearching,
      hasMinLength: debounce.hasMinLength,
    },

    // Мутації
    mutations: baseSearch.mutations,

    // Workflow
    workflow,
  };
};

export type UseClientSearchDebounceReturn = ReturnType<typeof useClientSearchDebounce>;
