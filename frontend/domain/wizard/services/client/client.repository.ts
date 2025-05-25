/**
 * @fileoverview Репозиторій клієнтів
 * @module domain/wizard/services/client/repository
 */

import {
  searchClientsWithPagination,
  getClientById,
  createClient,
  updateClient,
} from '../../adapters/client';
import { OperationResultFactory } from '../interfaces';

import type {
  ClientDomain,
  CreateClientDomainRequest,
  UpdateClientDomainRequest,
  ClientSearchDomainParams,
  ClientSearchDomainResult,
} from './client-domain.types';
import type { ClientSearchResult } from '../../types/wizard-step-states.types';
import type { OperationResult } from '../interfaces';

/**
 * Константи для помилок
 */
const ERROR_MESSAGES = {
  UNKNOWN: 'Невідома помилка',
  SEARCH_FAILED: 'Помилка пошуку клієнтів',
  GET_FAILED: 'Помилка отримання клієнта',
  CREATE_FAILED: 'Помилка створення клієнта',
  UPDATE_FAILED: 'Помилка оновлення клієнта',
} as const;

/**
 * Репозиторій для роботи з клієнтами
 * Інкапсулює логіку взаємодії з адаптерами та конвертацію типів
 */
export class ClientRepository {
  /**
   * Пошук клієнтів
   */
  async searchClients(
    params: ClientSearchDomainParams
  ): Promise<OperationResult<ClientSearchDomainResult>> {
    try {
      // Конвертуємо доменні параметри в параметри для адаптера
      const searchQuery = this.buildSearchQuery(params);
      const page = Math.max(0, params.page || 0);
      const size = Math.min(params.size || 20, 100);

      // Викликаємо адаптер
      const result = await searchClientsWithPagination(searchQuery, page, size);

      // Конвертуємо результат адаптера в доменний результат
      const domainResult: ClientSearchDomainResult = {
        clients: result.clients.map(this.convertToDomainClient),
        total: result.totalElements,
        page,
        size,
        hasMore: page < result.totalPages - 1,
      };

      return OperationResultFactory.success(domainResult);
    } catch (error) {
      return OperationResultFactory.error(
        `${ERROR_MESSAGES.SEARCH_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN}`
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

      const domainClient = this.convertToDomainClient(result);
      return OperationResultFactory.success(domainClient);
    } catch (error) {
      return OperationResultFactory.error(
        `${ERROR_MESSAGES.GET_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Створення клієнта
   */
  async create(request: CreateClientDomainRequest): Promise<OperationResult<ClientDomain>> {
    try {
      // Конвертуємо доменний запит в запит для адаптера
      const apiRequest = this.convertToApiCreateRequest(request);

      const result = await createClient(apiRequest);

      const domainClient = this.convertToDomainClient(result);
      return OperationResultFactory.success(domainClient);
    } catch (error) {
      return OperationResultFactory.error(
        `${ERROR_MESSAGES.CREATE_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN}`
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
      const apiRequest = this.convertToApiUpdateRequest(request);

      const result = await updateClient(id, apiRequest);

      const domainClient = this.convertToDomainClient(result);
      return OperationResultFactory.success(domainClient);
    } catch (error) {
      return OperationResultFactory.error(
        `${ERROR_MESSAGES.UPDATE_FAILED}: ${error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Побудова запиту для пошуку
   */
  private buildSearchQuery(params: ClientSearchDomainParams): string {
    // Тут логіка побудови запиту залежно від того, що очікує адаптер
    if (params.query) {
      return params.query;
    }

    const parts: string[] = [];
    if (params.firstName) parts.push(params.firstName);
    if (params.lastName) parts.push(params.lastName);
    if (params.phone) parts.push(params.phone);
    if (params.email) parts.push(params.email);

    return parts.join(' ');
  }

  /**
   * Конвертація API клієнта в доменний тип
   */
  private convertToDomainClient(apiClient: ClientSearchResult): ClientDomain {
    return {
      id: apiClient.id,
      firstName: apiClient.firstName,
      lastName: apiClient.lastName,
      phone: apiClient.phone,
      email: apiClient.email || undefined,
      address: apiClient.structuredAddress
        ? {
            street: apiClient.structuredAddress.street,
            city: apiClient.structuredAddress.city,
            zipCode: apiClient.structuredAddress.zipCode,
            country: apiClient.structuredAddress.country,
          }
        : undefined,
      contactMethods: (apiClient.communicationChannels || []).filter(
        (method): method is 'PHONE' | 'SMS' | 'VIBER' => ['PHONE', 'SMS', 'VIBER'].includes(method)
      ),
      referralSource: apiClient.source,
      createdAt: new Date(apiClient.createdAt),
      updatedAt: new Date(apiClient.updatedAt),
    };
  }

  /**
   * Конвертація доменного запиту створення в API запит
   */
  private convertToApiCreateRequest(
    request: CreateClientDomainRequest
  ): Partial<ClientSearchResult> {
    return {
      firstName: request.firstName,
      lastName: request.lastName,
      phone: request.phone,
      email: request.email,
      structuredAddress: request.address
        ? {
            street: request.address.street,
            city: request.address.city,
            zipCode: request.address.zipCode,
            country: request.address.country,
          }
        : undefined,
      communicationChannels: request.contactMethods.filter(
        (method): method is 'PHONE' | 'SMS' | 'VIBER' => ['PHONE', 'SMS', 'VIBER'].includes(method)
      ),
      source: request.referralSource,
      sourceDetails: request.referralSourceOther,
    };
  }

  /**
   * Конвертація доменного запиту оновлення в API запит
   */
  private convertToApiUpdateRequest(
    request: UpdateClientDomainRequest
  ): Partial<ClientSearchResult> {
    const result: Partial<ClientSearchResult> = {};

    if (request.firstName !== undefined) result.firstName = request.firstName;
    if (request.lastName !== undefined) result.lastName = request.lastName;
    if (request.phone !== undefined) result.phone = request.phone;
    if (request.email !== undefined) result.email = request.email;

    if (request.address !== undefined) {
      result.structuredAddress = request.address
        ? {
            street: request.address.street,
            city: request.address.city,
            zipCode: request.address.zipCode,
            country: request.address.country,
          }
        : undefined;
    }

    if (request.contactMethods !== undefined) {
      result.communicationChannels = request.contactMethods.filter(
        (method): method is 'PHONE' | 'SMS' | 'VIBER' => ['PHONE', 'SMS', 'VIBER'].includes(method)
      );
    }

    return result;
  }
}

/**
 * Експорт екземпляра репозиторію (Singleton)
 */
export const clientRepository = new ClientRepository();
