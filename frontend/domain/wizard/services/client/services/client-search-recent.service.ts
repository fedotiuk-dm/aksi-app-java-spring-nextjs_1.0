/**
 * @fileoverview Сервіс отримання останніх клієнтів
 * @module domain/wizard/services/client/services/client-search-recent
 */

import { clientSearchCoreService } from './client-search-core.service';
import { OperationResultFactory } from '../../interfaces';

import type { OperationResult } from '../../interfaces';
import type { ClientDomain } from '../types';

/**
 * Константи
 */
const CONSTANTS = {
  RECENT_CLIENTS_LIMIT: 10,
  MAX_PAGE_SIZE: 100,
  ERROR_MESSAGES: {
    RECENT_CLIENTS_FAILED: 'Помилка отримання останніх клієнтів',
    UNKNOWN: 'Невідома помилка',
  },
} as const;

/**
 * Інтерфейс сервісу отримання останніх клієнтів
 */
export interface IClientSearchRecentService {
  getRecentClients(limit?: number): Promise<OperationResult<ClientDomain[]>>;
}

/**
 * Сервіс отримання останніх клієнтів
 * Відповідальність: отримання списку останніх клієнтів
 */
export class ClientSearchRecentService implements IClientSearchRecentService {
  public readonly name = 'ClientSearchRecentService';
  public readonly version = '1.0.0';

  /**
   * Отримання останніх клієнтів
   */
  async getRecentClients(limit?: number): Promise<OperationResult<ClientDomain[]>> {
    try {
      const actualLimit = Math.min(
        limit || CONSTANTS.RECENT_CLIENTS_LIMIT,
        CONSTANTS.MAX_PAGE_SIZE
      );
      const result = await clientSearchCoreService.searchClients({
        page: 0,
        size: actualLimit,
      });

      if (!result.success) {
        return OperationResultFactory.error(
          result.error || CONSTANTS.ERROR_MESSAGES.RECENT_CLIENTS_FAILED
        );
      }

      return OperationResultFactory.success(result.data || []);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.RECENT_CLIENTS_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientSearchRecentService = new ClientSearchRecentService();
