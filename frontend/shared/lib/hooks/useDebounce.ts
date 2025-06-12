/**
 * Хук для затримки виконання значення (debouncing)
 * Корисний для пошуку, щоб не робити запити на кожну зміну символу
 *
 * @param value - значення для debounce
 * @param delay - затримка в мілісекундах
 * @returns debounced значення
 */
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Якщо значення порожнє, оновлюємо відразу
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      setDebouncedValue(value);
      return;
    }

    // Встановлюємо таймер для оновлення debounced значення
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищуємо таймер при зміні value або delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Хук для затримки виконання функції (debouncing)
 * Корисний для обробників подій, які викликаються часто
 *
 * @param callback - функція для виконання
 * @param delay - затримка в мілісекундах

 * @returns debounced функція
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = ((...args: Parameters<T>) => {
    // Очищуємо попередній таймер
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Встановлюємо новий таймер
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  }) as T;

  // Очищуємо таймер при unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
}
