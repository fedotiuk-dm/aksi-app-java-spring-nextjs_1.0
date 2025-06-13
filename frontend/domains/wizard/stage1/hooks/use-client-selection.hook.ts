// 🎯 КОМПОЗИЦІЙНИЙ ХУК для вибору/створення клієнта
// Об'єднує логіку пошуку та створення клієнта в одному місці

import { useCallback, useMemo } from 'react';

import { useClientCreate } from './use-client-create.hook';
import { useClientSearch } from './use-client-search.hook';
import { CLIENT_MODES, type ClientMode } from '../utils/stage1-mapping';

/**
 * 🎯 Головний хук для роботи з клієнтами в Stage1
 *
 * Функціональність:
 * - Переключення між режимами пошуку та створення
 * - Композиція логіки пошуку та створення
 * - Єдиний інтерфейс для UI компонентів
 */
export const useClientSelection = () => {
  // 1. Підхуки
  const clientSearch = useClientSearch();
  const clientCreate = useClientCreate();

  // 2. Поточний режим роботи
  const currentMode = useMemo((): ClientMode => {
    if (clientCreate.ui.isCreateMode) {
      return CLIENT_MODES.CREATE;
    }
    return CLIENT_MODES.SEARCH;
  }, [clientCreate.ui.isCreateMode]);

  // 3. Обробники переключення режимів
  const handleSwitchToSearch = useCallback(() => {
    clientCreate.actions.cancelCreate();
    clientSearch.actions.startSearch();
  }, [clientCreate.actions, clientSearch.actions]);

  const handleSwitchToCreate = useCallback(() => {
    clientSearch.actions.clearSearch();
    clientCreate.actions.startCreate();
  }, [clientSearch.actions, clientCreate.actions]);

  // 4. Обробники завершення процесів
  const handleClientSelected = useCallback(() => {
    // Клієнт обраний - можна переходити до наступного етапу
    return clientSearch.computed.selectedClient;
  }, [clientSearch.computed.selectedClient]);

  const handleClientCreated = useCallback(() => {
    // Клієнт створений - повертаємося до пошуку з автовибором
    handleSwitchToSearch();
    return clientCreate.data.creationState;
  }, [clientCreate.data.creationState, handleSwitchToSearch]);

  // 5. Computed значення
  const computed = useMemo(() => {
    return {
      // Режим роботи
      currentMode,
      isSearchMode: currentMode === CLIENT_MODES.SEARCH,
      isCreateMode: currentMode === CLIENT_MODES.CREATE,

      // Стан готовності
      hasSelectedClient: !!clientSearch.computed.selectedClient,
      isClientSelectionCompleted: !!clientSearch.computed.selectedClient,

      // Обраний клієнт
      selectedClient: clientSearch.computed.selectedClient,

      // Можливість переходу до наступного етапу
      canProceedToNextStep: !!clientSearch.computed.selectedClient,
    };
  }, [currentMode, clientSearch.computed.selectedClient]);

  // 6. Групування повернення
  return {
    // Режими роботи
    mode: {
      current: computed.currentMode,
      isSearch: computed.isSearchMode,
      isCreate: computed.isCreateMode,
      switchToSearch: handleSwitchToSearch,
      switchToCreate: handleSwitchToCreate,
    },

    // Підхуки
    search: clientSearch,
    create: clientCreate,

    // Дані
    data: {
      selectedClient: computed.selectedClient,
      creationState: clientCreate.data.creationState,
    },

    // Стани завантаження
    loading: {
      isSearching: clientSearch.loading.isSearching,
      isCreating: clientCreate.loading.isCreating,
      isAnyLoading: clientSearch.loading.isSearching || clientCreate.loading.isCreating,
    },

    // Дії
    actions: {
      selectClient: clientSearch.actions.selectClient,
      createClient: clientCreate.actions.createClient,
      onClientSelected: handleClientSelected,
      onClientCreated: handleClientCreated,
    },

    // Computed значення
    computed,

    // Константи
    constants: {
      modes: CLIENT_MODES,
    },
  };
};

export type UseClientSelectionReturn = ReturnType<typeof useClientSelection>;
