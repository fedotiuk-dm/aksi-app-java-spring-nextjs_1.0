/**
 * @fileoverview Інтерфейси збереження даних для сервісів
 * @module domain/wizard/services/interfaces/persistence
 */

import type {
  OperationResult,
  SaveOperationResult,
  LoadOperationResult,
} from './operation-result.interfaces';

/**
 * Базовий інтерфейс репозиторію
 */
export interface BaseRepository<T, ID = string> {
  findById(id: ID): Promise<OperationResult<T | null>>;
  save(entity: T): Promise<SaveOperationResult<T>>;
  delete(id: ID): Promise<OperationResult<boolean>>;
}

/**
 * Розширений інтерфейс репозиторію з пошуком
 */
export interface SearchableRepository<T, ID = string> extends BaseRepository<T, ID> {
  findAll(): Promise<OperationResult<T[]>>;
  findByQuery(query: string): Promise<OperationResult<T[]>>;
  count(): Promise<OperationResult<number>>;
}

/**
 * Інтерфейс кешованого репозиторію
 */
export interface CachedRepository<T, ID = string> extends BaseRepository<T, ID> {
  findByIdCached(id: ID): Promise<LoadOperationResult<T | null>>;
  clearCache(): Promise<OperationResult<boolean>>;
  getCacheStats(): Promise<OperationResult<CacheStats>>;
}

/**
 * Статистика кешу
 */
export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

/**
 * Інтерфейс збереження стану
 */
export interface StateStorage {
  save<T>(key: string, data: T): Promise<OperationResult<boolean>>;
  load<T>(key: string): Promise<LoadOperationResult<T | null>>;
  remove(key: string): Promise<OperationResult<boolean>>;
  clear(): Promise<OperationResult<boolean>>;
}
