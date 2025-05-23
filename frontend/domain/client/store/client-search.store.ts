import { create } from 'zustand';

import { ClientRepository } from '../repositories/client-repository';
import { ClientSearchParams, Client } from '../types';

/**
 * Стан для пошуку клієнтів
 * Реалізує Single Responsibility Principle - відповідає ТІЛЬКИ за пошук
 */
interface ClientSearchState {
  searchTerm: string;
  results: Client[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Дії для пошуку клієнтів
 */
interface ClientSearchActions {
  setSearchTerm: (term: string) => void;
  search: (params?: Partial<ClientSearchParams>) => Promise<void>;
  loadMore: () => Promise<void>;
  clearSearch: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Повний інтерфейс стору
 */
type ClientSearchStore = ClientSearchState & ClientSearchActions;

/**
 * Початковий стан
 */
const initialState: ClientSearchState = {
  searchTerm: '',
  results: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    hasMore: false,
  },
};

/**
 * Zustand стор для пошуку клієнтів
 * Реалізує принцип Single Responsibility
 */
export const useClientSearchStore = create<ClientSearchStore>((set, get) => {
  const clientRepository = new ClientRepository();

  return {
    // Початковий стан
    ...initialState,

    // Дії
    setSearchTerm: (term) => {
      set({ searchTerm: term });
    },

    search: async (params = {}) => {
      const { searchTerm, pagination } = get();

      const searchParams: ClientSearchParams = {
        keyword: params.keyword || searchTerm,
        page: params.page || 0,
        size: params.size || pagination.size,
      };

      // Якщо це новий пошук (page = 0), очищаємо результати
      if (searchParams.page === 0) {
        set({ results: [], isLoading: true, error: null });
      } else {
        set({ isLoading: true, error: null });
      }

      try {
        const response = await clientRepository.search(searchParams);

        // response.content вже містить доменні об'єкти Client[]
        const domainClients = response.content || [];

        set((state) => ({
          results: searchParams.page === 0 ? domainClients : [...state.results, ...domainClients],
          isLoading: false,
          pagination: {
            page: response.number || 0,
            size: response.size || state.pagination.size,
            totalElements: response.totalElements || 0,
            totalPages: response.totalPages || 0,
            hasMore: !response.last,
          },
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Помилка пошуку клієнтів';

        set({ isLoading: false, error: errorMessage });
      }
    },

    loadMore: async () => {
      const { pagination, isLoading } = get();

      if (isLoading || !pagination.hasMore) return;

      await get().search({ page: pagination.page + 1 });
    },

    clearSearch: () => {
      set({
        searchTerm: '',
        results: [],
        error: null,
        pagination: initialState.pagination,
      });
    },

    setLoading: (loading) => {
      set({ isLoading: loading });
    },

    setError: (error) => {
      set({ error });
    },
  };
});
