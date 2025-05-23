/**
 * Спільні типи для всіх доменів
 */

/**
 * Базовий інтерфейс для всіх доменних сутностей
 */
export interface Entity<TId = string> {
  id?: TId;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Базовий інтерфейс для Value Objects
 */
export interface ValueObject {
  equals(other: this): boolean;
}

/**
 * Інтерфейс для Use Cases
 */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

/**
 * Базовий результат операції
 */
export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Пагінація
 */
export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Параметри пошуку
 */
export interface SearchParams {
  keyword?: string;
  page?: number;
  size?: number;
}
