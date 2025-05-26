/**
 * @fileoverview Експорт всіх модульних сервісів клієнтів
 * @module domain/wizard/services/client/services
 */

// === СЕРВІСИ СТВОРЕННЯ ТА ОНОВЛЕННЯ ===
export * from './client-creation.service';
export * from './client-update.service';
export * from './client-existence.service';

// === СЕРВІСИ ВАЛІДАЦІЇ ===
export * from './client-validation-constants.service';
export * from './client-validation-create.service';
export * from './client-validation-update.service';

// === СЕРВІСИ ПОШУКУ ===
export * from './client-search-core.service';
export * from './client-search-specialized.service';
export * from './client-search-recent.service';
export * from './client-search-utils.service';
export * from './client-search-advanced.service';
export * from './client-pagination-adapter.service';
