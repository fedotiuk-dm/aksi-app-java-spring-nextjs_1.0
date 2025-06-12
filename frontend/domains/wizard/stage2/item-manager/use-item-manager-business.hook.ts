/**
 * @fileoverview Бізнес-логіка хук для домену "Менеджер предметів Stage2"
 *
 * Відповідальність: координація між API та UI стором
 * Принцип: Single Responsibility Principle
 */

import { useCallback, useMemo, useEffect } from 'react';

import { useItemManagerStore } from './item-manager.store';
import { useItemManagerAPI } from './use-item-manager-api.hook';

/**
 * Хук для бізнес-логіки менеджера предметів
 * Координує взаємодію між API та UI станом
 */
export const useItemManagerBusiness = () => {
  const {
    // Стан
    sessionId,
    searchTerm,
    activeFilters,
    selectedItemId,
    wizardOpen,
    wizardMode,
    settings,
    loading,
    error,

    // Дії з стором
    setSessionId,
    setSearchTerm,
    setActiveFilters,
    setSelectedItem,
    setWizardOpen,
    setSettings,
    setLoading,
    setError,
    clearSelection,
    closeWizard,
    resetState,
  } = useItemManagerStore();

  // API операції
  const api = useItemManagerAPI(sessionId);

  // Координаційні бізнес-операції з useCallback
  const initializeManager = useCallback(
    async (orderId: string) => {
      try {
        setLoading(true);
        const result = await api.operations.initializeManager(orderId);

        // Оновлюємо sessionId якщо отримали його з API
        if (result && typeof result === 'object' && 'sessionId' in result) {
          setSessionId(result.sessionId as string);
        }

        setError(null);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Помилка ініціалізації менеджера';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api.operations, setLoading, setError, setSessionId]
  );

  const addItemToOrder = useCallback(
    async (itemData: any) => {
      try {
        setLoading(true);
        const result = await api.operations.addItemToOrder(itemData);
        setError(null);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка додавання предмета';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api.operations, setLoading, setError]
  );

  const updateItemInOrder = useCallback(
    async (itemId: string, itemData: any) => {
      try {
        setLoading(true);
        const result = await api.operations.updateItemInOrder(itemId, itemData);
        setError(null);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка оновлення предмета';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api.operations, setLoading, setError]
  );

  const deleteItemFromOrder = useCallback(
    async (itemId: string) => {
      try {
        setLoading(true);
        const result = await api.operations.deleteItemFromOrder(itemId);
        clearSelection(); // Очищуємо вибір після видалення
        setError(null);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка видалення предмета';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api.operations, setLoading, setError, clearSelection]
  );

  const startNewItemWizard = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.operations.startNewItemWizard();
      setWizardOpen(true, 'create');
      setError(null);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Помилка запуску візарда створення';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api.operations, setLoading, setError, setWizardOpen]);

  const startEditItemWizard = useCallback(
    async (itemId: string) => {
      try {
        setLoading(true);
        setSelectedItem(itemId); // Встановлюємо вибраний предмет
        const result = await api.operations.startEditItemWizard(itemId);
        setWizardOpen(true, 'edit');
        setError(null);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Помилка запуску візарда редагування';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api.operations, setLoading, setError, setSelectedItem, setWizardOpen]
  );

  // UI операції (прості, без API) з useCallback
  const updateSearchTerm = useCallback(
    (term: string) => {
      setSearchTerm(term);
    },
    [setSearchTerm]
  );

  const updateFilters = useCallback(
    (filters: any) => {
      setActiveFilters(filters);
    },
    [setActiveFilters]
  );

  const selectItem = useCallback(
    (itemId: string | null) => {
      setSelectedItem(itemId);
    },
    [setSelectedItem]
  );

  const closeItemWizard = useCallback(() => {
    closeWizard();
    clearSelection();
  }, [closeWizard, clearSelection]);

  const updateSettings = useCallback(
    (newSettings: any) => {
      setSettings(newSettings);
    },
    [setSettings]
  );

  const resetManager = useCallback(() => {
    resetState();
  }, [resetState]);

  const setExternalSessionId = useCallback(
    (newSessionId: string) => {
      setSessionId(newSessionId);
    },
    [setSessionId]
  );

  // Мемоізовані групи даних
  const data = useMemo(() => api.data, [api.data]);
  const apiLoading = useMemo(() => api.loading, [api.loading]);

  const ui = useMemo(
    () => ({
      sessionId,
      searchTerm,
      activeFilters,
      selectedItemId,
      wizardOpen,
      wizardMode,
      settings,
      error,
    }),
    [sessionId, searchTerm, activeFilters, selectedItemId, wizardOpen, wizardMode, settings, error]
  );

  const combinedLoading = useMemo(
    () => ({
      ...apiLoading,
      isLocalLoading: loading,
      anyLoading: apiLoading.anyLoading || loading,
    }),
    [apiLoading, loading]
  );

  return {
    // Основні бізнес-операції
    initializeManager,
    addItemToOrder,
    updateItemInOrder,
    deleteItemFromOrder,
    startNewItemWizard,
    startEditItemWizard,

    // UI операції
    updateSearchTerm,
    updateFilters,
    selectItem,
    closeItemWizard,
    updateSettings,
    resetManager,
    setExternalSessionId,

    // API дані
    data,

    // Стани завантаження
    loading: combinedLoading,

    // UI стан
    ui,
  };
};

export type UseItemManagerBusinessReturn = ReturnType<typeof useItemManagerBusiness>;
