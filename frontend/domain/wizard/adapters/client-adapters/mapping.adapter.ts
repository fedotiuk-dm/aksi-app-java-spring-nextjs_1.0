/**
 * @fileoverview Адаптер маппінгу типів API ↔ Domain
 * @module domain/wizard/adapters/client-adapters
 */

import type { ClientSearchResult, OrderStatus } from '../../types';
import type {
  ClientResponse,
  ClientPageResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from '@/lib/api';

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

/**
 * Адаптер для маппінгу типів між API та Domain
 *
 * Відповідальність:
 * - Перетворення API типів у доменні
 * - Перетворення доменних типів у API запити
 * - Маппінг енумів та складних структур
 */
export class ClientMappingAdapter {
  /**
   * Перетворює API ClientResponse у доменний ClientSearchResult
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
      communicationChannels: (apiClient.communicationChannels || []).map(
        (channel) => COMMUNICATION_CHANNELS_FROM_API[channel] || 'PHONE'
      ),
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
   * Перетворює пагіновану API відповідь у доменний тип
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

  /**
   * Перетворює доменний тип у CreateClientRequest
   */
  static toCreateRequest(domainClient: Partial<ClientSearchResult>): CreateClientRequest {
    return this.toApiRequest(domainClient);
  }

  /**
   * Перетворює доменний тип у UpdateClientRequest
   */
  static toUpdateRequest(domainClient: Partial<ClientSearchResult>): UpdateClientRequest {
    return this.toApiRequest(domainClient);
  }

  // === ПРИВАТНІ УТИЛІТИ ===

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
      communicationChannels: domainClient.communicationChannels || [],
      source: domainClient.source as CreateClientRequest.source | undefined,
      sourceDetails: domainClient.sourceDetails,
    };
  }
}
