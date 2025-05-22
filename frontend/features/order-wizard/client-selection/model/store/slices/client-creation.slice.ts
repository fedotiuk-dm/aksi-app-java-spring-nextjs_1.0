import { ClientResponse, ClientsService, CreateClientRequest } from '@/lib/api';

import { initialNewClientState } from '../../constants';
import {
  ClientCreationActions,
  ClientFieldValue,
  ClientFormField,
  ClientStore,
  ValidationErrors,
} from '../../types';
import { createSlice } from '../utils/slice-factory';

/**
 * Слайс стору для функціональності створення клієнта
 */
export const createClientCreationSlice = createSlice<
  Pick<ClientStore, keyof ClientCreationActions>
>('clientCreation', (set, get) => ({
  setNewClientField: <T extends ClientFormField>(field: T, value: ClientFieldValue) => {
    set((state) => ({
      newClient: {
        ...state.newClient,
        [field]: value,
      },
    }));
  },

  // Для сумісності з існуючим кодом - ті ж дії, що й setNewClientField
  updateNewClientField: <T extends ClientFormField>(field: T, value: ClientFieldValue) => {
    set((state) => ({
      newClient: {
        ...state.newClient,
        [field]: value,
      },
    }));
  },

  clearNewClient: () => {
    set(() => ({
      newClient: initialNewClientState,
    }));
  },

  createClient: async (): Promise<{
    client: ClientResponse | null;
    errors: ValidationErrors | null;
  }> => {
    // Отримуємо дані для створення клієнта
    const { newClient } = get();
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      communicationChannels,
      source,
      sourceDetails,
    } = newClient;

    // Встановлюємо стан завантаження
    set((state) => ({
      newClient: {
        ...state.newClient,
        isLoading: true,
        error: null,
      },
    }));

    try {
      // Підготовка даних для запиту
      const requestData: CreateClientRequest = {
        firstName,
        lastName,
        phone,
        email: email || undefined,
        address: typeof address === 'string' ? address : undefined,
        communicationChannels: communicationChannels || ['PHONE'],
        source:
          source && source.length > 0
            ? (source[0] as CreateClientRequest.source)
            : CreateClientRequest.source.INSTAGRAM,
        sourceDetails: sourceDetails || undefined,
      };

      // Виконання API-запиту на створення клієнта
      const client: ClientResponse = await ClientsService.createClient({
        requestBody: requestData,
      });

      // Зберігаємо створеного клієнта як вибраного
      set((state) => ({
        selectedClient: client,
        mode: state.mode === 'new' ? 'existing' : state.mode,
        newClient: {
          ...initialNewClientState,
          isLoading: false,
        },
      }));

      return { client, errors: null };
    } catch (error) {
      // Обробка помилок
      let errorMessage = 'Помилка створення клієнта';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Обробка помилок API
        const apiError = error as { response?: { data?: { message?: string; error?: string } } };
        if (apiError.response?.data) {
          const responseData = apiError.response.data;
          errorMessage = responseData.message || responseData.error || errorMessage;
        }
      }

      // Оновлення стану з помилкою
      set((state) => ({
        newClient: {
          ...state.newClient,
          isLoading: false,
          error: errorMessage,
        },
      }));

      return { client: null, errors: { general: errorMessage } };
    }
  },
}));
