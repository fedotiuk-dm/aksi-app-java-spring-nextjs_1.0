/**
 * @fileoverview Хук для операцій Stage 1 - Клієнт та базова інформація замовлення
 *
 * Інкапсулює всю логіку роботи з першим етапом Order Wizard:
 * - Автоматичний пошук клієнтів з debounce
 * - Пошук та вибір клієнта
 * - Створення нового клієнта
 * - Базова інформація замовлення
 * - Створення ордеру
 */

import { useCallback, useState, useMemo, useEffect } from 'react';

import {
  useCreateClient,
  useGetAllBranchLocations,
  useCreateOrder,
  useSearchClientsWithPagination,
  generateReceiptNumber1,
  type ClientResponse,
  type CreateClientRequest,
  type BranchLocationDTO,
  type CreateOrderRequest,
  type OrderDTO,
  type ClientSearchRequest,
  type ClientPageResponse,
} from '@/shared/api/generated/full';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';

import { useWizardNavigationStore } from '../store/wizard-navigation.store';

export interface Stage1OperationsState {
  // Клієнт
  selectedClient: ClientResponse | null;
  isCreatingNewClient: boolean;
  searchQuery: string;

  // Базова інформація
  selectedBranch: BranchLocationDTO | null;
  tagNumber: string;
  receiptNumber: string;

  // Ордер
  orderId: string | null;
}

export interface Stage1Operations {
  // Стан
  state: Stage1OperationsState;

  // Клієнтські операції
  setSearchQuery: (query: string) => void;
  selectClient: (client: ClientResponse) => void;
  clearSelectedClient: () => void;
  searchClients: (query: string, page?: number) => Promise<ClientResponse[]>;

  // Пагінація пошуку
  searchPagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  searchNextPage: () => Promise<void>;
  searchPreviousPage: () => Promise<void>;
  searchToPage: (page: number) => Promise<void>;

  // Створення нового клієнта
  startNewClientCreation: () => void;
  cancelNewClientCreation: () => void;
  createNewClient: (clientData: CreateClientRequest) => Promise<ClientResponse | null>;

  // Базова інформація
  selectBranch: (branch: BranchLocationDTO) => void;
  setTagNumber: (tagNumber: string) => void;
  setReceiptNumber: (receiptNumber: string) => void;

  // Валідація та навігація
  isStage1Valid: boolean;
  completeStage1: () => Promise<void>;

  // Статуси завантаження
  isLoading: boolean;
  isSearching: boolean;
  isCreating: boolean;
  isCreatingOrder: boolean;
  error: string | null;

  // Дані для UI
  searchResults: ClientResponse[];
  availableBranches: BranchLocationDTO[];
  hasSearchResults: boolean;
}

export const useStage1Operations = (): Stage1Operations => {
  const { markStageCompleted, setCurrentStage, setOrderId } = useWizardNavigationStore();

  // Локальний стан
  const [state, setState] = useState<Stage1OperationsState>({
    selectedClient: null,
    isCreatingNewClient: false,
    searchQuery: '',
    selectedBranch: null,
    tagNumber: '',
    receiptNumber: '',
    orderId: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<ClientResponse[]>([]);
  const [isGeneratingReceiptNumber, setIsGeneratingReceiptNumber] = useState(false);

  // Стан для пагінації пошуку
  const [searchPagination, setSearchPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Debounce для пошукового запиту (затримка 500ms)
  const debouncedSearchQuery = useDebounce(state.searchQuery, 500);

  // API хуки для мутацій
  const createClientMutation = useCreateClient();
  const createOrderMutation = useCreateOrder();
  const searchClientsMutation = useSearchClientsWithPagination();

  // API хуки для запитів
  const { data: branchesData, isLoading: isBranchesLoading } = useGetAllBranchLocations();

  // Функція для генерації номера квитанції
  const generateReceiptNumberForBranch = useCallback(async (branchId: string) => {
    setIsGeneratingReceiptNumber(true);
    setError(null);

    try {
      console.log('Generating receipt number for branch:', branchId);

      // Використовуємо Orval згенеровану функцію напряму
      const receiptNumber = await generateReceiptNumber1({ branchLocationId: branchId });
      console.log('Generated receipt number:', receiptNumber);

      // Перевіряємо, чи отримали дані
      if (receiptNumber && typeof receiptNumber === 'string') {
        setState((prev) => ({ ...prev, receiptNumber }));
      } else if (receiptNumber && typeof receiptNumber === 'object' && 'data' in receiptNumber) {
        // Якщо дані завернуті в об'єкт
        setState((prev) => ({ ...prev, receiptNumber: receiptNumber.data as string }));
      } else {
        console.warn('Unexpected receipt number format:', receiptNumber);
        setState((prev) => ({ ...prev, receiptNumber: String(receiptNumber) }));
      }
    } catch (err) {
      console.error('Failed to generate receipt number:', err);
      setError('Помилка при генерації номера квитанції');
    } finally {
      setIsGeneratingReceiptNumber(false);
    }
  }, []);

  // Функція для пошуку клієнтів з пагінацією
  const handleSearchClients = useCallback(
    async (query: string, page: number = 0): Promise<ClientResponse[]> => {
      if (!query || query.length < 2) {
        setSearchResults([]);
        setSearchPagination({
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          hasNext: false,
          hasPrevious: false,
        });
        return [];
      }

      try {
        setError(null);

        const searchRequest: ClientSearchRequest = {
          query: query.trim(),
          page: page,
          size: 10, // 10 результатів на сторінку
        };

        const response: ClientPageResponse = await searchClientsMutation.mutateAsync({
          data: searchRequest,
        });

        const clients = response.content || [];

        // Оновлюємо стан пагінації
        setSearchPagination({
          currentPage: response.pageNumber || 0,
          totalPages: response.totalPages || 0,
          totalElements: response.totalElements || 0,
          hasNext: response.hasNext || false,
          hasPrevious: response.hasPrevious || false,
        });

        return clients;
      } catch (err) {
        console.error('Search clients error:', err);
        setError('Помилка при пошуку клієнтів');
        setSearchResults([]);
        setSearchPagination({
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          hasNext: false,
          hasPrevious: false,
        });
        return [];
      }
    },
    [searchClientsMutation]
  );

  // Автоматичний пошук клієнтів при зміні debouncedSearchQuery
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 2) {
      handleSearchClients(debouncedSearchQuery).then(setSearchResults);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]); // Видаляємо handleSearchClients з dependency array

  // Клієнтські операції
  const handleSetSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
    setError(null);
    // Скидаємо пагінацію при новому пошуку
    setSearchPagination({
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      hasNext: false,
      hasPrevious: false,
    });
  }, []);

  // Функції для навігації по сторінках пошуку
  const handleSearchNextPage = useCallback(async () => {
    if (searchPagination.hasNext && state.searchQuery) {
      const nextPage = searchPagination.currentPage + 1;
      const results = await handleSearchClients(state.searchQuery, nextPage);
      setSearchResults(results);
    }
  }, [
    searchPagination.hasNext,
    searchPagination.currentPage,
    state.searchQuery,
    handleSearchClients,
  ]);

  const handleSearchPreviousPage = useCallback(async () => {
    if (searchPagination.hasPrevious && state.searchQuery) {
      const prevPage = searchPagination.currentPage - 1;
      const results = await handleSearchClients(state.searchQuery, prevPage);
      setSearchResults(results);
    }
  }, [
    searchPagination.hasPrevious,
    searchPagination.currentPage,
    state.searchQuery,
    handleSearchClients,
  ]);

  const handleSearchToPage = useCallback(
    async (page: number) => {
      if (state.searchQuery && page >= 0 && page < searchPagination.totalPages) {
        const results = await handleSearchClients(state.searchQuery, page);
        setSearchResults(results);
      }
    },
    [state.searchQuery, searchPagination.totalPages, handleSearchClients]
  );

  const handleSelectClient = useCallback((client: ClientResponse) => {
    setState((prev) => ({
      ...prev,
      selectedClient: client,
      isCreatingNewClient: false,
      searchQuery: '', // Очищаємо пошук після вибору
    }));
    setSearchResults([]);
    setError(null);
  }, []);

  const handleClearSelectedClient = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedClient: null,
    }));
  }, []);

  // Створення нового клієнта
  const handleStartNewClientCreation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isCreatingNewClient: true,
      selectedClient: null,
      searchQuery: '', // Очищаємо пошук при створенні нового клієнта
    }));
    setSearchResults([]);
  }, []);

  const handleCancelNewClientCreation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isCreatingNewClient: false,
    }));
  }, []);

  const handleCreateNewClient = useCallback(
    async (clientData: CreateClientRequest): Promise<ClientResponse | null> => {
      try {
        setError(null);
        const newClient = await createClientMutation.mutateAsync({ data: clientData });

        setState((prev) => ({
          ...prev,
          selectedClient: newClient,
          isCreatingNewClient: false,
        }));

        return newClient;
      } catch (err) {
        setError('Помилка при створенні клієнта');
        console.error('Create client error:', err);
        return null;
      }
    },
    [createClientMutation]
  );

  // Базова інформація
  const handleSelectBranch = useCallback(
    async (branch: BranchLocationDTO) => {
      setState((prev) => ({ ...prev, selectedBranch: branch }));

      // Автоматично генеруємо номер квитанції при виборі філії
      if (branch.id) {
        await generateReceiptNumberForBranch(branch.id);
      }
    },
    [generateReceiptNumberForBranch]
  );

  const handleSetTagNumber = useCallback((tagNumber: string) => {
    setState((prev) => ({ ...prev, tagNumber }));
  }, []);

  const handleSetReceiptNumber = useCallback((receiptNumber: string) => {
    setState((prev) => ({ ...prev, receiptNumber }));
  }, []);

  // Створення ордеру
  const createOrder = useCallback(async (): Promise<OrderDTO | null> => {
    if (!state.selectedClient?.id || !state.selectedBranch?.id) {
      setError('Не вибрано клієнта або філію');
      return null;
    }

    try {
      setError(null);

      const orderRequest: CreateOrderRequest = {
        clientId: state.selectedClient.id,
        branchLocationId: state.selectedBranch.id,
        tagNumber: state.tagNumber || undefined,
        items: [], // Пустий список предметів на початку
        draft: true, // Створюємо як чернетку
      };

      const order = await createOrderMutation.mutateAsync({ data: orderRequest });

      // Зберігаємо orderId в стані
      setState((prev) => ({ ...prev, orderId: order.id || null }));
      setOrderId(order.id || null);

      console.log('Order created successfully:', order);
      return order;
    } catch (err) {
      setError('Помилка при створенні замовлення');
      console.error('Create order error:', err);
      return null;
    }
  }, [
    state.selectedClient,
    state.selectedBranch,
    state.tagNumber,
    createOrderMutation,
    setOrderId,
  ]);

  // Валідація
  const isStage1Valid = useMemo(() => {
    return !!(state.selectedClient && state.selectedBranch);
  }, [state.selectedClient, state.selectedBranch]);

  // Завершення етапу з створенням ордеру
  const completeStage1 = useCallback(async () => {
    if (!isStage1Valid) {
      setError("Заповніть всі обов'язкові поля");
      return;
    }

    try {
      // Створюємо ордер якщо він ще не створений
      if (!state.orderId) {
        const order = await createOrder();
        if (!order) {
          return; // Помилка вже встановлена в createOrder
        }
      }

      markStageCompleted(1);
      setCurrentStage(2);
    } catch (err) {
      setError('Помилка при завершенні етапу');
      console.error('Complete stage 1 error:', err);
    }
  }, [isStage1Valid, state.orderId, createOrder, markStageCompleted, setCurrentStage]);

  // Статуси завантаження
  const isLoading = isBranchesLoading || isGeneratingReceiptNumber;
  const isCreating = createClientMutation.isPending;
  const isCreatingOrder = createOrderMutation.isPending;
  const isSearching = searchClientsMutation.isPending;

  // Обробка даних філій
  const availableBranches = Array.isArray(branchesData) ? branchesData : [];

  // Підрахунок результатів
  const hasSearchResults = searchResults.length > 0;

  return {
    // Стан
    state,

    // Клієнтські операції
    setSearchQuery: handleSetSearchQuery,
    selectClient: handleSelectClient,
    clearSelectedClient: handleClearSelectedClient,
    searchClients: handleSearchClients,

    // Пагінація пошуку
    searchPagination,
    searchNextPage: handleSearchNextPage,
    searchPreviousPage: handleSearchPreviousPage,
    searchToPage: handleSearchToPage,

    // Створення нового клієнта
    startNewClientCreation: handleStartNewClientCreation,
    cancelNewClientCreation: handleCancelNewClientCreation,
    createNewClient: handleCreateNewClient,

    // Базова інформація
    selectBranch: handleSelectBranch,
    setTagNumber: handleSetTagNumber,
    setReceiptNumber: handleSetReceiptNumber,

    // Валідація та навігація
    isStage1Valid,
    completeStage1,

    // Статуси завантаження
    isLoading,
    isSearching,
    isCreating,
    isCreatingOrder,
    error,

    // Дані для UI
    searchResults,
    availableBranches,
    hasSearchResults,
  };
};
