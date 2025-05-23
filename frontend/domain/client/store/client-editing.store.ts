import { create } from 'zustand';

import { ClientRepository } from '../repositories/client-repository';
import { UpdateClientFormData, UpdateClientResult, Client } from '../types';
import { ClientSource } from '../types/client-enums';

/**
 * Стан для редагування клієнта
 * Реалізує Single Responsibility Principle - відповідає ТІЛЬКИ за редагування
 */
interface ClientEditingState {
  formData: UpdateClientFormData | null;
  originalClient: Client | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Дії для редагування клієнта
 */
interface ClientEditingActions {
  startEditing: (client: Client) => void;
  setFormData: (data: Partial<UpdateClientFormData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  saveClient: () => Promise<UpdateClientResult>;
  cancelEditing: () => void;
}

/**
 * Повний інтерфейс стору
 */
type ClientEditingStore = ClientEditingState & ClientEditingActions;

/**
 * Початковий стан
 */
const initialState: ClientEditingState = {
  formData: null,
  originalClient: null,
  isLoading: false,
  error: null,
};

/**
 * Zustand стор для редагування клієнтів
 * Реалізує принцип Single Responsibility
 */
export const useClientEditingStore = create<ClientEditingStore>((set, get) => {
  const clientRepository = new ClientRepository();

  return {
    // Початковий стан
    ...initialState,

    // Дії
    startEditing: (client) => {
      console.log('🎯 ClientEditingStore.startEditing - початок:', {
        client,
        structuredAddress: client.structuredAddress,
        clientKeys: Object.keys(client),
      });

      const formData: UpdateClientFormData = {
        id: client.id || '',
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        phone: client.phone || '',
        email: client.email || '',
        address: client.address || '',
        structuredAddress: client.structuredAddress,
        communicationChannels: client.communicationChannels || [],
        source: client.source || ClientSource.OTHER,
        sourceDetails: client.sourceDetails || '',
      };

      console.log('🎯 ClientEditingStore.startEditing - створена formData:', {
        formData,
        structuredAddress: formData.structuredAddress,
        formDataKeys: Object.keys(formData),
      });

      set({
        formData,
        originalClient: client,
        isLoading: false,
        error: null,
      });
    },

    setFormData: (data) => {
      console.log('🔧 ClientEditingStore.setFormData:', {
        newData: data,
        structuredAddress: data.structuredAddress,
        dataKeys: Object.keys(data),
      });

      set((state) => {
        const updatedFormData = state.formData ? { ...state.formData, ...data } : null;
        console.log('🔧 ClientEditingStore.setFormData - результат:', {
          oldFormData: state.formData,
          updatedFormData,
          structuredAddress: updatedFormData?.structuredAddress,
        });

        return {
          formData: updatedFormData,
        };
      });
    },

    setLoading: (loading) => {
      set({ isLoading: loading });
    },

    setError: (error) => {
      set({ error });
    },

    saveClient: async (): Promise<UpdateClientResult> => {
      const { formData } = get();

      console.log('🚀 ClientEditingStore.saveClient() - початок:', {
        formData,
        structuredAddress: formData?.structuredAddress,
        allKeys: formData ? Object.keys(formData) : [],
      });

      if (!formData) {
        return { client: null, errors: { general: 'Дані клієнта відсутні' } };
      }

      set({ isLoading: true, error: null });

      try {
        console.log('🚀 ClientEditingStore.saveClient() - викликаємо repository.update');
        const response = await clientRepository.update(formData);

        console.log('🚀 ClientEditingStore.saveClient() - успіх:', response);
        set({ isLoading: false });

        return { client: response, errors: null };
      } catch (error) {
        console.error('🚀 ClientEditingStore.saveClient() - помилка:', error);
        const errorMessage = error instanceof Error ? error.message : 'Помилка оновлення клієнта';

        set({ isLoading: false, error: errorMessage });

        return { client: null, errors: { general: errorMessage } };
      }
    },

    cancelEditing: () => {
      set(initialState);
    },
  };
});
