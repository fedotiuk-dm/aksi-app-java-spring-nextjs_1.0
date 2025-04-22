import { useState } from 'react';
import { ClientResponse } from '@/lib/api';
import { useSearchClients, useCreateClient } from '../api/clients';
import { ClientFormValues } from '../model/types';
import { DEFAULT_CLIENT_FORM_VALUES } from '../model/constants';

export const useClientSelection = () => {
  // Стан для вибраного клієнта
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);
  // Стан для вибору між існуючим клієнтом та створенням нового
  const [isExistingClient, setIsExistingClient] = useState(true);
  // Початкові значення форми клієнта
  const [clientForm, setClientForm] = useState<ClientFormValues>(DEFAULT_CLIENT_FORM_VALUES);

  // Хуки для роботи з API
  const { searchTerm, clients, isLoading: isSearching, handleSearch } = useSearchClients();
  const createClientMutation = useCreateClient();

  // Функція для обробки вибору клієнта зі списку
  const handleSelectClient = (client: ClientResponse | null) => {
    setSelectedClient(client);
  };

  // Функція для переключення між пошуком існуючого клієнта та створенням нового
  const toggleClientMode = () => {
    setIsExistingClient(!isExistingClient);
    if (isExistingClient) {
      // Якщо переключаємося на створення нового клієнта, скидаємо вибраного клієнта
      setSelectedClient(null);
    }
  };

  // Функція для обробки змін у формі клієнта
  const handleClientFormChange = (values: Partial<ClientFormValues>) => {
    setClientForm(prev => ({ ...prev, ...values }));
  };

  // Функція для створення нового клієнта
  const handleCreateClient = async () => {
    try {
      const newClient = await createClientMutation.mutateAsync(clientForm);
      setSelectedClient(newClient);
      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  };

  return {
    selectedClient,
    isExistingClient,
    searchTerm,
    clients,
    isSearching,
    clientForm,
    isCreating: createClientMutation.isPending,
    createError: createClientMutation.error,
    handleSearch,
    handleSelectClient,
    toggleClientMode,
    handleClientFormChange,
    handleCreateClient,
  };
};
