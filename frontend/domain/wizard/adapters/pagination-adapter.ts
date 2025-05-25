/**
 * @fileoverview Утилітарний адаптер пагінації API → Domain
 * @module domain/wizard/adapters
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
 * Утилітарний адаптер для перетворення пагінованих API відповідей у доменний формат
 */
export class PaginationAdapter {
  /**
   * Перетворює пагіновану API відповідь у стандартний доменний формат
   */
  static toDomain<TApi, TDomain>(
    apiResponse: PaginatedApiResponse<TApi>,
    itemAdapter: (item: TApi) => TDomain
  ): {
    items: TDomain[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    return {
      items: (apiResponse.content || apiResponse.items || []).map(itemAdapter),
      totalElements: apiResponse.totalElements || 0,
      totalPages: apiResponse.totalPages || 0,
      currentPage: apiResponse.pageNumber || apiResponse.number || 0,
      pageSize: apiResponse.pageSize || apiResponse.size || 10,
      hasNext:
        apiResponse.hasNext ??
        (!apiResponse.last &&
          (apiResponse.pageNumber || apiResponse.number || 0) + 1 < (apiResponse.totalPages || 0)),
      hasPrevious:
        apiResponse.hasPrevious ??
        (!apiResponse.first && (apiResponse.pageNumber || apiResponse.number || 0) > 0),
    };
  }

  /**
   * Перетворює масив items у формат пагінованої відповіді (для локальної пагінації)
   */
  static createLocalPage<T>(
    items: T[],
    page: number,
    size: number
  ): {
    items: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
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
}
