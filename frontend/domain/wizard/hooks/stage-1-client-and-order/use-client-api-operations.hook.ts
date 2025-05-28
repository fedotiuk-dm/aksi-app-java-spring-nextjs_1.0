/**
 * @fileoverview Доменний хук для роботи з API клієнтів
 *
 * Інкапсулює згенеровані Orval API хуки та додає бізнес-логіку:
 * - Адаптація API під потреби UI
 * - Обробка помилок та станів
 * - Кешування та оптимізація
 * - Валідація через Zod схеми
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

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
import {
  safeValidate,
  validateOrThrow,
  createPartialSchema,
  z,
  createClientBody,
  updateClientBody,
  searchClientsWithPaginationBody,
} from '@/shared/api/generated/client/zod';

import {
  ClientValidationService,
  type ClientFormData,
  clientFormSchema,
} from '../../services/stage-1-client-and-order/client-management/client-validation.service';
import { useWizardBase } from '../base.hook';

/**
 * 🎯 Інтерфейси для UI
 */
export interface ClientSearchState {
  searchTerm: string;
  isSearching: boolean;
  searchResults: ClientResponse[];
  hasSearched: boolean;
  searchError: string | null;
}

export interface ClientOperationsState {
  selectedClient: ClientResponse | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  operationError: string | null;
}

/**
 * 🚀 Доменний хук для операцій з клієнтами
 * Використовує згенеровані Orval хуки + доменна логіка
 */
export function useClientApiOperations() {
  const { logInfo, logError, logWarning } = useWizardBase();
  const queryClient = useQueryClient();
  const validationService = useMemo(() => new ClientValidationService(), []);

  // 📋 Отримання всіх клієнтів (з типізованими параметрами)
  const allClientsQuery = useGetAllClients(
    undefined, // Змінюємо на undefined
    {
      query: {
        enabled: false, // Вимикаємо автоматичне завантаження
        staleTime: 5 * 60 * 1000, // 5 хвилин кеш
      },
    }
  );

  // 📋 Отримання окремого клієнта по ID (новий хук)
  const getClientByIdQuery = useGetClientById;

  // 🔍 Пошук клієнтів (з типізованими параметрами)
  const searchClientsQuery = useSearchClients(
    { keyword: '' } as SearchClientsParams, // Типізовані параметри
    {
      query: {
        enabled: false, // Вимикаємо автоматичне виконання
        staleTime: 2 * 60 * 1000, // 2 хвилини кеш для пошуку
      },
    }
  );

  // 🔍 Розширений пошук з пагінацією (це mutation)
  const searchWithPaginationMutation = useSearchClientsWithPagination({
    mutation: {
      onError: (error: Error) => {
        logError('Помилка пошуку клієнтів з пагінацією:', error);
      },
      onSuccess: (data) => {
        logInfo('Пошук клієнтів з пагінацією успішний:', data);
      },
    },
  });

  // ➕ Створення клієнта
  const createMutation = useCreateClient({
    mutation: {
      onMutate: (variables) => {
        logInfo('Створення клієнта...', variables);
      },
      onSuccess: (data, variables) => {
        logInfo('Клієнт створений успішно:', {
          clientId: data.id,
          clientName: `${data.firstName} ${data.lastName}`,
          originalData: variables.data,
        });

        // Оновлюємо кеш списку клієнтів
        queryClient.invalidateQueries({ queryKey: ['getAllClients'] });

        // Додаємо до кешу окремого клієнта
        if (data.id) {
          queryClient.setQueryData(['getClientById', data.id], data);
        }
      },
      onError: (error: Error, variables) => {
        logError('Помилка створення клієнта:', error, variables);
      },
    },
  });

  // ✏️ Оновлення клієнта
  const updateMutation = useUpdateClient({
    mutation: {
      onMutate: async (variables) => {
        logInfo('Оновлення клієнта...', variables);

        // Оптимістичне оновлення
        const previousClient = queryClient.getQueryData(['getClientById', variables.id]);

        if (previousClient) {
          queryClient.setQueryData(['getClientById', variables.id], {
            ...previousClient,
            ...variables.data,
          });
        }

        return { previousClient };
      },
      onSuccess: (data, variables) => {
        logInfo('Клієнт оновлений успішно:', data);

        // Оновлюємо кеш
        queryClient.invalidateQueries({ queryKey: ['getAllClients'] });
        queryClient.setQueryData(['getClientById', variables.id], data);
      },
      onError: (error: Error, variables, context) => {
        logError('Помилка оновлення клієнта:', error);

        // Відкочуємо оптимістичне оновлення
        if (context?.previousClient) {
          queryClient.setQueryData(['getClientById', variables.id], context.previousClient);
        }
      },
    },
  });

  // 🗑️ Видалення клієнта
  const deleteMutation = useDeleteClient({
    mutation: {
      onMutate: (variables) => {
        logInfo('Видалення клієнта...', variables);
      },
      onSuccess: (data, variables) => {
        logInfo('Клієнт видалений успішно:', variables.id);

        // Видаляємо з кешу
        queryClient.removeQueries({ queryKey: ['getClientById', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['getAllClients'] });
      },
      onError: (error: Error, variables) => {
        logError('Помилка видалення клієнта:', error, variables);
      },
    },
  });

  /**
   * 📋 Отримання клієнта по ID (утиліта)
   */
  const getClientById = useCallback(
    (id: string, options?: { enabled?: boolean }) => {
      return getClientByIdQuery(id, {
        query: {
          enabled: options?.enabled ?? !!id,
          staleTime: 10 * 60 * 1000, // 10 хвилин кеш для окремого клієнта
        },
      });
    },
    [getClientByIdQuery]
  );

  /**
   * 🔍 М'яка валідація (без викидання помилок)
   */
  const validateClientDataSoft = useCallback((clientData: ClientFormData) => {
    // М'яка валідація через safeValidate
    const apiValidation = safeValidate(createClientBody, clientData);
    const formValidation = safeValidate(clientFormSchema, clientData);

    return {
      isApiValid: apiValidation.success,
      isFormValid: formValidation.success,
      apiErrors: apiValidation.success ? [] : apiValidation.errors,
      formErrors: formValidation.success ? [] : formValidation.errors,
    };
  }, []);

  /**
   * 🔍 Простий пошук клієнтів (покращений з м'якою валідацією)
   */
  const searchClients = useCallback(
    async (keyword: string) => {
      // М'яка валідація параметрів пошуку
      const searchSchema = z.object({
        keyword: z.string().min(1, 'Введіть пошуковий запит'),
      });

      const validation = safeValidate(searchSchema, { keyword });
      if (!validation.success) {
        logWarning('Невалідні параметри пошуку:', validation.errors);
        return { data: [], error: validation.errors.join(', ') };
      }

      try {
        // Виконуємо пошук через refetch з новими параметрами
        const result = await queryClient.fetchQuery({
          queryKey: ['searchClients', keyword],
          queryFn: () => searchClientsQuery.refetch(),
          staleTime: 2 * 60 * 1000,
        });
        return { data: result.data || [], error: null };
      } catch (error) {
        logWarning('Помилка пошуку:', error);
        return { data: [], error: String(error) };
      }
    },
    [searchClientsQuery, queryClient, logWarning]
  );

  /**
   * 🔍 Розширений пошук з пагінацією (з м'якою валідацією)
   */
  const searchClientsWithPagination = useCallback(
    async (searchParams: { query: string; page?: number; size?: number }) => {
      // М'яка валідація через safeValidate
      const validation = safeValidate(searchClientsWithPaginationBody, searchParams);
      if (!validation.success) {
        logError('API валідація пошуку не пройшла:', validation.errors);
        throw new Error(validation.errors.join(', '));
      }

      const searchRequest: ClientSearchRequest = {
        query: searchParams.query,
        page: searchParams.page || 0,
        size: searchParams.size || 20,
      };

      return searchWithPaginationMutation.mutateAsync({ data: searchRequest });
    },
    [searchWithPaginationMutation, logError]
  );

  /**
   * ➕ Створення клієнта з покращеною валідацією
   */
  const createClient = useCallback(
    async (clientData: ClientFormData) => {
      try {
        // Валідація через доменний сервіс
        const validation = validationService.validateClientData(clientData);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '));
        }

        // Валідація через clientFormSchema з validateOrThrow
        validateOrThrow(clientFormSchema, clientData);

        // Додаткова валідація через API схему
        validateOrThrow(createClientBody, clientData);

        // Перетворення UI даних в API формат
        const apiData: CreateClientRequest = {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          phone: clientData.phone,
          email: clientData.email || undefined,
          address: clientData.address,
          source: clientData.source,
          sourceDetails: clientData.sourceDetails,
          structuredAddress: clientData.structuredAddress,
          communicationChannels: clientData.communicationChannels,
        };

        return createMutation.mutateAsync({ data: apiData });
      } catch (error) {
        logError('Валідація клієнта не пройшла:', error);
        throw error;
      }
    },
    [createMutation, validationService, logError]
  );

  /**
   * ✏️ Оновлення клієнта з покращеною валідацією та частковими схемами
   */
  const updateClient = useCallback(
    async (id: string, clientData: Partial<ClientFormData>) => {
      try {
        // Валідація через доменний сервіс
        const validation = validationService.validateUpdateClientData(clientData as ClientFormData);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '));
        }

        // Валідація через часткову API схему з createPartialSchema
        const partialUpdateSchema = createPartialSchema(updateClientBody);
        validateOrThrow(partialUpdateSchema, clientData);

        // Безпечне створення API даних з перевіркою наявності полів
        const apiData: UpdateClientRequest = {
          firstName: clientData.firstName || '',
          lastName: clientData.lastName || '',
          phone: clientData.phone || '',
          email: clientData.email,
          address: clientData.address,
          source: clientData.source,
          sourceDetails: clientData.sourceDetails,
          structuredAddress: clientData.structuredAddress,
          communicationChannels: clientData.communicationChannels,
        };

        return updateMutation.mutateAsync({ id, data: apiData });
      } catch (error) {
        logError('Валідація оновлення клієнта не пройшла:', error);
        throw error;
      }
    },
    [updateMutation, validationService, logError]
  );

  /**
   * 🗑️ Видалення клієнта з підтвердженням
   */
  const deleteClient = useCallback(
    async (id: string, confirm = false) => {
      if (!confirm) {
        throw new Error('Підтвердьте видалення клієнта');
      }

      return deleteMutation.mutateAsync({ id });
    },
    [deleteMutation]
  );

  /**
   * 🔄 Оновлення кешу клієнтів
   */
  const refreshClients = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['getAllClients'] });
    logInfo('Кеш клієнтів оновлено');
  }, [queryClient, logInfo]);

  /**
   * 📋 Ручне завантаження всіх клієнтів (якщо потрібно)
   */
  const loadAllClients = useCallback(() => {
    return allClientsQuery.refetch();
  }, [allClientsQuery]);

  /**
   * 📊 Статистика операцій
   */
  const getOperationsState = useCallback(
    (): ClientOperationsState => ({
      selectedClient: null, // Буде керуватися окремим хуком
      isCreating: createMutation.isPending,
      isUpdating: updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
      operationError:
        createMutation.error?.message ||
        updateMutation.error?.message ||
        deleteMutation.error?.message ||
        null,
    }),
    [createMutation, updateMutation, deleteMutation]
  );

  return {
    // Дані
    allClients: allClientsQuery.data || [],
    isLoadingClients: allClientsQuery.isLoading,
    clientsError: allClientsQuery.error?.message || null,

    // Пошук
    searchResults: searchWithPaginationMutation.data?.content || [],
    isSearching: searchWithPaginationMutation.isPending || searchClientsQuery.isFetching,
    searchError:
      searchWithPaginationMutation.error?.message || searchClientsQuery.error?.message || null,

    // Операції
    ...getOperationsState(),

    // Методи
    getClientById,
    validateClientDataSoft,
    searchClients,
    searchClientsWithPagination,
    createClient,
    updateClient,
    deleteClient,
    refreshClients,
    loadAllClients,

    // Утиліти
    clearSearchResults: () => searchWithPaginationMutation.reset(),
    clearErrors: () => {
      createMutation.reset();
      updateMutation.reset();
      deleteMutation.reset();
      searchWithPaginationMutation.reset();
    },

    // React Query утиліти
    queryClient,
  };
}
