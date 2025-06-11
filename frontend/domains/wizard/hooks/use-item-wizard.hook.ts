import { useCallback, useMemo } from 'react';

import { useStage2Store } from '../store/stage2.store';

import type { UseItemWizardReturn } from '../types/stage2.types';

/**
 * Хук для управління підвізардом предметів
 *
 * Відповідальність:
 * - Управління станом підвізарда (створення/редагування)
 * - Запуск та закриття підвізарда
 * - Відстеження активного режиму роботи
 */
export const useItemWizard = (): UseItemWizardReturn => {
  // Витягуємо потрібні дані та методи зі стору
  const {
    wizardMode,
    editingItemId,
    activeWizardId,
    isLoading,
    error,

    // Методи управління візардом
    startNewItemWizard,
    startEditItemWizard,
    closeWizard,
  } = useStage2Store();

  // Обчислювані значення
  const isWizardActive = useMemo(() => {
    return wizardMode !== 'inactive';
  }, [wizardMode]);

  // Мемоізовані методи
  const memoizedStartNewItem = useCallback(async () => {
    await startNewItemWizard();
  }, [startNewItemWizard]);

  const memoizedStartEditItem = useCallback(
    async (itemId: string) => {
      await startEditItemWizard(itemId);
    },
    [startEditItemWizard]
  );

  const memoizedCloseWizard = useCallback(async () => {
    await closeWizard();
  }, [closeWizard]);

  return {
    // Wizard стан
    wizardMode,
    isWizardActive,
    editingItemId,
    activeWizardId,

    // Методи управління візардом
    startNewItem: memoizedStartNewItem,
    startEditItem: memoizedStartEditItem,
    closeWizard: memoizedCloseWizard,

    // Стан завантаження
    isLoading,
    error,
  };
};
