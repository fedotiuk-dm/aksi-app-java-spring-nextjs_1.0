import { useCallback } from 'react';

import { useClientCreation } from './use-client-creation.hook';
import { useClientEditing } from './use-client-editing.hook';
import { useClientSearch } from './use-client-search.hook';
import { useClientSelection } from './use-client-selection.hook';
import { useClientDomainStore } from '../store/client-store';
import { CreateClientFormData, UpdateClientFormData } from '../types';

/**
 * Хук для дій з клієнтами в CLIENT_SELECTION кроці
 *
 * SOLID принципи:
 * - Single Responsibility: тільки дії з клієнтами
 * - Interface Segregation: спеціалізований API для операцій
 * - Dependency Inversion: залежить від domain хуків
 * - Composition: композиція спеціалізованих хуків
 */
export const useClientStepActions = () => {
  const {
    createAndSelect,
    editAndSelect,
    searchAndSelect,
    startClientEditing,
    startClientCreation,
    startClientSelection,
    deleteClient,
  } = useClientDomainStore();

  const clientSearch = useClientSearch();
  const clientSelection = useClientSelection();
  const clientCreation = useClientCreation();
  const clientEditing = useClientEditing();

  /**
   * Швидкий пошук та вибір клієнта
   */
  const quickSearchAndSelect = useCallback(
    async (searchTerm: string) => {
      try {
        await searchAndSelect(searchTerm);
      } catch (error) {
        console.error('Помилка швидкого пошуку:', error);
      }
    },
    [searchAndSelect]
  );

  /**
   * Створення нового клієнта
   */
  const createClient = useCallback(
    async (clientData: CreateClientFormData) => {
      try {
        await createAndSelect(clientData);
      } catch (error) {
        console.error('Помилка створення клієнта:', error);
      }
    },
    [createAndSelect]
  );

  /**
   * Редагування клієнта
   */
  const editClient = useCallback(
    async (clientData: UpdateClientFormData) => {
      try {
        await editAndSelect(clientData);
      } catch (error) {
        console.error('Помилка редагування клієнта:', error);
      }
    },
    [editAndSelect]
  );

  return {
    // Операції пошуку
    search: clientSearch.handleDirectSearch,
    clearSearch: clientSearch.handleClear,
    quickSearchAndSelect,
    searchResults: clientSearch.results,

    // Операції вибору
    selectClient: clientSelection.selectClient,
    clearSelection: clientSelection.clearSelection,
    deleteClient,

    // Переключення режимів
    switchToCreate: startClientCreation,
    switchToEdit: startClientEditing,
    switchToSelect: startClientSelection,

    // Операції створення
    createClient,
    creationState: {
      isLoading: clientCreation.isLoading,
      error: clientCreation.error,
      formData: clientCreation.formData,
    },

    // Операції редагування
    editClient,
    startEditing: startClientEditing,
    editingState: {
      isLoading: clientEditing.isLoading,
      error: clientEditing.error,
      formData: clientEditing.formData,
      originalClient: clientEditing.originalClient,
    },

    // Доступ до підхуків для складних випадків
    clientSearch,
    clientSelection,
    clientCreation,
    clientEditing,
  };
};
