import { useQuery } from '@tanstack/react-query';
import { getClients } from '../api/clientsApi';

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
