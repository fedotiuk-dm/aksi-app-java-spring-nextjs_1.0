/**
 * @fileoverview Хук для пошуку клієнтів (DDD архітектура)
 * @module domain/wizard/hooks/steps/client-selection
 */

import { useState, useCallback, useEffect, useMemo } from 'react';

import { clientSearchCoreService } from '../../../services';
import { useWizardState } from '../../shared';

import type { ClientSearchPageResult } from '../../../services';
import type { ClientSearchResult } from '../../../types';

/**
 * Простий дебаунс хук (замість use-debounce)
 */
const useDebounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: T) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        callback(...args);
      }, delay);

      setDebounceTimer(timer);
    },
    [callback, delay, debounceTimer]
  );

  const cancel = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }
  }, [debounceTimer]);

  return { debouncedCallback, cancel };
};

/**
 * Хук пошуку клієнтів з пагінацією та дебаунсом
 *
 * Відповідальність:
 * - React стан пошуку та результатів
 * - Дебаунс пошукових запитів
 * - Пагінація результатів
 * - Інтеграція з wizard станом
 *
 * Делегує бізнес-логіку:
 * - ClientSearchService для пошуку
 * - useWizardState для помилок
 */
export const useClientSearch = () => {
  // === REACT СТАН ===
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<ClientSearchPageResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCache, setSearchCache] = useState<Map<string, ClientSearchPageResult>>(new Map());

  // === WIZARD ІНТЕГРАЦІЯ ===
  const { addError, clearErrors } = useWizardState();

  // === ФУНКЦІЯ ПОШУКУ ===
  const performSearch = useCallback(
    async (query: string, page: number = 0) => {
      if (!ClientSearchService.shouldDebounceSearch(query)) {
        setSearchResult(null);
        return;
      }

      // Перевірка кешу
      const cacheKey = `${query}-${page}`;
      const cached = searchCache.get(cacheKey);
      if (cached) {
        setSearchResult(cached);
        return;
      }

      setIsSearching(true);
      clearErrors();

      try {
        const result = await ClientSearchService.searchWithPagination({
          query,
          page,
        });

        setSearchResult(result);

        // Кешування результату
        setSearchCache((prev) => new Map(prev).set(cacheKey, result));
      } catch (error) {
        addError(error instanceof Error ? error.message : 'Помилка пошуку клієнтів');
        setSearchResult(null);
      } finally {
        setIsSearching(false);
      }
    },
    [searchCache, clearErrors, addError]
  );

  // === ДЕБАУНС ПОШУКУ ===
  const { debouncedCallback: debouncedSearch, cancel: cancelDebounce } = useDebounce(
    performSearch,
    ClientSearchService.getSearchDebounceMs()
  );

  // === МЕТОДИ ПОШУКУ ===
  const search = useCallback(
    (query: string, page: number = 0) => {
      setSearchTerm(query);
      debouncedSearch(query, page);
    },
    [debouncedSearch]
  );

  const searchNextPage = useCallback(() => {
    if (!searchResult || !ClientSearchService.canLoadNextPage(searchResult)) {
      return;
    }

    const nextPage = ClientSearchService.getNextPageNumber(searchResult);
    if (nextPage !== null) {
      debouncedSearch(searchTerm, nextPage);
    }
  }, [searchResult, searchTerm, debouncedSearch]);

  const searchPreviousPage = useCallback(() => {
    if (!searchResult || !ClientSearchService.canLoadPreviousPage(searchResult)) {
      return;
    }

    const prevPage = ClientSearchService.getPreviousPageNumber(searchResult);
    if (prevPage !== null) {
      debouncedSearch(searchTerm, prevPage);
    }
  }, [searchResult, searchTerm, debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResult(null);
    setSearchCache(new Map());
    clearErrors();
    cancelDebounce();
  }, [clearErrors, cancelDebounce]);

  // === ШВИДКИЙ ПОШУК ДЛЯ АВТОКОМПЛЕТУ ===
  const quickSearch = useCallback(
    async (query: string, limit: number = 5): Promise<ClientSearchResult[]> => {
      try {
        return await ClientSearchService.quickSearch(query, limit);
      } catch (error) {
        addError(error instanceof Error ? error.message : 'Помилка швидкого пошуку');
        return [];
      }
    },
    [addError]
  );

  // === COMPUTED ЗНАЧЕННЯ ===
  const computed = useMemo(() => {
    const hasResults = searchResult ? ClientSearchService.hasSearchResults(searchResult) : false;
    const canLoadNext = searchResult ? ClientSearchService.canLoadNextPage(searchResult) : false;
    const canLoadPrevious = searchResult
      ? ClientSearchService.canLoadPreviousPage(searchResult)
      : false;

    const formattedResults = searchResult?.items
      ? ClientSearchService.formatSearchResultsForDisplay(searchResult.items)
      : [];

    return {
      hasResults,
      canLoadNext,
      canLoadPrevious,
      formattedResults,
      totalResults: searchResult?.totalElements || 0,
      currentPage: searchResult?.currentPage || 0,
      totalPages: searchResult?.totalPages || 0,
      isEmptySearch: searchTerm.length === 0,
      isMinimalQuery:
        searchTerm.length > 0 && !ClientSearchService.shouldDebounceSearch(searchTerm),
    };
  }, [searchResult, searchTerm]);

  // === ЕФЕКТ ОЧИЩЕННЯ ПРИ РОЗМОНТУВАННІ ===
  useEffect(() => {
    return () => {
      cancelDebounce();
    };
  }, [cancelDebounce]);

  return {
    // Стан пошуку
    searchTerm,
    searchResult,
    isSearching,

    // Computed значення
    ...computed,

    // Методи пошуку
    search,
    searchNextPage,
    searchPreviousPage,
    clearSearch,
    quickSearch,

    // Результати
    results: searchResult?.items || [],
  };
};
