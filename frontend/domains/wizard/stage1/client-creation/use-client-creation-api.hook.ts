/**
 * @fileoverview API хук для домену "Створення клієнта"
 *
 * Відповідальність: тільки API операції з backend
 * Принцип: Single Responsibility Principle
 */

import { useCallback } from 'react';

// Orval API хуки та типи
import {
  useStage1InitializeNewClient,
  useStage1GetClientFormData,
  useStage1GetClientFormState,
  useStage1UpdateClientData,
  useStage1ValidateClientForm,
  useStage1CreateClient,
  useStage1CompleteClientCreation,
  useStage1CancelClientCreation,
  type Stage1UpdateClientDataMutationBody,
} from '@/shared/api/generated/wizard/aksiApi';

import type { ClientCreationUIFormData } from './client-creation.schemas';

const SESSION_ID_REQUIRED_ERROR = 'Session ID is required';

/**
 * Хук для API операцій створення клієнта
 * Інкапсулює всі серверні взаємодії
 */
export const useClientCreationAPI = (sessionId: string | null) => {
  // API мутації (викликаються на верхньому рівні)
  const initializeNewClientMutation = useStage1InitializeNewClient();
  const updateClientDataMutation = useStage1UpdateClientData();
  const validateClientFormMutation = useStage1ValidateClientForm();
  const createClientMutation = useStage1CreateClient();
  const completeClientCreationMutation = useStage1CompleteClientCreation();
  const cancelClientCreationMutation = useStage1CancelClientCreation();

  // API запити для даних (викликаються на верхньому рівні з sessionId)
  const clientFormDataQuery = useStage1GetClientFormData(sessionId || '', {
    query: {
      enabled: !!sessionId,
      refetchOnWindowFocus: false,
    },
  });

  const clientFormStateQuery = useStage1GetClientFormState(sessionId || '', {
    query: {
      enabled: !!sessionId,
      refetchInterval: 2000, // Поллінг для відстеження стану
      refetchOnWindowFocus: false,
    },
  });

  // Обгортки для мутацій з error handling
  const initializeNewClient = useCallback(async () => {
    try {
      return await initializeNewClientMutation.mutateAsync();
    } catch (error) {
      console.error('API Error - Failed to initialize new client:', error);
      throw error;
    }
  }, [initializeNewClientMutation]);

  const updateClientData = useCallback(
    async (data: Partial<ClientCreationUIFormData>) => {
      if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

      try {
        return await updateClientDataMutation.mutateAsync({
          sessionId,
          data: data as Stage1UpdateClientDataMutationBody,
        });
      } catch (error) {
        console.error('API Error - Failed to update client data:', error);
        throw error;
      }
    },
    [sessionId, updateClientDataMutation]
  );

  const validateForm = useCallback(async () => {
    if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

    try {
      return await validateClientFormMutation.mutateAsync({ sessionId });
    } catch (error) {
      console.error('API Error - Failed to validate form:', error);
      throw error;
    }
  }, [sessionId, validateClientFormMutation]);

  const createClient = useCallback(async () => {
    if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

    try {
      return await createClientMutation.mutateAsync({ sessionId });
    } catch (error) {
      console.error('API Error - Failed to create client:', error);
      throw error;
    }
  }, [sessionId, createClientMutation]);

  const completeCreation = useCallback(async () => {
    if (!sessionId) throw new Error(SESSION_ID_REQUIRED_ERROR);

    try {
      return await completeClientCreationMutation.mutateAsync({ sessionId });
    } catch (error) {
      console.error('API Error - Failed to complete client creation:', error);
      throw error;
    }
  }, [sessionId, completeClientCreationMutation]);

  const cancelCreation = useCallback(async () => {
    if (!sessionId) return;

    try {
      return await cancelClientCreationMutation.mutateAsync({ sessionId });
    } catch (error) {
      console.error('API Error - Failed to cancel client creation:', error);
      throw error;
    }
  }, [sessionId, cancelClientCreationMutation]);

  return {
    // Операції
    operations: {
      initializeNewClient,
      updateClientData,
      validateForm,
      createClient,
      completeCreation,
      cancelCreation,
    },

    // Стани завантаження
    loading: {
      isInitializing: initializeNewClientMutation.isPending,
      isUpdating: updateClientDataMutation.isPending,
      isValidating: validateClientFormMutation.isPending,
      isCreating: createClientMutation.isPending,
      isCompleting: completeClientCreationMutation.isPending,
      isCancelling: cancelClientCreationMutation.isPending,
      isLoadingFormData: clientFormDataQuery.isFetching,
      isLoadingFormState: clientFormStateQuery.isFetching,
    },

    // API дані
    data: {
      clientFormData: clientFormDataQuery.data,
      formState: clientFormStateQuery.data,
      createdClient: createClientMutation.data,
    },
  };
};

export type UseClientCreationAPIReturn = ReturnType<typeof useClientCreationAPI>;
