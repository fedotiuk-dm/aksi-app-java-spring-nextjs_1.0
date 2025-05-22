import { ClientPageResponse, ClientsService } from '@/lib/api';

import { ClientStore, ClientSearchActions } from '../../types';
import { createSlice } from '../utils/slice-factory';

/**
 * Слайс стору для функціональності пошуку клієнтів
 */
export const createClientSearchSlice = createSlice<Pick<ClientStore, keyof ClientSearchActions>>(
  'clientSearch',
  (set, get) => ({
    setSearchQuery: (query: string) => {
      set((state) => ({
        search: {
          ...state.search,
          query,
          // Скидаємо пагінацію при новому пошуковому запиті
          page: query !== state.search.query ? 0 : state.search.page,
        },
      }));

      // Автоматично запускаємо пошук після оновлення query, якщо довжина >= 2 символів
      if (query.length >= 2) {
        // Затримка для уникнення частих запитів під час введення
        setTimeout(() => {
          get().searchClients();
        }, 300);
      } else if (query.length === 0) {
        // Якщо пошук очищено, очищаємо і результати
        set((state) => ({
          clients: [],
          // Оновлюємо стан пошуку для узгодженості
          search: {
            ...state.search,
            totalElements: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false,
            error: null,
          },
        }));
      }
    },

    searchClients: async (): Promise<void> => {
      const { search, clients } = get();
      const { query, page = 0, size = 10 } = search;

      // Не виконуємо пошук, якщо запит порожній
      if (!query || query.length < 2) {
        if (clients.length > 0) {
          set((state) => ({
            clients: [],
            search: {
              ...state.search,
              totalElements: 0,
              totalPages: 0,
              hasNext: false,
              hasPrevious: false,
              error: null,
            },
          }));
        }
        return;
      }

      // Встановлюємо стан завантаження
      set((state) => ({
        search: {
          ...state.search,
          isLoading: true,
          error: null,
        },
      }));

      try {
        // Підготовка параметрів запиту
        const requestBody = {
          query: query.trim(),
          page: typeof page === 'string' ? parseInt(page, 10) : page,
          size: typeof size === 'string' ? parseInt(size, 10) : size,
        };

        // Виконання запиту до API
        const response: ClientPageResponse = await ClientsService.searchClientsWithPagination({
          requestBody,
        });

        // Оновлення стану з результатами
        set({
          clients: response.content || [],
          search: {
            ...get().search,
            isLoading: false,
            error: null,
            totalElements: response.totalElements || 0,
            totalPages: response.totalPages || 0,
            hasNext: response.hasNext || false,
            hasPrevious: response.hasPrevious || false,
          },
        });
      } catch (error) {
        // Обробка помилок
        const errorMessage = error instanceof Error ? error.message : 'Помилка пошуку клієнтів';

        set((state) => ({
          clients: [],
          search: {
            ...state.search,
            isLoading: false,
            error: errorMessage,
            totalElements: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false,
          },
        }));
      }
    },

    setPage: (pageNumber: number) => {
      set((state) => ({
        search: {
          ...state.search,
          page: pageNumber,
        },
      }));

      // Перевіряємо, чи є дійсний пошуковий запит, перед виконанням пошуку
      const currentQuery = get().search.query;
      if (currentQuery && currentQuery.length >= 2) {
        // Автоматично оновлюємо результати пошуку при зміні сторінки
        get().searchClients();
      }
    },

    setSize: (size: number) => {
      set((state) => ({
        search: {
          ...state.search,
          size,
          // При зміні кількості елементів на сторінці скидаємо на першу сторінку
          page: 0,
        },
      }));

      // Перевіряємо, чи є дійсний пошуковий запит, перед виконанням пошуку
      const currentQuery = get().search.query;
      if (currentQuery && currentQuery.length >= 2) {
        // Автоматично оновлюємо результати пошуку при зміні розміру сторінки
        get().searchClients();
      }
    },

    resetSearch: () => {
      set((state) => ({
        search: {
          ...state.search,
          query: '',
          page: 0,
          totalElements: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
          error: null,
        },
        clients: [],
      }));
    },
  })
);
