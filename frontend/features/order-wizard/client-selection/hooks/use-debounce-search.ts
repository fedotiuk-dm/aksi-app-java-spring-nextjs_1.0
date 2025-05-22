import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Хук для роботи з відкладеним пошуком
 * @param searchCallback - функція, яка буде викликана після затримки
 * @param delay - затримка в мілісекундах
 */
export function useDebounceSearch<T>(
  searchCallback: (query: string) => Promise<T | null>,
  delay: number = 500
) {
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const searchInProgress = useRef(false);

  /**
   * Функція для виконання пошуку
   */
  const executeSearch = useCallback(
    async (searchQuery: string) => {
      // Якщо пошук вже виконується, пропускаємо запит
      if (searchInProgress.current) {
        console.log('Пошук вже виконується, пропускаємо запит');
        return;
      }

      if (searchQuery.length >= 2) {
        // Встановлюємо прапорець, що пошук почався
        searchInProgress.current = true;
        setIsSearching(true);
        setValidationMessage(null);
        setError(null);
        setLastQuery(searchQuery);

        try {
          console.log(`Виконуємо пошук за запитом: "${searchQuery}"`);
          await searchCallback(searchQuery);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Помилка під час пошуку';
          console.error('Помилка під час пошуку:', error);
          setError(errorMessage);
        } finally {
          setIsSearching(false);
          // Знімаємо прапорець, що пошук завершився
          searchInProgress.current = false;
        }
      } else if (searchQuery.length === 0 && lastQuery.length > 0) {
        // Якщо поле очищено, скидаємо результати пошуку
        setValidationMessage(null);
        setLastQuery('');
        searchInProgress.current = true;
        try {
          await searchCallback('');
        } catch (error) {
          console.error('Помилка при очищенні пошуку:', error);
        } finally {
          searchInProgress.current = false;
        }
      } else if (searchQuery.length === 1) {
        // Показуємо повідомлення про мінімальну довжину запиту
        setValidationMessage('Введіть мінімум 2 символи для пошуку');
      }
    },
    [searchCallback, lastQuery]
  );

  /**
   * Ефект для відкладеного пошуку
   */
  useEffect(() => {
    // Не запускаємо пошук, якщо запит не змінився або якщо вже є активний запит
    if (query === lastQuery || searchInProgress.current) return;

    const timer = setTimeout(() => {
      executeSearch(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay, executeSearch, lastQuery]);

  /**
   * Функція для очищення пошукового запиту
   */
  const clearSearch = useCallback(async () => {
    setQuery('');
    setLastQuery('');
    setValidationMessage(null);
    setError(null);

    // Якщо пошук вже виконується, пропускаємо запит
    if (searchInProgress.current) return;

    searchInProgress.current = true;
    try {
      await searchCallback('');
    } catch (error) {
      console.error('Помилка при очищенні пошуку:', error);
    } finally {
      searchInProgress.current = false;
    }
  }, [searchCallback]);

  /**
   * Функція для негайного виконання пошуку
   */
  const executeSearchNow = useCallback(async () => {
    // Якщо пошук вже виконується, пропускаємо запит
    if (searchInProgress.current) return;

    if (query.length >= 2) {
      await executeSearch(query);
    }
  }, [query, executeSearch]);

  return {
    query,
    setQuery,
    isSearching,
    error,
    validationMessage,
    lastQuery,
    executeSearchNow,
    clearSearch,
  };
}
