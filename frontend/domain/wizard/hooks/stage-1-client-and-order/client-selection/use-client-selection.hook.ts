import { useCallback } from 'react';

import { ClientService } from '../../../services/stage-1-client-and-order/client-selection/client.service';
import { useClientSelectionStore } from '../../../store/stage-1-client-and-order/client-selection.store';

import type { ClientResponse } from '@/shared/api/generated/client/aksiApi.schemas';

const clientService = new ClientService();

/**
 * Хук для вибору клієнта
 * Відповідальність: логіка вибору та валідації клієнта
 */
export const useClientSelection = () => {
  const {
    selectedClientId,
    selectedClient,
    setSelectedClient,
    clearSelection,
    validationError,
    setValidationError,
  } = useClientSelectionStore();

  const selectClient = useCallback(
    (client: ClientResponse) => {
      const validation = clientService.validateClientData(client);

      if (!validation.isValid) {
        setValidationError(validation.errors.join(', '));
        return;
      }

      if (!clientService.isClientComplete(client)) {
        setValidationError('Клієнт має неповні дані');
        return;
      }

      setSelectedClient(client);
      setValidationError(null);
    },
    [setSelectedClient, setValidationError]
  );

  const clearClientSelection = useCallback(() => {
    clearSelection();
    setValidationError(null);
  }, [clearSelection, setValidationError]);

  return {
    selectedClientId,
    selectedClient,
    validationError,
    isSelected: !!selectedClient,
    selectClient,
    clearSelection: clearClientSelection,
    clientDisplayName: selectedClient ? clientService.formatClientName(selectedClient) : '',
  };
};
