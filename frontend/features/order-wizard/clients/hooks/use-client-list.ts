import { useQuery } from '@tanstack/react-query';
import { ClientsService } from '@/lib/api';
import { Client } from '@/features/order-wizard/model/types/types';
import { mapApiClientToModelClient } from '../utils/client.mappers';

const QUERY_KEYS = {
  all: ['clients'] as const,
  details: (id: string) => [...QUERY_KEYS.all, id] as const,
};

export const useClientList = () => {
  return useQuery<Client[]>({
    queryKey: QUERY_KEYS.all,
    queryFn: async () => {
      const response = await ClientsService.getAllClients();
      return Array.isArray(response)
        ? response.map(mapApiClientToModelClient)
        : [];
    },
  });
};

export const useClient = (id: string) => {
  return useQuery<Client>({
    queryKey: QUERY_KEYS.details(id),
    queryFn: async () => {
      const response = await ClientsService.getClientById({ id });
      return mapApiClientToModelClient(response);
    },
    enabled: !!id,
  });
};
