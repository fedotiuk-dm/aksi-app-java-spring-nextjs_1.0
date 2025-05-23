
import { ClientResponse } from '@/lib/api';
import { ClientSearchRequest } from '@/lib/api';
import { CreateClientRequest } from '@/lib/api';
import { UpdateClientRequest } from '@/lib/api';

import { ClientSearchParams, CreateClientFormData, UpdateClientFormData } from '../types';
import { ClientEntity } from './client.entity';
import { ClientAdapter } from '../utils/client-adapter';

/**
 * Фабрика для створення сутностей клієнта
 */
export class ClientFactory {
  /**
   * Створення доменної сутності клієнта з відповіді API
   */
  static createFromResponse(response: ClientResponse): ClientEntity {
    return ClientAdapter.toDomainEntity(response);
  }

  /**
   * Створення списку доменних сутностей з масиву відповідей API
   */
  static createListFromResponse(responses: ClientResponse[]): ClientEntity[] {
    return ClientAdapter.toDomainEntities(responses);
  }

  /**
   * Створення запиту на пошук клієнтів з параметрів домену
   */
  static createSearchRequest(params: ClientSearchParams): ClientSearchRequest {
    return {
      query: params.keyword || '',
      page: params.page || 0,
      size: params.size || 20,
    };
  }

  /**
   * Створення запиту на створення клієнта з даних форми
   */
  static createClientRequest(formData: CreateClientFormData): CreateClientRequest {
    return ClientAdapter.toCreateRequest(formData);
  }

  /**
   * Створення запиту на оновлення клієнта з даних форми
   */
  static updateClientRequest(formData: UpdateClientFormData): UpdateClientRequest {
    return ClientAdapter.toUpdateRequest(formData);
  }
}
