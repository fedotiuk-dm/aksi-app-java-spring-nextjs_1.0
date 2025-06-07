/**
 * @fileoverview Хук для створення нових клієнтів
 *
 * Відповідальність:
 * - Створення нового клієнта
 * - Управління станом створення
 * - Обробка помилок
 * - Інвалідація кешу після створення
 */

import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

// Orval згенеровані хуки
import { useCreateClient } from '@/shared/api/generated/client/aksiApi';

// Типи
import type { UseClientCreateReturn, CreateClientData, Client } from './types';

/**
 * Хук для створення нових клієнтів
 *
 * @example
 * ```tsx
 * const {
 *   isLoading,
 *   error,
 *   createdClient,
 *   createClient,
 *   reset
 * } = useClientCreate();
 *
 * // Створити клієнта
 * const newClient = await createClient({
 *   firstName: 'Іван',
 *   lastName: 'Іванов',
 *   phone: '+380123456789',
 *   email: 'ivan@example.com'
 * });
 * ```
 */
const CLIENT_CREATE_ERROR = 'Помилка створення клієнта';

export function useClientCreate(): UseClientCreateReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [error, setError] = useState<string | null>(null);
  const [createdClient, setCreatedClient] = useState<Client | null>(null);

  // Query client для інвалідації кешу
  const queryClient = useQueryClient();

  // =====================================
  // Orval хук для створення
  // =====================================

  const {
    mutateAsync: createClientMutation,
    isPending: isLoading,
    error: apiError,
    reset: resetMutation,
  } = useCreateClient({
    mutation: {
      // Успішне створення
      onSuccess: (response) => {
        if (response) {
          setCreatedClient(response as Client);
          setError(null);

          // Інвалідуємо кеш пошуку та списку клієнтів
          queryClient.invalidateQueries({
            predicate: (query) => {
              // Інвалідуємо всі запити пошуку клієнтів
              return query.queryKey[0] === '/clients' || query.queryKey[0] === '/clients/search';
            },
          });
        }
      },

      // Помилка створення
      onError: (error) => {
        setError(CLIENT_CREATE_ERROR);
        setCreatedClient(null);
        console.error('Client creation error:', error);
      },
    },
  });

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Створити нового клієнта
   */
  const createClient = useCallback(
    async (data: CreateClientData): Promise<Client | null> => {
      try {
        setError(null);

        const response = await createClientMutation({ data });

        return response || null;
      } catch {
        setError(CLIENT_CREATE_ERROR);
        return null;
      }
    },
    [createClientMutation]
  );

  /**
   * Очистити стан
   */
  const reset = useCallback(() => {
    setError(null);
    setCreatedClient(null);
    resetMutation();
  }, [resetMutation]);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    isLoading,
    error: error || (apiError ? CLIENT_CREATE_ERROR : null),
    createdClient,

    // Дії
    createClient,
    reset,
  };
}
