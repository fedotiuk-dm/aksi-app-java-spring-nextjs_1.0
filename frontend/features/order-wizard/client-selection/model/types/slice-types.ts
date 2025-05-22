import { StateCreator } from 'zustand';

import { ClientStore } from './state-types';

/**
 * Базовий тип для створення слайсів
 */
export type SliceCreator<TSlice> = StateCreator<ClientStore, [], [], TSlice>;

/**
 * Тип для повного набору слайсів
 */
export interface ClientSlices {
  search: ReturnType<typeof import('../store/slices/client-search.slice').createClientSearchSlice>;
  selection: ReturnType<
    typeof import('../store/slices/client-selection.slice').createClientSelectionSlice
  >;
  creation: ReturnType<
    typeof import('../store/slices/client-creation.slice').createClientCreationSlice
  >;
  editing: ReturnType<
    typeof import('../store/slices/client-editing.slice').createClientEditingSlice
  >;
}

/**
 * Тип для persist storage
 */
export interface StorageHandler {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}

/**
 * Тип для persist конфігурації
 */
export interface PersistConfig {
  name: string;
  partialize: (state: ClientStore) => Partial<ClientStore>;
  storage?: StorageHandler;
}
