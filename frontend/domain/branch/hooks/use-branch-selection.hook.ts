import { useCallback, useEffect } from 'react';

import { useBranchSelectionStore } from '../store';
import { Branch, BranchSearchParams } from '../types';

// Додаємо імпорт wizard для оновлення availability
let wizardStoreModule: any = null;
const getWizardStore = async () => {
  if (!wizardStoreModule) {
    wizardStoreModule = await import('../../wizard/store/wizard.store');
  }
  return wizardStoreModule.useWizardStore;
};

const getWizardStep = async () => {
  const wizardTypesModule = await import('../../wizard/types');
  return wizardTypesModule.WizardStep;
};

/**
 * Хук для вибору приймального пункту
 * Інкапсулює доступ до стору та забезпечує зручний API для UI компонентів
 *
 * DDD принципи:
 * - Інкапсулює доменну логіку
 * - Забезпечує простий API для UI
 * - Ізолює UI від деталей реалізації стору
 */
export const useBranchSelection = () => {
  const {
    // Стан
    availableBranches,
    selectedBranch,
    isLoading,
    error,
    searchResults,
    showActiveOnly,

    // Дії
    loadAvailableBranches,
    selectBranch,
    selectBranchObject,
    clearSelection,
    searchBranches,
    clearSearch,
    setShowActiveOnly,
    setError,
  } = useBranchSelectionStore();

  // Ініціалізація - завантажуємо активні пункти при першому використанні
  useEffect(() => {
    if (availableBranches.length === 0 && !isLoading) {
      loadAvailableBranches(true);
    }
  }, [availableBranches.length, isLoading, loadAvailableBranches]);

  // Зручні методи для UI
  const handleBranchSelect = useCallback(
    async (branchId: string) => {
      if (!branchId) {
        clearSelection();
        return;
      }

      await selectBranch(branchId);
    },
    [selectBranch, clearSelection]
  );

  const handleBranchSelectObject = useCallback(
    async (branch: Branch | null) => {
      if (!branch) {
        clearSelection();

        // Відключаємо availability для наступного кроку
        try {
          const useWizardStore = await getWizardStore();
          const WizardStep = await getWizardStep();
          useWizardStore.getState().updateStepAvailability(WizardStep.ITEM_MANAGER, false);
          console.log('Branch Selection: відключено availability для ITEM_MANAGER');
        } catch (error) {
          console.warn('Помилка оновлення wizard availability при очищенні:', error);
        }
        return;
      }

      selectBranchObject(branch);

      // Увімкнаємо availability для наступного кроку після успішного вибору
      try {
        const useWizardStore = await getWizardStore();
        const WizardStep = await getWizardStep();
        useWizardStore.getState().updateStepAvailability(WizardStep.ITEM_MANAGER, true);
        console.log('Branch Selection: увімкнено availability для ITEM_MANAGER');
      } catch (error) {
        console.warn('Помилка оновлення wizard availability при виборі філії:', error);
      }
    },
    [selectBranchObject, clearSelection]
  );

  const handleSearch = useCallback(
    async (keyword: string) => {
      if (!keyword.trim()) {
        clearSearch();
        return;
      }

      const searchParams: BranchSearchParams = {
        keyword: keyword.trim(),
        active: showActiveOnly ? true : undefined,
        includeInactive: !showActiveOnly,
      };

      await searchBranches(searchParams);
    },
    [searchBranches, clearSearch, showActiveOnly]
  );

  const toggleActiveFilter = useCallback(async () => {
    await setShowActiveOnly(!showActiveOnly);
  }, [setShowActiveOnly, showActiveOnly]);

  const refreshBranches = useCallback(async () => {
    await loadAvailableBranches(showActiveOnly);
  }, [loadAvailableBranches, showActiveOnly]);

  // Додаткові методи для роботи з API
  const getBranchByCode = useCallback(
    async (code: string) => {
      if (!code.trim()) {
        setError('Код приймального пункту не може бути порожнім');
        return null;
      }

      try {
        const branchRepository = new (await import('../repositories')).BranchRepository();
        const branchEntity = await branchRepository.getByCode(code.trim());
        return branchEntity.toPlainObject();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Помилка отримання пункту за кодом';
        setError(errorMessage);
        return null;
      }
    },
    [setError]
  );

  const toggleBranchActiveStatus = useCallback(
    async (branchId: string) => {
      const branch = availableBranches.find((b) => b.id === branchId);
      if (!branch) {
        setError('Приймальний пункт не знайдено');
        return null;
      }

      try {
        const branchRepository = new (await import('../repositories')).BranchRepository();
        const response = await branchRepository.setActiveStatus(branchId, !branch.active);

        // Оновлюємо локальний стан
        await refreshBranches();

        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка зміни статусу';
        setError(errorMessage);
        return null;
      }
    },
    [availableBranches, setError, refreshBranches]
  );

  // Комп'ютовані значення
  const activeBranches = availableBranches.filter((branch) => branch.active);
  const inactiveBranches = availableBranches.filter((branch) => !branch.active);

  const hasSelection = Boolean(selectedBranch);
  const hasAvailableBranches = availableBranches.length > 0;
  const hasSearchResults = Boolean(searchResults);

  // Валідація вибору
  const isSelectionValid = Boolean(selectedBranch?.id && selectedBranch?.active);

  // Обертка для clearSelection з оновленням wizard availability
  const handleClearSelection = useCallback(async () => {
    clearSelection();

    // Відключаємо availability для наступного кроку
    try {
      const useWizardStore = await getWizardStore();
      const WizardStep = await getWizardStep();
      useWizardStore.getState().updateStepAvailability(WizardStep.ITEM_MANAGER, false);
      console.log('Branch Selection: відключено availability для ITEM_MANAGER при очищенні');
    } catch (error) {
      console.warn('Помилка оновлення wizard availability при очищенні:', error);
    }
  }, [clearSelection]);

  return {
    // Стан даних
    availableBranches,
    activeBranches,
    inactiveBranches,
    selectedBranch,
    searchResults,

    // Стан UI
    isLoading,
    error,
    showActiveOnly,

    // Булеві значення
    hasSelection,
    hasAvailableBranches,
    hasSearchResults,
    isSelectionValid,

    // Методи
    selectBranch: handleBranchSelect,
    selectBranchObject: handleBranchSelectObject,
    clearSelection: handleClearSelection,
    search: handleSearch,
    clearSearch,
    toggleActiveFilter,
    refreshBranches,
    setError,

    // Статистика
    stats: {
      total: availableBranches.length,
      active: activeBranches.length,
      inactive: inactiveBranches.length,
    },

    // Додаткові методи
    getBranchByCode,
    toggleBranchActiveStatus,
  };
};
