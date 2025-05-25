/**
 * @fileoverview Експорт адаптерів предметів замовлень
 * @module domain/wizard/adapters/order-item-adapters
 */

export { OrderItemMappingAdapter } from './mapping.adapter';
export { OrderItemApiOperationsAdapter } from './api-operations.adapter';

// Композиційний адаптер для зворотної сумісності
export { OrderItemAdapter } from './order-item.adapter';

// Групування типів адаптера (БЕЗ реекспорту доменних типів)
import type { OrderItem } from '../../types';

export type OrderItemDomainTypes = {
  OrderItem: OrderItem;
};

// Експорт для зворотної сумісності (тільки аліаси)
export type { OrderItem as WizardOrderItem } from '../../types';
