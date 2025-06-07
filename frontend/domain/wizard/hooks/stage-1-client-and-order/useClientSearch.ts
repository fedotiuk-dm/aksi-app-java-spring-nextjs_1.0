/**
 * @fileoverview Хук для пошуку клієнтів з підтримкою пагінації
 *
 * Відповідальність:
 * - Реактивний пошук клієнтів при вводі
 * - Управління станом пошуку
 * - Підтримка пагінації
 * - Кешування результатів
 */

import { useState, useCallback, useEffect } from 'react';

import { useSearchClientsWithPagination } from '@/shared/api/generated/client/aksiApi';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';

// Типи
import type { UseClientSearchReturn, Client } from './types';
import type { ClientPageResponse } from '@/shared/api/generated/client/aksiApi.schemas';

/**
 * Хук для пошуку клієнтів з підтримкою пагінації
 *
 * @example
 * ```tsx
 * const {
 *   searchTerm,
 *   results,
 *   isLoading,
 *   hasMore,
 *   setSearchTerm,
 *   search,
 *   loadMore
 * } = useClientSearch();
 *
 * // Встановити пошуковий термін
 * setSearchTerm('Іванов');
 *
 * // Завантажити наступну сторінку
 * await loadMore();
 * ```
 */
export function useClientSearch(): UseClientSearchReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [searchTerm, setSearchTermState] = useState<string>('');
  const [results, setResults] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Debounce пошукового терміна для автоматичного пошуку
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // =====================================
  // Orval хук для пошуку з пагінацією
  // =====================================

  const {
    mutateAsync: searchMutation,
    isPending: isLoading,
    error: apiError,
  } = useSearchClientsWithPagination();

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Виконати пошук
   */
  const performSearch = useCallback(
    async (query: string, page: number = 0, resetResults: boolean = false) => {
      if (!query.trim()) return;

      try {
        setError(null);

        const response = await searchMutation({
          data: {
            query: query.trim(),
            page,
            size: 20, // розмір сторінки
          },
        });

        if (response) {
          const pageResponse = response as ClientPageResponse;

          // Якщо це перша сторінка або скидання - замінюємо результати
          // Інакше - додаємо до існуючих
          if (resetResults || page === 0) {
            setResults((pageResponse.content || []) as Client[]);
          } else {
            setResults((prev) => [...prev, ...((pageResponse.content || []) as Client[])]);
          }

          // Оновлюємо метадані пагінації
          setCurrentPage(pageResponse.pageNumber || 0);
          setTotalPages(pageResponse.totalPages || 0);
          setHasMore(pageResponse.hasNext || false);
        }
      } catch {
        setError('Помилка пошуку клієнтів');
        if (resetResults) {
          setResults([]);
          setHasMore(false);
        }
      }
    },
    [searchMutation]
  );

  // =====================================
  // Ефекти для автоматичного пошуку
  // =====================================

  // Автоматичний пошук при зміні debouncedSearchTerm
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      performSearch(debouncedSearchTerm, 0, true); // true = reset results
    } else if (debouncedSearchTerm.length === 0) {
      // Очищуємо результати якщо пошук порожній
      setResults([]);
      setError(null);
      setHasMore(false);
      setCurrentPage(0);
      setTotalPages(0);
    }
  }, [debouncedSearchTerm, performSearch]);

  /**
   * Встановити пошуковий термін
   */
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);

    // Якщо термін порожній, очищуємо результати
    if (!term.trim()) {
      setResults([]);
      setError(null);
      setHasMore(false);
      setCurrentPage(0);
      setTotalPages(0);
    }
  }, []);

  /**
   * Виконати пошук вручну
   */
  const search = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        setResults([]);
        setError(null);
        setHasMore(false);
        setCurrentPage(0);
        setTotalPages(0);
        return;
      }

      setSearchTermState(term);
      await performSearch(term, 0, true);
    },
    [performSearch]
  );

  /**
   * Завантажити наступну сторінку результатів
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || !debouncedSearchTerm.trim()) return;

    const nextPage = currentPage + 1;
    await performSearch(debouncedSearchTerm, nextPage, false);
  }, [hasMore, isLoading, debouncedSearchTerm, currentPage, performSearch]);

  /**
   * Очистити результати пошуку
   */
  const clearResults = useCallback(() => {
    setSearchTermState('');
    setResults([]);
    setError(null);
    setHasMore(false);
    setCurrentPage(0);
    setTotalPages(0);
  }, []);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    searchTerm,
    results,
    isLoading,
    error: error || (apiError ? 'Помилка пошуку клієнтів' : null),
    hasMore,
    currentPage,
    totalPages,

    // Дії
    setSearchTerm,
    search,
    clearResults,
    loadMore,
  };
}
