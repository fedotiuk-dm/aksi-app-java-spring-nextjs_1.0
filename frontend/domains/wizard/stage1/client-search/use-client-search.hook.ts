/**
 * @fileoverview Композиційний хук для домену "Пошук клієнтів"
 *
 * Об'єднує всі розділені хуки в єдиний інтерфейс
 * за принципом "Golden Rule" архітектури та SOLID принципами
 */

import { useMemo } from 'react';

import { useClientSearchBusiness } from './use-client-search-business.hook';
import { useClientSearchForms } from './use-client-search-forms.hook';

/**
 * Головний композиційний хук домену "Пошук клієнтів"
 *
 * Принципи:
 * - Single Responsibility: кожен підхук має одну відповідальність
 * - Open/Closed: легко розширювати без модифікації існуючого коду
 * - Dependency Inversion: залежність від абстракцій (хуків), а не конкретних реалізацій
 */
export const useClientSearch = () => {
  // 1. Бізнес-логіка (API + стор координація)
  const business = useClientSearchBusiness();

  // 2. Управління формами
  const forms = useClientSearchForms();

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
      initialize: business.initializeSearch,
      searchClients: business.searchClients,
      searchByPhone: business.searchByPhone,
      selectClient: business.selectClient,
      clearSearch: business.clearSearch,

      // UI операції (без API)
      toggleAdvanced: business.toggleAdvancedMode,
      toggleAutoSearch: business.toggleAutoSearchMode,
      updateSearchTerm: business.updateSearchTerm,
      updatePhoneNumber: business.updatePhoneNumber,
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

export type UseClientSearchReturn = ReturnType<typeof useClientSearch>;
