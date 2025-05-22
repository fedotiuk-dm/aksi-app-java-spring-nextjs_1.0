import { ClientResponse, ClientSearchRequest } from '@/lib/api';

import { ClientActions } from './action-types';
import { ClientSelectionMode } from './common-types';
import { ClientFormData } from './form-types';

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
  newClient: ClientFormData;

  // Дані для редагування клієнта
  editClient: ClientFormData;
}

/**
 * Загальний інтерфейс для стору клієнтів
 * Поєднує стан та дії в одному інтерфейсі
 */
/**
 * Загальний інтерфейс стору клієнтів
 * Поєднує стан та дії в одному інтерфейсі
 */
export interface ClientStore extends ClientState, ClientActions {}

