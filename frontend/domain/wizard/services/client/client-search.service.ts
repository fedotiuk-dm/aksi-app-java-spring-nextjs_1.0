/**
 * @fileoverview Сервіс пошуку клієнтів
 * @module domain/wizard/services/client/client-search
 */

import { clientRepository } from './client.repository';
import { OperationResultFactory } from '../interfaces';

import type { IClientSearchService, ClientSearchParams } from './client.interfaces';
import type { OperationResult, PaginatedOperationResult } from '../interfaces';
import type { ClientDomain } from './client-domain.types';

/**
 * Константи
 */
const CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  RECENT_CLIENTS_LIMIT: 10,
  ERROR_MESSAGES: {
    EMPTY_QUERY: 'Запит не може бути порожнім',
    EMPTY_PHONE: 'Номер телефону не може бути порожнім',
    EMPTY_EMAIL: 'Email не може бути порожнім',
    SEARCH_FAILED: 'Помилка пошуку',
    PHONE_SEARCH_FAILED: 'Помилка пошуку за телефоном',
    EMAIL_SEARCH_FAILED: 'Помилка пошуку за email',
    RECENT_CLIENTS_FAILED: 'Помилка отримання останніх клієнтів',
    UNKNOWN: 'Невідома помилка',
  },
} as const;

/**
 * Сервіс пошуку клієнтів
 * Відповідальність: пошук клієнтів за різними критеріями
 */
export class ClientSearchService implements IClientSearchService {
  public readonly name = 'ClientSearchService';
  public readonly version = '1.0.0';

  /**
   * Пошук клієнтів з пагінацією
   */
  async searchClients(params: ClientSearchParams): Promise<PaginatedOperationResult<ClientDomain>> {
    try {
      const searchRequest = this.buildSearchRequest(params);
      const result = await clientRepository.searchClients(searchRequest);

      if (!result.success) {
        return {
          success: false,
          error: result.error || CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED,
          timestamp: new Date(),
          pagination: this.createEmptyPagination(
            params.page || 0,
            params.size || CONSTANTS.DEFAULT_PAGE_SIZE
          ),
        };
      }

      const searchResult = result.data;
      if (!searchResult) {
        return {
          success: false,
          error: CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED,
          timestamp: new Date(),
          pagination: this.createEmptyPagination(
            params.page || 0,
            params.size || CONSTANTS.DEFAULT_PAGE_SIZE
          ),
        };
      }

      return {
        success: true,
        data: searchResult.clients,
        timestamp: new Date(),
        pagination: {
          page: searchResult.page,
          size: searchResult.size,
          total: searchResult.total,
          totalPages: Math.ceil(searchResult.total / searchResult.size),
          hasNext: searchResult.hasMore,
          hasPrevious: searchResult.page > 0,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN;
      return {
        success: false,
        error: `${CONSTANTS.ERROR_MESSAGES.SEARCH_FAILED}: ${errorMessage}`,
        timestamp: new Date(),
        pagination: this.createEmptyPagination(
          params.page || 0,
          params.size || CONSTANTS.DEFAULT_PAGE_SIZE
        ),
      };
    }
  }

  /**
   * Пошук клієнтів за загальним запитом
   */
  async searchByQuery(query: string): Promise<OperationResult<ClientDomain[]>> {
    if (!query.trim()) {
      return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.EMPTY_QUERY);
    }

    try {
      const result = await this.searchClients({ query: query.trim() });

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
      const normalizedPhone = this.normalizePhone(phone);
      const result = await this.searchClients({ phone: normalizedPhone });

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
      const result = await this.searchClients({ email: normalizedEmail });

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

  /**
   * Отримання останніх клієнтів
   */
  async getRecentClients(
    limit = CONSTANTS.RECENT_CLIENTS_LIMIT
  ): Promise<OperationResult<ClientDomain[]>> {
    try {
      const actualLimit = Math.min(limit, CONSTANTS.MAX_PAGE_SIZE);
      const result = await this.searchClients({
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

  /**
   * Побудова запиту для пошуку
   */
  private buildSearchRequest(params: ClientSearchParams) {
    return {
      query: params.query?.trim(),
      firstName: params.firstName?.trim(),
      lastName: params.lastName?.trim(),
      phone: params.phone ? this.normalizePhone(params.phone) : undefined,
      email: params.email?.trim().toLowerCase(),
      page: Math.max(0, params.page || 0),
      size: Math.min(params.size || CONSTANTS.DEFAULT_PAGE_SIZE, CONSTANTS.MAX_PAGE_SIZE),
    };
  }

  /**
   * Нормалізація номера телефону
   */
  private normalizePhone(phone: string): string {
    // Видаляємо всі символи крім цифр та +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Якщо номер починається з 0, замінюємо на +380
    if (cleaned.startsWith('0')) {
      return '+38' + cleaned;
    }

    // Якщо номер починається з 380, додаємо +
    if (cleaned.startsWith('380')) {
      return '+' + cleaned;
    }

    // Якщо номер не має коду країни, додаємо +380
    if (!cleaned.startsWith('+') && cleaned.length === 9) {
      return '+380' + cleaned;
    }

    return cleaned;
  }

  /**
   * Створення порожньої пагінації
   */
  private createEmptyPagination(page: number, size: number) {
    return {
      page,
      size,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    };
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientSearchService = new ClientSearchService();
