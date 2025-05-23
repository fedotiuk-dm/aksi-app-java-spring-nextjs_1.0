'use client';

import { Box } from '@mui/material';
import React from 'react';

import { useClientStep, Client, ClientMode } from '@/domain/client';

import {
  ClientCreateForm,
  ClientEditForm,
  ClientModeSelector,
  ClientSearchPanel,
  SelectedClientInfo,
} from './components';
import { StepContainer } from '../../shared/ui/step-container';
import { StepNavigation } from '../../shared/ui/step-navigation';

/**
 * Головний компонент для CLIENT_SELECTION кроку Order Wizard
 *
 * FSD принципи:
 * - Тільки UI логіка (презентаційний компонент)
 * - Отримує всі дані з domain хуків
 * - Мінімальний локальний стан
 * - Композиція спеціалізованих UI компонентів
 *
 * Згідно з документацією Order Wizard:
 * 1.1. Вибір або створення клієнта
 * - Форма пошуку існуючого клієнта
 * - Відображення списку знайдених клієнтів
 * - Можливість вибрати клієнта зі списку
 * - Можливість редагування клієнта
 * - Форма нового клієнта з повною валідацією
 */
export const ClientSelectionStep: React.FC = () => {
  // Отримуємо всю функціональність з domain layer
  const clientStep = useClientStep({
    autoAdvance: true,
    onStepComplete: (client: Client) => {
      console.log('Клієнт вибраний для замовлення:', client);
    },
  });

  /**
   * Рендер контенту залежно від режиму
   */
  const renderContent = () => {
    switch (clientStep.mode) {
      case ClientMode.CREATE:
        return (
          <ClientCreateForm
            isLoading={clientStep.creationState.isLoading}
            error={clientStep.creationState.error}
            formData={clientStep.creationState.formData}
            onSave={clientStep.createClient}
            onCancel={clientStep.switchToSelect}
          />
        );

      case ClientMode.EDIT:
        return (
          <ClientEditForm
            isLoading={clientStep.editingState.isLoading}
            error={clientStep.editingState.error}
            formData={clientStep.editingState.formData || {}}
            originalClient={clientStep.editingState.originalClient}
            onSave={clientStep.editClient}
            onCancel={clientStep.switchToSelect}
          />
        );

      case ClientMode.SELECT:
      default:
        return (
          <>
            <ClientModeSelector
              currentMode={clientStep.mode}
              onSwitchToCreate={clientStep.switchToCreate}
              onSwitchToSearch={clientStep.switchToSelect}
              hasSelectedClient={clientStep.stepInfo.hasSelectedClient}
            />

            {clientStep.stepInfo.hasSelectedClient && clientStep.selectedClient && (
              <SelectedClientInfo
                client={clientStep.selectedClient}
                onEdit={() => {
                  if (clientStep.selectedClient) {
                    clientStep.startEditing(clientStep.selectedClient);
                  }
                }}
                onClear={clientStep.clearSelection}
              />
            )}

            <ClientSearchPanel
              searchTerm={clientStep.clientSearch.searchTerm}
              results={clientStep.searchResults}
              onSearchTermChange={clientStep.clientSearch.setSearchQuery}
              onSearch={clientStep.search}
              onSelectClient={clientStep.selectAndComplete}
              isLoading={clientStep.isLoading}
              error={clientStep.error}
            />
          </>
        );
    }
  };

  return (
    <StepContainer
      title="Вибір клієнта"
      subtitle="Оберіть існуючого клієнта, створіть нового або відредагуйте дані"
    >
      <Box sx={{ minHeight: '400px' }}>{renderContent()}</Box>

      <StepNavigation
        onNext={clientStep.canProceed ? clientStep.proceedToNext : undefined}
        nextLabel="Продовжити до вибору філії"
        isNextDisabled={!clientStep.canProceed}
        hideBackButton
      />
    </StepContainer>
  );
};

export default ClientSelectionStep;
