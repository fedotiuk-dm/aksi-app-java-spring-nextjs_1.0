/**
 * @fileoverview Експорт адаптерів предметів замовлень
 * @module domain/wizard/adapters/order-item-adapters
 */

export { OrderItemMappingAdapter } from './mapping.adapter';
export { OrderItemApiOperationsAdapter } from './api-operations.adapter';

// Композиційний адаптер для зворотної сумісності
export { OrderItemAdapter } from './order-item.adapter';

// Експорт типів з wizard domain
export type { OrderItem } from '../../types';

// Групування типів для зручності
import type { OrderItem } from '../../types';

export type OrderItemDomainTypes = {
  OrderItem: OrderItem;
};

// Експорт для зворотної сумісності
export type { OrderItem as WizardOrderItem } from '../../types';
