/**
 * @fileoverview Маппер для перетворення ClientResponse ↔ ClientSearchResult
 * @module domain/wizard/adapters/client
 */

import type { ClientSearchResult, OrderStatus } from '../../types';
import type { ClientResponse, CreateClientRequest, UpdateClientRequest } from '@/lib/api';

/**
 * Перетворює ClientResponse у доменний ClientSearchResult
 */
export function mapClientResponseToDomain(apiClient: ClientResponse): ClientSearchResult {
  return {
    id: apiClient.id || '',
    firstName: apiClient.firstName || '',
    lastName: apiClient.lastName || '',
    fullName:
      apiClient.fullName || `${apiClient.firstName || ''} ${apiClient.lastName || ''}`.trim(),
    phone: apiClient.phone || '',
    email: apiClient.email || undefined,
    address: apiClient.address || undefined,
    structuredAddress: apiClient.structuredAddress
      ? {
          street: apiClient.structuredAddress.street || '',
          city: apiClient.structuredAddress.city || '',
          zipCode: apiClient.structuredAddress.postalCode,
          country: undefined, // AddressDTO не має поля country
        }
      : undefined,
    communicationChannels: apiClient.communicationChannels || [],
    source: apiClient.source as ClientSearchResult['source'],
    sourceDetails: apiClient.sourceDetails || undefined,
    createdAt: apiClient.createdAt || new Date().toISOString(),
    updatedAt: apiClient.updatedAt || new Date().toISOString(),
    orderCount: apiClient.orderCount || 0,
    recentOrders:
      apiClient.recentOrders?.map((order) => ({
        id: order.id || '',
        receiptNumber: order.receiptNumber || '',
        status: (order.status || 'DRAFT') as OrderStatus,
        totalAmount: order.totalAmount || 0,
        createdAt: order.createdAt || new Date().toISOString(),
        completionDate: order.completionDate,
        itemCount: order.itemCount || 0,
      })) || [],
  };
}

/**
 * Перетворює доменний ClientSearchResult у CreateClientRequest
 */
export function mapClientToCreateRequest(
  domainClient: Partial<ClientSearchResult>
): CreateClientRequest {
  return {
    firstName: domainClient.firstName || '',
    lastName: domainClient.lastName || '',
    phone: domainClient.phone || '',
    email: domainClient.email,
    address: domainClient.address,
    structuredAddress: domainClient.structuredAddress
      ? {
          street: domainClient.structuredAddress.street,
          city: domainClient.structuredAddress.city,
          postalCode: domainClient.structuredAddress.zipCode,
          building: undefined, // Доменна модель не має цих полів
          apartment: undefined,
          fullAddress: domainClient.address, // Використовуємо загальну адресу
        }
      : undefined,
    communicationChannels: domainClient.communicationChannels,
    source: domainClient.source as CreateClientRequest['source'],
    sourceDetails: domainClient.sourceDetails,
  };
}

/**
 * Перетворює доменний ClientSearchResult у UpdateClientRequest
 */
export function mapClientToUpdateRequest(
  domainClient: Partial<ClientSearchResult>
): UpdateClientRequest {
  return {
    firstName: domainClient.firstName || '',
    lastName: domainClient.lastName || '',
    phone: domainClient.phone || '',
    email: domainClient.email,
    address: domainClient.address,
    structuredAddress: domainClient.structuredAddress
      ? {
          street: domainClient.structuredAddress.street,
          city: domainClient.structuredAddress.city,
          postalCode: domainClient.structuredAddress.zipCode,
          building: undefined, // Доменна модель не має цих полів
          apartment: undefined,
          fullAddress: domainClient.address, // Використовуємо загальну адресу
        }
      : undefined,
    communicationChannels: domainClient.communicationChannels,
    source: domainClient.source as UpdateClientRequest['source'],
    sourceDetails: domainClient.sourceDetails,
  };
}

// Legacy експорти для зворотної сумісності
export const mapClientDTOToDomain = mapClientResponseToDomain;
export const mapClientSummaryDTOToDomain = mapClientResponseToDomain;
export const mapClientToDTO = mapClientToCreateRequest;
export const mapClientArrayToDomain = (clients: ClientResponse[]) =>
  clients.map(mapClientResponseToDomain);
