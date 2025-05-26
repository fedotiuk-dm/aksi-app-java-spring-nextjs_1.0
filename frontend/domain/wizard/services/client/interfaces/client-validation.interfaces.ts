 /**
 * @fileoverview Інтерфейси сервісів валідації клієнтів
 * @module domain/wizard/services/client/interfaces/client-validation
 */

import type { BaseService, ValidationOperationResult } from '../../interfaces';
import type { CreateClientDomainRequest, UpdateClientDomainRequest } from '../types';

/**
 * Інтерфейс сервісу валідації клієнтів
 */
export interface IClientValidationService extends BaseService {
  validatePhone(phone: string): ValidationOperationResult<string>;
  validateEmail(email: string): ValidationOperationResult<string>;
  validateName(
    firstName: string,
    lastName: string
  ): ValidationOperationResult<{ firstName: string; lastName: string }>;
  validateClientRequest(
    request: CreateClientDomainRequest
  ): ValidationOperationResult<CreateClientDomainRequest>;
  validateUpdateRequest(
    request: UpdateClientDomainRequest
  ): ValidationOperationResult<UpdateClientDomainRequest>;
}
