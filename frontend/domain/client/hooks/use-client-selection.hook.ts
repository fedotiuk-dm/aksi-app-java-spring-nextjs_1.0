import { useCallback, useEffect } from 'react';

import { ClientResponse } from '@/lib/api';

import { eventBus } from '../../shared/events/event-bus';
import { useWizardStore } from '../../wizard/store/wizard.store';
import { WizardStep } from '../../wizard/types';
import { ClientEventFactory } from '../events';
import { useClientSelectionStore } from '../store/client-selection.store';
import { Client } from '../types';
import { ClientAdapter } from '../utils';

/**
 * Властивості хука вибору клієнта
 */
interface UseClientSelectionProps {
  initialClientId?: string;
  onSelect?: (client: Client | null) => void;
  onClear?: () => void;
}

/**
 * Хук для вибору клієнта
 *
 * DDD SOLID принципи:
 * - Single Responsibility: відповідає ТІЛЬКИ за вибір клієнта
 * - Open/Closed: розширюється через props та callbacks
 * - Dependency Inversion: залежить від абстракцій (store, events, adapter)
 * - Interface Segregation: мінімальний, спеціалізований інтерфейс
 * - Liskov Substitution: заміняє старі хуки без зміни поведінки
 *
 * OpenAPI інтеграція:
 * - Всі дані з lib/api через ClientAdapter
 * - Type-safe операції з ClientResponse → Domain Client
 * - Event Bus для міжобластної комунікації
 */
export const useClientSelection = (props: UseClientSelectionProps = {}) => {
  const { initialClientId, onSelect, onClear } = props;

  const {
    selectedClientId,
    selectedClient: selectedClientEntity,
    isLoading,
    error,
    selectClient: storeSelectClient,
    clearSelection: storeClearSelection,
  } = useClientSelectionStore();

  // Додаємо wizard store для оновлення availability
  const { updateStepAvailability } = useWizardStore();

  /**
   * Конвертуємо ClientEntity в Client через ClientAdapter
   * OpenAPI Response → Domain Entity → Domain Interface
   * Type-safe conversion з валідацією
   */
  const selectedClient = selectedClientEntity
    ? ClientAdapter.toDomain({
        id: selectedClientEntity.id,
        firstName: selectedClientEntity.firstName,
        lastName: selectedClientEntity.lastName,
        phone: selectedClientEntity.phone,
        email: selectedClientEntity.email,
        address: selectedClientEntity.address,
        structuredAddress: selectedClientEntity.structuredAddress,
        source: selectedClientEntity.source,
        sourceDetails: selectedClientEntity.sourceDetails,
        communicationChannels: selectedClientEntity.communicationChannels,
        createdAt: selectedClientEntity.createdAt,
        updatedAt: selectedClientEntity.updatedAt,
      } as ClientResponse)
    : null;

  /**
   * Ініціалізація початкового клієнта
   * Lifecycle management
   */
  useEffect(() => {
    if (initialClientId) {
      storeSelectClient(initialClientId);
    }
  }, [initialClientId, storeSelectClient]);

  /**
   * Виклик callback при зміні вибраного клієнта
   * Event notification pattern
   */
  useEffect(() => {
    if (onSelect) {
      onSelect(selectedClient);
    }
  }, [selectedClient, onSelect]);

  /**
   * Обробник вибору клієнта за об'єктом
   * Domain Event pattern integration
   */
  const handleSelectClient = useCallback(
    async (client: Client) => {
      if (!client.id) return;

      await storeSelectClient(client.id);

      // Оновлюємо доступність наступного кроку в wizard
      updateStepAvailability(WizardStep.BRANCH_SELECTION, true);

      // Створюємо та публікуємо доменну подію (Event Sourcing)
      const event = ClientEventFactory.createClientSelectedEvent(client);
      await eventBus.publish(event);
    },
    [storeSelectClient, updateStepAvailability]
  );

  /**
   * Обробник вибору клієнта за ID
   * Repository pattern delegation
   */
  const handleSelectClientById = useCallback(
    async (clientId: string) => {
      await storeSelectClient(clientId);
    },
    [storeSelectClient]
  );

  /**
   * Обробник очищення вибору
   * State cleanup з доменними подіями
   */
  const handleClearSelection = useCallback(async () => {
    storeClearSelection();

    // Відключаємо доступність наступного кроку в wizard
    updateStepAvailability(WizardStep.BRANCH_SELECTION, false);

    // Створюємо та публікуємо подію очищення вибору (Domain Event)
    const event = ClientEventFactory.createClientSelectionClearedEvent();
    await eventBus.publish(event);

    // Викликаємо callback очищення (UI notification)
    onClear?.();
  }, [storeClearSelection, updateStepAvailability, onClear]);

  /**
   * Перевірка, чи клієнт вибраний за ID
   * Domain query method
   */
  const isSelected = useCallback(
    (clientId: string): boolean => {
      return selectedClientId === clientId;
    },
    [selectedClientId]
  );

  /**
   * Перевірка, чи клієнт вибраний за об'єктом
   * Domain query method with object comparison
   */
  const isClientSelected = useCallback(
    (client: Client): boolean => {
      return Boolean(client.id && selectedClientId === client.id);
    },
    [selectedClientId]
  );

  return {
    // Дані (Read-only для UI)
    selectedClient,
    selectedClientId,

    // Стан (Computed properties)
    isLoading,
    error,
    hasSelection: Boolean(selectedClient),

    // Методи (Write operations)
    selectClient: handleSelectClient,
    selectClientById: handleSelectClientById,
    clearSelection: handleClearSelection,
    isSelected,
    isClientSelected,

    // Інформація про вибраного клієнта (Computed properties)
    selectedClientName: selectedClient
      ? `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim()
      : undefined,
    selectedClientPhone: selectedClient?.phone,
    selectedClientEmail: selectedClient?.email,

    // Metadata
    selectionType: 'client' as const,
  };
};
