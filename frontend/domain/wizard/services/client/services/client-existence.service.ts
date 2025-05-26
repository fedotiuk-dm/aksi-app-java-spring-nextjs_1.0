/**
 * @fileoverview Сервіс перевірки існування клієнтів
 * @module domain/wizard/services/client/services/client-existence
 */

import { OperationResultFactory } from '../../interfaces';
import { clientRepositoryCore } from '../repositories';

import type { OperationResult } from '../../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    CHECK_FAILED: 'Помилка перевірки існування клієнта',
    UNKNOWN: 'Невідома помилка',
  },
} as const;

/**
 * Інтерфейс сервісу перевірки існування клієнтів
 */
export interface IClientExistenceService {
  checkClientExists(phone: string, email?: string): Promise<OperationResult<boolean>>;
  checkClientExistsByPhone(phone: string): Promise<OperationResult<boolean>>;
  checkClientExistsByEmail(email: string): Promise<OperationResult<boolean>>;
}

/**
 * Сервіс перевірки існування клієнтів
 * Відповідальність: перевірка дублікатів клієнтів за телефоном та email
 */
export class ClientExistenceService implements IClientExistenceService {
  public readonly name = 'ClientExistenceService';
  public readonly version = '1.0.0';

  /**
   * Перевірка існування клієнта за телефоном та/або email
   */
  async checkClientExists(phone: string, email?: string): Promise<OperationResult<boolean>> {
    try {
      // Пошук за телефоном
      const phoneExistsResult = await this.checkClientExistsByPhone(phone);
      if (!phoneExistsResult.success) {
        return OperationResultFactory.error(
          phoneExistsResult.error || CONSTANTS.ERROR_MESSAGES.CHECK_FAILED
        );
      }

      if (phoneExistsResult.data) {
        return OperationResultFactory.success(true);
      }

      // Пошук за email, якщо вказано
      if (email) {
        const emailExistsResult = await this.checkClientExistsByEmail(email);
        if (!emailExistsResult.success) {
          return OperationResultFactory.error(
            emailExistsResult.error || CONSTANTS.ERROR_MESSAGES.CHECK_FAILED
          );
        }

        if (emailExistsResult.data) {
          return OperationResultFactory.success(true);
        }
      }

      return OperationResultFactory.success(false);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CHECK_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Перевірка існування клієнта за телефоном
   */
  async checkClientExistsByPhone(phone: string): Promise<OperationResult<boolean>> {
    try {
      const searchResult = await clientRepositoryCore.searchClients({ phone });
      if (!searchResult.success) {
        return OperationResultFactory.error(
          searchResult.error || CONSTANTS.ERROR_MESSAGES.CHECK_FAILED
        );
      }

      const exists = Boolean(searchResult.data && searchResult.data.content.length > 0);
      return OperationResultFactory.success(exists);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CHECK_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Перевірка існування клієнта за email
   */
  async checkClientExistsByEmail(email: string): Promise<OperationResult<boolean>> {
    try {
      const searchResult = await clientRepositoryCore.searchClients({ email });
      if (!searchResult.success) {
        return OperationResultFactory.error(
          searchResult.error || CONSTANTS.ERROR_MESSAGES.CHECK_FAILED
        );
      }

      const exists = Boolean(searchResult.data && searchResult.data.content.length > 0);
      return OperationResultFactory.success(exists);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CHECK_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientExistenceService = new ClientExistenceService();
