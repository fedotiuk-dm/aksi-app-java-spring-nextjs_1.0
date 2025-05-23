import { create } from 'zustand';

import { ClientEntity } from '../entities';
import { ClientRepository } from '../repositories';

interface ClientSelectionState {
  // Дані
  selectedClientId: string | null;
  selectedClient: ClientEntity | null;

  // Статуси
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Методи
  selectClient: (clientId: string) => Promise<void>;
  clearSelection: () => void;
  isClientSelected: () => boolean;
  deleteClient: (clientId: string) => Promise<void>;
}

/**
 * Стор Zustand для вибору клієнта
 */
export const useClientSelectionStore = create<ClientSelectionState>((set, get) => {
  // Створення репозиторію
  const clientRepository = new ClientRepository();

  return {
    // Початковий стан
    selectedClientId: null,
    selectedClient: null,

    isLoading: false,
    isError: false,
    error: null,

    // Методи для роботи з вибором клієнта
    selectClient: async (clientId: string) => {
      if (!clientId) {
        set({ selectedClientId: null, selectedClient: null });
        return;
      }

      set({
        isLoading: true,
        isError: false,
        error: null,
        selectedClientId: clientId
      });

      try {
        const client = await clientRepository.getById(clientId);
        set({
          selectedClient: client,
          isLoading: false
        });
      } catch (error) {
        set({
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error : new Error('Помилка отримання клієнта'),
          selectedClient: null
        });
      }
    },

    clearSelection: () => {
      set({
        selectedClientId: null,
        selectedClient: null,
        isLoading: false,
        isError: false,
        error: null
      });
    },

    isClientSelected: () => {
      return !!get().selectedClient;
    },

    deleteClient: async (clientId: string) => {
      if (!clientId) {
        set({ selectedClientId: null, selectedClient: null });
        return;
      }

      set({
        isLoading: true,
        isError: false,
        error: null,
        selectedClientId: null,
        selectedClient: null
      });

      try {
        await clientRepository.delete(clientId);
        set({
          isLoading: false
        });
      } catch (error) {
        set({
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error : new Error('Помилка видалення клієнта'),
          selectedClientId: null,
          selectedClient: null
        });
      }
    }
  };
});
