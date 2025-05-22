import { StateCreator } from 'zustand';

import { ClientResponse, ClientsService, CreateClientRequest } from '@/lib/api';

import { NavigationActions } from '../../../wizard/store/navigation';
import { initialEditClientState } from '../constants';
import { ClientState, ClientStore } from '../types';

/**
 * Слайс стору для функціональності редагування клієнта
 * @template State - тип стану стору
 * @template Middlewares - тип middleware для Zustand
 * @template Extenders - тип екстендерів для Zustand
 * @template Selection - тип вибраних методів та властивостей
 */
export const createClientEditingSlice: StateCreator<
  ClientStore,
  [],
  [],
  Pick<
    ClientStore,
    'startEditingClient' | 'updateEditClientField' | 'saveEditedClient' | 'cancelEditing'
  >
> = (set, get, store) => ({
  startEditingClient: (client: ClientResponse) => {
    // Зберігаємо вибраного клієнта як клієнта для редагування
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

  updateEditClientField: <K extends keyof ClientState['editClient']>(
    field: K,
    value: ClientState['editClient'][K]
  ) => {
    set((state) => ({
      editClient: {
        ...state.editClient,
        [field]: value,
      },
    }));
  },

  saveEditedClient: async () => {
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
      set((state) => ({
        editClient: {
          ...state.editClient,
          error: 'Відсутній ID клієнта для оновлення',
        },
      }));
      return null;
    }

    set((state) => ({
      editClient: {
        ...state.editClient,
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

      console.log(`Відправляємо запит на оновлення клієнта ${id}:`, requestData);

      // Використовуємо OpenAPI-генерований клієнт для оновлення клієнта
      const client = await ClientsService.updateClient({
        id,
        requestBody: requestData,
      });

      // Оновлюємо вибраного клієнта
      set((state) => ({
        // state використовується для доступу до попереднього стану
        // під час оновлення, що забезпечує правильне об'єднання з
        // даними, збереженими через middleware persist
        mode: 'existing',
        selectedClient: client,
        // Зберігаємо інші дані стану, які не пов'язані з редагуванням
        clients: [...state.clients.map((c) => (c.id === client.id ? client : c))],
        editClient: {
          ...initialEditClientState,
        },
      }));

      // Доступ до навігаційних дій загального стору (якщо потрібно)
      const wizardStore = store as unknown as { navigation?: NavigationActions };
      if (wizardStore.navigation) {
        // Можемо оновити доступність кроків після успішного оновлення клієнта
        // wizardStore.navigation.updateStepAvailability(WizardStep.BRANCH_SELECTION, true);
      }

      return client;
    } catch (error) {
      console.error('Помилка оновлення клієнта:', error);

      // Отримуємо деталі помилки з відповіді
      let errorMessage = 'Помилка оновлення клієнта';

      // Обробка помилки axios
      // @ts-ignore
      if (error.response && error.response.data) {
        // @ts-ignore
        const responseData = error.response.data;
        errorMessage = responseData.message || responseData.error || errorMessage;
        console.error('Деталі API помилки:', responseData);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      set((state) => ({
        editClient: {
          ...state.editClient,
          isLoading: false,
          error: errorMessage,
        },
      }));

      return null;
    }
  },

  cancelEditing: () => {
    set({
      mode: 'existing',
      editClient: {
        ...initialEditClientState,
      },
    });
  },
});
