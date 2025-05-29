/**
 * @fileoverview Спрощений хук для операцій з клієнтами
 *
 * Прямо використовує orval API + zod без додаткових шарів трансформації
 * Слідує принципу "DDD inside, FSD outside"
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  useGetAllClients,
  useSearchClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  useGetClientById,
  useSearchClientsWithPagination,
  type CreateClientRequest,
  type UpdateClientRequest,
  type ClientResponse,
  type SearchClientsParams,
  type ClientSearchRequest,
} from '@/shared/api/generated/client';
import { zodSchemas } from '@/shared/api/generated/client';

import { useWizardBase } from '../base.hook';

import type { ZodIssue } from 'zod';

/**
 * 🚀 Спрощений хук для операцій з клієнтами
 * Використовує orval API + zod безпосередньо
 */
export function useClientOperations() {
  const { logInfo, logError } = useWizardBase();
  const queryClient = useQueryClient();

  // 📋 Orval хуки без додаткових обгорток
  const allClientsQuery = useGetAllClients();

  const searchClientsQuery = useSearchClients({ keyword: '' } as SearchClientsParams, {
    query: { enabled: false },
  });

  const searchWithPaginationMutation = useSearchClientsWithPagination();

  const createMutation = useCreateClient({
    mutation: {
      onSuccess: (data) => {
        logInfo('Клієнт створений:', data);
        queryClient.invalidateQueries({ queryKey: ['getAllClients'] });
      },
      onError: (error) => logError('Помилка створення клієнта:', error),
    },
  });

  const updateMutation = useUpdateClient({
    mutation: {
      onSuccess: (data) => {
        logInfo('Клієнт оновлений:', data);
        queryClient.invalidateQueries({ queryKey: ['getAllClients'] });
      },
      onError: (error) => logError('Помилка оновлення клієнта:', error),
    },
  });

  const deleteMutation = useDeleteClient({
    mutation: {
      onSuccess: (_, variables) => {
        logInfo('Клієнт видалений:', variables.id);
        queryClient.invalidateQueries({ queryKey: ['getAllClients'] });
      },
      onError: (error) => logError('Помилка видалення клієнта:', error),
    },
  });

  /**
   * 🔍 Пошук клієнтів
   */
  const searchClients = useCallback(
    async (keyword: string) => {
      try {
        const result = await queryClient.fetchQuery({
          queryKey: ['searchClients', keyword],
          queryFn: () =>
            fetch(`/api/clients/search?keyword=${encodeURIComponent(keyword)}`).then((res) =>
              res.json()
            ),
          staleTime: 2 * 60 * 1000,
        });
        return { data: result, error: null };
      } catch (error) {
        return { data: [], error: String(error) };
      }
    },
    [queryClient]
  );

  /**
   * 🔍 Розширений пошук з пагінацією
   */
  const searchWithPagination = useCallback(
    async (searchParams: ClientSearchRequest) => {
      // Використовуємо zod схему orval прямо для валідації
      const validationResult = zodSchemas.searchClientsWithPaginationBody.safeParse(searchParams);

      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors.map((e: ZodIssue) => e.message);
        throw new Error(errorMessages.join(', '));
      }

      return searchWithPaginationMutation.mutateAsync({ data: searchParams });
    },
    [searchWithPaginationMutation]
  );

  /**
   * ➕ Створення клієнта з orval zod валідацією
   */
  const createClient = useCallback(
    async (clientData: CreateClientRequest) => {
      // Використовуємо zod схему orval прямо
      const validationResult = zodSchemas.createClientBody.safeParse(clientData);

      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors.map((e: ZodIssue) => e.message);
        throw new Error(errorMessages.join(', '));
      }

      return createMutation.mutateAsync({ data: clientData });
    },
    [createMutation]
  );

  /**
   * ✏️ Оновлення клієнта з orval zod валідацією
   */
  const updateClient = useCallback(
    async (id: string, clientData: UpdateClientRequest) => {
      // Використовуємо zod схему orval прямо
      const validationResult = zodSchemas.updateClientBody.safeParse(clientData);

      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors.map((e: ZodIssue) => e.message);
        throw new Error(errorMessages.join(', '));
      }

      return updateMutation.mutateAsync({ id, data: clientData });
    },
    [updateMutation]
  );

  /**
   * 🗑️ Видалення клієнта
   */
  const deleteClient = useCallback(
    async (id: string) => {
      return deleteMutation.mutateAsync({ id });
    },
    [deleteMutation]
  );

  return {
    // Дані з orval хуків прямо
    allClients: allClientsQuery.data || [],
    isLoadingClients: allClientsQuery.isLoading,
    clientsError: allClientsQuery.error?.message || null,

    // Пошук
    searchResults: searchWithPaginationMutation.data?.content || [],
    isSearching: searchWithPaginationMutation.isPending || searchClientsQuery.isFetching,
    searchError: searchWithPaginationMutation.error?.message || null,

    // Стан операцій
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    operationError:
      createMutation.error?.message ||
      updateMutation.error?.message ||
      deleteMutation.error?.message ||
      null,

    // Методи
    searchClients,
    searchWithPagination,
    createClient,
    updateClient,
    deleteClient,

    // Утиліти
    refreshClients: () => queryClient.invalidateQueries({ queryKey: ['getAllClients'] }),
    clearSearchResults: () => searchWithPaginationMutation.reset(),
    clearErrors: () => {
      createMutation.reset();
      updateMutation.reset();
      deleteMutation.reset();
    },

    // Orval типи для TypeScript (реекспорт)
    zodSchemas,
  };
}

/**
 * 📋 Спрощений хук для отримання конкретного клієнта
 */
export function useClientDetails(id: string) {
  return useGetClientById(id, {
    query: { enabled: !!id },
  });
}

/**
 * 🔍 Спрощений хук для швидкого пошуку
 */
export function useQuickClientSearch() {
  const searchMutation = useSearchClientsWithPagination();

  const search = useCallback(
    async (query: string) => {
      const searchRequest: ClientSearchRequest = {
        query,
        page: 0,
        size: 10,
      };

      return searchMutation.mutateAsync({ data: searchRequest });
    },
    [searchMutation]
  );

  return {
    search,
    results: searchMutation.data?.content || [],
    isSearching: searchMutation.isPending,
    error: searchMutation.error?.message || null,
    reset: () => searchMutation.reset(),
  };
}
