import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { initialClientState } from './constants';
import {
  createClientSearchSlice,
  createClientSelectionSlice,
  createClientCreationSlice,
  createClientEditingSlice,
} from './slices';
import { ClientStore, WizardGlobalState } from './types';

/**
 * Створення стору для роботи з клієнтами
 * Використовується композиція слайсів для розділення функціональності
 * Додано персистентність для збереження стану між сесіями
 */
export const useClientStore = create<ClientStore>()(
  persist(
    (set, get, store) => ({
      // Базовий стан
      ...initialClientState,

      // Слайс для пошуку клієнтів
      ...createClientSearchSlice(set, get, store),

      // Слайс для вибору клієнта
      ...createClientSelectionSlice(set, get, store),

      // Слайс для створення нового клієнта
      ...createClientCreationSlice(set, get, store),

      // Слайс для редагування клієнта
      ...createClientEditingSlice(set, get, store),

      // Загальні дії
      resetState: () => {
        set(initialClientState);
      },

      // Інтеграція з глобальним станом
      syncWithGlobalState: (wizardState: WizardGlobalState) => {
        // Перевіряємо наявність даних клієнта у глобальному стані
        if (wizardState?.client) {
          // Синхронізуємо вибраного клієнта з глобальним станом
          set({ selectedClient: wizardState.client });

          // Якщо потрібно, можна також оновити інші частини стану
          if (wizardState?.clientMode) {
            set({ mode: wizardState.clientMode });
          }
        }
      },

      // Метод для отримання даних клієнта для наступних кроків візарда
      getClientDataForWizard: () => {
        const { selectedClient } = get();

        // Для інтеграції з іншими кроками, можна повертати тільки необхідні поля
        // або трансформувати дані в потрібний формат
        if (selectedClient) {
          return {
            ...selectedClient,
            // Додаткові обчислювані поля для інших кроків
            fullName: `${selectedClient.lastName} ${selectedClient.firstName}`,
            // Можна додати інші поля для зручності використання в інших кроках
          };
        }

        return null;
      },
    }),
    {
      name: 'aksi-client-storage', // Назва для localStorage
      storage: createJSONStorage(() => localStorage), // Використовуємо localStorage
      partialize: (state) => ({
        // Зберігаємо тільки важливі дані, не зберігаємо тимчасові стани
        selectedClient: state.selectedClient,
        // Зберігаємо також режим роботи з клієнтом
        mode: state.mode,
        // Зберігаємо дані форми створення клієнта, щоб не втратити дані при перезавантаженні
        newClient: {
          firstName: state.newClient.firstName,
          lastName: state.newClient.lastName,
          phone: state.newClient.phone,
          email: state.newClient.email,
          address: state.newClient.address,
          communicationChannels: state.newClient.communicationChannels,
          source: state.newClient.source,
          sourceDetails: state.newClient.sourceDetails,
          // Не зберігаємо isLoading та error
        },
        // Зберігаємо останній запит пошуку
        search: {
          query: state.search.query,
          page: state.search.page,
          size: state.search.size,
          // Не зберігаємо результати пошуку та статуси
        },
      }),
    }
  )
);
