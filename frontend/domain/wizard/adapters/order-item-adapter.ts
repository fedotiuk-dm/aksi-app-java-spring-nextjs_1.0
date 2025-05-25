/**
 * @fileoverview Адаптер предметів замовлень API → Domain (SOLID рефакторинг)
 * @module domain/wizard/adapters
 */

// Експорт композиційного адаптера з модульної структури
export { OrderItemAdapter } from './order-item-adapters';

// Експорт спеціалізованих адаптерів для прямого використання
export { OrderItemMappingAdapter, OrderItemApiOperationsAdapter } from './order-item-adapters';

// Експорт типів
export type { OrderItemDomainTypes, OrderItem, WizardOrderItem } from './order-item-adapters';
