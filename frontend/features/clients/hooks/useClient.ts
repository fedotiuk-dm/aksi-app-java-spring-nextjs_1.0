import { useQuery } from '@tanstack/react-query';
import { getClientById } from '../api/clientsApi';

export const useClient = (clientId: string) => {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId,
  });
};
