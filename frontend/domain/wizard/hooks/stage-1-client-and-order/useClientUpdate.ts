/**
 * @fileoverview Хук для оновлення клієнтів
 *
 * Відповідальність:
 * - Оновлення існуючого клієнта
 * - Управління станом оновлення
 * - Обробка помилок
 * - Інвалідація кешу після оновлення
 */

import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

// Orval згенеровані хуки
import { useUpdateClient } from '@/shared/api/generated/client/aksiApi';

// Типи
import type { UseClientUpdateReturn, UpdateClientData, Client } from './types';

const CLIENT_UPDATE_ERROR = 'Помилка оновлення клієнта';

/**
 * Хук для оновлення клієнтів
 *
 * @example
 * ```tsx
 * const {
 *   isLoading,
 *   error,
 *   updatedClient,
 *   updateClient,
 *   reset
 * } = useClientUpdate();
 *
 * // Оновити клієнта
 * const updated = await updateClient('client-id', {
 *   firstName: 'Іван',
 *   lastName: 'Петров',
 *   phone: '+380987654321'
 * });
 * ```
 */
export function useClientUpdate(): UseClientUpdateReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [error, setError] = useState<string | null>(null);
  const [updatedClient, setUpdatedClient] = useState<Client | null>(null);

  // Query client для інвалідації кешу
  const queryClient = useQueryClient();

  // =====================================
  // Orval хук для оновлення
  // =====================================

  const {
    mutateAsync: updateClientMutation,
    isPending: isLoading,
    error: apiError,
    reset: resetMutation,
  } = useUpdateClient({
    mutation: {
      // Успішне оновлення
      onSuccess: (response) => {
        if (response) {
          setUpdatedClient(response as Client);
          setError(null);

          // Інвалідуємо всі запити клієнтів для оновлення кешу
          queryClient.invalidateQueries({
            predicate: (query) => {
              // Інвалідуємо всі запити пов'язані з клієнтами
              return (
                query.queryKey[0] === '/clients' ||
                (typeof query.queryKey[0] === 'string' && query.queryKey[0].includes('client'))
              );
            },
          });
        }
      },

      // Помилка оновлення
      onError: (error) => {
        setError(CLIENT_UPDATE_ERROR);
        setUpdatedClient(null);
        console.error('Client update error:', error);
      },
    },
  });

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Оновити клієнта
   */
  const updateClient = useCallback(
    async (id: string, data: UpdateClientData): Promise<Client | null> => {
      try {
        setError(null);

        const response = await updateClientMutation({
          id,
          data,
        });

        return response || null;
      } catch {
        setError(CLIENT_UPDATE_ERROR);
        return null;
      }
    },
    [updateClientMutation]
  );

  /**
   * Очистити стан
   */
  const reset = useCallback(() => {
    setError(null);
    setUpdatedClient(null);
    resetMutation();
  }, [resetMutation]);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    isLoading,
    error: error || (apiError ? CLIENT_UPDATE_ERROR : null),
    updatedClient,

    // Дії
    updateClient,
    reset,
  };
}
