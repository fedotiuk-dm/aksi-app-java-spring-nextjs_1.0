/**
 * @fileoverview Головний експорт basic-info модуля
 * @module domain/wizard/services/stage-3-item-management/basic-info
 */

// === ТИПИ ===
export type * from './types/basic-info.types';

// === ІНТЕРФЕЙСИ ===
export type * from './interfaces/basic-info.interfaces';

// === СЕРВІСИ ===
export * from './services';

// === ГОЛОВНИЙ СЕРВІС ===
export { default as basicInfoManager } from './services';
