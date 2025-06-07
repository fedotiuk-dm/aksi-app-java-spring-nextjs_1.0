/**
 * @fileoverview Хук для генерації номера квитанції через API
 *
 * Відповідальність:
 * - Генерація унікального номера квитанції через backend API
 * - Обробка помилок генерації
 * - Кешування згенерованого номера
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import orvalFetcher from '@/lib/api/orval-fetcher';

// Типи
import type { UseReceiptNumberGenerationReturn } from './types';

// Константи
const RECEIPT_NUMBER_QUERY_KEY = 'receipt-number-generation';

/**
 * Функція для генерації номера квитанції через API
 */
const generateReceiptNumber = async (): Promise<string> => {
  return orvalFetcher<string>({
    url: '/orders/generate-receipt-number',
    method: 'GET',
  });
};

/**
 * Хук для генерації номера квитанції
 *
 * Використовує реальний backend API для генерації унікального номера квитанції
 * у форматі AKSI-[BRANCH_CODE]-YYYYMMDD-HHMMSS-XXX
 *
 * @example
 * ```tsx
 * const {
 *   receiptNumber,
 *   generateNew,
 *   isGenerating,
 *   error
 * } = useReceiptNumberGeneration();
 *
 * // Автоматично генерується при монтуванні компонента
 * // Для ручної генерації:
 * generateNew();
 * ```
 */
export const useReceiptNumberGeneration = (): UseReceiptNumberGenerationReturn => {
  const queryClient = useQueryClient();

  // Query для автоматичної генерації номера при завантаженні
  const {
    data: receiptNumber,
    isLoading: isGenerating,
    error,
    refetch,
  } = useQuery({
    queryKey: [RECEIPT_NUMBER_QUERY_KEY],
    queryFn: generateReceiptNumber,
    staleTime: 0, // Завжди генеруємо новий номер
    gcTime: 1000 * 60 * 5, // Зберігаємо в кеші 5 хвилин
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Mutation для ручної генерації нового номера
  const generateNewMutation = useMutation({
    mutationFn: generateReceiptNumber,
    onSuccess: (newReceiptNumber) => {
      // Оновлюємо кеш з новим номером
      queryClient.setQueryData([RECEIPT_NUMBER_QUERY_KEY], newReceiptNumber);
    },
    onError: (error) => {
      console.error('Помилка генерації номера квитанції:', error);
    },
  });

  /**
   * Генерує новий номер квитанції
   */
  const generateNew = () => {
    generateNewMutation.mutate();
  };

  /**
   * Очищає згенерований номер (форсує нову генерацію)
   */
  const reset = () => {
    queryClient.removeQueries({ queryKey: [RECEIPT_NUMBER_QUERY_KEY] });
    refetch();
  };

  return {
    receiptNumber: receiptNumber || null,
    isGenerating: isGenerating || generateNewMutation.isPending,
    error: error || generateNewMutation.error,
    generateNew,
    reset,
  };
};
