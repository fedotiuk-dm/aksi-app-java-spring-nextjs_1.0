import { ClientResponse } from '@/lib/api';

import { ClientSource, CommunicationChannel } from './client-enums';
import { Client } from './client.types';

import type { AddressDTO } from '@/lib/api';

/**
 * Тип форми клієнта
 */
export type ClientFormType = 'create' | 'edit' | 'simple';

/**
 * Тип даних форми для створення клієнта
 */
export interface CreateClientFormData {
  // Основні дані
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;

  // Адреса (підтримка як простої так і структурованої)
  address?: string; // Проста адреса для зворотної сумісності
  structuredAddress?: AddressDTO; // Структурована адреса

  // Джерело та канали
  source?: ClientSource;
  sourceDetails?: string;
  communicationChannels?: CommunicationChannel[];
}

/**
 * Тип даних форми для оновлення клієнта
 * Розширює форму створення, додаючи ID
 */
export interface UpdateClientFormData extends CreateClientFormData {
  id: string;
}

/**
 * Результат створення клієнта
 */
export interface CreateClientResult {
  client: ClientResponse | null;
  errors: Record<string, string> | null;
}

/**
 * Результат оновлення клієнта
 */
export interface UpdateClientResult {
  client: ClientResponse | null;
  errors: Record<string, string> | null;
}

/**
 * Результат пошуку клієнтів
 */
export interface ClientSearchResult {
  content: Client[];
  totalElements: number;
  totalPages: number;
  number: number; // поточна сторінка
  size: number; // розмір сторінки
  first: boolean; // чи це перша сторінка
  last: boolean; // чи це остання сторінка
  empty: boolean; // чи порожній результат
}

/**
 * Параметри пошуку клієнтів
 */
export interface ClientSearchParams {
  keyword?: string;
  page?: number;
  size?: number;
}

/**
 * Результат операції з клієнтом
 */
export interface ClientOperationResult<T> {
  data: T | null;
  success: boolean;
  error: string | null;
}
