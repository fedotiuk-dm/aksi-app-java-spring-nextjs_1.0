/**
 * @fileoverview Доменні типи для управління клієнтами - інтеграція з wizard типами
 * @module domain/wizard/services/stage-1/client-management/types
 */

import { z } from 'zod';

import type { ClientSearchResult as WizardClientSearchResult } from '../../../../types';

/**
 * Способи зв'язку з клієнтом (мапимо на wizard формат)
 */
export enum ContactMethod {
  PHONE = 'PHONE',
  SMS = 'SMS',
  VIBER = 'VIBER',
}

/**
 * Джерела інформації про хімчистку (мапимо на wizard формат)
 */
export enum InformationSource {
  INSTAGRAM = 'INSTAGRAM',
  GOOGLE = 'GOOGLE',
  RECOMMENDATIONS = 'RECOMMENDATION',
  OTHER = 'OTHER',
}

/**
 * Розширений тип клієнта з додатковими доменними полями
 */
export interface ClientSearchResult extends WizardClientSearchResult {
  // Додаткові доменні поля для нашого сервісу
  contactMethods?: ContactMethod[];
  informationSource?: InformationSource;
  informationSourceOther?: string;
}

/**
 * Схема для валідації даних клієнта (для форм)
 */
export const clientDataSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .max(50, "Ім'я не може перевищувати 50 символів"),

  lastName: z
    .string()
    .trim()
    .min(2, 'Прізвище повинно містити мінімум 2 символи')
    .max(50, 'Прізвище не може перевищувати 50 символів'),

  phone: z
    .string()
    .trim()
    .min(10, 'Телефон повинен містити мінімум 10 символів')
    .max(15, 'Телефон не може перевищувати 15 символів')
    .regex(/^[\+]?[0-9\(\)\-\s]+$/, 'Некоректний формат телефону'),

  email: z.string().email('Некоректний формат email').optional(),

  address: z.string().trim().max(200, 'Адреса не може перевищувати 200 символів').optional(),

  contactMethods: z
    .array(z.nativeEnum(ContactMethod))
    .min(1, "Необхідно вибрати хоча б один спосіб зв'язку")
    .optional(),

  informationSource: z.nativeEnum(InformationSource).optional(),

  informationSourceOther: z
    .string()
    .trim()
    .max(100, 'Опис джерела не може перевищувати 100 символів')
    .optional(),
});

/**
 * Схема для валідації пошукового запиту
 */
export const clientSearchQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, 'Пошуковий запит не може бути порожнім')
    .max(100, 'Пошуковий запит не може перевищувати 100 символів'),

  page: z.number().int().min(0, "Номер сторінки не може бути від'ємним").default(0),

  size: z
    .number()
    .int()
    .min(1, 'Розмір сторінки повинен бути більше 0')
    .max(100, 'Розмір сторінки не може перевищувати 100')
    .default(20),
});

/**
 * Типи на основі схем
 */
export type ClientData = z.infer<typeof clientDataSchema>;
export type ClientSearchQuery = z.infer<typeof clientSearchQuerySchema>;

/**
 * Результат пошуку з пагінацією
 */
export interface ClientSearchPaginatedResult {
  clients: ClientSearchResult[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * Параметри для створення клієнта
 */
export interface CreateClientRequest extends ClientData {}

/**
 * Параметри для оновлення клієнта
 */
export interface UpdateClientRequest extends Partial<ClientData> {
  id: string;
}

/**
 * Стан процесу роботи з клієнтом
 */
export interface ClientManagementState {
  // Пошук клієнтів
  searchQuery: string;
  searchResults: ClientSearchResult[];
  isSearching: boolean;
  searchError: string | null;

  // Пагінація
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;

  // Вибраний клієнт
  selectedClient: ClientSearchResult | null;

  // Створення/редагування клієнта
  isCreatingClient: boolean;
  isEditingClient: boolean;
  clientFormData: Partial<ClientData>;
  clientFormErrors: Record<string, string>;

  // Операції
  isLoading: boolean;
  error: string | null;
}

/**
 * Дії для управління клієнтами
 */
export interface ClientManagementActions {
  // Пошук
  setSearchQuery: (query: string) => void;
  searchClients: (query: string, page?: number) => Promise<void>;
  clearSearchResults: () => void;

  // Пагінація
  goToPage: (page: number) => Promise<void>;
  setPageSize: (size: number) => void;

  // Вибір клієнта
  selectClient: (client: ClientSearchResult) => void;
  clearSelectedClient: () => void;

  // Створення клієнта
  startClientCreation: () => void;
  cancelClientCreation: () => void;
  setClientFormData: (data: Partial<ClientData>) => void;
  createClient: (data: ClientData) => Promise<boolean>;

  // Редагування клієнта
  startClientEditing: (client: ClientSearchResult) => void;
  cancelClientEditing: () => void;
  updateClient: (id: string, data: Partial<ClientData>) => Promise<boolean>;

  // Валідація
  validateClientForm: () => boolean;
  clearFormErrors: () => void;

  // Утиліти
  reset: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Утиліти для трансформації між форматами
 */
export const ClientTransformUtils = {
  /**
   * Перетворює наші ContactMethod в wizard communicationChannels
   */
  contactMethodsToChannels: (methods: ContactMethod[]): Array<'PHONE' | 'SMS' | 'VIBER'> => {
    return methods.map((method) => method as 'PHONE' | 'SMS' | 'VIBER');
  },

  /**
   * Перетворює wizard communicationChannels в наші ContactMethod
   */
  channelsToContactMethods: (channels: Array<'PHONE' | 'SMS' | 'VIBER'>): ContactMethod[] => {
    return channels.map((channel) => ContactMethod[channel]);
  },

  /**
   * Перетворює наш InformationSource в wizard source
   */
  informationSourceToWizardSource: (
    source: InformationSource
  ): 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER' => {
    return source as 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER';
  },

  /**
   * Перетворює wizard source в наш InformationSource
   */
  wizardSourceToInformationSource: (
    source: 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER'
  ): InformationSource => {
    if (source === 'RECOMMENDATION') {
      return InformationSource.RECOMMENDATIONS;
    }
    return InformationSource[source];
  },
};
