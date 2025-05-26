/**
 * @fileoverview Сервіс спеціалізованого пошуку клієнтів
 * @module domain/wizard/services/client/services/client-search-specialized
 */

import { clientSearchCoreService } from './client-search-core.service';
import { clientSearchUtilsService } from './client-search-utils.service';
import { OperationResultFactory } from '../../interfaces';

import type { OperationResult } from '../../interfaces';
import type { ClientDomain } from '../types';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    EMPTY_QUERY: 'Запит не може бути порожнім',
    EMPTY_PHONE: 'Номер телефону не може бути порожнім',
    EMPTY_EMAIL: 'Email не може бути порожнім',
    SEARCH_FAILED: 'Помилка пошуку',
    PHONE_SEARCH_FAILED: 'Помилка пошуку за телефоном',
    EMAIL_SEARCH_FAILED: 'Помилка пошуку за email',
    UNKNOWN: 'Невідома помилка',
  },
} as const;

/**
 * Інтерфейс сервісу спеціалізованого пошуку клієнтів
 */
export interface IClientSearchSpecializedService {
  searchByQuery(query: string): Promise<OperationResult<ClientDomain[]>>;
  searchByPhone(phone: string): Promise<OperationResult<ClientDomain[]>>;
  searchByEmail(email: string): Promise<OperationResult<ClientDomain[]>>;
}

/**
 * Сервіс спеціалізованого пошуку клієнтів
 * Відповідальність: пошук клієнтів за конкретними критеріями
 */
export class ClientSearchSpecializedService implements IClientSearchSpecializedService {
  public readonly name = 'ClientSearchSpecializedService';
  public readonly version = '1.0.0';

  /**
   * Пошук клієнтів за загальним запитом
   */
  async searchByQuery(query: string): Promise<OperationResult<ClientDomain[]>> {
    if (!query.trim()) {
      return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.EMPTY_QUERY);
    }

    try {
      const result = await clientSearchCoreService.searchClients({ query: query.trim() });

      if (!result.success) {
        return OperationResultFactory.error(result.error || CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED);
      }

      return OperationResultFactory.success(result.data || []);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Пошук клієнтів за номером телефону
   */
  async searchByPhone(phone: string): Promise<OperationResult<ClientDomain[]>> {
    if (!phone.trim()) {
      return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.EMPTY_PHONE);
    }

    try {
      const normalizedPhone = clientSearchUtilsService.normalizePhone(phone);
      const result = await clientSearchCoreService.searchClients({ phone: normalizedPhone });

      if (!result.success) {
        return OperationResultFactory.error(
          result.error || CONSTANTS.ERROR_MESSAGES.PHONE_SEARCH_FAILED
        );
      }

      return OperationResultFactory.success(result.data || []);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.PHONE_SEARCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Пошук клієнтів за email
   */
  async searchByEmail(email: string): Promise<OperationResult<ClientDomain[]>> {
    if (!email.trim()) {
      return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.EMPTY_EMAIL);
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await clientSearchCoreService.searchClients({ email: normalizedEmail });

      if (!result.success) {
        return OperationResultFactory.error(
          result.error || CONSTANTS.ERROR_MESSAGES.EMAIL_SEARCH_FAILED
        );
      }

      return OperationResultFactory.success(result.data || []);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.EMAIL_SEARCH_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientSearchSpecializedService = new ClientSearchSpecializedService();
