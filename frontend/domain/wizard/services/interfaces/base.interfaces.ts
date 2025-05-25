/**
 * @fileoverview Базові інтерфейси для сервісів wizard домену
 * @module domain/wizard/services/interfaces/base
 */

/**
 * Базовий інтерфейс для всіх сервісів
 */
export interface BaseService {
  readonly name: string;
  readonly version: string;
}

/**
 * Інтерфейс для сервісів з ініціалізацією
 */
export interface InitializableService extends BaseService {
  initialize(): Promise<void>;
  isInitialized(): boolean;
}

/**
 * Інтерфейс для сервісів з очищенням ресурсів
 */
export interface DisposableService extends BaseService {
  dispose(): Promise<void>;
  isDisposed(): boolean;
}

/**
 * Інтерфейс для сервісів з кешуванням
 */
export interface CacheableService extends BaseService {
  clearCache(): Promise<void>;
  getCacheSize(): number;
}

/**
 * Інтерфейс для сервісів з логуванням
 */
export interface LoggableService extends BaseService {
  enableLogging(enabled: boolean): void;
  isLoggingEnabled(): boolean;
}

/**
 * Повний інтерфейс для складних сервісів
 */
export interface FullService
  extends InitializableService,
    DisposableService,
    CacheableService,
    LoggableService {}

/**
 * Конфігурація для сервісів
 */
export interface ServiceConfig {
  enableLogging?: boolean;
  enableCaching?: boolean;
  cacheSize?: number;
  timeout?: number;
}

/**
 * Метадані сервісу
 */
export interface ServiceMetadata {
  name: string;
  version: string;
  description: string;
  dependencies: string[];
  createdAt: Date;
  lastUpdated: Date;
}
