/**
 * @fileoverview Сервіс адаптації пагінації для клієнтів
 * @module domain/wizard/services/client/services/client-pagination-adapter
 */

import type { PaginatedOperationResult } from '../../interfaces';
import type { ClientSearchDomainResult, ClientSearchLegacyResult } from '../types';
import type { ClientDomain } from '../types';

/**
 * Інтерфейс сервісу адаптації пагінації
 */
export interface IClientPaginationAdapterService {
  adaptToLegacyFormat(result: ClientSearchDomainResult): ClientSearchLegacyResult;
  adaptToPaginatedResult(result: ClientSearchDomainResult): PaginatedOperationResult<ClientDomain>;
  createEmptyPaginatedResult(page: number, size: number): PaginatedOperationResult<ClientDomain>;
}

/**
 * Сервіс адаптації пагінації для клієнтів
 * Відповідальність: конвертація між різними форматами пагінації
 */
export class ClientPaginationAdapterService implements IClientPaginationAdapterService {
  public readonly name = 'ClientPaginationAdapterService';
  public readonly version = '1.0.0';

  /**
   * Адаптація до застарілого формату для зворотної сумісності
   */
  adaptToLegacyFormat(result: ClientSearchDomainResult): ClientSearchLegacyResult {
    return {
      clients: result.content,
      total: result.totalElements,
      page: result.pageNumber,
      size: result.pageSize,
      hasMore: result.hasNext,
    };
  }

  /**
   * Адаптація до формату PaginatedOperationResult
   */
  adaptToPaginatedResult(result: ClientSearchDomainResult): PaginatedOperationResult<ClientDomain> {
    return {
      success: true,
      data: result.content,
      timestamp: new Date(),
      pagination: {
        page: result.pageNumber,
        size: result.pageSize,
        total: result.totalElements,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious,
      },
    };
  }

  /**
   * Створення порожнього результату з пагінацією
   */
  createEmptyPaginatedResult(page: number, size: number): PaginatedOperationResult<ClientDomain> {
    return {
      success: false,
      error: 'Немає даних',
      timestamp: new Date(),
      pagination: {
        page,
        size,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      },
    };
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientPaginationAdapterService = new ClientPaginationAdapterService();
