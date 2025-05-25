/**
 * @fileoverview Адаптер замовлень API → Domain (SOLID рефакторинг)
 * @module domain/wizard/adapters
 */

// Експорт композиційного адаптера з модульної структури
export { OrderAdapter } from './order-adapters';

// Експорт спеціалізованих адаптерів для прямого використання
export { OrderMappingAdapter, OrderApiOperationsAdapter } from './order-adapters';

// Експорт типів
export type {
  OrderDomainTypes,
  OrderSummary,
  OrderStatus,
  ExpediteType,
  WizardOrderSummary,
} from './order-adapters';
