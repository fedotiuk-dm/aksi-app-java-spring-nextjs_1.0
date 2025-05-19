import type {
  ClientResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from '@/lib/api';

export type { ClientResponse, CreateClientRequest, UpdateClientRequest };

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
