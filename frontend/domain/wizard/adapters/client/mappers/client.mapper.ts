/**
 * @fileoverview Маппер для перетворення ClientResponse ↔ WizardClient
 * @module domain/wizard/adapters/client/mappers
 */

import { ClientResponse, CreateClientRequest, UpdateClientRequest } from '@/lib/api';

import { WizardClient, WizardClientCreateData, WizardClientUpdateData } from '../types';
import { mapAddressDTOToDomain, mapAddressDomainToDTO } from './address.mapper';
import { mapClientCategoryDTOToDomain } from './category.mapper';
import {
  mapCommunicationChannelsToDomain,
  mapCommunicationChannelsToAPI,
} from './communication.mapper';
import { mapClientOrderSummaryFromDTO } from './order.mapper';
import { mapClientPreferenceDTOToDomain } from './preference.mapper';
import {
  mapApiSourceToWizard,
  mapWizardSourceToCreateRequest,
  mapWizardSourceToUpdateRequest,
} from './source.mapper.improved';

/**
 * Перетворює ClientResponse у WizardClient
 */
export function mapClientResponseToDomain(apiClient: ClientResponse): WizardClient {
  return {
    id: apiClient.id || '',
    lastName: apiClient.lastName || '',
    firstName: apiClient.firstName || '',
    fullName:
      apiClient.fullName || `${apiClient.firstName || ''} ${apiClient.lastName || ''}`.trim(),
    phone: apiClient.phone || '',
    email: apiClient.email,
    address: apiClient.address,
    structuredAddress: mapAddressDTOToDomain(apiClient.structuredAddress),
    communicationChannels: mapCommunicationChannelsToDomain(apiClient.communicationChannels),
    source: mapApiSourceToWizard(apiClient.source),
    sourceDetails: apiClient.sourceDetails,
    createdAt: apiClient.createdAt || new Date().toISOString(),
    updatedAt: apiClient.updatedAt || new Date().toISOString(),
    category: mapClientCategoryDTOToDomain(apiClient.category),
    preferences: (apiClient.preferences || []).map(mapClientPreferenceDTOToDomain),
    recentOrders: (apiClient.recentOrders || []).map(mapClientOrderSummaryFromDTO),
    orderCount: apiClient.orderCount || 0,
  };
}

/**
 * Перетворює WizardClientCreateData у CreateClientRequest
 */
export function mapClientToCreateRequest(
  domainClient: WizardClientCreateData
): CreateClientRequest {
  return {
    lastName: domainClient.lastName,
    firstName: domainClient.firstName,
    phone: domainClient.phone,
    email: domainClient.email,
    address: domainClient.address,
    structuredAddress: mapAddressDomainToDTO(domainClient.structuredAddress),
    communicationChannels: mapCommunicationChannelsToAPI(domainClient.communicationChannels),
    source: mapWizardSourceToCreateRequest(domainClient.source),
    sourceDetails: domainClient.sourceDetails,
  };
}

/**
 * Перетворює WizardClientUpdateData у UpdateClientRequest
 */
export function mapClientToUpdateRequest(
  domainClient: WizardClientUpdateData
): UpdateClientRequest {
  return {
    lastName: domainClient.lastName || '',
    firstName: domainClient.firstName || '',
    phone: domainClient.phone || '',
    email: domainClient.email,
    address: domainClient.address,
    structuredAddress: mapAddressDomainToDTO(domainClient.structuredAddress),
    communicationChannels: mapCommunicationChannelsToAPI(domainClient.communicationChannels),
    source: mapWizardSourceToUpdateRequest(domainClient.source),
    sourceDetails: domainClient.sourceDetails,
  };
}

/**
 * Перетворює масив API клієнтів у WizardClient[]
 */
export function mapClientArrayToDomain(apiClients: ClientResponse[]): WizardClient[] {
  return apiClients.map(mapClientResponseToDomain);
}

/**
 * Перетворює WizardClient у часткові дані для створення
 */
export function mapWizardClientToCreateData(client: Partial<WizardClient>): WizardClientCreateData {
  if (!client.lastName || !client.firstName || !client.phone) {
    throw new Error("Обов'язкові поля для створення клієнта: lastName, firstName, phone");
  }

  return {
    lastName: client.lastName,
    firstName: client.firstName,
    phone: client.phone,
    email: client.email,
    address: client.address,
    structuredAddress: client.structuredAddress,
    communicationChannels: client.communicationChannels,
    source: client.source,
    sourceDetails: client.sourceDetails,
  };
}

/**
 * Перетворює WizardClient у часткові дані для оновлення
 */
export function mapWizardClientToUpdateData(client: Partial<WizardClient>): WizardClientUpdateData {
  return {
    lastName: client.lastName,
    firstName: client.firstName,
    phone: client.phone,
    email: client.email,
    address: client.address,
    structuredAddress: client.structuredAddress,
    communicationChannels: client.communicationChannels,
    source: client.source,
    sourceDetails: client.sourceDetails,
  };
}
