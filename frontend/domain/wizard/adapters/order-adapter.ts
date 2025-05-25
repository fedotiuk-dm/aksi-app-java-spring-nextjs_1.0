/**
 * @fileoverview Адаптер замовлень API → Domain (SOLID рефакторинг)
 * @module domain/wizard/adapters
 */

// Експорт композиційного адаптера з модульної структури
export { OrderAdapter } from './order-adapters';

// Експорт спеціалізованих адаптерів для прямого використання
export { OrderMappingAdapter, OrderApiOperationsAdapter } from './order-adapters';

// Експорт типів (тільки ті, що доступні в підіндексі)
export type {
  OrderDomainTypes,
  WizardOrderSummary,
  WizardOrderStatus,
  WizardExpediteType,
} from './order-adapters';
