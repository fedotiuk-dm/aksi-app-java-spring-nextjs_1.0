/**
 * @fileoverview Адаптер клієнтів API → Domain
 * @module domain/wizard/adapters
 */

// === ІМПОРТИ ЗГЕНЕРОВАНИХ API ТИПІВ ===
import { ClientsService } from '@/lib/api';

import type { ClientSearchResult, OrderStatus } from '../types';
import type {
  ClientResponse,
  ClientPageResponse,
  CreateClientRequest,
  UpdateClientRequest,
  ClientSearchRequest,
} from '@/lib/api';

// === ІМПОРТИ API СЕРВІСІВ ===

// === МАПЕРИ ДЛЯ ПЕРЕТВОРЕННЯ ТИПІВ ===

/**
 * Мапер каналів комунікації: API → Domain
 */
const COMMUNICATION_CHANNELS_FROM_API = {
  PHONE: 'PHONE' as const,
  SMS: 'SMS' as const,
  VIBER: 'VIBER' as const,
} as const;

/**
 * Мапер джерел інформації: API → Domain
 */
const INFO_SOURCE_FROM_API = {
  INSTAGRAM: 'INSTAGRAM' as const,
  GOOGLE: 'GOOGLE' as const,
  RECOMMENDATION: 'RECOMMENDATION' as const,
  OTHER: 'OTHER' as const,
} as const;

// === ІМПОРТИ ДОМЕННИХ ТИПІВ ===

/**
 * Адаптер для перетворення API типів клієнтів у доменні типи
 */
export class ClientAdapter {
  /**
   * Перетворює згенерований ClientResponse у доменний ClientSearchResult
   */
  static toDomain(apiClient: ClientResponse): ClientSearchResult {
    return {
      id: apiClient.id || '',
      lastName: apiClient.lastName || '',
      firstName: apiClient.firstName || '',
      fullName:
        apiClient.fullName || `${apiClient.firstName || ''} ${apiClient.lastName || ''}`.trim(),
      phone: apiClient.phone || '',
      email: apiClient.email || undefined,
      address: apiClient.address || undefined,
      structuredAddress: apiClient.structuredAddress
        ? {
            street: apiClient.structuredAddress.street || '',
            city: apiClient.structuredAddress.city || '',
            zipCode: apiClient.structuredAddress.postalCode || undefined,
            country: apiClient.structuredAddress.fullAddress || undefined,
          }
        : undefined,
      // Доменні типи вже використовують правильні API значення
      communicationChannels: (apiClient.communicationChannels || []).map(
        (channel) => COMMUNICATION_CHANNELS_FROM_API[channel] || 'PHONE'
      ),
      // Доменні типи вже використовують правильні API значення
      source: apiClient.source ? INFO_SOURCE_FROM_API[apiClient.source] : undefined,
      sourceDetails: apiClient.sourceDetails || undefined,
      createdAt: apiClient.createdAt || new Date().toISOString(),
      updatedAt: apiClient.updatedAt || new Date().toISOString(),
      orderCount: apiClient.orderCount || 0,
      recentOrders: (apiClient.recentOrders || []).map((order) => ({
        id: order.id || '',
        receiptNumber: order.receiptNumber || '',
        status: (order.status as OrderStatus) || 'DRAFT',
        totalAmount: order.totalAmount || 0,
        createdAt: order.createdAt || '',
        completionDate: order.completionDate || undefined,
        itemCount: order.itemCount || 0,
      })),
    };
  }

  /**
   * Спільна логіка для перетворення доменного типу в API запит
   */
  private static toApiRequest(domainClient: Partial<ClientSearchResult>) {
    return {
      firstName: domainClient.firstName || '',
      lastName: domainClient.lastName || '',
      phone: domainClient.phone || '',
      email: domainClient.email,
      address: domainClient.address,
      // Доменні типи вже використовують правильні API значення
      communicationChannels: domainClient.communicationChannels || [],
      // Доменні типи вже використовують правильні API значення
      source: domainClient.source as CreateClientRequest.source | undefined,
      sourceDetails: domainClient.sourceDetails,
    };
  }

  /**
   * Перетворює доменний тип у CreateClientRequest для створення нового клієнта
   */
  static toCreateRequest(domainClient: Partial<ClientSearchResult>): CreateClientRequest {
    return this.toApiRequest(domainClient);
  }

  /**
   * Перетворює доменний тип у UpdateClientRequest для оновлення клієнта
   */
  static toUpdateRequest(domainClient: Partial<ClientSearchResult>): UpdateClientRequest {
    return this.toApiRequest(domainClient);
  }

  /**
   * Перетворює пагіновану відповідь клієнтів
   */
  static toDomainPage(apiResponse: ClientPageResponse): {
    items: ClientSearchResult[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    return {
      items: (apiResponse.content || []).map(this.toDomain),
      totalElements: apiResponse.totalElements || 0,
      totalPages: apiResponse.totalPages || 0,
      currentPage: apiResponse.pageNumber || 0,
      pageSize: apiResponse.pageSize || 10,
      hasNext: apiResponse.hasNext || false,
      hasPrevious: apiResponse.hasPrevious || false,
    };
  }

  // === НОВІ API МЕТОДИ (КРОК 1) ===

  /**
   * Пошук клієнтів з пагінацією через API
   */
  static async searchWithPagination(params: {
    query: string;
    page?: number;
    size?: number;
  }): Promise<{
    items: ClientSearchResult[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    const searchRequest: ClientSearchRequest = {
      query: params.query,
      page: params.page || 0,
      size: params.size || 10,
    };

    const apiResponse = await ClientsService.searchClientsWithPagination({
      requestBody: searchRequest,
    });

    return this.toDomainPage(apiResponse);
  }

  /**
   * Створення нового клієнта через API
   */
  static async createClient(domainData: Partial<ClientSearchResult>): Promise<ClientSearchResult> {
    const createRequest = this.toCreateRequest(domainData);
    const apiResponse = await ClientsService.createClient({
      requestBody: createRequest,
    });

    return this.toDomain(apiResponse);
  }

  /**
   * Отримання клієнта за ID через API
   */
  static async getById(id: string): Promise<ClientSearchResult> {
    const apiResponse = await ClientsService.getClientById({ id });
    return this.toDomain(apiResponse);
  }

  /**
   * Оновлення існуючого клієнта через API
   */
  static async updateClient(
    id: string,
    domainData: Partial<ClientSearchResult>
  ): Promise<ClientSearchResult> {
    const updateRequest = this.toUpdateRequest(domainData);
    const apiResponse = await ClientsService.updateClient({
      id,
      requestBody: updateRequest,
    });

    return this.toDomain(apiResponse);
  }

  /**
   * Видалення клієнта через API
   */
  static async deleteClient(id: string): Promise<void> {
    await ClientsService.deleteClient({ id });
  }
}
