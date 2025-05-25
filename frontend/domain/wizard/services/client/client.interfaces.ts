/**
 * @fileoverview Інтерфейси клієнтських сервісів
 * @module domain/wizard/services/client/interfaces
 */

import type {
  BaseService,
  OperationResult,
  ValidationOperationResult,
  PaginatedOperationResult,
} from '../interfaces';
import type {
  ClientDomain,
  CreateClientDomainRequest,
  UpdateClientDomainRequest,
  ClientSearchDomainParams,
  ClientSearchDomainResult,
} from './client-domain.types';

/**
 * Параметри пошуку клієнтів (аліас для доменного типу)
 */
export type ClientSearchParams = ClientSearchDomainParams;

/**
 * Результат пошуку клієнтів (аліас для доменного типу)
 */
export type ClientSearchResult = ClientSearchDomainResult;

/**
 * Параметри автокомпліту
 */
export interface ClientAutocompleteParams {
  query: string;
  limit?: number;
  includePhone?: boolean;
  includeEmail?: boolean;
}

/**
 * Результат автокомпліту
 */
export interface ClientAutocompleteResult {
  suggestions: ClientSuggestion[];
  hasMore: boolean;
}

/**
 * Пропозиція автокомпліту
 */
export interface ClientSuggestion {
  id: string;
  displayText: string;
  client: ClientDomain;
  matchType: 'name' | 'phone' | 'email';
}

/**
 * Інтерфейс сервісу пошуку клієнтів
 */
export interface IClientSearchService extends BaseService {
  searchClients(params: ClientSearchParams): Promise<PaginatedOperationResult<ClientDomain>>;
  searchByQuery(query: string): Promise<OperationResult<ClientDomain[]>>;
  searchByPhone(phone: string): Promise<OperationResult<ClientDomain[]>>;
  searchByEmail(email: string): Promise<OperationResult<ClientDomain[]>>;
  getRecentClients(limit?: number): Promise<OperationResult<ClientDomain[]>>;
}

/**
 * Інтерфейс сервісу створення клієнтів
 */
export interface IClientCreationService extends BaseService {
  createClient(request: CreateClientDomainRequest): Promise<OperationResult<ClientDomain>>;
  updateClient(
    id: string,
    request: UpdateClientDomainRequest
  ): Promise<OperationResult<ClientDomain>>;
  validateClientData(
    request: CreateClientDomainRequest
  ): Promise<ValidationOperationResult<CreateClientDomainRequest>>;
  checkClientExists(phone: string, email?: string): Promise<OperationResult<boolean>>;
}

/**
 * Інтерфейс сервісу валідації клієнтів
 */
export interface IClientValidationService extends BaseService {
  validatePhone(phone: string): ValidationOperationResult<string>;
  validateEmail(email: string): ValidationOperationResult<string>;
  validateName(
    firstName: string,
    lastName: string
  ): ValidationOperationResult<{ firstName: string; lastName: string }>;
  validateClientRequest(
    request: CreateClientDomainRequest
  ): ValidationOperationResult<CreateClientDomainRequest>;
  validateUpdateRequest(
    request: UpdateClientDomainRequest
  ): ValidationOperationResult<UpdateClientDomainRequest>;
}

/**
 * Інтерфейс сервісу вибору клієнтів
 */
export interface IClientSelectionService extends BaseService {
  selectClient(client: ClientDomain): OperationResult<ClientDomain>;
  clearSelection(): OperationResult<void>;
  getSelectedClient(): OperationResult<ClientDomain | null>;
  isClientSelected(): boolean;
}

/**
 * Інтерфейс сервісу автокомпліту клієнтів
 */
export interface IClientAutocompleteService extends BaseService {
  getAutocompleteSuggestions(
    params: ClientAutocompleteParams
  ): Promise<OperationResult<ClientAutocompleteResult>>;
  formatSuggestion(client: ClientDomain, matchType: ClientSuggestion['matchType']): string;
  highlightMatch(text: string, query: string): string;
}
