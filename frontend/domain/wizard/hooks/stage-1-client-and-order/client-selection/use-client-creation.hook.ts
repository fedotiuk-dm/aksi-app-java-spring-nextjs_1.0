import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createClient } from '@/shared/api/generated/client';

import { useClientSelection } from './use-client-selection.hook';
import { ClientService } from '../../../services/stage-1-client-and-order/client-selection/client.service';

import type { CreateClientRequest } from '@/shared/api/generated/client/aksiApi.schemas';

const clientService = new ClientService();

/**
 * Хук для створення нового клієнта
 * Відповідальність: створення клієнта та автоматичний вибір
 */
export const useClientCreation = () => {
  const queryClient = useQueryClient();
  const { selectClient } = useClientSelection();

  const mutation = useMutation({
    mutationFn: (clientData: CreateClientRequest) => createClient(clientData),
    onSuccess: (response) => {
      // Інвалідуємо кеш пошуку клієнтів
      queryClient.invalidateQueries({ queryKey: ['clients'] });

      // Автоматично вибираємо щойно створеного клієнта
      if (response) {
        selectClient(response);
      }
    },
  });

  const createAndSelectClient = (clientData: CreateClientRequest) => {
    const validation = clientService.validateClientData(clientData);

    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    mutation.mutate(clientData);
  };

  return {
    ...mutation,
    createAndSelectClient,
    isCreating: mutation.isPending,
  };
};
