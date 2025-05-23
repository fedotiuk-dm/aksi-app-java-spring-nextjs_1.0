import { create } from 'zustand';

import { ClientRepository } from '../repositories/client-repository';
import { CreateClientFormData, CreateClientResult } from '../types';
import { ClientSource } from '../types/client-enums';

/**
 * Стан для створення нового клієнта
 * Реалізує Single Responsibility Principle - відповідає ТІЛЬКИ за створення
 */
interface ClientCreationState {
  formData: CreateClientFormData;
  isLoading: boolean;
  error: string | null;
}

/**
 * Дії для створення клієнта
 */
interface ClientCreationActions {
  setFormData: (data: Partial<CreateClientFormData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  saveClient: () => Promise<CreateClientResult>;
  resetForm: () => void;
}

/**
 * Повний інтерфейс стору
 */
type ClientCreationStore = ClientCreationState & ClientCreationActions;

/**
 * Початковий стан
 */
const initialState: ClientCreationState = {
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

/**
 * Zustand стор для створення клієнтів
 * Реалізує принцип Single Responsibility
 */
export const useClientCreationStore = create<ClientCreationStore>((set, get) => {
  const clientRepository = new ClientRepository();

  return {
    // Початковий стан
    ...initialState,

    // Дії
    setFormData: (data) => {
      set((state) => ({
        formData: { ...state.formData, ...data },
      }));
    },

    setLoading: (loading) => {
      set({ isLoading: loading });
    },

    setError: (error) => {
      set({ error });
    },

    saveClient: async (): Promise<CreateClientResult> => {
      const { formData } = get();

      set({ isLoading: true, error: null });

      try {
        const response = await clientRepository.create(formData);

        set({ isLoading: false });

        return { client: response, errors: null };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка створення клієнта';

        set({ isLoading: false, error: errorMessage });

        return { client: null, errors: { general: errorMessage } };
      }
    },

    resetForm: () => {
      set(initialState);
    },
  };
});
