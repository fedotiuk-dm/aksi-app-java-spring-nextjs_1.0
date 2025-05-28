'use client';

import { PersonAdd, PersonSearch } from '@mui/icons-material';
import { Box, Paper, Typography, Button, Stepper, Step, StepLabel, Alert } from '@mui/material';
import React, { useState, useEffect } from 'react';

// 🔥 Новий уніфікований хук з доменного шару
import {
  useClientApiOperations,
  type ClientSearchState,
} from '@/domain/wizard/hooks/stage-1-client-and-order';

// Компоненти
import { ClientFormPanel } from './components/ClientFormPanel';
import { ClientSearchPanel } from './components/ClientSearchPanel';
import { ClientSelectedPanel } from './components/ClientSelectedPanel';

// Типи з API та домену
import type { ClientFormData } from '@/domain/wizard/services/stage-1-client-and-order/client-management/client-validation.service';
import type { ClientResponse } from '@/shared/api/generated/client';

type ClientSelectionMode = 'search' | 'create' | 'selected';

/**
 * Головний компонент етапу вибору клієнта (оновлений для DDD архітектури)
 */
export const ClientSelectionStep: React.FC = () => {
  const [mode, setMode] = useState<ClientSelectionMode>('search');
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);

  // === ДОМЕННИЙ ХУК ===
  const {
    // Дані
    allClients,
    isLoadingClients,
    clientsError,
    searchResults,
    isSearching,
    searchError,

    // Операції
    isCreating,
    isUpdating,
    isDeleting,
    operationError,

    // Методи
    searchClientsWithPagination,
    createClient,
    updateClient,
    deleteClient,
    refreshClients,

    // Утиліти
    clearSearchResults,
    clearErrors,
  } = useClientApiOperations();

  // === ЕФЕКТИ ===

  // Завантажуємо початковий список клієнтів
  useEffect(() => {
    const clientsList = Array.isArray(allClients) ? allClients : [];
    if (!isLoadingClients && clientsList.length === 0) {
      refreshClients();
    }
  }, [isLoadingClients, allClients, refreshClients]);

  // === ОБРОБНИКИ ПОДІЙ ===

  const handleSelectExistingClient = async (client: ClientResponse) => {
    try {
      setSelectedClient(client);
      setIsNewClient(false);
      setMode('selected');
    } catch (error) {
      console.error('Помилка вибору клієнта:', error);
    }
  };

  const handleCreateClient = async (clientData: ClientFormData) => {
    try {
      const newClient = await createClient(clientData);
      if (newClient) {
        setSelectedClient(newClient);
        setIsNewClient(true);
        setMode('selected');
      }
    } catch (error) {
      console.error('Помилка створення клієнта:', error);
    }
  };

  const handleUpdateClient = async (clientData: ClientFormData) => {
    if (!selectedClient?.id) return;

    try {
      const updatedClient = await updateClient(selectedClient.id, clientData);
      if (updatedClient) {
        setSelectedClient(updatedClient);
        setMode('selected');
      }
    } catch (error) {
      console.error('Помилка оновлення клієнта:', error);
    }
  };

  const handleBackToSearch = () => {
    setSelectedClient(null);
    setIsNewClient(false);
    clearErrors();
    setMode('search');
  };

  const handleCreateNewClient = () => {
    setSelectedClient(null);
    setIsNewClient(false);
    clearErrors();
    setMode('create');
  };

  const handleEditClient = () => {
    setMode('create');
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      try {
        await searchClientsWithPagination({
          query: term,
          page: 0,
          size: 20,
        });
      } catch (error) {
        console.error('Помилка пошуку:', error);
      }
    } else {
      clearSearchResults();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    clearSearchResults();
  };

  const handlePageChange = async (page: number) => {
    if (searchTerm) {
      try {
        await searchClientsWithPagination({
          query: searchTerm,
          page,
          size: 20,
        });
      } catch (error) {
        console.error('Помилка зміни сторінки:', error);
      }
    }
  };

  // === ДОПОМІЖНІ МЕТОДИ ===

  const getActiveStep = () => {
    switch (mode) {
      case 'search':
      case 'create':
        return 0;
      case 'selected':
        return selectedClient ? 1 : 0;
      default:
        return 0;
    }
  };

  // Визначаємо клієнтів для відображення
  const clientsList = Array.isArray(allClients) ? allClients : [];
  const displayClients = searchTerm.length >= 2 ? searchResults : clientsList;

  // Форматуємо клієнтів для компонента
  const formattedClients = displayClients.map((client) => ({
    client,
    formatted: {
      fullName: `${client.firstName ?? ''} ${client.lastName ?? ''}`.trim() || 'Без імені',
      contactInfo: [client.phone, client.email].filter(Boolean).join(', '),
      address: client.address || 'Адреса не вказана',
      source: client.source || 'Не вказано',
      orderCount: `${client.orderCount || 0} замовлень`,
      lastUpdate: client.updatedAt
        ? new Date(client.updatedAt).toLocaleDateString('uk-UA')
        : 'Невідомо',
    },
  }));

  // Створюємо searchState для сумісності з компонентом
  const searchState: ClientSearchState = {
    searchTerm,
    isSearching: isSearching,
    searchResults: displayClients,
    hasSearched: searchTerm.length >= 2,
    searchError: searchError,
  };

  // === ЕТАПИ ВІЗАРДА ===
  const steps = ['Пошук/створення клієнта', 'Підтвердження вибору', 'Завершення'];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Заголовок етапу */}
      <Typography variant="h4" component="h1" gutterBottom>
        Етап 1: Вибір клієнта
      </Typography>

      {/* Прогрес бар */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={getActiveStep()} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Показуємо помилки */}
      {(clientsError || searchError || operationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Помилка: {clientsError || searchError || operationError}
        </Alert>
      )}

      {/* Головний контент */}
      <Paper elevation={1} sx={{ p: 3 }}>
        {mode === 'search' && (
          <Box>
            {/* Вибір дії */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<PersonSearch />}
                onClick={() => setMode('search')}
                size="large"
                disabled={isLoadingClients}
              >
                Знайти існуючого клієнта
              </Button>
              <Button
                variant="outlined"
                startIcon={<PersonAdd />}
                onClick={handleCreateNewClient}
                size="large"
              >
                Створити нового клієнта
              </Button>
            </Box>

            {/* Панель пошуку */}
            <ClientSearchPanel
              searchState={searchState}
              formattedClients={formattedClients}
              onSearchTermChange={handleSearch}
              onClearSearch={handleClearSearch}
              onPageChange={handlePageChange}
              onSelectClient={handleSelectExistingClient}
            />
          </Box>
        )}

        {mode === 'create' && (
          <ClientFormPanel
            creationState={{
              isLoading: isCreating || isUpdating,
              isError: !!operationError,
              errorMessage: operationError || '',
            }}
            selectedClient={selectedClient}
            onSubmit={selectedClient ? handleUpdateClient : handleCreateClient}
            onCancel={handleBackToSearch}
            onValidate={(data: ClientFormData) => ({ isValid: true, errors: [] })}
            isEditMode={!!selectedClient}
          />
        )}

        {mode === 'selected' && selectedClient && (
          <ClientSelectedPanel
            selectedClient={selectedClient}
            clientInfo={{
              client: selectedClient,
              isNew: isNewClient,
              formattedInfo: {
                fullName:
                  `${selectedClient.firstName ?? ''} ${selectedClient.lastName ?? ''}`.trim(),
                phone: selectedClient.phone ?? '',
                email: selectedClient.email ?? '',
                address: selectedClient.address ?? '',
              },
            }}
            isNewClient={isNewClient}
            onEdit={handleEditClient}
            onBack={handleBackToSearch}
            onContinue={() => {
              console.log('Переходимо до наступного етапу');
              // Тут буде логіка переходу до наступного етапу
            }}
          />
        )}
      </Paper>
    </Box>
  );
};
