import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  ClientsService,
  ClientResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from '@/lib/api';

import { CreateClient, EditClient } from '../schemas';
import { CreateClientResult, UpdateClientResult } from './use-client-form-types';

/**
 * Хук для роботи з мутаціями клієнта
 * Відповідає за створення та оновлення клієнта через API
 */
export const useClientMutations = () => {
  const queryClient = useQueryClient();

  // Мутація для створення клієнта
  const createClientMutation = useMutation<ClientResponse, Error, CreateClient>({
    mutationFn: async (data: CreateClient): Promise<ClientResponse> => {
      console.log('✅ Створення клієнта - вхідні дані:', JSON.stringify(data, null, 2));

      // Конвертація в формат API запиту
      const request: CreateClientRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || '',
        email: data.email || undefined,
        // Використовуємо адресу як рядок
        address: typeof data.address === 'string' ? data.address : undefined,
        // Беремо перше значення з масиву джерел або undefined
        source:
          Array.isArray(data.source) && data.source.length > 0
            ? (data.source[0] as CreateClientRequest.source)
            : undefined,
        sourceDetails: data.sourceDetails || undefined,
      };

      console.log('✅ Запит на створення клієнта:', JSON.stringify(request, null, 2));
      console.log('✅ Використовуємо ClientsService.createClient() з OpenAPI');

      try {
        const response = await ClientsService.createClient({ requestBody: request });
        console.log('✅ Успішна відповідь від API:', response);
        return response;
      } catch (error) {
        console.error('❌ Помилка при створенні клієнта:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Інвалідуємо кеш для оновлення списку клієнтів
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  // Мутація для оновлення клієнта
  const updateClientMutation = useMutation<
    ClientResponse,
    Error,
    { data: EditClient; clientId: string }
  >({
    mutationFn: async ({ data, clientId }): Promise<ClientResponse> => {
      console.log('✅ Оновлення клієнта - вхідні дані:', JSON.stringify(data, null, 2));
      console.log('✅ ID клієнта для оновлення:', clientId);

      if (!clientId) throw new Error('Client ID is required for update');

      // Конвертація в формат API запиту
      const request: UpdateClientRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || '',
        email: data.email || undefined,
        // Використовуємо адресу як рядок
        address: typeof data.address === 'string' ? data.address : undefined,
        // Беремо перше значення з масиву джерел або undefined
        source:
          Array.isArray(data.source) && data.source.length > 0
            ? (data.source[0] as CreateClientRequest.source)
            : undefined,
        sourceDetails: data.sourceDetails || undefined,
      };

      console.log('✅ Запит на оновлення клієнта:', JSON.stringify(request, null, 2));
      console.log('✅ Використовуємо ClientsService.updateClient() з OpenAPI');

      try {
        const response = await ClientsService.updateClient({
          id: clientId,
          requestBody: request,
        });
        console.log('✅ Успішна відповідь від API при оновленні клієнта:', response);
        return response;
      } catch (error) {
        console.error('❌ Помилка при оновленні клієнта:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Інвалідуємо кеш для оновлення списку клієнтів
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  // Функція для створення клієнта з обробкою помилок
  const createClient = async (data: CreateClient): Promise<CreateClientResult> => {
    try {
      const client = await createClientMutation.mutateAsync(data);
      return { client, error: null };
    } catch (error) {
      console.error('❌ Помилка при створенні клієнта:', error);
      return {
        client: null as unknown as ClientResponse, // Для сумісності типів
        error: error instanceof Error ? error.message : 'Помилка при створенні клієнта',
      };
    }
  };

  // Функція для оновлення клієнта з обробкою помилок
  const updateClient = async (data: EditClient, clientId: string): Promise<UpdateClientResult> => {
    try {
      const client = await updateClientMutation.mutateAsync({ data, clientId });
      return { client, error: null };
    } catch (error) {
      console.error('❌ Помилка при оновленні клієнта:', error);
      return {
        client: null as unknown as ClientResponse, // Для сумісності типів
        error: error instanceof Error ? error.message : 'Помилка при оновленні клієнта',
      };
    }
  };

  return {
    createClient,
    updateClient,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
  };
};
