/**
 * @fileoverview Адаптери wizard домену
 * @module domain/wizard/adapters
 *
 * Експорт адаптерів для перетворення згенерованих OpenAPI типів у доменні типи:
 * - Адаптер клієнтів
 * - Адаптер філій
 * - Адаптер предметів замовлення
 * - Адаптер замовлень
 * - Утилітарний адаптер пагінації
 */

// === ОСНОВНІ АДАПТЕРИ ===
export { ClientAdapter } from './client-adapter';
export { BranchAdapter } from './branch-adapter';
export { OrderItemAdapter } from './order-item-adapter';
export { OrderAdapter } from './order-adapter';

// === УТИЛІТАРНІ АДАПТЕРИ ===
export { PaginationAdapter } from './pagination-adapter';
