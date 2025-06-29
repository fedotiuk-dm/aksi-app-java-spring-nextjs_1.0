/**
 * Базова структура відповіді з помилкою
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  stack?: string;
}

/**
 * Базова структура пагінованої відповіді
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

/**
 * Параметри для пагінованих запитів
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

/**
 * Загальна структура відповіді з сервера
 */
export type ApiResponse<T> = T | ApiError;

/**
 * Інтерфейс для фільтрів
 */
export interface FilterParams {
  [key: string]: string | number | boolean | string[] | undefined;
}
