import { ClientCreateRequest, ClientResponse, ReceptionPointDTO } from '@/lib/api';

// Типи для форми вибору клієнта
export interface ClientSearchFormValues {
  search: string;
}

// Розширюємо тип для форми створення клієнта, щоб включити всі потрібні поля
export interface ClientFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  communicationChannels: Array<'PHONE' | 'SMS' | 'VIBER'>;
  source: ClientCreateRequest.source;
  otherSourceDetails?: string; // Для поля "Інше" коли source === 'OTHER'
  notes?: string; // Нотатки про клієнта
  birthDate?: string; // Дата народження клієнта в форматі ISO
}

// Базова інформація про замовлення (Етап 1.2)
export interface OrderBaseInfoValues {
  receiptNumber: string;           // Генерується автоматично
  uniqueTag: string;               // Вводиться вручну або сканується
  receptionPointId: string | null; // ID пункту прийому
  createdAt: string;               // Автоматично поточна дата
}

// Утворюємо тип для контексту Етапу 1 Order Wizard
export interface OrderWizardStage1State {
  selectedClient: ClientResponse | null;
  isExistingClient: boolean;
  isSearching: boolean;
  searchResults: ClientResponse[];
  clientForm: ClientFormValues;
  orderBaseInfo: OrderBaseInfoValues;
  receptionPoints: ReceptionPointDTO[];
}
