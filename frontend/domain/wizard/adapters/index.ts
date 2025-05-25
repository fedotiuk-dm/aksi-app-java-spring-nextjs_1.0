/**
 * @fileoverview Головний експорт адаптерів домену wizard
 * @module domain/wizard/adapters
 *
 * Нова структура адаптерів:
 * - Плоска структура папок
 * - Розділення на маппери та API функції
 * - Максимум 150 рядків на файл
 * - Функціональний підхід замість класів
 */

// === ORDER ADAPTERS ===
export * from './order';

// === CLIENT ADAPTERS ===
export * from './client';

// === BRANCH ADAPTERS ===
export * from './branch';

// === ORDER ITEM ADAPTERS ===
export * from './order-item';

// === PRICING ADAPTERS ===
export * from './pricing';
