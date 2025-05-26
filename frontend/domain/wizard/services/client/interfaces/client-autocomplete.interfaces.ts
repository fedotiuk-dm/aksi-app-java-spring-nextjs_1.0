 /**
 * @fileoverview Інтерфейси сервісів автокомпліту клієнтів
 * @module domain/wizard/services/client/interfaces/client-autocomplete
 */

import type { BaseService, OperationResult } from '../../interfaces';
import type { ClientDomain } from '../types';

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
 * Інтерфейс сервісу автокомпліту клієнтів
 */
export interface IClientAutocompleteService extends BaseService {
  getAutocompleteSuggestions(
    params: ClientAutocompleteParams
  ): Promise<OperationResult<ClientAutocompleteResult>>;
  formatSuggestion(client: ClientDomain, matchType: ClientSuggestion['matchType']): string;
  highlightMatch(text: string, query: string): string;
}
