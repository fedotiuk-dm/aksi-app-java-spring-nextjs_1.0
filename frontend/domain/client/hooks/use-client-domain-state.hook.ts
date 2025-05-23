import { useMemo } from 'react';

import { useClientCreationStore } from '../store/client-creation.store';
import { useClientEditingStore } from '../store/client-editing.store';
import { useClientSearchStore } from '../store/client-search.store';
import { useClientSelectionStore } from '../store/client-selection.store';
import { useClientDomainStore } from '../store/client-store';
import { ClientMode } from '../types/client-enums';

/**
 * Хук для отримання повного стану клієнтського домену
 *
 * SOLID принципи:
 * - Single Responsibility: тільки композиція стану домену
 * - Interface Segregation: надає структурований доступ до різних аспектів домену
 * - Dependency Inversion: залежить від абстракцій сторів
 *
 * Об'єднує дані з усіх спеціалізованих сторів і надає computed properties
 */
export const useClientDomainState = () => {
  const domainStore = useClientDomainStore();
  const creationStore = useClientCreationStore();
  const editingStore = useClientEditingStore();
  const searchStore = useClientSearchStore();
  const selectionStore = useClientSelectionStore();

  /**
   * Computed properties з мемоізацією для оптимізації
   */
  const computedState = useMemo(
    () => ({
      // Стан завантаження
      isAnyLoading:
        domainStore.isGlobalLoading ||
        creationStore.isLoading ||
        editingStore.isLoading ||
        searchStore.isLoading,

      // Стан помилок
      hasAnyError: Boolean(
        domainStore.globalError || creationStore.error || editingStore.error || searchStore.error
      ),

      // Поточний клієнт
      currentClient: selectionStore.selectedClient,

      // Статистика домену
      stats: {
        searchResultsCount: searchStore.results.length,
        hasSelectedClient: Boolean(selectionStore.selectedClient),
        isCreating: domainStore.mode === ClientMode.CREATE,
        isEditing: domainStore.mode === ClientMode.EDIT,
        isSelecting: domainStore.mode === ClientMode.SELECT,
      },
    }),
    [domainStore, creationStore, editingStore, searchStore, selectionStore]
  );

  return {
    // Композиційний стан домену
    domain: domainStore,

    // Спеціалізовані стори
    creation: creationStore,
    editing: editingStore,
    search: searchStore,
    selection: selectionStore,

    // Computed properties
    ...computedState,
  };
};
