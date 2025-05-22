/**
 * Допоміжні функції для роботи з пагінацією
 * Враховує особливості формату даних Spring Data
 */

/**
 * Інтерфейс для об'єкта сортування від Spring Data
 */
export interface SortObject {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

/**
 * Інтерфейс для об'єкта сторінки від Spring Data
 */
export interface PageableObject {
  offset?: number;
  pageNumber?: number;
  pageSize?: number;
  paged?: boolean;
  sort?: SortObject;
  unpaged?: boolean;
}

/**
 * Інтерфейс для запиту пагінації до Spring Data
 */
export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

/**
 * Створює об'єкт Pageable для запитів з пагінацією
 */
export const createPageable = (
  page: number = 0,
  size: number = 10,
  sort?: { field: string; direction: 'asc' | 'desc' }
): Pageable => {
  const pageable: Pageable = {
    page,
    size,
  };

  if (sort) {
    // Формуємо параметр sort у форматі, який очікує Spring Data
    // Spring Data очікує рядок вигляду "property,direction"
    pageable.sort = [`${sort.field},${sort.direction.toUpperCase()}`];
  }

  return pageable;
};

/**
 * Базовий інтерфейс для пагінованих відповідей від бекенду
 * Відповідає загальній структурі Page з Spring Data
 */
export interface PageResponse<T> {
  content?: T[];
  pageable?: PageableObject;
  last?: boolean;
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  sort?: SortObject;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

/**
 * Адаптує формат відповіді з бекенду до зручного для використання на фронтенді
 * Типізований коректно для роботи з будь-яким типом Page з OpenAPI
 */
export const adaptPageResponse = <T, P extends PageResponse<T>>(response: P) => {
  return {
    items: response.content || [],
    pagination: {
      currentPage: response.number || 0,
      totalPages: response.totalPages || 0,
      totalItems: response.totalElements || 0,
      pageSize: response.size || 0,
      isFirstPage: response.first || false,
      isLastPage: response.last || false,
      isEmpty: response.empty || true,
    },
    original: response, // збереження оригінальної відповіді для додаткових потреб
  };
};
