import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Client } from '@/features/order-wizard/clients/types/client.types';
import {
  ClientsService,
  CreateClientRequest,
  UpdateClientRequest,
} from '@/lib/api';

import { clientSchema } from '../schemas/client.schema';
import {
  mapApiClientToModelClient,
  mapSourceToApiSource,
  formatAddress,
} from '../utils/client.mappers';

const QUERY_KEYS = {
  all: ['clients'] as const,
  details: (id: string) => [...QUERY_KEYS.all, id] as const,
  search: (keyword: string) => [...QUERY_KEYS.all, 'search', keyword] as const,
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Client,
    Error,
    Omit<Client, 'id'>,
    { previousClients: Client[] | undefined }
  >({
    mutationFn: async (clientData) => {
      const validationResult = clientSchema.safeParse(clientData);
      if (!validationResult.success) {
        throw new Error(
          validationResult.error.errors
            .map((err) => `${err.path.join('.')}: ${err.message}`)
            .join(', ')
        );
      }

      // Перевірка, що обов'язкові поля існують (вони вже валідовані через zod схему вище)
      const requestBody: CreateClientRequest = {
        firstName: clientData.firstName || '',
        lastName: clientData.lastName || '',
        phone: clientData.phone || '',
        email: clientData.email,
        address: clientData.address ? formatAddress(clientData.address) : undefined,
        communicationChannels: clientData.communicationChannels,
        source: mapSourceToApiSource(clientData.source || 'OTHER'),
        sourceDetails: clientData.sourceDetails,
      };
      const response = await ClientsService.createClient({ requestBody });
      return mapApiClientToModelClient(response);
    },
    onMutate: async (newClient) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.all });
      const previousClients = queryClient.getQueryData<Client[]>(
        QUERY_KEYS.all
      );

      queryClient.setQueryData<Client[]>(QUERY_KEYS.all, (old) => {
        const tempClient: Client = {
          ...newClient,
          id: crypto.randomUUID() as Client['id'],
        };
        return old ? [...old, tempClient] : [tempClient];
      });

      return { previousClients };
    },
    onError: (_err, _newClient, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(QUERY_KEYS.all, context.previousClients);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Client,
    Error,
    Client,
    { previousClient: Client | undefined }
  >({
    mutationFn: async (clientData) => {
      if (!clientData.id) {
        throw new Error('Client ID is required for update');
      }

      const validationResult = clientSchema.safeParse(clientData);
      if (!validationResult.success) {
        throw new Error(
          validationResult.error.errors
            .map((err) => `${err.path.join('.')}: ${err.message}`)
            .join(', ')
        );
      }

      const requestBody: UpdateClientRequest = {
        firstName: clientData.firstName || '',
        lastName: clientData.lastName || '',
        phone: clientData.phone || '',
        email: clientData.email,
        address: clientData.address ? formatAddress(clientData.address) : undefined,
        communicationChannels: clientData.communicationChannels,
        source: mapSourceToApiSource(clientData.source || 'OTHER'),
        sourceDetails: clientData.sourceDetails,
      };
      const response = await ClientsService.updateClient({
        id: clientData.id,
        requestBody,
      });
      return mapApiClientToModelClient(response);
    },
    onMutate: async (updatedClient) => {
      if (!updatedClient.id) return { previousClient: undefined };

      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.all });
      const previousClient = queryClient.getQueryData<Client>(
        QUERY_KEYS.details(updatedClient.id)
      );

      queryClient.setQueryData<Client>(
        QUERY_KEYS.details(updatedClient.id),
        updatedClient
      );

      return { previousClient };
    },
    onError: (err, updatedClient, context) => {
      if (context?.previousClient && updatedClient.id) {
        queryClient.setQueryData(
          QUERY_KEYS.details(updatedClient.id),
          context.previousClient
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.details(data.id),
        });
      }
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    string,
    { previousClients: Client[] | undefined }
  >({
    mutationFn: async (id) => {
      await ClientsService.deleteClient({ id });
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.all });
      const previousClients = queryClient.getQueryData<Client[]>(
        QUERY_KEYS.all
      );

      queryClient.setQueryData<Client[]>(QUERY_KEYS.all, (old) => {
        return old ? old.filter((client) => client.id !== deletedId) : [];
      });

      return { previousClients };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(QUERY_KEYS.all, context.previousClients);
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.details(id) });
    },
  });
};
