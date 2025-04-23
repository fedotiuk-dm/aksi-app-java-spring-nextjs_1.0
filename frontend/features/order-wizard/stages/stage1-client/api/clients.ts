import { useMutation, useQuery } from '@tanstack/react-query';
import { ClientsService } from '@/lib/api';
import { ClientCreateRequest, 
  ClientResponse, 
  ClientSearchRequest, 
  ClientUpdateRequest, 
  PageClientResponse } from '@/lib/api';

/**
 * Хук для пошуку клієнтів
 */
export const useSearchClients = () => {
  return useMutation({
    mutationKey: ['searchClients'],
    mutationFn: async (request: ClientSearchRequest): Promise<PageClientResponse> => {
      return await ClientsService.searchClients({ requestBody: request });
    }
  });
};

/**
 * Хук для отримання клієнта за ID
 */
export const useGetClient = (clientId: string | null) => {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: async (): Promise<ClientResponse | null> => {
      if (!clientId) return null;
      return await ClientsService.getClientById({ id: clientId });
    },
    enabled: !!clientId
  });
};

/**
 * Хук для створення нового клієнта
 */
export const useCreateClient = () => {
  return useMutation({
    mutationKey: ['createClient'],
    mutationFn: async (client: ClientCreateRequest): Promise<ClientResponse> => {
      return await ClientsService.createClient({ requestBody: client });
    }
  });
};

/**
 * Хук для оновлення даних клієнта
 */
export const useUpdateClient = () => {
  return useMutation({
    mutationKey: ['updateClient'],
    mutationFn: async ({ id, client }: { id: string; client: ClientUpdateRequest }): Promise<ClientResponse> => {
      return await ClientsService.updateClient({ id, requestBody: client });
    }
  });
};
