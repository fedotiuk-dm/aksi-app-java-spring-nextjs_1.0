/**
 * @fileoverview Адаптер маппінгу пагінованих відповідей API ↔ Domain
 * @module domain/wizard/adapters/pagination-adapters
 */

/**
 * Інтерфейс для пагінованої API відповіді
 */
interface PaginatedApiResponse<T = unknown> {
  content?: T[];
  items?: T[];
  totalElements?: number;
  totalPages?: number;
  pageNumber?: number;
  number?: number;
  pageSize?: number;
  size?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  last?: boolean;
  first?: boolean;
}

/**
 * Доменний інтерфейс для пагінованих даних
 */
export interface PaginatedDomainResponse<T> {
  items: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Адаптер для маппінгу пагінованих відповідей між API та Domain
 *
 * Відповідальність:
 * - Перетворення API пагінованих відповідей у доменний формат
 * - Нормалізація різних форматів пагінації
 * - Обчислення метаданих пагінації
 */
export class PaginationMappingAdapter {
  /**
   * Перетворює пагіновану API відповідь у стандартний доменний формат
   */
  static toDomain<TApi, TDomain>(
    apiResponse: PaginatedApiResponse<TApi>,
    itemAdapter: (item: TApi) => TDomain
  ): PaginatedDomainResponse<TDomain> {
    return {
      items: (apiResponse.content || apiResponse.items || []).map(itemAdapter),
      totalElements: apiResponse.totalElements || 0,
      totalPages: apiResponse.totalPages || 0,
      currentPage: apiResponse.pageNumber || apiResponse.number || 0,
      pageSize: apiResponse.pageSize || apiResponse.size || 10,
      hasNext: this.calculateHasNext(apiResponse),
      hasPrevious: this.calculateHasPrevious(apiResponse),
    };
  }

  /**
   * Перетворює масив items у формат пагінованої відповіді (для локальної пагінації)
   */
  static createLocalPage<T>(items: T[], page: number, size: number): PaginatedDomainResponse<T> {
    const totalElements = items.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const pageItems = items.slice(startIndex, endIndex);

    return {
      items: pageItems,
      totalElements,
      totalPages,
      currentPage: page,
      pageSize: size,
      hasNext: page + 1 < totalPages,
      hasPrevious: page > 0,
    };
  }

  /**
   * Створює порожню пагіновану відповідь
   */
  static createEmpty<T>(page: number = 0, size: number = 10): PaginatedDomainResponse<T> {
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

  // === ПРИВАТНІ УТИЛІТИ ===

  /**
   * Обчислює чи є наступна сторінка
   */
  private static calculateHasNext(apiResponse: PaginatedApiResponse): boolean {
    if (apiResponse.hasNext !== undefined) {
      return apiResponse.hasNext;
    }

    if (apiResponse.last !== undefined) {
      return !apiResponse.last;
    }

    const currentPage = apiResponse.pageNumber || apiResponse.number || 0;
    const totalPages = apiResponse.totalPages || 0;
    return currentPage + 1 < totalPages;
  }

  /**
   * Обчислює чи є попередня сторінка
   */
  private static calculateHasPrevious(apiResponse: PaginatedApiResponse): boolean {
    if (apiResponse.hasPrevious !== undefined) {
      return apiResponse.hasPrevious;
    }

    if (apiResponse.first !== undefined) {
      return !apiResponse.first;
    }

    const currentPage = apiResponse.pageNumber || apiResponse.number || 0;
    return currentPage > 0;
  }
}
