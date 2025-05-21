import {
  Client,
  ClientAddress,
  ClientSource,
} from '@/features/order-wizard/clients/types/client.types';
import { ClientResponse, CreateClientRequest, UpdateClientRequest } from '@/lib/api';

/**
 * Форматування структурованої адреси для відображення
 */
export const formatAddress = (
  address?: Client['address']
): string | undefined => {
  if (!address) return undefined;

  // Якщо адреса - це рядок, просто повертаємо її
  if (typeof address === 'string') {
    return address;
  }

  // Якщо адреса - це об'єкт, формуємо рядок
  const addressParts = [
    address.street || '',
    address.city || '',
    address.postalCode || '',
    address.additionalInfo || '',
  ].filter(Boolean);

  return addressParts.length > 0 ? addressParts.join(', ') : undefined;
};

/**
 * Перетворення рядка адреси в об'єкт адреси
 * Примітка: використовуйте цю функцію лише для відображення, бекенд очікує адресу як рядок
 */
export const parseAddress = (addressString: string): ClientAddress => {
  if (!addressString) {
    return {
      street: '',
      city: '',
      postalCode: '',
      additionalInfo: '',
    };
  }

  const parts = addressString.split(',').map((part) => part.trim());

  return {
    street: parts[0] || '',
    city: parts[1] || '',
    postalCode: parts[2] || '',
    additionalInfo: parts[3] || '',
  };
};

/**
 * Мапінг джерела з API в модель
 */
export const mapApiSourceToModelSource = (apiSource?: ClientResponse['source']): ClientSource => {
  return apiSource as ClientSource;
};

/**
 * Мапінг модельного джерела в API формат
 */
export const mapSourceToApiSource = (source?: ClientSource): ClientResponse['source'] => {
  return source as ClientResponse['source'];
};

/**
 * Підготовка даних клієнта з API для відображення
 */
export const mapApiClientToModelClient = (apiClient: ClientResponse): Client => {
  return {
    ...apiClient,
    firstName: apiClient.firstName || '',
    lastName: apiClient.lastName || '',
    phone: apiClient.phone || '',
    // Для відображення можемо парсити адресу як об'єкт
    address: apiClient.address ? parseAddress(apiClient.address) : undefined,
    communicationChannels: apiClient.communicationChannels || [],
    source: apiClient.source,
    sourceDetails: apiClient.sourceDetails,
    createdAt: apiClient.createdAt,
    updatedAt: apiClient.updatedAt,
  };
};

/**
 * Підготовка даних клієнта для відправки на бекенд
 */
export const prepareClientForApi = (client: Partial<Client>): Partial<CreateClientRequest | UpdateClientRequest> => {
  // Якщо адреса - об'єкт, перетворюємо її на рядок, тому що бекенд очікує рядок
  const address = client.address
    ? typeof client.address === 'string'
      ? client.address
      : formatAddress(client.address)
    : undefined;

  return {
    firstName: client.firstName,
    lastName: client.lastName,
    phone: client.phone,
    email: client.email,
    address,
    communicationChannels: client.communicationChannels,
    source: client.source,
    sourceDetails: client.sourceDetails,
  };
};

