import {
  ClientPageResponse,
  ClientResponse,
  ClientSearchRequest,
  CreateClientRequest,
} from '@/lib/api';

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
    address: string | null | { fullAddress?: string };
    communicationChannels: Array<'PHONE' | 'SMS' | 'VIBER'>;
    source: Array<CreateClientRequest.source>;
    sourceDetails: string | null;
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
    address: string | null | { fullAddress?: string };
    communicationChannels: Array<'PHONE' | 'SMS' | 'VIBER'>;
    source: Array<CreateClientRequest.source>;
    sourceDetails: string | null;
    isLoading: boolean;
    error: string | null;
  };
}

/**
 * Тип даних для форми клієнта
 * Об'єднує всі можливі структури даних, які використовуються в формах клієнта
 */
export type ClientFormData =
  | ClientState['newClient']
  | ClientState['editClient']
  | { firstName: string; lastName: string; phone: string; email: string | null };

/**
 * Інтерфейс для глобального стану візарда
 */
export interface WizardGlobalState {
  client?: ClientResponse;
  clientMode?: ClientSelectionMode;
  [key: string]: unknown;
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

  // Інтеграція з глобальним станом
  syncWithGlobalState: (wizardState: WizardGlobalState) => void;
  getClientDataForWizard: () => ClientResponse | null;

  // Дія для скидання стану
  resetState: () => void;
}

/**
 * Повний тип стору клієнтів
 */
export type ClientStore = ClientState & ClientActions;
