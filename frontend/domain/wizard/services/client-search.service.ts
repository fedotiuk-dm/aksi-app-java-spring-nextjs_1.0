/**
 * @fileoverview Доменний сервіс пошуку клієнтів
 * @module domain/wizard/services
 */

import { ClientAdapter } from '../adapters';

import type { ClientSearchResult } from '../types';

/**
 * Параметри пошуку клієнтів
 */
export interface ClientSearchParams {
  query: string;
  page?: number;
  size?: number;
}

/**
 * Результат пошуку клієнтів з пагінацією
 */
export interface ClientSearchPageResult {
  items: ClientSearchResult[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Доменний сервіс для пошуку клієнтів
 *
 * Відповідальність:
 * - Координація пошуку клієнтів
 * - Бізнес-правила пошуку
 * - Кешування результатів пошуку
 * - Логіка пагінації
 *
 * НЕ відповідає за:
 * - Валідацію (робить Zod в хуках)
 * - React стан (робить хук)
 * - API виклики (робить адаптер)
 */
export class ClientSearchService {
  private static readonly DEFAULT_PAGE_SIZE = 10;
  private static readonly MIN_SEARCH_LENGTH = 2;
  private static readonly SEARCH_DEBOUNCE_MS = 300;

  /**
   * Пошук клієнтів з пагінацією
   */
  static async searchWithPagination(params: ClientSearchParams): Promise<ClientSearchPageResult> {
    // Бізнес-правило: мінімальна довжина пошукового запиту
    if (params.query.trim().length < this.MIN_SEARCH_LENGTH) {
      return this.createEmptyResult(params.page || 0, params.size || this.DEFAULT_PAGE_SIZE);
    }

    // Нормалізація параметрів пошуку
    const normalizedParams = this.normalizeSearchParams(params);

    // Делегування адаптеру для API виклику
    return await ClientAdapter.searchWithPagination(normalizedParams);
  }

  /**
   * Швидкий пошук для автокомплету (без пагінації)
   */
  static async quickSearch(query: string, limit: number = 5): Promise<ClientSearchResult[]> {
    if (query.trim().length < this.MIN_SEARCH_LENGTH) {
      return [];
    }

    const result = await this.searchWithPagination({
      query: query.trim(),
      page: 0,
      size: limit,
    });

    return result.items;
  }

  /**
   * Перевірка чи є результати пошуку
   */
  static hasSearchResults(result: ClientSearchPageResult): boolean {
    return result.totalElements > 0;
  }

  /**
   * Перевірка чи можна завантажити наступну сторінку
   */
  static canLoadNextPage(result: ClientSearchPageResult): boolean {
    return result.hasNext;
  }

  /**
   * Перевірка чи можна завантажити попередню сторінку
   */
  static canLoadPreviousPage(result: ClientSearchPageResult): boolean {
    return result.hasPrevious;
  }

  /**
   * Обчислення номера наступної сторінки
   */
  static getNextPageNumber(result: ClientSearchPageResult): number | null {
    return result.hasNext ? result.currentPage + 1 : null;
  }

  /**
   * Обчислення номера попередньої сторінки
   */
  static getPreviousPageNumber(result: ClientSearchPageResult): number | null {
    return result.hasPrevious ? result.currentPage - 1 : null;
  }

  /**
   * Створення порожнього результату пошуку
   */
  private static createEmptyResult(page: number, size: number): ClientSearchPageResult {
    return {
      items: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: page,
      pageSize: size,
      hasNext: false,
      hasPrevious: false,
    };
  }

  /**
   * Нормалізація параметрів пошуку
   */
  private static normalizeSearchParams(params: ClientSearchParams): ClientSearchParams {
    return {
      query: params.query.trim(),
      page: Math.max(0, params.page || 0),
      size: Math.min(50, Math.max(1, params.size || this.DEFAULT_PAGE_SIZE)),
    };
  }

  /**
   * Перевірка чи запит потребує дебаунсу
   */
  static shouldDebounceSearch(query: string): boolean {
    return query.length >= this.MIN_SEARCH_LENGTH;
  }

  /**
   * Отримання рекомендованої затримки для дебаунсу
   */
  static getSearchDebounceMs(): number {
    return this.SEARCH_DEBOUNCE_MS;
  }

  /**
   * Форматування результатів для відображення
   */
  static formatSearchResultsForDisplay(results: ClientSearchResult[]): Array<{
    id: string;
    displayName: string;
    subtitle: string;
    phone: string;
    orderCount: number;
  }> {
    return results.map((client) => ({
      id: client.id,
      displayName: client.fullName || `${client.firstName} ${client.lastName}`.trim(),
      subtitle: client.address || 'Адреса не вказана',
      phone: client.phone,
      orderCount: client.orderCount || 0,
    }));
  }
}
