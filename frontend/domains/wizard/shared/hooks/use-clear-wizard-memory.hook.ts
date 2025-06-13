import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useMainStore } from '../../main/store/main.store';
import { useStage1Store } from '../../stage1/store/stage1.store';
import { useOrderWizardClearAllSessions } from '@/shared/api/generated/main';

/**
 * 🧹 Хук для очищення всієї пам'яті Order Wizard
 *
 * Використовується для вирішення проблем з валідацією sessionId
 * та конфліктами між frontend та backend сесіями.
 *
 * @returns функція clearAllMemory для очищення всієї пам'яті
 */
export const useClearWizardMemory = () => {
  const queryClient = useQueryClient();

  // Отримуємо reset функції з всіх сторів
  const resetMainStore = useMainStore((state) => state.reset);
  const resetStage1Store = useStage1Store((state) => state.reset);

  // Orval хук для очищення backend сесій
  const clearBackendSessionsMutation = useOrderWizardClearAllSessions();

  const clearAllMemory = useCallback(async () => {
    console.log("🧹 Очищення всієї пам'яті Order Wizard...");

    // 1. Очищуємо localStorage
    try {
      const keysToRemove = [
        'wizard-session',
        'stage1-data',
        'stage2-data',
        'stage3-data',
        'stage4-data',
        'client-search-data',
        'order-wizard-data',
        'wizard-ui-state',
        'item-manager-data',
      ];

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      console.log('✅ localStorage очищено');
    } catch (error) {
      console.warn('⚠️ Помилка при очищенні localStorage:', error);
    }

    // 2. Очищуємо React Query кеш для всіх wizard запитів
    try {
      const queryKeys = [
        'order-wizard',
        'stage1',
        'stage2',
        'stage3',
        'stage4',
        'client-search',
        'item-manager',
      ];

      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
        queryClient.removeQueries({ queryKey: [key] });
      });

      console.log('✅ React Query кеш очищено');
    } catch (error) {
      console.warn('⚠️ Помилка при очищенні React Query кешу:', error);
    }

    // 3. Скидаємо всі Zustand стори
    try {
      resetMainStore();
      resetStage1Store();

      console.log('✅ Zustand стори скинуто');
    } catch (error) {
      console.warn('⚠️ Помилка при скиданні Zustand сторів:', error);
    }

    // 4. Очищуємо sessionStorage якщо використовується
    try {
      const sessionKeys = ['wizard-temp-data', 'current-step', 'form-cache'];

      sessionKeys.forEach((key) => {
        sessionStorage.removeItem(key);
      });

      console.log('✅ sessionStorage очищено');
    } catch (error) {
      console.warn('⚠️ Помилка при очищенні sessionStorage:', error);
    }

    // 5. Очищуємо backend сесії через Orval хук
    try {
      await clearBackendSessionsMutation.mutateAsync();
      console.log('✅ Backend сесії очищено через Orval');
    } catch (error) {
      console.warn('⚠️ Помилка при очищенні backend сесій:', error);
    }

    // 6. ВАЖЛИВО: Після очищення backend сесій, скидаємо стори ще раз
    // щоб переконатися що sessionId = null
    try {
      resetMainStore();
      resetStage1Store();
      console.log('✅ Стори скинуто повторно після очищення backend');
    } catch (error) {
      console.warn('⚠️ Помилка при повторному скиданні сторів:', error);
    }

    console.log("🎉 Пам'ять Order Wizard повністю очищена!");
  }, [queryClient, resetMainStore, resetStage1Store, clearBackendSessionsMutation]);

  return {
    clearAllMemory,
  };
};
