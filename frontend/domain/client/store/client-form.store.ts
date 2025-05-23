import { create } from 'zustand';

import { ClientRepository } from '../repositories/client-repository';
import {
  CreateClientFormData,
  UpdateClientFormData,
  CreateClientResult,
  UpdateClientResult,
  Client,
} from '../types';
import { ClientSource } from '../types/client-enums';

/**
 * Стан для нового клієнта
 */
interface NewClientState {
  formData: CreateClientFormData;
  isLoading: boolean;
  error: string | null;
}

/**
 * Стан для редагування клієнта
 */
interface EditClientState {
  formData: UpdateClientFormData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Основний стор для форм клієнтів
 * Реалізує принцип Single Responsibility - відповідає тільки за форми
 */
interface ClientFormStore {
  // Стани
  newClient: NewClientState;
  editClient: EditClientState;

  // Дії для нового клієнта
  setNewClientFormData: (data: Partial<CreateClientFormData>) => void;
  setNewClientLoading: (loading: boolean) => void;
  setNewClientError: (error: string | null) => void;
  resetNewClient: () => void;
  saveNewClient: () => Promise<CreateClientResult>;

  // Дії для редагування клієнта
  startEditingClient: (client: Client) => void;
  setEditClientFormData: (data: Partial<UpdateClientFormData>) => void;
  setEditClientLoading: (loading: boolean) => void;
  setEditClientError: (error: string | null) => void;
  saveEditedClient: () => Promise<UpdateClientResult>;
  cancelEditing: () => void;
}

// Початкові стани
const initialNewClientState: NewClientState = {
  formData: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    communicationChannels: [],
    source: ClientSource.OTHER,
    sourceDetails: '',
  },
  isLoading: false,
  error: null,
};

const initialEditClientState: EditClientState = {
  formData: null,
  isLoading: false,
  error: null,
};

/**
 * Zustand стор для управління формами клієнтів
 * Реалізує принцип Single Responsibility - відповідає тільки за форми
 */
export const clientFormStore = create<ClientFormStore>((set, get) => {
  const clientRepository = new ClientRepository();

  return {
    // Початкові стани
    newClient: initialNewClientState,
    editClient: initialEditClientState,

    // Дії для нового клієнта
    setNewClientFormData: (data) => {
      set((state) => ({
        newClient: {
          ...state.newClient,
          formData: { ...state.newClient.formData, ...data },
        },
      }));
    },

    setNewClientLoading: (loading) => {
      set((state) => ({
        newClient: { ...state.newClient, isLoading: loading },
      }));
    },

    setNewClientError: (error) => {
      set((state) => ({
        newClient: { ...state.newClient, error },
      }));
    },

    resetNewClient: () => {
      set({ newClient: initialNewClientState });
    },

    saveNewClient: async (): Promise<CreateClientResult> => {
      const { newClient } = get();
      set((state) => ({
        newClient: { ...state.newClient, isLoading: true, error: null },
      }));

      try {
        const response = await clientRepository.create(newClient.formData);

        set((state) => ({
          newClient: { ...state.newClient, isLoading: false },
        }));

        return { client: response, errors: null };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка створення клієнта';
        set((state) => ({
          newClient: { ...state.newClient, isLoading: false, error: errorMessage },
        }));
        return { client: null, errors: { general: errorMessage } };
      }
    },

    // Дії для редагування клієнта
    startEditingClient: (client) => {
      const formData: UpdateClientFormData = {
        id: client.id || '',
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        phone: client.phone || '',
        email: client.email || '',
        address: client.address || '',
        communicationChannels: client.communicationChannels || [],
        source: client.source || ClientSource.OTHER,
        sourceDetails: client.sourceDetails || '',
      };

      set({
        editClient: {
          formData,
          isLoading: false,
          error: null,
        },
      });
    },

    setEditClientFormData: (data) => {
      set((state) => ({
        editClient: {
          ...state.editClient,
          formData: state.editClient.formData ? { ...state.editClient.formData, ...data } : null,
        },
      }));
    },

    setEditClientLoading: (loading) => {
      set((state) => ({
        editClient: { ...state.editClient, isLoading: loading },
      }));
    },

    setEditClientError: (error) => {
      set((state) => ({
        editClient: { ...state.editClient, error },
      }));
    },

    saveEditedClient: async (): Promise<UpdateClientResult> => {
      const { editClient } = get();
      if (!editClient.formData) {
        return { client: null, errors: { general: 'Дані клієнта відсутні' } };
      }

      set((state) => ({
        editClient: { ...state.editClient, isLoading: true, error: null },
      }));

      try {
        const response = await clientRepository.update(editClient.formData);

        set((state) => ({
          editClient: { ...state.editClient, isLoading: false },
        }));

        return { client: response, errors: null };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка оновлення клієнта';
        set((state) => ({
          editClient: { ...state.editClient, isLoading: false, error: errorMessage },
        }));
        return { client: null, errors: { general: errorMessage } };
      }
    },

    cancelEditing: () => {
      set({ editClient: initialEditClientState });
    },
  };
});
