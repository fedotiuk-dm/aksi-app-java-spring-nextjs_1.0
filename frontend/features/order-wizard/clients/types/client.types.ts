import type {
  ClientResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from '@/lib/api';

export type { ClientResponse, CreateClientRequest, UpdateClientRequest };

/**
 * Структуроване представлення адреси для використання в компонентах
 */
export interface ClientAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  additionalInfo?: string;
}

/**
 * Основний тип клієнта для використання в компонентах
 */
export interface Client extends Omit<ClientResponse, 'address'> {
  address?: string | ClientAddress;
}

export type ClientSource = ClientResponse['source'];

export type CommunicationChannel = 'PHONE' | 'SMS' | 'VIBER';

export interface ClientSearchParams {
  keyword: string;
}

export interface ClientError {
  message: string;
  code?: string;
  field?: string;
}
