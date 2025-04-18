import { useQuery } from '@tanstack/react-query';
import {
  getClients,
  searchClients,
  ClientSearchRequest,
} from '../api/clientsApi';
import { ClientResponse } from '../types';
import { Page } from '@/types';

// Хук для отримання всіх клієнтів
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Хук для пошуку клієнтів з пагінацією
export const useSearchClients = (searchParams: ClientSearchRequest) => {
  return useQuery<Page<ClientResponse>, Error>({
    queryKey: ['clients', 'search', searchParams],
    queryFn: () => searchClients(searchParams),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: true,
  });
};
