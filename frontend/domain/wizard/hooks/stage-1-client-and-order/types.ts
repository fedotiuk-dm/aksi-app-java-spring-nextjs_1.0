/**
 * @fileoverview Типи для етапу 1: Клієнт та базова інформація замовлення
 */

// Імпорт Orval згенерованих типів
import type {
  ClientResponse,
  CreateClientRequest,
  UpdateClientRequest,
  ClientSearchRequest,
  SearchClientsParams,
  BranchLocationDTO,
} from '@/shared/api/generated/client/aksiApi.schemas';

// =====================================
// Типи для клієнтів
// =====================================

/**
 * Тип клієнта з backend
 */
export type Client = ClientResponse;

/**
 * Дані для створення нового клієнта
 */
export type CreateClientData = CreateClientRequest;

/**
 * Дані для оновлення клієнта
 */
export type UpdateClientData = UpdateClientRequest;

/**
 * Параметри пошуку клієнтів
 */
export type ClientSearchParams = SearchClientsParams;

/**
 * Запит на пошук клієнтів
 */
export type ClientSearchRequestData = ClientSearchRequest;

// =====================================
// Типи для філій
// =====================================

/**
 * Тип філії з backend
 */
export type BranchLocation = BranchLocationDTO;

// =====================================
// Типи для базової інформації замовлення
// =====================================

/**
 * Базова інформація про замовлення
 */
export interface OrderBasicInfo {
  /** Номер квитанції (генерується автоматично) */
  receiptNumber: string;
  /** Унікальна мітка (вводиться вручну або сканується) */
  uniqueTag: string;
  /** ID вибраної філії */
  branchId: string;
  /** Дата створення замовлення */
  createdAt: Date;
}

// =====================================
// Стани хуків
// =====================================

/**
 * Стан пошуку клієнтів
 */
export interface ClientSearchState {
  /** Пошуковий термін */
  searchTerm: string;
  /** Результати пошуку */
  results: Client[];
  /** Індикатор завантаження */
  isLoading: boolean;
  /** Помилка пошуку */
  error: string | null;
  /** Чи є ще результати для завантаження */
  hasMore: boolean;
  /** Поточна сторінка (починаючи з 0) */
  currentPage: number;
  /** Загальна кількість сторінок */
  totalPages: number;
}

/**
 * Стан створення клієнта
 */
export interface ClientCreateState {
  /** Індикатор завантаження */
  isLoading: boolean;
  /** Помилка створення */
  error: string | null;
  /** Успішно створений клієнт */
  createdClient: Client | null;
}

/**
 * Стан оновлення клієнта
 */
export interface ClientUpdateState {
  /** Індикатор завантаження */
  isLoading: boolean;
  /** Помилка оновлення */
  error: string | null;
  /** Успішно оновлений клієнт */
  updatedClient: Client | null;
}

/**
 * Стан вибору клієнта
 */
export interface ClientSelectionState {
  /** Вибраний клієнт */
  selectedClient: Client | null;
  /** Режим роботи (пошук або створення) */
  mode: 'search' | 'create';
  /** Чи є вибраний клієнт */
  isClientSelected: boolean;
}

/**
 * Стан завантаження філій
 */
export interface BranchLocationsState {
  /** Список філій */
  locations: BranchLocation[];
  /** Індикатор завантаження */
  isLoading: boolean;
  /** Помилка завантаження */
  error: string | null;
  /** Активні філії */
  activeLocations: BranchLocation[];
}

/**
 * Тип для повернення хука генерації номера квитанції
 */
export interface UseReceiptNumberGenerationReturn {
  /** Згенерований номер квитанції */
  receiptNumber: string | null;
  /** Чи відбувається генерація */
  isGenerating: boolean;
  /** Помилка генерації */
  error: unknown;
  /** Згенерувати новий номер */
  generateNew: () => void;
  /** Скинути поточний номер */
  reset: () => void;
}

/**
 * Тип для повернення хука валідації унікальності мітки
 */
export interface UseUniqueTagValidationReturn {
  /** Чи унікальна мітка (null якщо ще не перевірена) */
  isUnique: boolean | null;
  /** Чи відбувається валідація */
  isValidating: boolean;
  /** Помилка валідації */
  error: unknown;
  /** Нормалізована мітка */
  tag: string;
}

/**
 * Спрощені функції для базової інформації замовлення
 */
export interface OrderBasicInfoActions {
  /** Встановити унікальну мітку */
  setUniqueTag: (tag: string) => void;
  /** Встановити філію */
  setBranchId: (branchId: string) => void;
  /** Встановити дату створення */
  setCreatedAt: (date: Date) => void;
  /** Валідувати дані */
  validate: () => boolean;
  /** Очистити дані */
  reset: () => void;
}

/**
 * Спрощений стан базової інформації замовлення
 */
export interface OrderBasicInfoState {
  /** Дані базової інформації */
  basicInfo: OrderBasicInfo;
  /** Чи валідна інформація */
  isValid: boolean;
  /** Помилки валідації */
  validationErrors: Record<string, string>;
}

/**
 * Спрощений тип для повернення хука базової інформації замовлення
 */
export interface UseOrderBasicInfoReturn extends OrderBasicInfoState, OrderBasicInfoActions {
  /** Встановити дані повністю */
  setBasicInfo: (info: Partial<OrderBasicInfo>) => void;
}

// =====================================
// Функціональні типи
// =====================================

/**
 * Функції для роботи з пошуком клієнтів
 */
export interface ClientSearchActions {
  /** Встановити пошуковий термін */
  setSearchTerm: (term: string) => void;
  /** Виконати пошук */
  search: (term: string) => Promise<void>;
  /** Очистити результати пошуку */
  clearResults: () => void;
  /** Завантажити більше результатів */
  loadMore: () => Promise<void>;
}

/**
 * Функції для створення клієнта
 */
export interface ClientCreateActions {
  /** Створити нового клієнта */
  createClient: (data: CreateClientData) => Promise<Client | null>;
  /** Очистити стан */
  reset: () => void;
}

/**
 * Функції для оновлення клієнта
 */
export interface ClientUpdateActions {
  /** Оновити клієнта */
  updateClient: (id: string, data: UpdateClientData) => Promise<Client | null>;
  /** Очистити стан */
  reset: () => void;
}

/**
 * Функції для вибору клієнта
 */
export interface ClientSelectionActions {
  /** Вибрати клієнта */
  selectClient: (client: Client) => void;
  /** Встановити режим роботи */
  setMode: (mode: 'search' | 'create') => void;
  /** Очистити вибір */
  clearSelection: () => void;
  /** Оновити дані вибраного клієнта */
  updateSelectedClient: (client: Client) => void;
}

/**
 * Функції для роботи з філіями
 */
export interface BranchLocationsActions {
  /** Перезавантажити список філій */
  refetch: () => Promise<void>;
  /** Отримати філію за ID */
  getLocationById: (id: string) => BranchLocation | null;
  /** Отримати філію за кодом */
  getLocationByCode: (code: string) => BranchLocation | null;
}

// =====================================
// Композитні типи хуків
// =====================================

/**
 * Повертається з хука useClientSearch
 */
export type UseClientSearchReturn = ClientSearchState & ClientSearchActions;

/**
 * Повертається з хука useClientCreate
 */
export type UseClientCreateReturn = ClientCreateState & ClientCreateActions;

/**
 * Повертається з хука useClientUpdate
 */
export type UseClientUpdateReturn = ClientUpdateState & ClientUpdateActions;

/**
 * Повертається з хука useBranchLocations
 */
export type UseBranchLocationsReturn = BranchLocationsState & BranchLocationsActions;

/**
 * Повертається з хука useClientSelection
 */
export type UseClientSelectionReturn = ClientSelectionState & ClientSelectionActions;
