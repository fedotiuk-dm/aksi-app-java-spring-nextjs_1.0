/**
 * @fileoverview Конвертери даних для репозиторію клієнтів
 * @module domain/wizard/services/client/repositories/client-repository-converters
 */

import type { ClientSearchResult } from '../../../types/wizard-step-states.types';
import type { ClientDomain, CreateClientDomainRequest, UpdateClientDomainRequest } from '../types';

/**
 * Інтерфейс сервісу конвертерів репозиторію
 */
export interface IClientRepositoryConverters {
  convertToDomainClient(apiClient: ClientSearchResult): ClientDomain;
  convertToApiCreateRequest(request: CreateClientDomainRequest): Partial<ClientSearchResult>;
  convertToApiUpdateRequest(request: UpdateClientDomainRequest): Partial<ClientSearchResult>;
}

/**
 * Сервіс конвертерів для репозиторію клієнтів
 * Відповідальність: конвертація між доменними типами та API типами
 */
export class ClientRepositoryConverters implements IClientRepositoryConverters {
  public readonly name = 'ClientRepositoryConverters';
  public readonly version = '1.0.0';

  /**
   * Конвертація API клієнта в доменний тип
   */
  convertToDomainClient(apiClient: ClientSearchResult): ClientDomain {
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
  convertToApiCreateRequest(request: CreateClientDomainRequest): Partial<ClientSearchResult> {
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
  convertToApiUpdateRequest(request: UpdateClientDomainRequest): Partial<ClientSearchResult> {
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
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientRepositoryConverters = new ClientRepositoryConverters();
