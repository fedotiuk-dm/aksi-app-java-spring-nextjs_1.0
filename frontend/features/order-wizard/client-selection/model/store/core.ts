import { create } from 'zustand';
import { StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { initialClientState } from '../constants';
import { ClientStore, PersistConfig } from '../types';

/**
 * Типізована функція-фабрика для створення стору клієнтів
 * Дозволяє композувати різні слайси та дії в єдиний стор
 *
 * @param createSlices - Функція для створення та композиції слайсів
 * @param persistConfig - Конфігурація персистентності
 * @returns Хук Zustand для стору клієнтів
 */
export const createClientStore = (
  createSlices: StateCreator<ClientStore, [], [], ClientStore>,
  persistConfig: PersistConfig
) => {
  const { storage, ...restConfig } = persistConfig;

  return create<ClientStore>()(
    persist(
      (set, get, api) => ({
        ...initialClientState,
        ...createSlices(set, get, api),
      }),
      {
        ...restConfig,
        storage: storage ? createJSONStorage(() => storage) : createJSONStorage(() => localStorage),
      }
    )
  );
};
