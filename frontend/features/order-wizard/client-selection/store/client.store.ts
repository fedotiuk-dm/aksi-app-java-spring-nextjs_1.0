import { create } from 'zustand';

import { ClientResponse, ClientsService } from '@/lib/api';

import { initialClientState } from './client.initial';
import { ClientState, ClientSelectionMode, ClientStore } from './client.types';

/**
 * Створення стору для роботи з клієнтами
 */
export const useClientStore = create<ClientStore>((set, get) => ({
  // Базовий стан
  ...initialClientState,

  // Дії для пошуку клієнтів
  setSearchQuery: (query: string) => {
    set((state) => ({
      search: {
        ...state.search,
        query,
        // Скидаємо пагінацію при новому пошуковому запиті
        pageNumber: query !== state.search.query ? 0 : state.search.pageNumber
      }
    }));
  },

  searchClients: async () => {
    const { search } = get();
    const { query, pageNumber, pageSize } = search;

    // Не виконуємо пошук, якщо запит порожній
    if (!query || query.length < 2) {
      set({ clients: [] });
      return null;
    }

    set((state) => ({
      search: {
        ...state.search,
        isLoading: true,
        error: null
      }
    }));

    try {
      // Використовуємо новий метод для пошуку з пагінацією
      const result = await ClientsService.searchClientsWithPagination({
        requestBody: {
          query,
          pageNumber,
          pageSize
        }
      });

      // Оновлюємо стан з результатами пошуку
      set((state) => ({
        clients: result.content || [],
        search: {
          ...state.search,
          isLoading: false,
          totalElements: result.totalElements || 0,
          totalPages: result.totalPages || 0,
          pageNumber: result.pageNumber || 0,
          pageSize: result.pageSize || 10,
          hasNext: result.hasNext || false,
          hasPrevious: result.hasPrevious || false
        }
      }));

      return result;
    } catch (error) {
      set((state) => ({
        search: {
          ...state.search,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Помилка пошуку клієнтів'
        }
      }));
      return null;
    }
  },
  
  // Дія для зміни сторінки при пагінації
  setPage: (pageNumber: number) => {
    set((state) => ({
      search: {
        ...state.search,
        pageNumber
      }
    }));
    
    // Автоматично оновлюємо результати пошуку при зміні сторінки
    get().searchClients();
  },

  // Дії для вибору клієнта
  selectClient: (client: ClientResponse) => {
    set({
      selectedClient: client,
      mode: 'existing'
    });
  },

  clearSelectedClient: () => {
    set({
      selectedClient: null
    });
  },

  // Дії для зміни режиму
  setMode: (mode: ClientSelectionMode) => {
    set({ mode });

    // Скидаємо відповідні дані при зміні режиму
    if (mode === 'new') {
      set({ selectedClient: null });
    } else {
      set((state) => ({
        newClient: {
          ...state.newClient,
          firstName: '',
          lastName: '',
          phone: '',
          email: null
        }
      }));
    }
  },

  // Дії для створення нового клієнта
  updateNewClientField: (field, value) => {
    set((state) => ({
      newClient: {
        ...state.newClient,
        [field]: value
      }
    }));
  },

  createClient: async () => {
    const { newClient } = get();
    const { firstName, lastName, phone, email } = newClient;

    set((state) => ({
      newClient: {
        ...state.newClient,
        isLoading: true,
        error: null
      }
    }));

    try {
      // Використовуємо OpenAPI-генерований клієнт для створення клієнта
      const client = await ClientsService.createClient({
        requestBody: {
          firstName,
          lastName,
          phone,
          // Для опрацювання null в API перетворюємо на undefined
          email: email || undefined,
          // Додаткові поля можуть бути додані тут при потребі
        }
      });

      // Оновлюємо стан з новоствореним клієнтом
      set((state) => ({
        selectedClient: client,
        mode: 'existing',
        newClient: {
          ...state.newClient,
          isLoading: false,
          // Скидаємо поля нового клієнта
          firstName: '',
          lastName: '',
          phone: '',
          email: null
        }
      }));

      return client;
    } catch (error) {
      set((state) => ({
        newClient: {
          ...state.newClient,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Помилка створення клієнта'
        }
      }));
      return null;
    }
  },

  // Дії для редагування клієнта
  startEditingClient: (client: ClientResponse) => {
    // Заповнюємо форму редагування даними клієнта
    set({
      mode: 'edit',
      editClient: {
        id: client.id || null,
        firstName: client.firstName || '',
        lastName: client.lastName || '',
        phone: client.phone || '',
        email: client.email || null,
        isLoading: false,
        error: null
      }
    });
  },

  updateEditClientField: <K extends keyof ClientState['editClient']>(
    field: K,
    value: ClientState['editClient'][K]
  ) => {
    set((state) => ({
      editClient: {
        ...state.editClient,
        [field]: value
      }
    }));
  },

  saveEditedClient: async () => {
    const { editClient } = get();
    const { id, firstName, lastName, phone, email } = editClient;

    // Перевірка на наявність ID клієнта
    if (!id) {
      set((state) => ({
        editClient: {
          ...state.editClient,
          error: 'Відсутній ID клієнта для редагування'
        }
      }));
      return null;
    }

    set((state) => ({
      editClient: {
        ...state.editClient,
        isLoading: true,
        error: null
      }
    }));

    try {
      // Використовуємо OpenAPI-генерований клієнт для оновлення клієнта
      const updatedClient = await ClientsService.updateClient({
        id,
        requestBody: {
          firstName,
          lastName,
          phone,
          // Для опрацювання null в API перетворюємо на undefined
          email: email || undefined,
        }
      });

      // Оновлюємо стан з оновленим клієнтом
      set((state) => ({
        selectedClient: updatedClient,
        mode: 'existing',
        editClient: {
          ...state.editClient,
          isLoading: false,
          error: null
        },
        // Оновлюємо клієнта в списку, якщо він там є
        clients: state.clients.map(client => 
          client.id === id ? updatedClient : client
        )
      }));

      return updatedClient;
    } catch (error) {
      set((state) => ({
        editClient: {
          ...state.editClient,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Помилка оновлення клієнта'
        }
      }));
      return null;
    }
  },

  cancelEditing: () => {
    set((state) => ({
      mode: 'existing',
      editClient: {
        ...state.editClient,
        id: null,
        firstName: '',
        lastName: '',
        phone: '',
        email: null,
        isLoading: false,
        error: null
      }
    }));
  },

  // Дія для скидання стану
  resetState: () => {
    set(initialClientState);
  }
}));
