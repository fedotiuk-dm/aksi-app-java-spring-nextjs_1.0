/**
 * @fileoverview Основний репозиторій клієнтів
 * @module domain/wizard/services/client/repositories/client-repository-core
 */

import { CLIENT_REPOSITORY_ERROR_MESSAGES } from './client-repository-constants';
import { clientRepositoryConverters } from './client-repository-converters';
import { clientRepositoryUtils } from './client-repository-utils';
import {
  searchClientsWithPagination,
  getClientById,
  createClient,
  updateClient,
} from '../../../adapters/client';
import { OperationResultFactory } from '../../interfaces';

import type { OperationResult } from '../../interfaces';
import type {
  ClientDomain,
  CreateClientDomainRequest,
  UpdateClientDomainRequest,
  ClientSearchDomainParams,
  ClientSearchDomainResult,
} from '../types';

/**
 * Інтерфейс основного репозиторію клієнтів
 */
export interface IClientRepositoryCore {
  searchClients(
    params: ClientSearchDomainParams
  ): Promise<OperationResult<ClientSearchDomainResult>>;
  getById(id: string): Promise<OperationResult<ClientDomain | null>>;
  create(request: CreateClientDomainRequest): Promise<OperationResult<ClientDomain>>;
  update(id: string, request: UpdateClientDomainRequest): Promise<OperationResult<ClientDomain>>;
}

/**
 * Основний репозиторій для роботи з клієнтами
 * Відповідальність: CRUD операції з клієнтами через API адаптери
 */
export class ClientRepositoryCore implements IClientRepositoryCore {
  public readonly name = 'ClientRepositoryCore';
  public readonly version = '1.0.0';

  /**
   * Пошук клієнтів
   */
  async searchClients(
    params: ClientSearchDomainParams
  ): Promise<OperationResult<ClientSearchDomainResult>> {
    try {
      // Конвертуємо доменні параметри в параметри для адаптера
      const searchQuery = clientRepositoryUtils.buildSearchQuery(params);
      const { page, size } = clientRepositoryUtils.normalizePaginationParams(
        params.page,
        params.size
      );

      // Викликаємо адаптер
      const result = await searchClientsWithPagination(searchQuery, page, size);

      // Конвертуємо результат адаптера в доменний результат
      // Адаптер повертає структуру { clients, totalElements, totalPages }
      // Потрібно перетворити в структуру ClientPageResponse
      const domainResult: ClientSearchDomainResult = {
        content: result.clients.map(clientRepositoryConverters.convertToDomainClient),
        totalElements: result.totalElements,
        totalPages: result.totalPages,
        pageNumber: page,
        pageSize: size,
        hasPrevious: page > 0,
        hasNext: page < result.totalPages - 1,
      };

      return OperationResultFactory.success(domainResult);
    } catch (error) {
      return OperationResultFactory.error(
        `${CLIENT_REPOSITORY_ERROR_MESSAGES.SEARCH_FAILED}: ${error instanceof Error ? error.message : CLIENT_REPOSITORY_ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання клієнта за ID
   */
  async getById(id: string): Promise<OperationResult<ClientDomain | null>> {
    try {
      const result = await getClientById(id);

      if (!result) {
        return OperationResultFactory.success(null);
      }

      const domainClient = clientRepositoryConverters.convertToDomainClient(result);
      return OperationResultFactory.success(domainClient);
    } catch (error) {
      return OperationResultFactory.error(
        `${CLIENT_REPOSITORY_ERROR_MESSAGES.GET_FAILED}: ${error instanceof Error ? error.message : CLIENT_REPOSITORY_ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Створення клієнта
   */
  async create(request: CreateClientDomainRequest): Promise<OperationResult<ClientDomain>> {
    try {
      // Конвертуємо доменний запит в запит для адаптера
      const apiRequest = clientRepositoryConverters.convertToApiCreateRequest(request);

      const result = await createClient(apiRequest);

      const domainClient = clientRepositoryConverters.convertToDomainClient(result);
      return OperationResultFactory.success(domainClient);
    } catch (error) {
      return OperationResultFactory.error(
        `${CLIENT_REPOSITORY_ERROR_MESSAGES.CREATE_FAILED}: ${error instanceof Error ? error.message : CLIENT_REPOSITORY_ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Оновлення клієнта
   */
  async update(
    id: string,
    request: UpdateClientDomainRequest
  ): Promise<OperationResult<ClientDomain>> {
    try {
      // Конвертуємо доменний запит в запит для адаптера
      const apiRequest = clientRepositoryConverters.convertToApiUpdateRequest(request);

      const result = await updateClient(id, apiRequest);

      const domainClient = clientRepositoryConverters.convertToDomainClient(result);
      return OperationResultFactory.success(domainClient);
    } catch (error) {
      return OperationResultFactory.error(
        `${CLIENT_REPOSITORY_ERROR_MESSAGES.UPDATE_FAILED}: ${error instanceof Error ? error.message : CLIENT_REPOSITORY_ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }
}

/**
 * Експорт екземпляра репозиторію (Singleton)
 */
export const clientRepositoryCore = new ClientRepositoryCore();
