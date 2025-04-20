import { useState, useEffect } from 'react';

/**
 * Хук useDebounce для відкладеного оновлення значення
 * Використовується для оптимізації запитів при пошуку
 * 
 * @param value - Значення, яке потрібно відкласти
 * @param delay - Затримка в мілісекундах (за замовчуванням 500мс)
 * @returns Відкладене значення
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Встановлюємо таймер для відкладеного оновлення значення
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаємо таймер при зміні значення або при розмонтуванні компонента
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
