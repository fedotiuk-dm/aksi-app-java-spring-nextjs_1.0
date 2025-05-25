/**
 * @fileoverview Інтерфейси збереження для сервісів
 * @module domain/wizard/services/interfaces/persistence
 */

/**
 * Інтерфейс репозиторію
 */
export interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<boolean>;
  findAll(): Promise<T[]>;
}

/**
 * Інтерфейс кешу
 */
export interface Cache<K, V> {
  get(key: K): Promise<V | null>;
  set(key: K, value: V, ttl?: number): Promise<void>;
  delete(key: K): Promise<boolean>;
  clear(): Promise<void>;
  has(key: K): Promise<boolean>;
}

/**
 * Конфігурація збереження
 */
export interface PersistenceConfig {
  autoSave?: boolean;
  saveInterval?: number;
  maxRetries?: number;
  timeout?: number;
}

/**
 * Метадані збереження
 */
export interface PersistenceMetadata {
  version: number;
  timestamp: Date;
  checksum?: string;
  size?: number;
}
