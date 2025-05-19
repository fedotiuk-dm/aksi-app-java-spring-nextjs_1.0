import { ClientResponse } from '@/lib/api';
import {
  Client,
  ClientSource,
  ClientAddress,
} from '@/features/order-wizard/model/types/types';
import { UUID } from 'node:crypto';

export const formatAddress = (
  address?: Client['address']
): string | undefined => {
  if (!address) return undefined;

  const hasAddressData =
    address.street ||
    address.city ||
    address.postalCode ||
    address.additionalInfo;
  if (!hasAddressData) return undefined;

  if (typeof address === 'object') {
    const addressParts = [
      address.street || '',
      address.city || '',
      address.postalCode || '',
      address.additionalInfo || '',
    ].filter(Boolean);

    return addressParts.join(', ');
  }

  return address;
};

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

export const mapApiSourceToModelSource = (apiSource: string): ClientSource => {
  switch (apiSource) {
    case ClientResponse.source.INSTAGRAM:
      return 'INSTAGRAM';
    case ClientResponse.source.GOOGLE:
      return 'GOOGLE';
    case ClientResponse.source.RECOMMENDATION:
      return 'RECOMMENDATION';
    default:
      return 'OTHER';
  }
};

export const mapSourceToApiSource = (
  source: ClientSource
): ClientResponse.source => {
  switch (source) {
    case 'INSTAGRAM':
      return ClientResponse.source.INSTAGRAM;
    case 'GOOGLE':
      return ClientResponse.source.GOOGLE;
    case 'RECOMMENDATION':
      return ClientResponse.source.RECOMMENDATION;
    default:
      return ClientResponse.source.OTHER;
  }
};

export const mapApiClientToModelClient = (
  apiClient: ClientResponse
): Client => {
  const address: ClientAddress | undefined = apiClient.address
    ? typeof apiClient.address === 'string'
      ? parseAddress(apiClient.address)
      : (apiClient.address as unknown as ClientAddress)
    : undefined;

  const communicationChannels = apiClient.communicationChannels || [];

  return {
    id: apiClient.id as UUID | undefined,
    firstName: apiClient.firstName || '',
    lastName: apiClient.lastName || '',
    email: apiClient.email,
    phone: apiClient.phone || '',
    address,
    communicationChannels,
    source: {
      source: mapApiSourceToModelSource(apiClient.source || ''),
      details: apiClient.sourceDetails,
    },
  };
};
