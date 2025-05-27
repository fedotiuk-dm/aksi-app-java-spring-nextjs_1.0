/**
 * @fileoverview Композиційний хук управління клієнтами (DDD архітектура)
 * @module domain/wizard/hooks/steps/client-selection
 */

import { useCallback, useMemo } from 'react';

import { useClientForm } from './use-client-form.hook';
import { useClientSearch } from './use-client-search.hook';
import { useClientSelection } from './use-client-selection.hook';
import {
  type ClientData,
  type ClientSearchResult,
  ContactMethod,
  InformationSource,
  ClientUniquenessCheckService,
  ClientManagementService,
} from '../../../services/stage-1-client-and-order-info';
import { formatPhone } from '../../../utils';

/**
 * Тип конфлікту при перевірці унікальності
 */
interface ClientConflict {
  field: 'phone' | 'email';
  value: string;
  existingClientId?: string;
}

// Ініціалізація сервісів
const uniquenessService = new ClientUniquenessCheckService();
const managementService = new ClientManagementService();

/**
 * Тип повертаємого значення композиційного хука
 */
export interface UseClientManagementReturn {
  // === ПОШУК КЛІЄНТІВ ===
  searchQuery: string;
  searchResults: ClientSearchResult[];
  isSearching: boolean;
  searchError: string | null;
  searchClients: (query: string, page?: number) => void;
  clearSearch: () => void;
  quickSearch: (query: string, limit?: number) => Promise<ClientSearchResult[]>;

  // === ФОРМА КЛІЄНТА ===
  formMethods: ReturnType<typeof useClientForm>;
  isCreatingClient: boolean;
  isUpdatingClient: boolean;
  createClient: (data: ClientData) => Promise<{ success: boolean; client?: ClientSearchResult }>;
  updateClient: (
    id: string,
    data: Partial<ClientData>
  ) => Promise<{ success: boolean; client?: ClientSearchResult }>;
  validateClientData: (data: ClientData) => { success: boolean; errors?: string[] };

  // === ВИБІР КЛІЄНТА ===
  selectedClient: ClientSearchResult | null;
  isNewClient: boolean;
  validationResult: { canProceed: boolean; errors: string[]; warnings: string[] } | null;
  selectClient: (
    client: ClientSearchResult
  ) => Promise<{ success: boolean; client?: ClientSearchResult }>;
  selectNewClient: (client: ClientSearchResult) => {
    success: boolean;
    client?: ClientSearchResult;
  };
  clearSelection: () => { success: boolean };
  proceedToNextStep: () => void;

  // === УТИЛІТИ ===
  formatPhone: (phone: string) => string;
  createClientSummary: (client: ClientSearchResult) => string;
  checkUniqueness: (
    phone: string,
    email?: string
  ) => Promise<{ unique: boolean; conflicts?: ClientConflict[] }>;

  // === КОНСТАНТИ ===
  ContactMethod: typeof ContactMethod;
  InformationSource: typeof InformationSource;
}

/**
 * Композиційний хук управління клієнтами
 *
 * Об'єднує функціональність:
 * - Пошук клієнтів
 * - Створення/редагування клієнтів
 * - Вибір клієнта для замовлення
 * - Валідація та утиліти
 */
export const useClientManagement = (
  initialData?: Partial<ClientData>
): UseClientManagementReturn => {
  // === ІНТЕГРАЦІЯ З ІСНУЮЧИМИ ХУКАМИ ===
  const { searchTerm, searchResult, isSearching, search, clearSearch, quickSearch, hasResults } =
    useClientSearch();

  const formMethods = useClientForm(initialData);
  const {
    isCreating,
    isUpdating,
    createClient: formCreateClient,
    updateClient: formUpdateClient,
  } = formMethods;

  const {
    selectedClient,
    isNewClient,
    validationResult,
    selectClient: selectionSelectClient,
    selectNewClient,
    clearSelection,
    proceedToNextStep,
  } = useClientSelection();

  // === ВАЛІДАЦІЯ ДАНИХ КЛІЄНТА ===
  const validateClientData = useCallback((data: ClientData) => {
    try {
      // Базова синхронна валідація
      const errors: string[] = [];

      if (!data.firstName?.trim()) {
        errors.push("Ім'я обов'язкове");
      }

      if (!data.lastName?.trim()) {
        errors.push("Прізвище обов'язкове");
      }

      if (!data.phone?.trim()) {
        errors.push("Телефон обов'язковий");
      }

      if (
        data.informationSource === InformationSource.OTHER &&
        !data.informationSourceOther?.trim()
      ) {
        errors.push('Необхідно уточнити джерело інформації');
      }

      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch {
      return {
        success: false,
        errors: ['Помилка валідації даних'],
      };
    }
  }, []);

  // === ПЕРЕВІРКА УНІКАЛЬНОСТІ ===
  const checkUniqueness = useCallback(async (phone: string, email?: string) => {
    try {
      const result = await uniquenessService.checkClientDataUniqueness(phone, email);
      if (result.success) {
        return {
          unique: !result.data?.hasConflicts,
          conflicts: result.data?.hasConflicts ? [{ field: 'phone' as const, value: phone }] : [],
        };
      }
      return {
        unique: false,
        conflicts: [],
      };
    } catch {
      return {
        unique: false,
        conflicts: [],
      };
    }
  }, []);

  // === СТВОРЕННЯ КЛІЄНТА З ВАЛІДАЦІЄЮ ===
  const createClient = useCallback(
    async (data: ClientData) => {
      // Спочатку валідуємо дані
      const validation = validateClientData(data);
      if (!validation.success) {
        return { success: false };
      }

      // Перевіряємо унікальність
      const uniqueness = await checkUniqueness(data.phone, data.email);
      if (!uniqueness.unique) {
        return { success: false };
      }

      // Створюємо клієнта
      return await formCreateClient(data);
    },
    [validateClientData, checkUniqueness, formCreateClient]
  );

  // === ОНОВЛЕННЯ КЛІЄНТА З ВАЛІДАЦІЄЮ ===
  const updateClient = useCallback(
    async (id: string, data: Partial<ClientData>) => {
      return await formUpdateClient(id, data);
    },
    [formUpdateClient]
  );

  // === ВИБІР КЛІЄНТА З ДОДАТКОВОЮ ЛОГІКОЮ ===
  const selectClient = useCallback(
    async (client: ClientSearchResult) => {
      return await selectionSelectClient(client);
    },
    [selectionSelectClient]
  );

  // === ОБЧИСЛЕНІ ЗНАЧЕННЯ ===
  const computed = useMemo(() => {
    const searchResults = searchResult?.clients || [];
    const searchError =
      searchResults.length === 0 && hasResults === false && searchTerm
        ? 'Клієнтів не знайдено'
        : null;

    return {
      searchResults,
      searchError,
    };
  }, [searchResult, hasResults, searchTerm]);

  // === СТАБІЛЬНІ ПОСИЛАННЯ ===
  const stableApi = useMemo(
    () => ({
      // Пошук клієнтів
      searchClients: search,
      clearSearch,
      quickSearch,
    }),
    [search, clearSearch, quickSearch]
  );

  // === ПОВЕРНЕННЯ ПУБЛІЧНОГО API ===
  return {
    // Пошук клієнтів
    searchQuery: searchTerm,
    searchResults: computed.searchResults,
    isSearching,
    searchError: computed.searchError,
    ...stableApi,

    // Форма клієнта
    formMethods,
    isCreatingClient: isCreating,
    isUpdatingClient: isUpdating,
    createClient,
    updateClient,
    validateClientData,

    // Вибір клієнта
    selectedClient,
    isNewClient,
    validationResult,
    selectClient,
    selectNewClient,
    clearSelection,
    proceedToNextStep,

    // Утиліти
    formatPhone,
    createClientSummary: (client: ClientSearchResult) =>
      managementService.createClientSummary(client),
    checkUniqueness,

    // Константи
    ContactMethod,
    InformationSource,
  };
};
