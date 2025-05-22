import { ClientPageResponse } from '@/lib/api';

import { ClientStore, ClientUtilityActions, ClientIntegrationActions } from '../../types';

/**
 * Тип для результатів допоміжних дій
 */
export type UtilityActionsResult = ClientUtilityActions &
  Pick<ClientIntegrationActions, 'resetState'>;

/**
 * Інтерфейс для допоміжних дій стору
 */
export interface UtilityActions {
  searchClientsByPage: (page: number) => Promise<ClientPageResponse | null>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearClients: () => void;
  resetState: () => void;
}

/**
 * Створення допоміжних дій для стору
 *
 * @param set - Функція оновлення стану
 * @param get - Функція отримання поточного стану
 * @param initialState - Початковий стан
 * @returns Об'єкт з допоміжними діями
 */
export const createUtilityActions = (
  set: (state: Partial<ClientStore>) => void,
  get: () => ClientStore,
  initialState = {} as Partial<ClientStore>
): UtilityActionsResult => ({
  /**
   * Пошук клієнтів з вказаною сторінкою
   */
  searchClientsByPage: async (page: number): Promise<ClientPageResponse | null> => {
    set({
      search: {
        ...get().search,
        page,
      },
    });
    return (await get().searchClients()) as unknown as ClientPageResponse | null;
  },

  /**
   * Встановлення стану завантаження
   */
  setLoading: (isLoading: boolean): void => {
    set({
      search: {
        ...get().search,
        isLoading,
      },
    });
  },

  /**
   * Встановлення помилки
   */
  setError: (error: string | null): void => {
    set({
      search: {
        ...get().search,
        error,
      },
    });
  },

  /**
   * Очищення списку клієнтів
   */
  clearClients: (): void => {
    set({
      clients: [],
      search: {
        ...get().search,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      },
    });
  },

  /**
   * Скидання стану до початкового
   */
  resetState: () => {
    set(initialState);
  },
});
