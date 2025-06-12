/**
 * @fileoverview Композиційний хук для домену "Менеджер предметів Stage2"
 *
 * Об'єднує всі розділені хуки в єдиний інтерфейс
 * за принципом "Golden Rule" архітектури та SOLID принципами
 */

import { useMemo } from 'react';

import { useItemManagerBusiness } from './use-item-manager-business.hook';
import { useItemManagerForms } from './use-item-manager-forms.hook';

/**
 * Головний композиційний хук домену "Менеджер предметів"
 *
 * Принципи:
 * - Single Responsibility: кожен підхук має одну відповідальність
 * - Open/Closed: легко розширювати без модифікації існуючого коду
 * - Dependency Inversion: залежність від абстракцій (хуків), а не конкретних реалізацій
 */
export const useItemManager = () => {
  // 1. Бізнес-логіка (API + стор координація)
  const business = useItemManagerBusiness();

  // 2. Управління формами
  const forms = useItemManagerForms();

  // 3. Групування результатів за логічними блоками
  const ui = useMemo(
    () => ({
      ...business.ui,
    }),
    [business.ui]
  );

  const data = useMemo(
    () => ({
      ...business.data,
    }),
    [business.data]
  );

  const loading = useMemo(
    () => ({
      ...business.loading,
    }),
    [business.loading]
  );

  const actions = useMemo(
    () => ({
      // Основні бізнес-операції (з API)
      initializeManager: business.initializeManager,
      addItemToOrder: business.addItemToOrder,
      updateItemInOrder: business.updateItemInOrder,
      deleteItemFromOrder: business.deleteItemFromOrder,
      startNewItemWizard: business.startNewItemWizard,
      startEditItemWizard: business.startEditItemWizard,

      // UI операції (без API)
      updateSearchTerm: business.updateSearchTerm,
      updateFilters: business.updateFilters,
      selectItem: business.selectItem,
      closeItemWizard: business.closeItemWizard,
      updateSettings: business.updateSettings,
      resetManager: business.resetManager,
      setSessionId: business.setExternalSessionId,
    }),
    [business]
  );

  return {
    ui,
    data,
    loading,
    actions,
    forms,
  };
};

export type UseItemManagerReturn = ReturnType<typeof useItemManager>;
