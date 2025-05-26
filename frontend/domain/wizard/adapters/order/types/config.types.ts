/**
 * @fileoverview Типи для конфігурації адаптерів замовлень
 * @module domain/wizard/adapters/order/types/config
 */

/**
 * Конфігурація для order адаптера
 */
export interface WizardOrderAdapterConfig {
  readonly enableCaching: boolean;
  readonly cacheTimeout: number;
  readonly retryAttempts: number;
  readonly retryDelay: number;
  readonly defaultPageSize: number;
  readonly maxPageSize: number;
  readonly autoSaveDrafts: boolean;
  readonly draftSaveInterval: number;
}
