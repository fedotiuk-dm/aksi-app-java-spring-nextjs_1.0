/**
 * @fileoverview Сервіс створення клієнтів
 * @module domain/wizard/services/client/services/client-creation
 */

import { clientRepositoryCore } from '../repositories';
import { clientExistenceService } from './client-existence.service';
import { clientValidationCreateService } from './client-validation-create.service';
import { OperationResultFactory } from '../../interfaces';

import type { OperationResult, ValidationOperationResult } from '../../interfaces';
import type { IClientCreationService } from '../interfaces';
import type { ClientDomain, CreateClientDomainRequest, UpdateClientDomainRequest } from '../types';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    CREATION_FAILED: 'Помилка створення клієнта',
    VALIDATION_FAILED: 'Помилка валідації даних клієнта',
    CLIENT_EXISTS: 'Клієнт з таким телефоном вже існує',
    UNKNOWN: 'Невідома помилка',
  },
} as const;

/**
 * Сервіс створення клієнтів
 * Відповідальність: створення нових клієнтів з валідацією та перевіркою дублікатів
 */
export class ClientCreationService implements IClientCreationService {
  public readonly name = 'ClientCreationService';
  public readonly version = '1.0.0';

  /**
   * Створення нового клієнта
   */
  async createClient(request: CreateClientDomainRequest): Promise<OperationResult<ClientDomain>> {
    try {
      // Валідація даних
      const validationResult = await clientValidationCreateService.validateClientData(request);
      if (!validationResult.isValid) {
        const errorMessages = (validationResult.validationErrors || []).map((e) => e.message);
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${errorMessages.join(', ')}`
        );
      }

      // Перевірка на існування клієнта
      const existsResult = await clientExistenceService.checkClientExists(
        request.phone,
        request.email
      );
      if (!existsResult.success) {
        return OperationResultFactory.error(
          existsResult.error || CONSTANTS.ERROR_MESSAGES.CREATION_FAILED
        );
      }

      if (existsResult.data) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.CLIENT_EXISTS);
      }

      // Створення клієнта через репозиторій
      const result = await clientRepositoryCore.create(request);

      if (!result.success || !result.data) {
        return OperationResultFactory.error(
          result.error || CONSTANTS.ERROR_MESSAGES.CREATION_FAILED
        );
      }

      return OperationResultFactory.success(result.data);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CREATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Оновлення клієнта
   */
  async updateClient(
    id: string,
    request: UpdateClientDomainRequest
  ): Promise<OperationResult<ClientDomain>> {
    try {
      // Оновлення клієнта через репозиторій
      const result = await clientRepositoryCore.update(id, request);

      if (!result.success || !result.data) {
        return OperationResultFactory.error(
          result.error || CONSTANTS.ERROR_MESSAGES.CREATION_FAILED
        );
      }

      return OperationResultFactory.success(result.data);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CREATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація даних клієнта
   */
  async validateClientData(
    request: CreateClientDomainRequest
  ): Promise<ValidationOperationResult<CreateClientDomainRequest>> {
    return await clientValidationCreateService.validateClientData(request);
  }

  /**
   * Перевірка існування клієнта
   */
  async checkClientExists(phone: string, email?: string): Promise<OperationResult<boolean>> {
    return await clientExistenceService.checkClientExists(phone, email);
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientCreationService = new ClientCreationService();
