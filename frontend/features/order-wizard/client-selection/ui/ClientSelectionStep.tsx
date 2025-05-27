'use client';

import { PersonAdd, PersonSearch } from '@mui/icons-material';
import { Box, Paper, Typography, Button, Stepper, Step, StepLabel, Alert } from '@mui/material';
import React, { useState } from 'react';

import { useClientManagement } from '@/domain/wizard/hooks';

import { ClientFormPanel } from './components/ClientFormPanel';
import { ClientSearchPanel } from './components/ClientSearchPanel';
import { ClientSelectedPanel } from './components/ClientSelectedPanel';

import type {
  ClientSearchResult,
  ClientData,
} from '@/domain/wizard/services/stage-1-client-and-order-info';

type ClientSelectionMode = 'search' | 'create' | 'selected';

/**
 * Головний компонент етапу вибору клієнта
 */
export const ClientSelectionStep: React.FC = () => {
  const [mode, setMode] = useState<ClientSelectionMode>('search');

  // === ДОМЕННА ЛОГІКА ===
  const {
    // Пошук
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    searchClients,
    clearSearch,

    // Форма
    formMethods,
    isCreatingClient,
    isUpdatingClient,
    createClient,
    updateClient,
    validateClientData,

    // Вибір
    selectedClient,
    isNewClient,
    selectClient,
    selectNewClient,
    clearSelection,
    proceedToNextStep,

    // Утиліти
    formatPhone,
    createClientSummary,
    ContactMethod,
    InformationSource,
  } = useClientManagement();

  // === ОБРОБНИКИ ПОДІЙ ===
  const handleSelectExistingClient = async (client: ClientSearchResult) => {
    const result = await selectClient(client);
    if (result.success) {
      setMode('selected');
    }
  };

  const handleCreateOrUpdateClient = async (data: ClientData) => {
    let result;

    // Якщо є вибраний клієнт, то це оновлення
    if (selectedClient) {
      result = await updateClient(selectedClient.id || '', data);
    } else {
      // Інакше це створення нового клієнта
      result = await createClient(data);
    }

    if (result.success && result.client) {
      if (selectedClient) {
        // Оновлюємо вибраного клієнта
        await selectClient(result.client);
      } else {
        // Вибираємо нового клієнта
        await selectNewClient(result.client);
      }
      setMode('selected');
    }
  };

  const handleBackToSearch = () => {
    clearSelection();
    setMode('search');
  };

  const handleCreateNewClient = () => {
    clearSelection();
    formMethods.reset({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      contactMethods: [ContactMethod.PHONE],
      informationSource: InformationSource.OTHER,
      informationSourceOther: '',
    });
    setMode('create');
  };

  const handleEditClient = () => {
    // Ініціалізуємо форму з даними вибраного клієнта
    if (selectedClient) {
      formMethods.reset({
        firstName: selectedClient.firstName || '',
        lastName: selectedClient.lastName || '',
        phone: selectedClient.phone || '',
        email: selectedClient.email || '',
        address: selectedClient.address || '',
        contactMethods: selectedClient.contactMethods || [ContactMethod.PHONE],
        informationSource: selectedClient.informationSource || InformationSource.OTHER,
        informationSourceOther: selectedClient.informationSourceOther || '',
      });
    }
    setMode('create');
  };

  // === ЕТАПИ ВІЗАРДА ===
  const steps = ['Пошук клієнта', 'Підтвердження вибору', 'Завершення'];

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
              searchQuery={searchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              searchError={searchError}
              searchClients={searchClients}
              clearSearch={clearSearch}
              formatPhone={formatPhone}
              createClientSummary={createClientSummary}
              onSelectClient={handleSelectExistingClient}
              showBackButton={false}
            />
          </Box>
        )}

        {mode === 'create' && (
          <ClientFormPanel
            formMethods={formMethods}
            isCreating={isCreatingClient}
            isUpdating={isUpdatingClient}
            onSubmit={handleCreateOrUpdateClient}
            onBack={handleBackToSearch}
            ContactMethod={ContactMethod}
            InformationSource={InformationSource}
            validateClientData={validateClientData}
            isEditing={!!selectedClient}
          />
        )}

        {mode === 'selected' && selectedClient && (
          <ClientSelectedPanel
            client={selectedClient}
            isNewClient={isNewClient}
            formatPhone={formatPhone}
            createClientSummary={createClientSummary}
            onEdit={handleEditClient}
            onChangeClient={handleBackToSearch}
            onProceed={proceedToNextStep}
          />
        )}

        {/* Помилки */}
        {searchError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {searchError}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};
