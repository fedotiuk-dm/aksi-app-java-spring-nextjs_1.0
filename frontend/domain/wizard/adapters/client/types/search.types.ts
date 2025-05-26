/**
 * @fileoverview Типи для пошуку та фільтрації клієнтів
 * @module domain/wizard/adapters/client/types
 */

import type { WizardClientSource, WizardCommunicationChannel } from './base.types';
import type { WizardClient } from './entities.types';

/**
 * Параметри пошуку клієнтів
 */
export interface WizardClientSearchParams {
  readonly query?: string;
  readonly page?: number;
  readonly size?: number;
}

/**
 * Фільтри для пошуку клієнтів
 */
export interface WizardClientFilters {
  readonly searchTerm?: string;
  readonly source?: WizardClientSource;
  readonly hasEmail?: boolean;
  readonly hasOrders?: boolean;
  readonly categoryId?: string;
  readonly communicationChannels?: WizardCommunicationChannel[];
  readonly createdAfter?: string;
  readonly createdBefore?: string;
}

/**
 * Результат пошуку клієнтів з пагінацією
 */
export interface WizardClientSearchResult {
  readonly clients: WizardClient[];
  readonly totalElements: number;
  readonly totalPages: number;
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly hasPrevious: boolean;
  readonly hasNext: boolean;
}

/**
 * Параметри сортування клієнтів
 */
export interface WizardClientSortOptions {
  readonly field: 'lastName' | 'firstName' | 'phone' | 'createdAt' | 'orderCount';
  readonly direction: 'asc' | 'desc';
}
