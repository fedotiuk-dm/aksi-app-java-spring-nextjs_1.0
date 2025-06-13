/**
 * Прості та ефективні хуки для debouncing
 */
import { useEffect, useState, useCallback, useRef } from 'react';

// =================== БАЗОВИЙ DEBOUNCE ===================

/**
 * Простий хук для затримки значення
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// =================== DEBOUNCED CALLBACK ===================

/**
 * Простий хук для затримки виконання функції
 */
export const useDebouncedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  // Cleanup при unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// =================== СПЕЦІАЛІЗОВАНИЙ ХУК ДЛЯ ПОШУКУ ===================

/**
 * Хук для автоматичного пошуку з debounce
 */
export const useDebounceSearch = (
  searchTerm: string,
  onSearch: (term: string) => void | Promise<void>,
  delay: number = 500,
  minLength: number = 2
) => {
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchRef = useRef<string>('');

  // Debounced значення для відображення
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // Автоматичний пошук
  useEffect(() => {
    const trimmed = searchTerm.trim();

    // Скасовуємо попередній пошук
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Якщо термін занадто короткий або не змінився
    if (trimmed.length < minLength || trimmed === lastSearchRef.current) {
      setIsSearching(false);
      return;
    }

    // Встановлюємо новий пошук
    timeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      lastSearchRef.current = trimmed;

      try {
        await onSearch(trimmed);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, onSearch, delay, minLength]);

  // Примусовий пошук
  const forceSearch = useCallback(async () => {
    const trimmed = searchTerm.trim();
    if (trimmed.length >= minLength) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsSearching(true);
      lastSearchRef.current = trimmed;

      try {
        await onSearch(trimmed);
      } finally {
        setIsSearching(false);
      }
    }
  }, [searchTerm, onSearch, minLength]);

  // Скасування пошуку
  const cancelSearch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSearching(false);
  }, []);

  return {
    debouncedSearchTerm,
    isSearching,
    hasMinLength: searchTerm.trim().length >= minLength,
    forceSearch,
    cancelSearch,
  };
};
