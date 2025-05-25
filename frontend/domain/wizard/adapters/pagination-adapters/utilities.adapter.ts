/**
 * @fileoverview Адаптер утилітарних операцій з пагінацією
 * @module domain/wizard/adapters/pagination-adapters
 */

import type { PaginatedDomainResponse } from './mapping.adapter';

/**
 * Параметри пагінації для API запитів
 */
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

/**
 * Метадані пагінації
 */
export interface PaginationMetadata {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * Адаптер для утилітарних операцій з пагінацією
 *
 * Відповідальність:
 * - Обчислення метаданих пагінації
 * - Валідація параметрів пагінації
 * - Утилітарні функції для роботи з пагінацією
 */
export class PaginationUtilitiesAdapter {
  /**
   * Створює параметри пагінації з валідацією
   */
  static createParams(
    page: number = 0,
    size: number = 10,
    sort?: string,
    direction: 'asc' | 'desc' = 'asc'
  ): PaginationParams {
    return {
      page: Math.max(0, page),
      size: Math.min(Math.max(1, size), 100), // Обмежуємо розмір сторінки
      sort,
      direction,
    };
  }

  /**
   * Обчислює повні метадані пагінації
   */
  static calculateMetadata<T>(response: PaginatedDomainResponse<T>): PaginationMetadata {
    const startIndex = response.currentPage * response.pageSize;
    const endIndex = Math.min(startIndex + response.pageSize, response.totalElements);

    return {
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
      pageSize: response.pageSize,
      hasNext: response.hasNext,
      hasPrevious: response.hasPrevious,
      isFirst: response.currentPage === 0,
      isLast: response.currentPage === response.totalPages - 1 || response.totalPages === 0,
      startIndex,
      endIndex,
    };
  }

  /**
   * Перевіряє чи валідні параметри пагінації
   */
  static validateParams(params: PaginationParams): boolean {
    return (
      params.page >= 0 &&
      params.size > 0 &&
      params.size <= 100 &&
      (!params.direction || ['asc', 'desc'].includes(params.direction))
    );
  }

  /**
   * Обчислює номер наступної сторінки
   */
  static getNextPage<T>(response: PaginatedDomainResponse<T>): number | null {
    return response.hasNext ? response.currentPage + 1 : null;
  }

  /**
   * Обчислює номер попередньої сторінки
   */
  static getPreviousPage<T>(response: PaginatedDomainResponse<T>): number | null {
    return response.hasPrevious ? response.currentPage - 1 : null;
  }

  /**
   * Обчислює номер першої сторінки
   */
  static getFirstPage(): number {
    return 0;
  }

  /**
   * Обчислює номер останньої сторінки
   */
  static getLastPage<T>(response: PaginatedDomainResponse<T>): number {
    return Math.max(0, response.totalPages - 1);
  }

  /**
   * Створює масив номерів сторінок для пагінатора
   */
  static createPageNumbers<T>(
    response: PaginatedDomainResponse<T>,
    maxVisible: number = 5
  ): number[] {
    const totalPages = response.totalPages;
    const currentPage = response.currentPage;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    // Коригуємо початок якщо кінець досяг межі
    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  /**
   * Перевіряє чи сторінка в межах допустимого діапазону
   */
  static isValidPage<T>(response: PaginatedDomainResponse<T>, page: number): boolean {
    return page >= 0 && page < response.totalPages;
  }

  /**
   * Обчислює загальну кількість елементів на поточній сторінці
   */
  static getCurrentPageItemCount<T>(response: PaginatedDomainResponse<T>): number {
    return response.items.length;
  }

  /**
   * Перевіряє чи сторінка порожня
   */
  static isEmpty<T>(response: PaginatedDomainResponse<T>): boolean {
    return response.items.length === 0;
  }
}
