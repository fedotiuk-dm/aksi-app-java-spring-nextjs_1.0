/**
 * @fileoverview Хук для debounce значень
 *
 * Використовується для затримки викликів API при пошуку,
 * щоб зменшити кількість запитів під час вводу користувача
 */

import { useState, useEffect } from 'react';

/**
 * Хук для debounce значень
 *
 * @param value - Значення для debounce
 * @param delay - Затримка в мілісекундах
 * @returns Debounced значення
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 * // API виклик буде виконано тільки після 300мс простою
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Встановлюємо таймер для оновлення debounced значення
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищуємо таймер якщо value або delay змінилися
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
