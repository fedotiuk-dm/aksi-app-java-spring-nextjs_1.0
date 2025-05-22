import { ClientResponse, ClientsService, UpdateClientRequest } from '@/lib/api';

import { initialEditClientState } from '../../constants';
import {
  ClientEditingActions,
  ClientFieldValue,
  ClientFormField,
  ClientStore,
  ValidationErrors,
} from '../../types';
import { createSlice } from '../utils/slice-factory';

/**
 * Слайс стору для функціональності редагування клієнта
 */
export const createClientEditingSlice = createSlice<Pick<ClientStore, keyof ClientEditingActions>>(
  'clientEditing',
  (set, get) => ({
    setEditClient: (client: ClientResponse) => {
      set((state) => ({
        mode: 'edit',
        editClient: {
          ...state.editClient,
          id: client.id || null,
          firstName: client.firstName || '',
          lastName: client.lastName || '',
          phone: client.phone || '',
          email: client.email || null,
          address: client.address || null,
          communicationChannels: client.communicationChannels || ['PHONE'],
          source: client.source
            ? Array.isArray(client.source)
              ? client.source
              : [client.source]
            : [],
          sourceDetails: client.sourceDetails || null,
          isLoading: false,
          error: null,
        },
      }));
    },

    // Для сумісності з існуючим кодом
    startEditingClient: (client: ClientResponse) => {
      const { setEditClient } = get();
      setEditClient(client);
    },

    // Встановлення значення поля форми редагування
    setEditClientField: <T extends ClientFormField>(field: T, value: ClientFieldValue) => {
      set((state) => ({
        editClient: {
          ...state.editClient,
          [field]: value,
        },
      }));
    },

    // Для сумісності з існуючим кодом - ті ж дії, що й setEditClientField
    updateEditClientField: <T extends ClientFormField>(field: T, value: ClientFieldValue) => {
      set((state) => ({
        editClient: {
          ...state.editClient,
          [field]: value,
        },
      }));
    },

    saveEditedClient: async (): Promise<{
      client: ClientResponse | null;
      errors: ValidationErrors | null;
    }> => {
      // Отримуємо дані для редагування клієнта
      const { editClient } = get();
      const {
        id,
        firstName,
        lastName,
        phone,
        email,
        address,
        communicationChannels,
        source,
        sourceDetails,
      } = editClient;

      // Якщо немає id, не можемо оновити клієнта
      if (!id) {
        const errorMessage = 'Відсутній ID клієнта для оновлення';
        set((state) => ({
          editClient: {
            ...state.editClient,
            error: errorMessage,
          },
        }));
        return { client: null, errors: { general: errorMessage } };
      }

      // Встановлюємо стан завантаження
      set((state) => ({
        editClient: {
          ...state.editClient,
          isLoading: true,
          error: null,
        },
      }));

      try {
        // Підготовка даних для запиту
        const requestData: UpdateClientRequest = {
          firstName,
          lastName,
          phone,
          email: email || undefined,
          address: typeof address === 'string' ? address : undefined,
          communicationChannels: communicationChannels || ['PHONE'],
          source:
            source && source.length > 0
              ? (source[0] as UpdateClientRequest['source'])
              : UpdateClientRequest.source.INSTAGRAM,
          sourceDetails: sourceDetails || undefined,
        };

        // Виконання API-запиту на оновлення клієнта
        const client: ClientResponse = await ClientsService.updateClient({
          id,
          requestBody: requestData,
        });

        // Оновлюємо стан після успішного оновлення
        set((state) => ({
          mode: 'existing',
          selectedClient: client,
          clients: state.clients.map((c) => (c.id === client.id ? client : c)),
          editClient: initialEditClientState,
        }));

        return { client, errors: null };
      } catch (error) {
        // Обробка помилок
        let errorMessage = 'Помилка оновлення клієнта';

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
          editClient: {
            ...state.editClient,
            isLoading: false,
            error: errorMessage,
          },
        }));

        return { client: null, errors: { general: errorMessage } };
      }
    },

    cancelEditing: () => {
      set((state) => ({
        mode: state.selectedClient ? 'existing' : 'new',
        editClient: {
          ...initialEditClientState,
        },
      }));
    },

    // Очищення форми редагування
    clearEditClient: () => {
      set({
        editClient: initialEditClientState,
      });
    },
  })
);
