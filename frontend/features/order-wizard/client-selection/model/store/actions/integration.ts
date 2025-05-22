import { ClientResponse } from '@/lib/api';

import { ClientStore, WizardGlobalState } from '../../types';

/**
 * Інтерфейс для дій інтеграції з глобальним станом
 */
export interface IntegrationActions {
  syncWithGlobalState: (wizardState: WizardGlobalState) => void;
  getClientDataForWizard: () => ClientResponse | null;
}

/**
 * Створення дій для інтеграції з глобальним станом
 */
export const createIntegrationActions = (
  set: (state: Partial<ClientStore>) => void,
  get: () => ClientStore
): IntegrationActions => ({
  /**
   * Синхронізація з глобальним станом Wizard
   */
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

  /**
   * Отримання даних клієнта для наступних кроків візарда
   */
  getClientDataForWizard: () => {
    const { selectedClient } = get();

    // Для інтеграції з іншими кроками, можна повертати тільки необхідні поля
    // або трансформувати дані в потрібний формат
    if (selectedClient) {
      return {
        ...selectedClient,
        // Додаємо допоміжні поля, які можуть знадобитися для відображення
        fullName: `${selectedClient.firstName} ${selectedClient.lastName}`,
      };
    }

    return null;
  },
});
