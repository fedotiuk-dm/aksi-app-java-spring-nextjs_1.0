import { ClientResponse } from '@/lib/api';

import { CreateClient, EditClient } from '../schemas';

/**
 * Типи форм клієнта
 */
export type ClientFormType = 'create' | 'edit' | 'simple';

/**
 * Інтерфейс для хука форми клієнта
 */
export interface UseClientFormProps {
  type?: ClientFormType;
  onSuccess?: (client: ClientResponse) => void;
}

/**
 * Результат роботи з API для створення клієнта
 */
export interface CreateClientResult {
  client: ClientResponse;
  error: string | null;
}

/**
 * Результат роботи з API для оновлення клієнта
 */
export interface UpdateClientResult {
  client: ClientResponse;
  error: string | null;
}

/**
 * Параметри для створення клієнта
 */
export interface CreateClientParams {
  data: CreateClient;
}

/**
 * Параметри для оновлення клієнта
 */
export interface UpdateClientParams {
  data: EditClient;
  clientId: string;
}
