/**
 * Хуки для роботи з API клієнтів
 */
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
      // Переконуємось, що використовується поле 'search', а не 'searchText'
      if ('searchText' in request) {
        // Якщо знайдено поле 'searchText', конвертуємо його в 'search'
        const { searchText, ...rest } = request as unknown as { searchText: string } & Omit<ClientSearchRequest, 'search'>;
        request = { ...rest, search: searchText } as ClientSearchRequest;
      }
      
      // Додаткова перевірка на випадок, якщо request.searchQuery існує, але request.search не існує
      if ('searchQuery' in request && !('search' in request)) {
        const { searchQuery, ...rest } = request as unknown as { searchQuery: string } & Omit<ClientSearchRequest, 'search'>;
        request = { ...rest, search: searchQuery } as ClientSearchRequest;
      }
      
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
