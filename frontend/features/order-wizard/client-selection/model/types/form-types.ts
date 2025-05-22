import { CommunicationChannel, ClientSource } from './common-types';

/**
 * Базова інтерфейс для форми клієнта
 * Відповідає структурі API запитів CreateClientRequest і UpdateClientRequest
 */
export interface ClientFormData {
  // Основні поля клієнта (з CreateClientRequest)
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  communicationChannels: CommunicationChannel[];
  source: ClientSource[];
  address: string | null;
  sourceDetails: string | null;

  // Додаткові поля для роботи з формою
  id?: string | null; // Опціональне поле для існуючих клієнтів (з UpdateClientRequest)
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Тип для простої форми клієнта
 */
export interface SimpleClient {
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
}

/**
 * Тип для повної форми створення клієнта
 */
export interface CreateClient extends SimpleClient {
  communicationChannels: CommunicationChannel[];
  address: string | null;
  source: ClientSource[];
  sourceDetails: string | null;
}

/**
 * Тип для форми редагування клієнта
 */
export interface EditClient extends CreateClient {
  id: string | null;
}

/**
 * Типи полів для кожної форми
 */
export type SimpleClientField = keyof SimpleClient;
export type CreateClientField = keyof CreateClient;
export type EditClientField = keyof EditClient;
// Дозволяємо будь-які рядки, щоб забезпечити сумісність з існуючим кодом
export type ClientFormField = keyof ClientFormData | string;

/**
 * Типи для валідації
 */
export type ValidationErrors = Record<string, string>;
export type SetErrorFn = (field: string, options: { message: string; type: string }) => void;

/**
 * Тип для значень полів форми клієнта, які можуть бути передані в store
 */
export type ClientFieldValue =
  | string
  | boolean
  | CommunicationChannel[]
  | ClientSource[]
  | null
  | undefined;

/**
 * Тип для значень полів форми, які можуть бути встановлені через form.setValue
 */
export type FormFieldValue =
  | string
  | number
  | boolean
  | Date
  | CommunicationChannel[]
  | ClientSource[]
  | null
  | undefined;
