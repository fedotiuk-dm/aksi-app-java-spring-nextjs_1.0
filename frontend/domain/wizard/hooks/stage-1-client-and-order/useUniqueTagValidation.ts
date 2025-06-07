/**
 * @fileoverview Хук для валідації унікальності мітки замовлення
 *
 * Відповідальність:
 * - Валідація унікальності мітки через backend API
 * - Debounced перевірка для оптимізації запитів
 * - Кешування результатів валідації
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import orvalFetcher from '@/lib/api/orval-fetcher';

// Типи
import type { UseUniqueTagValidationReturn } from './types';
import type { ErrorResponse } from '@/shared/api/generated/order/aksiApi.schemas';

/**
 * Функція для перевірки унікальності мітки через API
 */
const checkUniqueTag = async (tag: string): Promise<boolean> => {
  try {
    // Спробуємо знайти замовлення з такою міткою
    await orvalFetcher({
      url: `/orders/tag/${encodeURIComponent(tag)}`,
      method: 'GET',
    });

    // Якщо знайшли - мітка не унікальна
    return false;
  } catch (error) {
    // Якщо 404 - мітка унікальна
    if ((error as ErrorResponse)?.status === 404) {
      return true;
    }

    // Інші помилки - прокидуємо далі
    throw error;
  }
};

/**
 * Хук для валідації унікальності мітки замовлення
 *
 * Використовує реальний backend API для перевірки того,
 * чи не існує вже замовлення з такою міткою
 *
 * @param tag - Мітка для перевірки
 * @param enabled - Чи активна валідація (за замовчуванням true)
 *
 * @example
 * ```tsx
 * const {
 *   isUnique,
 *   isValidating,
 *   error
 * } = useUniqueTagValidation('TAG-001');
 *
 * if (isValidating) {
 *   return <Spinner />;
 * }
 *
 * if (!isUnique) {
 *   return <Error>Мітка вже використовується</Error>;
 * }
 * ```
 */
export const useUniqueTagValidation = (
  tag: string,
  enabled: boolean = true
): UseUniqueTagValidationReturn => {
  // Валідуємо тільки якщо мітка не порожня та має мінімум 3 символи
  const shouldValidate = useMemo(() => {
    return enabled && !!tag && tag.trim().length >= 3;
  }, [enabled, tag]);

  const {
    data: isUnique,
    isLoading: isValidating,
    error,
  } = useQuery({
    queryKey: ['unique-tag-validation', tag],
    queryFn: () => checkUniqueTag(tag.trim()),
    enabled: shouldValidate,
    staleTime: 1000 * 60 * 5, // Кешуємо результат на 5 хвилин
    gcTime: 1000 * 60 * 10, // Зберігаємо в пам'яті 10 хвилин
    retry: (failureCount, error) => {
      // Не ретраємо 404 помилки (це означає що мітка унікальна)
      if ((error as ErrorResponse)?.status === 404) {
        return false;
      }

      // Ретраємо інші помилки максимум 2 рази
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    isUnique: isUnique ?? null,
    isValidating: shouldValidate && isValidating,
    error: shouldValidate ? error : null,
    tag: tag.trim(),
  };
};
