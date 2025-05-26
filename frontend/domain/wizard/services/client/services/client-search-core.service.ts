/**
 * @fileoverview Основний сервіс пошуку клієнтів
 * @module domain/wizard/services/client/services/client-search-core
 */

import { clientRepositoryCore } from '../repositories';
import { clientPaginationAdapterService } from './client-pagination-adapter.service';
import { clientSearchUtilsService } from './client-search-utils.service';

import type { PaginatedOperationResult } from '../../interfaces';
import type { ClientSearchParams } from '../interfaces';
import type { ClientDomain } from '../types';

/**
 * Константи
 */
const CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  ERROR_MESSAGES: {
    SEARCH_FAILED: 'Помилка пошуку',
    UNKNOWN: 'Невідома помилка',
  },
} as const;

/**
 * Інтерфейс основного сервісу пошуку клієнтів
 */
export interface IClientSearchCoreService {
  searchClients(params: ClientSearchParams): Promise<PaginatedOperationResult<ClientDomain>>;
  testPagination(): Promise<PaginatedOperationResult<ClientDomain>>;
}

/**
 * Основний сервіс пошуку клієнтів
 * Відповідальність: базовий пошук клієнтів з пагінацією
 */
export class ClientSearchCoreService implements IClientSearchCoreService {
  public readonly name = 'ClientSearchCoreService';
  public readonly version = '1.0.0';

  /**
   * Пошук клієнтів з пагінацією
   */
  async searchClients(params: ClientSearchParams): Promise<PaginatedOperationResult<ClientDomain>> {
    try {
      const searchRequest = clientSearchUtilsService.buildSearchRequest(params);
      const result = await clientRepositoryCore.searchClients(searchRequest);

      if (!result.success) {
        return clientPaginationAdapterService.createEmptyPaginatedResult(
          params.page || 0,
          params.size || CONSTANTS.DEFAULT_PAGE_SIZE
        );
      }

      const searchResult = result.data;
      if (!searchResult) {
        return clientPaginationAdapterService.createEmptyPaginatedResult(
          params.page || 0,
          params.size || CONSTANTS.DEFAULT_PAGE_SIZE
        );
      }

      return clientPaginationAdapterService.adaptToPaginatedResult(searchResult);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN;

      const emptyResult = clientPaginationAdapterService.createEmptyPaginatedResult(
        params.page || 0,
        params.size || CONSTANTS.DEFAULT_PAGE_SIZE
      );

      return {
        ...emptyResult,
        error: `${CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED}: ${errorMessage}`,
      };
    }
  }

  /**
   * Тестовий метод для перевірки пагінації
   */
  async testPagination(): Promise<PaginatedOperationResult<ClientDomain>> {
    return this.searchClients({
      query: '',
      page: 0,
      size: 5,
    });
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientSearchCoreService = new ClientSearchCoreService();
