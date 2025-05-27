/**
 * @fileoverview Хук для пошуку клієнтів (DDD архітектура)
 * @module domain/wizard/hooks/steps/client-selection
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

import { searchClients } from '../../../services/stage-1-client-and-order-info';
import { useWizardState } from '../../shared';

import type {
  ClientSearchPaginatedResult,
  ClientSearchResult,
} from '../../../services/stage-1-client-and-order-info';

/**
 * Простий дебаунс хук
 */
const useDebounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: T) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

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
 * - clientSearchService для пошуку
 * - useWizardState для помилок
 */
export const useClientSearch = () => {
  // === REACT СТАН ===
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<ClientSearchPaginatedResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchCacheRef = useRef<Map<string, ClientSearchPaginatedResult>>(new Map());

  // === WIZARD ІНТЕГРАЦІЯ ===
  const { addError, clearErrors } = useWizardState();

  // === ФУНКЦІЯ ПОШУКУ ===
  const performSearch = useCallback(
    async (query: string, page: number = 0) => {
      // Мінімальна довжина запиту
      if (query.trim().length < 2) {
        setSearchResult(null);
        return;
      }

      // Перевірка кешу
      const cacheKey = `${query}-${page}`;
      const currentCache = searchCacheRef.current;
      const cached = currentCache.get(cacheKey);

      if (cached) {
        setSearchResult(cached);
        return;
      }

      // Пошук якщо немає в кеші
      setIsSearching(true);
      clearErrors();

      try {
        const result = await searchClients(query, page, 20);

        if (result.success && result.data) {
          // Адаптуємо результат до ClientSearchPaginatedResult
          const searchData: ClientSearchPaginatedResult = {
            clients: result.data,
            totalElements: result.data.length,
            totalPages: 1,
            pageNumber: page,
            pageSize: 20,
            hasNext: false,
            hasPrevious: page > 0,
          };

          setSearchResult(searchData);
          // Кешування результату
          searchCacheRef.current.set(cacheKey, searchData);
        } else {
          addError(result.error || 'Помилка пошуку клієнтів');
          setSearchResult(null);
        }
      } catch (error) {
        addError(error instanceof Error ? error.message : 'Помилка пошуку клієнтів');
        setSearchResult(null);
      } finally {
        setIsSearching(false);
      }
    },
    [clearErrors, addError]
  );

  // === ДЕБАУНС ПОШУКУ ===
  const { debouncedCallback: debouncedSearch, cancel: cancelDebounce } = useDebounce(
    performSearch,
    300 // 300ms дебаунс
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
    if (!searchResult || !searchResult.hasNext) {
      return;
    }

    const nextPage = searchResult.pageNumber + 1;
    debouncedSearch(searchTerm, nextPage);
  }, [searchResult, searchTerm, debouncedSearch]);

  const searchPreviousPage = useCallback(() => {
    if (!searchResult || !searchResult.hasPrevious) {
      return;
    }

    const prevPage = searchResult.pageNumber - 1;
    debouncedSearch(searchTerm, prevPage);
  }, [searchResult, searchTerm, debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResult(null);
    searchCacheRef.current = new Map();
    clearErrors();
    cancelDebounce();
  }, [clearErrors, cancelDebounce]);

  // === ШВИДКИЙ ПОШУК ДЛЯ АВТОКОМПЛЕТУ ===
  const quickSearch = useCallback(
    async (query: string, limit: number = 5): Promise<ClientSearchResult[]> => {
      try {
        const result = await searchClients(query, 0, limit);
        return result.success && result.data ? result.data : [];
      } catch (error) {
        addError(error instanceof Error ? error.message : 'Помилка швидкого пошуку');
        return [];
      }
    },
    [addError]
  );

  // === ОТРИМАННЯ КЛІЄНТА ЗА ID ===
  const getClientById = useCallback(
    async (id: string): Promise<ClientSearchResult | null> => {
      try {
        const result = await searchClients(id, 0, 1);
        return result.success && result.data && result.data.length > 0 ? result.data[0] : null;
      } catch (error) {
        addError(error instanceof Error ? error.message : 'Помилка отримання клієнта');
        return null;
      }
    },
    [addError]
  );

  // === COMPUTED ЗНАЧЕННЯ ===
  const computed = useMemo(() => {
    const hasResults = searchResult ? searchResult.clients.length > 0 : false;
    const canLoadNext = searchResult ? searchResult.hasNext : false;
    const canLoadPrevious = searchResult ? searchResult.hasPrevious : false;

    return {
      hasResults,
      canLoadNext,
      canLoadPrevious,
      clients: searchResult?.clients || [],
      totalResults: searchResult?.totalElements || 0,
      currentPage: searchResult?.pageNumber || 0,
      totalPages: searchResult?.totalPages || 0,
      isEmptySearch: searchTerm.length === 0,
      isMinimalQuery: searchTerm.length > 0 && searchTerm.length < 2,
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

    // Методи
    search,
    searchNextPage,
    searchPreviousPage,
    clearSearch,
    quickSearch,
    getClientById,

    // Утиліти
    setSearchTerm,
  };
};
