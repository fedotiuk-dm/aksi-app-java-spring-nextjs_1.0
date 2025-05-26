/**
 * @fileoverview Сервіс утиліт для пошуку клієнтів
 * @module domain/wizard/services/client/services/client-search-utils
 */

import type { ClientSearchParams } from '../interfaces';

/**
 * Типи для утиліт пошуку
 */
interface SearchRequest {
  query?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  page: number;
  size: number;
}

interface PaginationInfo {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Константи
 */
const CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Інтерфейс сервісу утиліт пошуку клієнтів
 */
export interface IClientSearchUtilsService {
  buildSearchRequest(params: ClientSearchParams): SearchRequest;
  normalizePhone(phone: string): string;
  createEmptyPagination(page: number, size: number): PaginationInfo;
}

/**
 * Сервіс утиліт для пошуку клієнтів
 * Відповідальність: допоміжні функції для пошуку та обробки даних
 */
export class ClientSearchUtilsService implements IClientSearchUtilsService {
  public readonly name = 'ClientSearchUtilsService';
  public readonly version = '1.0.0';

  /**
   * Побудова запиту для пошуку
   */
  buildSearchRequest(params: ClientSearchParams) {
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
  normalizePhone(phone: string): string {
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
  createEmptyPagination(page: number, size: number) {
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
export const clientSearchUtilsService = new ClientSearchUtilsService();
