import { StateCreator } from 'zustand';

import { ClientsService, CreateClientRequest } from '@/lib/api';

import { NavigationActions } from '../../../wizard/store/navigation';
import { initialNewClientState } from '../constants';
import { ClientStore } from '../types';

/**
 * Слайс стору для функціональності створення клієнта
 * @template State - тип стану стору
 * @template Middlewares - тип middleware для Zustand
 * @template Extenders - тип екстендерів для Zustand
 * @template Selection - тип вибраних методів та властивостей
 */
export const createClientCreationSlice: StateCreator<
  ClientStore,
  [],
  [],
  Pick<ClientStore, 'updateNewClientField' | 'createClient'>
> = (set, get, store) => ({
  updateNewClientField: (field, value) => {
    set((state) => ({
      newClient: {
        ...state.newClient,
        [field]: value,
      },
    }));
  },

  createClient: async () => {
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

      console.log('Відправляємо запит на створення клієнта:', requestData);

      // Використовуємо OpenAPI-генерований клієнт для створення клієнта
      const client = await ClientsService.createClient({
        requestBody: requestData,
      });

      // Зберігаємо створеного клієнта як вибраного
      set((state) => ({
        // state використовується для доступу до попереднього стану
        // під час оновлення, що забезпечує правильне об'єднання з
        // даними, збереженими через middleware persist
        selectedClient: client,
        mode: state.mode === 'new' ? 'existing' : state.mode, // Використовуємо state для визначення режиму
        newClient: {
          ...initialNewClientState,
          isLoading: false,
        },
      }));

      // Після успішного створення клієнта викликаємо метод з основного store для переходу далі
      // Отримуємо доступ до методів навігації візарда через store
      const wizardStore = store as unknown as { navigation?: NavigationActions };
      if (wizardStore.navigation?.goToStep) {
        // Можливість автоматично перейти до наступного кроку після створення клієнта
        // Наприклад, до вибору філії
        // wizardStore.navigation.goToStep(WizardStep.BRANCH_SELECTION);
      }

      return client;
    } catch (error) {
      console.error('Помилка створення клієнта:', error);

      // Отримуємо деталі помилки з відповіді
      let errorMessage = 'Помилка створення клієнта';

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
        newClient: {
          ...state.newClient,
          isLoading: false,
          error: errorMessage,
        },
      }));

      return null;
    }
  },
});
