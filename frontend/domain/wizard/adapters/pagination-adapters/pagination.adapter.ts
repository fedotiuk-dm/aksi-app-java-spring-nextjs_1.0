/**
 * @fileoverview Композиційний адаптер пагінації (зворотна сумісність)
 * @module domain/wizard/adapters/pagination-adapters
 */

import { PaginationMappingAdapter } from './mapping.adapter';
import { PaginationUtilitiesAdapter } from './utilities.adapter';

import type { PaginatedDomainResponse } from './mapping.adapter';
import type { PaginationParams, PaginationMetadata } from './utilities.adapter';

/**
 * Композиційний адаптер пагінації для зворотної сумісності
 *
 * Відповідальність:
 * - Делегування до спеціалізованих адаптерів
 * - Збереження існуючого API
 * - Уніфікований доступ до функціональності
 */
export class PaginationAdapter {
  // === ДЕЛЕГУВАННЯ ДО MAPPING ADAPTER ===

  /**
   * Перетворює пагіновану API відповідь у стандартний доменний формат
   */
  static toDomain<TApi, TDomain>(
    apiResponse: any,
    itemAdapter: (item: TApi) => TDomain
  ): PaginatedDomainResponse<TDomain> {
    return PaginationMappingAdapter.toDomain(apiResponse, itemAdapter);
  }

  /**
   * Перетворює масив items у формат пагінованої відповіді (для локальної пагінації)
   */
  static createLocalPage<T>(items: T[], page: number, size: number): PaginatedDomainResponse<T> {
    return PaginationMappingAdapter.createLocalPage(items, page, size);
  }

  /**
   * Створює порожню пагіновану відповідь
   */
  static createEmpty<T>(page: number = 0, size: number = 10): PaginatedDomainResponse<T> {
    return PaginationMappingAdapter.createEmpty(page, size);
  }

  // === ДЕЛЕГУВАННЯ ДО UTILITIES ADAPTER ===

  /**
   * Створює параметри пагінації з валідацією
   */
  static createParams(
    page: number = 0,
    size: number = 10,
    sort?: string,
    direction: 'asc' | 'desc' = 'asc'
  ): PaginationParams {
    return PaginationUtilitiesAdapter.createParams(page, size, sort, direction);
  }

  /**
   * Обчислює повні метадані пагінації
   */
  static calculateMetadata<T>(response: PaginatedDomainResponse<T>): PaginationMetadata {
    return PaginationUtilitiesAdapter.calculateMetadata(response);
  }

  /**
   * Перевіряє чи валідні параметри пагінації
   */
  static validateParams(params: PaginationParams): boolean {
    return PaginationUtilitiesAdapter.validateParams(params);
  }

  /**
   * Обчислює номер наступної сторінки
   */
  static getNextPage<T>(response: PaginatedDomainResponse<T>): number | null {
    return PaginationUtilitiesAdapter.getNextPage(response);
  }

  /**
   * Обчислює номер попередньої сторінки
   */
  static getPreviousPage<T>(response: PaginatedDomainResponse<T>): number | null {
    return PaginationUtilitiesAdapter.getPreviousPage(response);
  }

  /**
   * Обчислює номер першої сторінки
   */
  static getFirstPage(): number {
    return PaginationUtilitiesAdapter.getFirstPage();
  }

  /**
   * Обчислює номер останньої сторінки
   */
  static getLastPage<T>(response: PaginatedDomainResponse<T>): number {
    return PaginationUtilitiesAdapter.getLastPage(response);
  }

  /**
   * Створює масив номерів сторінок для пагінатора
   */
  static createPageNumbers<T>(
    response: PaginatedDomainResponse<T>,
    maxVisible: number = 5
  ): number[] {
    return PaginationUtilitiesAdapter.createPageNumbers(response, maxVisible);
  }

  /**
   * Перевіряє чи сторінка в межах допустимого діапазону
   */
  static isValidPage<T>(response: PaginatedDomainResponse<T>, page: number): boolean {
    return PaginationUtilitiesAdapter.isValidPage(response, page);
  }

  /**
   * Обчислює загальну кількість елементів на поточній сторінці
   */
  static getCurrentPageItemCount<T>(response: PaginatedDomainResponse<T>): number {
    return PaginationUtilitiesAdapter.getCurrentPageItemCount(response);
  }

  /**
   * Перевіряє чи сторінка порожня
   */
  static isEmpty<T>(response: PaginatedDomainResponse<T>): boolean {
    return PaginationUtilitiesAdapter.isEmpty(response);
  }
}
