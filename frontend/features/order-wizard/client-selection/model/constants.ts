import { CreateClientRequest } from '@/lib/api';

import { ClientState } from './types';

/**
 * Початковий стан для пошуку клієнтів
 */
export const initialSearchState: ClientState['search'] = {
  // Поля з ClientSearchRequest
  query: '',
  page: 0,
  size: 10,
  // Додаткові поля для інтерфейсу
  totalElements: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  hasNext: false,
  hasPrevious: false,
};

/**
 * Початковий стан для нового клієнта
 */
export const initialNewClientState: ClientState['newClient'] = {
  firstName: '',
  lastName: '',
  phone: '',
  email: null,
  address: null,
  communicationChannels: ['PHONE'],
  source: [CreateClientRequest.source.INSTAGRAM],
  sourceDetails: null,
  isLoading: false,
  error: null,
};

/**
 * Початковий стан для редагування клієнта
 */
export const initialEditClientState: ClientState['editClient'] = {
  id: null,
  firstName: '',
  lastName: '',
  phone: '',
  email: null,
  address: null,
  communicationChannels: ['PHONE'],
  source: [CreateClientRequest.source.INSTAGRAM],
  sourceDetails: null,
  isLoading: false,
  error: null,
};

/**
 * Початковий стан стору клієнтів
 */
export const initialClientState: ClientState = {
  mode: 'existing',
  search: initialSearchState,
  clients: [],
  selectedClient: null,
  newClient: initialNewClientState,
  editClient: initialEditClientState,
};
