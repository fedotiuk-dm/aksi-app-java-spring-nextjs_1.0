import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ClientResponse, ClientSearchRequest, ClientCreateRequest } from '@/lib/api';
import { ClientsService } from '@/lib/api';
import { ClientFormValues } from '../model/types';

/**
 * Хук для пошуку клієнтів
 */
export const useSearchClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<ClientResponse[]>([]);

  const searchMutation = useMutation({
    mutationFn: async (term: string) => {
      const searchRequest: ClientSearchRequest = {
        search: term,
        page: 0,
        size: 10
      };
      
      // Використовуємо згенерований OpenAPI клієнт
      const response = await ClientsService.searchClients({
        requestBody: searchRequest
      });
      
      return response;
    },
    onSuccess: (data) => {
      // Переконуємося, що повертаємо масив, навіть якщо content є undefined
      setClients(data.content || []);
    }
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    searchMutation.mutate(term);
  };

  return {
    searchTerm,
    clients,
    isLoading: searchMutation.isPending,
    isError: searchMutation.isError,
    error: searchMutation.error,
    handleSearch
  };
};

/**
 * Хук для отримання клієнта за ID
 */
export const useGetClient = (clientId?: string) => {
  const getClient = async (clientId: string) => {
    try {
      // Отримуємо клієнта за ID через API
      const response = await ClientsService.getClientById({
        id: clientId
      });
      return response;
    } catch (error) {
      console.error('Помилка при отриманні клієнта:', error);
      return null;
    }
  };

  return useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      if (!clientId) throw new Error("Client ID is required");
      return getClient(clientId);
    },
    enabled: !!clientId, // Запит буде виконуватись тільки якщо є clientId
  });
};

/**
 * Хук для створення нового клієнта
 */
export const useCreateClient = () => {
  const createClient = async (data: ClientFormValues) => {
    try {
      // Формуємо запит для створення клієнта
      const createRequest: ClientCreateRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || undefined,
        address: data.address || undefined,
        communicationChannels: data.communicationChannels,
        source: data.source,
        notes: data.notes || undefined,
        birthDate: data.birthDate
      };

      // Відправляємо запит на створення клієнта
      const response = await ClientsService.createClient({
        requestBody: createRequest
      });

      return response;
    } catch (error) {
      console.error('Помилка при створенні клієнта:', error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: async (formValues: ClientFormValues): Promise<ClientResponse> => {
      return createClient(formValues);
    }
  });
};
