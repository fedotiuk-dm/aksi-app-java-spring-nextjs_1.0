import { ClientEntity } from '../entities';
import { ClientMode } from './client-enums';
import { ClientSearchParams, ClientSearchResult, CreateClientFormData, UpdateClientFormData } from './client-form.types';

/**
 * Базовий стан клієнта
 */
export interface ClientState {
  // Дані клієнта
  selectedClient: ClientEntity | null;
  clients: ClientEntity[];

  // Режим роботи з клієнтом
  mode: ClientMode;
  isLoading: boolean;
  error: string | null;

  // Дані для форм
  formData: {
    create: CreateClientFormData;
    update: UpdateClientFormData;
  };

  // Дані для пошуку
  search: {
    params: ClientSearchParams;
    results: ClientSearchResult | null;
    isSearching: boolean;
    searchError: string | null;
  };
}

/**
 * Дії для пошуку клієнтів
 */
export interface ClientSearchActions {
  // Пошук клієнтів
  searchClients: (params: ClientSearchParams) => Promise<ClientSearchResult | null>;
  setSearchParams: (params: Partial<ClientSearchParams>) => void;
  clearSearch: () => void;
}

/**
 * Дії для вибору клієнта
 */
export interface ClientSelectionActions {
  // Вибір клієнта
  selectClient: (clientId: string) => Promise<ClientEntity | null>;
  clearSelection: () => void;
}

/**
 * Дії для форми клієнта
 */
export interface ClientFormActions {
  // Створення клієнта
  createClient: (data: CreateClientFormData) => Promise<ClientEntity | null>;
  updateClient: (data: UpdateClientFormData) => Promise<ClientEntity | null>;
  deleteClient: (clientId: string) => Promise<boolean>;

  // Робота з формою
  setCreateFormData: (data: Partial<CreateClientFormData>) => void;
  setUpdateFormData: (data: Partial<UpdateClientFormData>) => void;
  resetForms: () => void;
}

/**
 * Повний інтерфейс стора клієнта
 */
export interface ClientStore extends
  ClientState,
  ClientSearchActions,
  ClientSelectionActions,
  ClientFormActions {}
