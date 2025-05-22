// Імпорт слайсів
import { createIntegrationActions } from './actions/integration';
import { createValidationActions } from './actions/validation';
import { createClientStore } from './core';
import {
  createClientSearchSlice,
  createClientSelectionSlice,
  createClientCreationSlice,
  createClientEditingSlice,
} from './slices';
import { initialClientState } from '../constants';
import { PersistConfig, StorageHandler } from '../types';
import { composeSlices } from './utils/slice-factory';
import { createUtilityActions } from './utils/store-utils';

/**
 * Створення localStorage handler
 */
const storageHandler: StorageHandler | undefined =
  typeof window !== 'undefined'
    ? {
        getItem: (name: string) => localStorage.getItem(name),
        setItem: (name: string, value: string) => localStorage.setItem(name, value),
        removeItem: (name: string) => localStorage.removeItem(name),
      }
    : undefined;

/**
 * Конфігурація персистентності
 */
const persistConfig: PersistConfig = {
  name: 'aksi-client-storage',
  partialize: (state) => ({
    selectedClient: state.selectedClient,
    mode: state.mode,
    clients: state.clients,
    search: {
      query: state.search.query,
      page: state.search.page,
      size: state.search.size,
      totalElements: state.search.totalElements,
      totalPages: state.search.totalPages,
      isLoading: false,
      error: null,
      hasNext: false,
      hasPrevious: false,
    },
    newClient: state.newClient,
    editClient: state.editClient,
  }),
  storage: storageHandler,
};

/**
 * Головний хук для роботи з клієнтами
 * Використовує композицію слайсів
 */
export const useClientStore = createClientStore(
  composeSlices(
    createClientSearchSlice,
    createClientSelectionSlice,
    createClientCreationSlice,
    createClientEditingSlice,
    (set, get) => createValidationActions(set, get),
    (set, get) => createIntegrationActions(set, get),
    (set, get) => createUtilityActions(set, get, initialClientState)
  ),
  persistConfig
);
