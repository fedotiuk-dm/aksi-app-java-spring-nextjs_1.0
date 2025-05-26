/**
 * @fileoverview Утиліти для репозиторію клієнтів
 * @module domain/wizard/services/client/repositories/client-repository-utils
 */

import { CLIENT_REPOSITORY_PAGINATION } from './client-repository-constants';

import type { ClientSearchDomainParams } from '../types';

/**
 * Інтерфейс сервісу утиліт репозиторію
 */
export interface IClientRepositoryUtils {
  buildSearchQuery(params: ClientSearchDomainParams): string;
  normalizePaginationParams(page?: number, size?: number): { page: number; size: number };
}

/**
 * Сервіс утиліт для репозиторію клієнтів
 * Відповідальність: допоміжні функції для роботи з запитами та пагінацією
 */
export class ClientRepositoryUtils implements IClientRepositoryUtils {
  public readonly name = 'ClientRepositoryUtils';
  public readonly version = '1.0.0';

  /**
   * Побудова запиту для пошуку
   */
  buildSearchQuery(params: ClientSearchDomainParams): string {
    // Тут логіка побудови запиту залежно від того, що очікує адаптер
    if (params.query) {
      return params.query;
    }

    const parts: string[] = [];
    if (params.firstName) parts.push(params.firstName);
    if (params.lastName) parts.push(params.lastName);
    if (params.phone) parts.push(params.phone);
    if (params.email) parts.push(params.email);

    return parts.join(' ');
  }

  /**
   * Нормалізація параметрів пагінації
   */
  normalizePaginationParams(page?: number, size?: number): { page: number; size: number } {
    return {
      page: Math.max(0, page || 0),
      size: Math.min(
        size || CLIENT_REPOSITORY_PAGINATION.DEFAULT_PAGE_SIZE,
        CLIENT_REPOSITORY_PAGINATION.MAX_PAGE_SIZE
      ),
    };
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const clientRepositoryUtils = new ClientRepositoryUtils();
