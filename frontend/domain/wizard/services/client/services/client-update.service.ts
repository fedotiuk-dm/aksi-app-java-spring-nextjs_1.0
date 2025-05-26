/**
 * @fileoverview Сервіс оновлення клієнтів
 * @module domain/wizard/services/client/services/client-update
 */

import { clientRepositoryCore } from '../repositories';
import { clientValidationUpdateService } from './client-validation-update.service';
import { OperationResultFactory } from '../../interfaces';

import type { OperationResult } from '../../interfaces';
import type { ClientDomain, UpdateClientDomainRequest } from '../types';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    UPDATE_FAILED: 'Помилка оновлення клієнта',
    VALIDATION_FAILED: 'Помилка валідації даних клієнта',
    UNKNOWN: 'Невідома помилка',
  },
} as const;

/**
 * Інтерфейс сервісу оновлення клієнтів
 */
export interface IClientUpdateService {
  updateClient(
    id: string,
    request: UpdateClientDomainRequest
  ): Promise<OperationResult<ClientDomain>>;
}

/**
 * Сервіс оновлення клієнтів
 * Відповідальність: оновлення існуючих клієнтів з валідацією
 */
export class ClientUpdateService implements IClientUpdateService {
  public readonly name = 'ClientUpdateService';
  public readonly version = '1.0.0';

  /**
   * Оновлення клієнта
   */
  async updateClient(
    id: string,
    request: UpdateClientDomainRequest
  ): Promise<OperationResult<ClientDomain>> {
    try {
      // Валідація даних
      const validationResult = await clientValidationUpdateService.validateUpdateData(request);
      if (!validationResult.isValid) {
        const errorMessages = (validationResult.validationErrors || []).map((e) => e.message);
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${errorMessages.join(', ')}`
        );
      }

      // Оновлення клієнта через репозиторій
      const result = await clientRepositoryCore.update(id, request);

      if (!result.success || !result.data) {
        return OperationResultFactory.error(result.error || CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED);
      }

      return OperationResultFactory.success(result.data);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientUpdateService = new ClientUpdateService();
