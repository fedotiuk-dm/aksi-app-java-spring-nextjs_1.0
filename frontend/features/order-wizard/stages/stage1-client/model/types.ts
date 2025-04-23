import { ClientResponse, ClientSearchRequest, ReceptionPointDTO } from '@/lib/api';

// Етап 1.1: Вибір або створення клієнта
export interface ClientFormState {
  isSubmitting: boolean;
  isNew: boolean;
  errors: Record<string, string>;
}

// Enum для режимів роботи з клієнтом
export enum ClientMode {
  SEARCH = 'search',
  CREATE = 'create',
  SELECTED = 'selected',
  EDIT = 'edit'
}

export interface ClientSelectionState {
  mode: ClientMode;
  selectedClient: ClientResponse | null;
}

// Тип для зберігання останнього пошукового запиту
export interface ClientSearchState {
  searchTerm: string;
  filters: Partial<ClientSearchRequest>;
  page: number;
  size: number;
}

// Етап 1.2: Базова інформація замовлення
export interface OrderBasicFormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// Загальні дані для етапу 1
export interface Stage1Data {
  // Дані клієнта
  client: ClientResponse | null;
  
  // Базова інформація замовлення
  receiptNumber?: string; // генерується автоматично
  uniqueTag?: string;
  receptionPointId?: string;
  receptionPoint?: ReceptionPointDTO | null;
  createdAt?: string; // автоматична дата створення
}

// Інтерфейс для зберігання даних 1-го етапу у контексті візарда
export interface ClientStageData {
  client: ClientResponse | null;  // Вибраний клієнт
  isNew: boolean;                // Чи це новий клієнт
  wasModified: boolean;          // Чи був клієнт редагований
}
