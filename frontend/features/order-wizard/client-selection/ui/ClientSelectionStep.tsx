'use client';

import { Box } from '@mui/material';
import React from 'react';

import { useClientStep, Client, ClientMode } from '@/domain/client';
import { useWizard } from '@/domain/wizard';
import { StepContainer, StepNavigation } from '@/shared/ui';

import {
  ClientCreateForm,
  ClientEditForm,
  ClientModeSelector,
  ClientSearchPanel,
  SelectedClientInfo,
} from './components';

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
  const wizard = useWizard();

  // Логування для діагностики
  console.log('ClientSelectionStep render - canProceed:', {
    canProceed: clientStep.canProceed,
    'clientStep.state.isStepComplete': clientStep.state.isStepComplete,
    'clientStep.navigation.canProceedToNext': clientStep.navigation.canProceedToNext,
    hasSelectedClient: clientStep.stepInfo.hasSelectedClient,
    selectedClientId: clientStep.selectedClient?.id,
    'clientStep.selectedClient': !!clientStep.selectedClient,
  });

  /**
   * Обробник переходу до наступного кроку
   */
  const handleNext = async () => {
    console.log('handleNext викликано, canProceed:', clientStep.canProceed);

    if (!clientStep.canProceed) {
      console.log('Не можна продовжити - клієнт не вибраний');
      return;
    }

    if (clientStep.canProceed) {
      console.log('Перехід до наступного кроку з клієнтом:', clientStep.selectedClient);

      // Переходимо до наступного кроку через wizard
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Успішно перейшли до вибору філії');
      } else {
        console.error('Помилка переходу:', result.errors);
      }
    }
  };

  /**
   * Рендер контенту залежно від режиму
   */
  const renderContent = () => {
    console.log('renderContent mode:', clientStep.mode);

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

      case ClientMode.SEARCH:
        return (
          <>
            {clientStep.stepInfo.hasSelectedClient && clientStep.selectedClient && (
              <SelectedClientInfo
                client={clientStep.selectedClient}
                onEdit={() => {
                  console.log('Редагування клієнта:', clientStep.selectedClient);
                  if (clientStep.selectedClient) {
                    clientStep.startEditing(clientStep.selectedClient);
                  }
                }}
                onClear={clientStep.clearSelection}
                onDelete={() => {
                  if (
                    clientStep.selectedClient?.id &&
                    confirm('Ви впевнені, що хочете видалити цього клієнта?')
                  ) {
                    console.log('Видалення клієнта:', clientStep.selectedClient);
                    clientStep.deleteClient(clientStep.selectedClient.id);
                  }
                }}
              />
            )}

            {/* Показуємо пошук якщо клієнт ще не вибраний */}
            {!clientStep.stepInfo.hasSelectedClient && (
              <ClientSearchPanel
                searchTerm={clientStep.clientSearch.searchTerm}
                results={clientStep.searchResults}
                onSearchTermChange={clientStep.clientSearch.setSearchQuery}
                onSearch={clientStep.search}
                onSelectClient={clientStep.selectAndComplete}
                onEditClient={(client) => {
                  console.log('Редагування клієнта з пошуку:', client);
                  clientStep.startEditing(client);
                }}
                onDeleteClient={(client) => {
                  if (
                    client.id &&
                    confirm(
                      `Ви впевнені, що хочете видалити клієнта ${client.firstName} ${client.lastName}?`
                    )
                  ) {
                    console.log('Видалення клієнта з пошуку:', client);
                    clientStep.deleteClient(client.id);
                  }
                }}
                onBack={clientStep.switchToSelect}
                isLoading={clientStep.isLoading}
                error={clientStep.error}
              />
            )}
          </>
        );

      case ClientMode.SELECT:
      default:
        return (
          <>
            {/* Показуємо селектор якщо клієнт ще не вибраний */}
            {!clientStep.stepInfo.hasSelectedClient && (
              <ClientModeSelector
                currentMode={clientStep.mode}
                onSwitchToCreate={clientStep.switchToCreate}
                onSwitchToSearch={clientStep.switchToSearch}
                hasSelectedClient={clientStep.stepInfo.hasSelectedClient}
              />
            )}

            {clientStep.stepInfo.hasSelectedClient && clientStep.selectedClient && (
              <SelectedClientInfo
                client={clientStep.selectedClient}
                onEdit={() => {
                  console.log('Редагування клієнта:', clientStep.selectedClient);
                  if (clientStep.selectedClient) {
                    clientStep.startEditing(clientStep.selectedClient);
                  }
                }}
                onClear={clientStep.clearSelection}
                onDelete={() => {
                  if (
                    clientStep.selectedClient?.id &&
                    confirm('Ви впевнені, що хочете видалити цього клієнта?')
                  ) {
                    console.log('Видалення клієнта:', clientStep.selectedClient);
                    clientStep.deleteClient(clientStep.selectedClient.id);
                  }
                }}
              />
            )}
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
        onNext={handleNext}
        nextLabel={
          clientStep.stepInfo.hasSelectedClient
            ? 'Продовжити до вибору філії'
            : 'Спочатку оберіть клієнта'
        }
        isNextDisabled={!clientStep.canProceed}
        nextLoading={clientStep.isLoading}
        hideBackButton
      />
    </StepContainer>
  );
};

export default ClientSelectionStep;
