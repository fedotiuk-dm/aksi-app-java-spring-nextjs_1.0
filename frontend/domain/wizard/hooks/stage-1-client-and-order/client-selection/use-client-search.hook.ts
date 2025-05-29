import { useMutation } from '@tanstack/react-query';

import { searchClientsWithPagination } from '@/shared/api/generated/client';

import { ClientService } from '../../../services/stage-1-client-and-order/client-selection/client.service';

import type {
  ClientSearchRequest,
  ClientPageResponse,
} from '@/shared/api/generated/client/aksiApi.schemas';

const clientService = new ClientService();

/**
 * Хук для пошуку клієнтів по серверу
 * Відповідальність: тільки пошук через API
 */
export const useClientSearch = () => {
  const mutation = useMutation({
    mutationFn: (searchRequest: ClientSearchRequest) => searchClientsWithPagination(searchRequest),
  });

  return {
    ...mutation,
    clients: mutation.data?.content || [],
    searchClients: mutation.mutate,
  };
};
