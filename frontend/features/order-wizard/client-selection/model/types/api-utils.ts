import {
  ClientResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from '@/lib/api';

import { CommunicationChannel, ClientSource } from './common-types';
import { ClientFormData } from './form-types';

/**
 * Утилітні функції для роботи з API та формами
 */

/**
 * Перетворення даних з API в форму
 */
export function clientResponseToFormData(client: ClientResponse): ClientFormData {
  return {
    id: client.id,
    firstName: client.firstName || '',
    lastName: client.lastName || '',
    phone: client.phone || '',
    email: client.email || null,
    address: client.address || null,
    communicationChannels:
      client.communicationChannels?.map((c) => c as CommunicationChannel) || [],
    source: Array.isArray(client.source)
      ? client.source.map((s: string) => s as ClientSource)
      : client.source
      ? [client.source as unknown as ClientSource]
      : [],
    sourceDetails: client.sourceDetails || null,
    isLoading: false,
    error: null,
  };
}

/**
 * Перетворення даних форми у запит на створення
 */
export function formDataToCreateRequest(formData: ClientFormData): CreateClientRequest {
  // Перетворюємо дані у вихідний формат
  return {
    firstName: formData.firstName?.trim() || '',
    lastName: formData.lastName?.trim() || '',
    phone: formData.phone?.trim() || '',
    email: sanitizeEmptyString(formData.email),
    address: sanitizeEmptyString(formData.address),
    sourceDetails: sanitizeEmptyString(formData.sourceDetails),
    communicationChannels: formData.communicationChannels?.filter(Boolean) || [],
    source: formData.source?.filter(Boolean) || [],
  } as unknown as CreateClientRequest;
}

/**
 * Перетворення даних форми у запит на оновлення
 */
export function formDataToUpdateRequest(formData: ClientFormData): UpdateClientRequest {
  // Перевіряємо, що id є валідним
  if (!formData.id) {
    throw new Error('Client ID is required for update request');
  }

  // Перетворюємо дані у вихідний формат
  return {
    id: formData.id,
    firstName: formData.firstName?.trim() || '',
    lastName: formData.lastName?.trim() || '',
    phone: formData.phone?.trim() || '',
    email: sanitizeEmptyString(formData.email),
    address: sanitizeEmptyString(formData.address),
    sourceDetails: sanitizeEmptyString(formData.sourceDetails),
    communicationChannels: formData.communicationChannels?.filter(Boolean) || [],
    source: formData.source?.filter(Boolean) || [],
  } as unknown as UpdateClientRequest;
}

/**
 * Допоміжна функція для перетворення пустих рядків у null
 */
function sanitizeEmptyString(value: string | null | undefined): string | null {
  if (value === undefined || value === null || value.trim() === '') {
    return null;
  }
  return value;
}


