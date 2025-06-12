/**
 * @fileoverview Бізнес-логіка хук для домену "Пошук клієнтів"
 *
 * Відповідальність: координація між API та UI стором
 * Принцип: Single Responsibility Principle
 */

import { useCallback, useMemo, useEffect } from 'react';

import { useDebounce } from '@/shared/lib/hooks/useDebounce';

import { useClientSearchStore } from './client-search.store';
import { useClientSearchAPI } from './use-client-search-api.hook';

import type { SearchFormData, PhoneFormData } from './client-search.schemas';

/**
 * Хук для бізнес-логіки пошуку клієнтів
 * Координує взаємодію між API та UI станом
 */
export const useClientSearchBusiness = () => {
  const {
    // Стан
    searchTerm,
    phoneNumber,
    selectedClientId,
    showAdvanced,
    autoSearchEnabled,
    sessionId,

    // Дії з стором
    setSearchTerm,
    setPhoneNumber,
    setSelectedClient,
    toggleAdvanced,
    toggleAutoSearch,
    setSessionId,
    reset,
  } = useClientSearchStore();

  // API операції
  const api = useClientSearchAPI(sessionId);

  // Debounced значення для автоматичного пошуку
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms затримка
  const debouncedPhoneNumber = useDebounce(phoneNumber, 500);

  // Стабільні посилання на API функції
  const searchClientsAPI = useCallback(
    (term: string) => api.operations.searchClients(term),
    [api.operations]
  );

  const searchByPhoneAPI = useCallback(
    (phone: string) => api.operations.searchByPhone(phone),
    [api.operations]
  );

  // Автоматичний пошук при зміні debounced значень (тільки якщо увімкнений)
  useEffect(() => {
    console.log('🔍 Debounce effect triggered:', {
      autoSearchEnabled,
      sessionId: !!sessionId,
      searchTerm,
      debouncedSearchTerm,
      length: debouncedSearchTerm?.length || 0,
    });

    if (autoSearchEnabled && sessionId && debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      console.log('🚀 Auto-searching for:', debouncedSearchTerm);
      searchClientsAPI(debouncedSearchTerm).catch((error) => {
        console.error('Auto-search failed:', error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSearchEnabled, sessionId, debouncedSearchTerm]);

  useEffect(() => {
    if (
      autoSearchEnabled &&
      sessionId &&
      debouncedPhoneNumber &&
      debouncedPhoneNumber.length >= 10
    ) {
      console.log('📞 Auto-searching by phone:', debouncedPhoneNumber);
      searchByPhoneAPI(debouncedPhoneNumber).catch((error) => {
        console.error('Auto phone search failed:', error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSearchEnabled, sessionId, debouncedPhoneNumber]);

  // Координаційні бізнес-операції з useCallback
  const initializeSearch = useCallback(async () => {
    try {
      const newSessionId = await api.operations.initializeSearch();

      if (typeof newSessionId === 'string') {
        setSessionId(newSessionId);
      }

      return newSessionId;
    } catch (error) {
      console.error('Business Error - Failed to initialize search:', error);
      throw error;
    }
  }, [api.operations, setSessionId]);

  const searchClients = useCallback(
    async (data: SearchFormData) => {
      try {
        // Оновлюємо локальний стан
        setSearchTerm(data.searchTerm);

        // Виконуємо API запит
        return await api.operations.searchClients(data.searchTerm);
      } catch (error) {
        console.error('Business Error - Failed to search clients:', error);
        throw error;
      }
    },
    [api.operations, setSearchTerm]
  );

  const searchByPhone = useCallback(
    async (data: PhoneFormData) => {
      try {
        // Оновлюємо локальний стан
        setPhoneNumber(data.phoneNumber);

        // Виконуємо API запит
        return await api.operations.searchByPhone(data.phoneNumber);
      } catch (error) {
        console.error('Business Error - Failed to search by phone:', error);
        throw error;
      }
    },
    [api.operations, setPhoneNumber]
  );

  const selectClient = useCallback(
    async (clientId: string) => {
      try {
        // Оновлюємо локальний стан
        setSelectedClient(clientId);

        // Виконуємо API запит
        return await api.operations.selectClient(clientId);
      } catch (error) {
        console.error('Business Error - Failed to select client:', error);
        throw error;
      }
    },
    [api.operations, setSelectedClient]
  );

  const clearSearch = useCallback(async () => {
    try {
      // Спочатку очищуємо API стан
      if (sessionId) {
        await api.operations.clearSearch();
      }
    } catch (error) {
      console.error('Business Error - Failed to clear search on server:', error);
      // Продовжуємо з локальним очищенням навіть якщо API не вдалося
    } finally {
      // Завжди очищуємо локальний стан
      reset();
    }
  }, [api.operations, sessionId, reset]);

  // UI операції (прості, без API) з useCallback
  const toggleAdvancedMode = useCallback(() => {
    toggleAdvanced();
  }, [toggleAdvanced]);

  const toggleAutoSearchMode = useCallback(() => {
    toggleAutoSearch();
  }, [toggleAutoSearch]);

  const updateSearchTerm = useCallback(
    (term: string) => {
      setSearchTerm(term);
    },
    [setSearchTerm]
  );

  const updatePhoneNumber = useCallback(
    (phone: string) => {
      setPhoneNumber(phone);
    },
    [setPhoneNumber]
  );

  const setExternalSessionId = useCallback(
    (newSessionId: string) => {
      setSessionId(newSessionId);
    },
    [setSessionId]
  );

  // Мемоізовані групи даних
  const data = useMemo(() => api.data, [api.data]);
  const loading = useMemo(() => api.loading, [api.loading]);
  const ui = useMemo(
    () => ({
      searchTerm,
      phoneNumber,
      selectedClientId,
      showAdvanced,
      autoSearchEnabled,
      sessionId,
    }),
    [searchTerm, phoneNumber, selectedClientId, showAdvanced, autoSearchEnabled, sessionId]
  );

  return {
    // Основні бізнес-операції
    initializeSearch,
    searchClients,
    searchByPhone,
    selectClient,
    clearSearch,

    // UI операції
    toggleAdvancedMode,
    toggleAutoSearchMode,
    updateSearchTerm,
    updatePhoneNumber,
    setExternalSessionId,

    // API дані
    data,

    // Стани завантаження
    loading,

    // UI стан
    ui,
  };
};

export type UseClientSearchBusinessReturn = ReturnType<typeof useClientSearchBusiness>;
