import { ClientPageResponse, ClientResponse, ClientSearchRequest } from '@/lib/api';

/**
 * Режим вибору клієнта
 */
export type ClientSelectionMode = 'existing' | 'new' | 'edit';

// Використовуємо тип ClientSearchRequest з API напряму

/**
 * Стан стору клієнтів
 */
export interface ClientState {
  // Режим вибору клієнта (існуючий або новий)
  mode: ClientSelectionMode;

  // Дані для пошуку клієнтів
  search: ClientSearchRequest & {
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    hasNext: boolean;
    hasPrevious: boolean;
  };

  // Список клієнтів отриманих через пошук
  clients: ClientResponse[];

  // Вибраний клієнт
  selectedClient: ClientResponse | null;

  // Дані для створення нового клієнта
  newClient: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
    isLoading: boolean;
    error: string | null;
  };
  
  // Дані для редагування існуючого клієнта
  editClient: {
    id: string | null;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
    isLoading: boolean;
    error: string | null;
  };
}

/**
 * Дії стору клієнтів
 */
export interface ClientActions {
  // Дії для пошуку клієнтів
  setSearchQuery: (query: string) => void;
  searchClients: () => Promise<ClientPageResponse | null>;
  setPage: (pageNumber: number) => void;

  // Дії для вибору клієнта
  selectClient: (client: ClientResponse) => void;
  clearSelectedClient: () => void;

  // Дії для зміни режиму
  setMode: (mode: ClientSelectionMode) => void;

  // Дії для створення нового клієнта
  updateNewClientField: <K extends keyof ClientState['newClient']>(
    field: K,
    value: ClientState['newClient'][K]
  ) => void;
  createClient: () => Promise<ClientResponse | null>;
  
  // Дії для редагування клієнта
  startEditingClient: (client: ClientResponse) => void;
  updateEditClientField: <K extends keyof ClientState['editClient']>(
    field: K,
    value: ClientState['editClient'][K]
  ) => void;
  saveEditedClient: () => Promise<ClientResponse | null>;
  cancelEditing: () => void;

  // Дія для скидання стану
  resetState: () => void;
}

/**
 * Повний тип стору клієнтів
 */
export type ClientStore = ClientState & ClientActions;

