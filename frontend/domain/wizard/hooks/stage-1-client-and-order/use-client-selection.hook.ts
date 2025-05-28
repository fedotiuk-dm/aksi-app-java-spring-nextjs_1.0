'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';

// API imports з Orval
import {
  useSearchClients,
  useCreateClient,
  useGetAllClients,
  type ClientResponse,
  type CreateClientRequest,
  type SearchClientsParams,
} from '@/shared/api/generated/client';

// Wizard types та store
import { useWizardStore } from '../../store/wizard.store';
import { ValidationStatus } from '../../types';

import type { ClientSearchResult } from '../../types';

/**
 * Інтерфейс для стану створення клієнта
 */
export interface ClientCreationState {
  isCreating: boolean;
  isSuccess: boolean;
  isError: boolean;
  createdClient?: ClientResponse;
  errorMessage?: string;
}

/**
 * Інтерфейс для стану пошуку клієнтів
 */
export interface ClientSearchState {
  clients: ClientResponse[];
  isLoading: boolean;
  isError: boolean;
  total: number;
  searchTerm: string;
}

/**
 * Результат валідації кроку вибору клієнта
 */
export interface ClientSelectionValidation {
  isValid: boolean;
  validationStatus: ValidationStatus;
  details: {
    clientSelected: boolean;
    clientDataComplete: boolean;
  };
  errors: string[];
}

/**
 * Хук для управління вибором та створенням клієнтів (крок 1.1)
 *
 * Відповідає за:
 * 1. Пошук існуючих клієнтів
 * 2. Створення нових клієнтів
 * 3. Вибір клієнта для замовлення
 * 4. Валідацію вибору клієнта
 * 5. Інтеграцію з wizard store
 */
export const useClientSelection = () => {
  const queryClient = useQueryClient();

  // Wizard store
  const {
    selectedClient,
    setSelectedClient,
    clearSelectedClient,
    isNewClient,
    setNewClientFlag,
    addError,
    clearErrors,
  } = useWizardStore();

  // Local state для пошуку
  const [searchTerm, setSearchTerm] = useState<string>('');

  // API хуки з Orval
  const allClientsQuery = useGetAllClients(
    { page: 0, size: 50 },
    {
      query: {
        staleTime: 10 * 60 * 1000, // 10 хвилин
        enabled: !searchTerm, // Завантажуємо всіх клієнтів коли немає пошуку
      },
    }
  );

  const clientSearchQuery = useSearchClients(
    { keyword: searchTerm.trim() } as SearchClientsParams,
    {
      query: {
        enabled: searchTerm.length >= 2,
        staleTime: 5 * 60 * 1000, // 5 хвилин
      },
    }
  );

  const createClientMutation = useCreateClient({
    mutation: {
      onSuccess: (newClient: ClientResponse) => {
        // Автоматично вибираємо новоствореного клієнта
        const clientSearchResult: ClientSearchResult = {
          id: newClient.id || '',
          firstName: newClient.firstName || '',
          lastName: newClient.lastName || '',
          fullName:
            newClient.fullName || `${newClient.firstName || ''} ${newClient.lastName || ''}`.trim(),
          phone: newClient.phone || '',
          email: newClient.email,
          address: newClient.address,
          structuredAddress: newClient.structuredAddress
            ? {
                street: newClient.structuredAddress.street || '',
                city: newClient.structuredAddress.city || '',
                zipCode: newClient.structuredAddress.postalCode,
                country: 'Україна',
              }
            : undefined,
          communicationChannels: newClient.communicationChannels || [],
          source: newClient.source,
          sourceDetails: newClient.sourceDetails,
          createdAt: newClient.createdAt || new Date().toISOString(),
          updatedAt: newClient.updatedAt || new Date().toISOString(),
          orderCount: newClient.orderCount,
        };

        setSelectedClient(clientSearchResult);
        setNewClientFlag(true);

        // Інвалідуємо кеш
        queryClient.invalidateQueries({ queryKey: ['searchClients'] });
        queryClient.invalidateQueries({ queryKey: ['getAllClients'] });

        clearErrors();
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Помилка створення клієнта';
        addError(errorMessage);
      },
    },
  });

  // === ОПЕРАЦІЇ З КЛІЄНТАМИ ===

  /**
   * Пошук клієнтів за ключовим словом
   */
  const searchClients = useCallback(
    (keyword: string) => {
      setSearchTerm(keyword.trim());
      clearErrors();
    },
    [clearErrors]
  );

  /**
   * Очищення пошуку
   */
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  /**
   * Вибір існуючого клієнта
   */
  const selectClient = useCallback(
    (client: ClientResponse) => {
      const clientSearchResult: ClientSearchResult = {
        id: client.id || '',
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        fullName: client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim(),
        phone: client.phone || '',
        email: client.email,
        address: client.address,
        structuredAddress: client.structuredAddress
          ? {
              street: client.structuredAddress.street || '',
              city: client.structuredAddress.city || '',
              zipCode: client.structuredAddress.postalCode,
              country: 'Україна',
            }
          : undefined,
        communicationChannels: client.communicationChannels || [],
        source: client.source,
        sourceDetails: client.sourceDetails,
        createdAt: client.createdAt || new Date().toISOString(),
        updatedAt: client.updatedAt || new Date().toISOString(),
        orderCount: client.orderCount,
      };

      setSelectedClient(clientSearchResult);
      setNewClientFlag(false);
      clearErrors();
    },
    [setSelectedClient, setNewClientFlag, clearErrors]
  );

  /**
   * Створення нового клієнта
   */
  const createClient = useCallback(
    (clientData: CreateClientRequest) => {
      clearErrors();
      createClientMutation.mutate({ data: clientData });
    },
    [createClientMutation, clearErrors]
  );

  /**
   * Очищення вибору клієнта
   */
  const clearClientSelection = useCallback(() => {
    clearSelectedClient();
    setNewClientFlag(false);
    clearErrors();
  }, [clearSelectedClient, setNewClientFlag, clearErrors]);

  // === ВАЛІДАЦІЯ ===

  /**
   * Валідація кроку вибору клієнта
   */
  const validateStep = useCallback((): ClientSelectionValidation => {
    const errors: string[] = [];
    const isClientSelected = !!selectedClient?.id;
    const isClientDataComplete =
      isClientSelected &&
      !!selectedClient.firstName &&
      !!selectedClient.lastName &&
      !!selectedClient.phone;

    if (!isClientSelected) {
      errors.push('Необхідно вибрати або створити клієнта');
    }

    if (isClientSelected && !isClientDataComplete) {
      errors.push("Не всі обов'язкові дані клієнта заповнені");
    }

    const isValid = isClientSelected && isClientDataComplete && errors.length === 0;

    return {
      isValid,
      validationStatus: isValid ? ValidationStatus.VALID : ValidationStatus.INVALID,
      details: {
        clientSelected: isClientSelected,
        clientDataComplete: isClientDataComplete,
      },
      errors,
    };
  }, [selectedClient]);

  /**
   * Завершення кроку вибору клієнта
   */
  const completeStep = useCallback(() => {
    const validation = validateStep();

    if (validation.isValid && selectedClient) {
      return {
        success: true,
        clientId: selectedClient.id,
        client: selectedClient,
        isNewClient,
      };
    }

    // Додаємо помилки валідації до store
    validation.errors.forEach((error) => addError(error));

    return {
      success: false,
      errors: validation.errors,
    };
  }, [validateStep, selectedClient, isNewClient, addError]);

  // === COMPUTED STATE ===

  /**
   * Стан пошуку клієнтів
   */
  const clientSearchState: ClientSearchState = useMemo(() => {
    const isSearchMode = searchTerm.length >= 2;
    const activeQuery = isSearchMode ? clientSearchQuery : allClientsQuery;

    // Отримуємо дані залежно від режиму
    let clients: ClientResponse[] = [];
    if (isSearchMode && clientSearchQuery.data) {
      clients = Array.isArray(clientSearchQuery.data)
        ? clientSearchQuery.data
        : [clientSearchQuery.data];
    } else if (!isSearchMode && allClientsQuery.data) {
      clients = Array.isArray(allClientsQuery.data) ? allClientsQuery.data : [allClientsQuery.data];
    }

    return {
      clients,
      isLoading: activeQuery.isLoading,
      isError: activeQuery.isError,
      total: clients.length,
      searchTerm,
    };
  }, [searchTerm, clientSearchQuery, allClientsQuery]);

  /**
   * Стан створення клієнта
   */
  const clientCreationState: ClientCreationState = useMemo(
    () => ({
      isCreating: createClientMutation.isPending,
      isSuccess: createClientMutation.isSuccess,
      isError: createClientMutation.isError,
      createdClient: createClientMutation.data,
      errorMessage: createClientMutation.error?.message,
    }),
    [createClientMutation]
  );

  /**
   * Валідація поточного стану
   */
  const validation = useMemo(() => validateStep(), [validateStep]);

  // === PUBLIC API ===
  return {
    // Стан
    selectedClient,
    isNewClient,
    clientSearchState,
    clientCreationState,
    validation,

    // Пошук операції
    searchClients,
    clearSearch,

    // Клієнт операції
    selectClient,
    createClient,
    clearClientSelection,

    // Валідація та завершення
    validateStep,
    completeStep,

    // Допоміжні методи
    refetchAllClients: allClientsQuery.refetch,
    refetchSearch: clientSearchQuery.refetch,
  };
};
