'use client';

import { Box, Alert } from '@mui/material';
import React, { useState } from 'react';

import {
  useClientSearch,
  useClientForm,
  useClientSelection,
  useWizardState,
  useWizardNavigation,
} from '@/domain/wizard';
import { StepContainer, StepNavigation } from '@/shared/ui';

import {
  ClientCreateForm,
  ClientModeSelector,
  ClientSearchPanel,
  SelectedClientInfo,
} from './components';

/**
 * Режими роботи компонента
 */
enum ClientMode {
  SELECT = 'select',
  SEARCH = 'search',
  CREATE = 'create',
}

/**
 * Головний компонент для CLIENT_SELECTION кроку Order Wizard (DDD архітектура)
 *
 * FSD принципи:
 * - Тільки UI логіка (презентаційний компонент)
 * - Отримує всі дані з domain хуків
 * - Мінімальний локальний стан
 * - Композиція спеціалізованих UI компонентів
 *
 * DDD принципи:
 * - Вся бізнес-логіка делегована доменним сервісам
 * - Хуки фокусуються тільки на React стані
 * - Валідація через Zod схеми
 */
export const ClientSelectionStep: React.FC = () => {
  // === ЛОКАЛЬНИЙ UI СТАН ===
  const [mode, setMode] = useState<ClientMode>(ClientMode.SELECT);

  // === DOMAIN ХУКИ ===
  const clientSearch = useClientSearch();
  const clientForm = useClientForm();
  const clientSelection = useClientSelection();
  const wizardState = useWizardState();
  const wizardNavigation = useWizardNavigation();

  // === ОБРОБНИКИ ПОДІЙ ===
  const handleSelectClient = async (client: any) => {
    const result = await clientSelection.selectClient(client);
    if (result.success) {
      setMode(ClientMode.SELECT);
    }
  };

  const handleCreateClient = async (data: any) => {
    const result = await clientForm.createClient(data);
    if (result.success) {
      if ('client' in result && result.client) {
        await clientSelection.selectNewClient(result.client);
        setMode(ClientMode.SELECT);
      }
    }
    // Якщо needsReview або інша помилка, залишаємося в режимі створення
  };

  const handleClearSelection = () => {
    clientSelection.clearSelection();
    setMode(ClientMode.SELECT);
  };

  const handleNext = () => {
    if (clientSelection.canProceed) {
      wizardNavigation.navigateForward();
    }
  };

  // === РЕНДЕР КОНТЕНТУ ===
  const renderContent = () => {
    switch (mode) {
      case ClientMode.CREATE:
        return (
          <ClientCreateForm
            form={clientForm}
            isCreating={clientForm.isCreating}
            duplicateCheck={clientForm.duplicateCheck}
            showDuplicateWarning={clientForm.showDuplicateWarning}
            onSubmit={handleCreateClient}
            onCancel={() => setMode(ClientMode.SELECT)}
            onFieldChange={(field, value) => {
              (clientForm.setValue as any)(field, value);
            }}
            onDismissDuplicateWarning={clientForm.dismissDuplicateWarning}
          />
        );

      case ClientMode.SEARCH:
        return (
          <ClientSearchPanel
            {...clientSearch}
            onSelectClient={handleSelectClient}
            onBack={() => setMode(ClientMode.SELECT)}
          />
        );

      case ClientMode.SELECT:
        return (
          <SelectedClientInfo
            client={
              clientSelection.selectedClient || {
                id: '',
                firstName: '',
                lastName: '',
                fullName: '',
                phone: '',
                email: '',
                address: '',
                communicationChannels: [],
                source: undefined,
                orderCount: 0,
                createdAt: '',
                updatedAt: '',
              }
            }
            clientDisplay={{
              fullName: clientSelection.selectedClient
                ? `${clientSelection.selectedClient.firstName} ${clientSelection.selectedClient.lastName}`
                : '',
              subtitle: clientSelection.selectedClient?.phone || '',
              completenessPercentage: 0,
              missingFields: [],
              recommendedFields: [],
              canProceed: false,
              proceedReasons: [],
            }}
            validationResult={clientSelection.validationResult || undefined}
            onClear={() => {
              clientSelection.clearSelection();
              setMode(ClientMode.SEARCH);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <StepContainer
      title="Вибір клієнта"
      subtitle="Оберіть існуючого клієнта, створіть нового або відредагуйте дані"
    >
      {/* Відображення помилок */}
      {wizardState.hasErrors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {wizardState.errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      {/* Відображення попереджень */}
      {wizardState.hasWarnings && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {wizardState.warnings.map((warning, index) => (
            <div key={index}>{warning}</div>
          ))}
        </Alert>
      )}

      <Box sx={{ minHeight: '400px' }}>{renderContent()}</Box>

      <StepNavigation
        onNext={handleNext}
        nextLabel={
          clientSelection.hasSelectedClient
            ? 'Продовжити до вибору філії'
            : 'Спочатку оберіть клієнта'
        }
        isNextDisabled={!clientSelection.canProceed}
        nextLoading={wizardState.isLoading}
        hideBackButton
      />
    </StepContainer>
  );
};

export default ClientSelectionStep;
