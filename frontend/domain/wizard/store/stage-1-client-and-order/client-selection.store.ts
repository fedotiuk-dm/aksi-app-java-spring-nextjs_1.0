import { create } from 'zustand';

import type { ClientResponse } from '@/shared/api/generated/client/aksiApi.schemas';

interface ClientSelectionState {
  selectedClientId?: string;
  selectedClient?: ClientResponse;
  validationError?: string | null;
}

interface ClientSelectionActions {
  setSelectedClient: (client: ClientResponse) => void;
  clearSelection: () => void;
  setValidationError: (error: string | null) => void;
}

/**
 * Мінімалістичний стор для вибору клієнта
 * Відповідальність: тільки збереження стану вибору
 */
export const useClientSelectionStore = create<ClientSelectionState & ClientSelectionActions>(
  (set) => ({
    // Стан
    selectedClientId: undefined,
    selectedClient: undefined,
    validationError: null,

    // Дії
    setSelectedClient: (client) =>
      set({
        selectedClientId: client.id,
        selectedClient: client,
        validationError: null,
      }),

    clearSelection: () =>
      set({
        selectedClientId: undefined,
        selectedClient: undefined,
        validationError: null,
      }),

    setValidationError: (error) =>
      set({
        validationError: error,
      }),
  })
);
