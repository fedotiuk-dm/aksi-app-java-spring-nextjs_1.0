// Тонка обгортка над Orval хуками для Stage1 Client Creation - Створення нових клієнтів
// МІНІМАЛЬНА логіка, максимальне використання готових Orval можливостей

import { useMemo } from 'react';

// Orval хуки (готові з бекенду)
import {
  useStage1CreateClient,
  useStage1InitializeNewClient,
  useStage1CompleteClientCreation,
  useStage1GetClientFormData,
  useStage1UpdateClientData,
  useStage1ValidateClientForm,
} from '../../../../shared/api/generated/stage1';

// Локальні імпорти
import { useClientCreationStore } from './client-creation.store';

// =================== ТОНКА ОБГОРТКА ===================
export const useClientCreation = () => {
  // UI стан з Zustand
  const uiState = useClientCreationStore();

  // Orval API хуки (без додаткової логіки)
  const createClientMutation = useStage1CreateClient();
  const initializeNewClientMutation = useStage1InitializeNewClient();
  const completeCreationMutation = useStage1CompleteClientCreation();
  const updateClientDataMutation = useStage1UpdateClientData();
  const validateFormMutation = useStage1ValidateClientForm();

  // Запити даних
  const formDataQuery = useStage1GetClientFormData(uiState.sessionId || '', {
    query: { enabled: !!uiState.sessionId },
  });

  // Стан завантаження (простий)
  const loading = useMemo(
    () => ({
      isCreating: createClientMutation.isPending,
      isInitializing: initializeNewClientMutation.isPending,
      isCompleting: completeCreationMutation.isPending,
      isUpdating: updateClientDataMutation.isPending,
      isValidating: validateFormMutation.isPending,
      isLoadingFormData: formDataQuery.isLoading,
      isLoading:
        createClientMutation.isPending ||
        initializeNewClientMutation.isPending ||
        completeCreationMutation.isPending ||
        updateClientDataMutation.isPending ||
        validateFormMutation.isPending,
    }),
    [
      createClientMutation.isPending,
      initializeNewClientMutation.isPending,
      completeCreationMutation.isPending,
      updateClientDataMutation.isPending,
      validateFormMutation.isPending,
      formDataQuery.isLoading,
    ]
  );

  // =================== ПОВЕРНЕННЯ (ГРУПУВАННЯ) ===================
  return {
    // UI стан (прямо з Zustand)
    ui: uiState,

    // API дані (прямо з Orval)
    data: {
      createdClient: createClientMutation.data,
      initializationData: initializeNewClientMutation.data,
      completionData: completeCreationMutation.data,
      formData: formDataQuery.data,
      validationResult: validateFormMutation.data,
    },

    // Стан завантаження
    loading,

    // API мутації (прямо з Orval)
    mutations: {
      createClient: createClientMutation,
      initializeNewClient: initializeNewClientMutation,
      completeCreation: completeCreationMutation,
      updateClientData: updateClientDataMutation,
      validateForm: validateFormMutation,
    },

    // Запити (прямо з Orval)
    queries: {
      formData: formDataQuery,
    },
  };
};

// =================== ТИПИ ===================
export type UseClientCreationReturn = ReturnType<typeof useClientCreation>;
