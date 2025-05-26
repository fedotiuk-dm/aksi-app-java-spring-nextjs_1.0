/**
 * @fileoverview Типи пошуку для клієнтів
 * @module domain/wizard/services/client/types/client-search
 */

import type { ClientDomain } from './client-core.types';

/**
 * Параметри пошуку клієнтів
 */
export interface ClientSearchDomainParams {
  query?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

/**
 * Результат пошуку клієнтів (відповідає структурі ClientPageResponse з бекенду)
 */
export interface ClientSearchDomainResult {
  /** Список клієнтів на поточній сторінці */
  content: ClientDomain[];
  /** Загальна кількість клієнтів */
  totalElements: number;
  /** Загальна кількість сторінок */
  totalPages: number;
  /** Номер поточної сторінки (з нуля) */
  pageNumber: number;
  /** Розмір сторінки */
  pageSize: number;
  /** Чи є попередня сторінка */
  hasPrevious: boolean;
  /** Чи є наступна сторінка */
  hasNext: boolean;
}

/**
 * Спрощений результат пошуку для зворотної сумісності
 * @deprecated Використовуйте ClientSearchDomainResult
 */
export interface ClientSearchLegacyResult {
  clients: ClientDomain[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}
