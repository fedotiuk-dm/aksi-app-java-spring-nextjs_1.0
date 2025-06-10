/**
 * @fileoverview Хук для операцій Stage 1 - Клієнт та базова інформація замовлення
 *
 * Інкапсулює всю логіку роботи з першим етапом Order Wizard:
 * - Автоматичний пошук клієнтів з debounce
 * - Пошук та вибір клієнта
 * - Створення нового клієнта
 * - Базова інформація замовлення
 */

import { useCallback, useState, useMemo, useEffect } from 'react';

import {
  useSearchClients,
  useCreateClient,
  useGetAllBranchLocations,
  generateReceiptNumber,
  type ClientResponse,
  type CreateClientRequest,
  type BranchLocationDTO,
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
}

export interface Stage1Operations {
  // Стан
  state: Stage1OperationsState;

  // Клієнтські операції
  setSearchQuery: (query: string) => void;
  selectClient: (client: ClientResponse) => void;
  clearSelectedClient: () => void;
  clearSearchResults: () => void;

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
  completeStage1: () => void;

  // Статуси завантаження
  isLoading: boolean;
  isSearching: boolean;
  isCreating: boolean;
  error: string | null;

  // Дані для UI
  searchResults: ClientResponse[];
  availableBranches: BranchLocationDTO[];
  hasSearchResults: boolean;
}

export const useStage1Operations = (): Stage1Operations => {
  const { markStageCompleted, setCurrentStage } = useWizardNavigationStore();

  // Локальний стан
  const [state, setState] = useState<Stage1OperationsState>({
    selectedClient: null,
    isCreatingNewClient: false,
    searchQuery: '',
    selectedBranch: null,
    tagNumber: '',
    receiptNumber: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<ClientResponse[]>([]);
  const [isGeneratingReceiptNumber, setIsGeneratingReceiptNumber] = useState(false);

  // Debounce для пошукового запиту (затримка 500ms)
  const debouncedSearchQuery = useDebounce(state.searchQuery, 500);

  // API хуки для мутацій
  const createClientMutation = useCreateClient();

  // API хуки для запитів
  const { data: branchesData, isLoading: isBranchesLoading } = useGetAllBranchLocations();

  // Функція для генерації номера квитанції
  const generateReceiptNumberForBranch = useCallback(async (branchId: string) => {
    setIsGeneratingReceiptNumber(true);
    setError(null);

    try {
      console.log('Generating receipt number for branch:', branchId);

      // Використовуємо Orval згенеровану функцію напряму
      const receiptNumber = await generateReceiptNumber({ branchLocationId: branchId });
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

  // API хук для пошуку клієнтів
  const {
    data: searchData,
    isLoading: isSearching,
    error: searchError,
  } = useSearchClients(
    { keyword: debouncedSearchQuery },
    {
      query: {
        enabled: !!debouncedSearchQuery && debouncedSearchQuery.length >= 2,
        staleTime: 30000, // Кеш на 30 секунд
        retry: 2,
      },
    }
  );

  // Автоматичне оновлення результатів пошуку
  useEffect(() => {
    if (searchData && Array.isArray(searchData)) {
      setSearchResults(searchData);
      setError(null);
    } else if (searchError) {
      setError('Помилка при пошуку клієнтів');
      setSearchResults([]);
    } else if (!debouncedSearchQuery) {
      setSearchResults([]);
    }
  }, [searchData, searchError, debouncedSearchQuery]);

  // Клієнтські операції
  const handleSetSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
    setError(null);
  }, []);

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

  const handleClearSearchResults = useCallback(() => {
    setSearchResults([]);
    setState((prev) => ({ ...prev, searchQuery: '' }));
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

  // Валідація
  const isStage1Valid = useMemo(() => {
    return !!(state.selectedClient && state.selectedBranch);
  }, [state.selectedClient, state.selectedBranch]);

  // Завершення етапу
  const completeStage1 = useCallback(() => {
    if (isStage1Valid) {
      markStageCompleted(1);
      setCurrentStage(2);
    }
  }, [isStage1Valid, markStageCompleted, setCurrentStage]);

  // Статуси завантаження
  const isLoading = isBranchesLoading || isGeneratingReceiptNumber;
  const isCreating = createClientMutation.isPending;

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
    clearSearchResults: handleClearSearchResults,

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
    error,

    // Дані для UI
    searchResults,
    availableBranches,
    hasSearchResults,
  };
};
