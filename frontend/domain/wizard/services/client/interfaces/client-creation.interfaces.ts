/**
 * @fileoverview Інтерфейси сервісів створення та оновлення клієнтів
 * @module domain/wizard/services/client/interfaces/client-creation
 */

import type { BaseService, OperationResult, ValidationOperationResult } from '../../interfaces';
import type { ClientDomain, CreateClientDomainRequest, UpdateClientDomainRequest } from '../types';

/**
 * Інтерфейс сервісу створення клієнтів
 */
export interface IClientCreationService extends BaseService {
  createClient(request: CreateClientDomainRequest): Promise<OperationResult<ClientDomain>>;
  updateClient(
    id: string,
    request: UpdateClientDomainRequest
  ): Promise<OperationResult<ClientDomain>>;
  validateClientData(
    request: CreateClientDomainRequest
  ): Promise<ValidationOperationResult<CreateClientDomainRequest>>;
  checkClientExists(phone: string, email?: string): Promise<OperationResult<boolean>>;
}
