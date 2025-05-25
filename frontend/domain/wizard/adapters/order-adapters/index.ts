/**
 * @fileoverview Експорт адаптерів замовлень
 * @module domain/wizard/adapters/order-adapters
 */

export { OrderMappingAdapter } from './mapping.adapter';
export { OrderApiOperationsAdapter } from './api-operations.adapter';

// Композиційний адаптер для зворотної сумісності
export { OrderAdapter } from './order.adapter';

// Експорт типів з wizard domain
export type { OrderSummary, OrderStatus, ExpediteType } from '../../types';

// Групування типів для зручності
import type { OrderSummary, OrderStatus, ExpediteType } from '../../types';

export type OrderDomainTypes = {
  OrderSummary: OrderSummary;
  OrderStatus: OrderStatus;
  ExpediteType: ExpediteType;
};

// Експорт для зворотної сумісності
export type { OrderSummary as WizardOrderSummary } from '../../types';
