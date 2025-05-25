/**
 * @fileoverview Експорт адаптерів замовлень
 * @module domain/wizard/adapters/order-adapters
 */

export { OrderMappingAdapter } from './mapping.adapter';
export { OrderApiOperationsAdapter } from './api-operations.adapter';

// Композиційний адаптер для зворотної сумісності
export { OrderAdapter } from './order.adapter';

// Експорт типів адаптера
export type {
  PaymentCalculationData,
  PaymentCalculationResult,
  DiscountData,
  DiscountResult,
  ReceiptGenerationData,
  ReceiptGenerationResult,
  EmailReceiptData,
  EmailReceiptResult,
  ReceiptData,
} from './mapping.adapter';

// Групування типів адаптера (БЕЗ реекспорту доменних типів)
import type { OrderSummary, OrderStatus, ExpediteType } from '../../types';

export type OrderDomainTypes = {
  OrderSummary: OrderSummary;
  OrderStatus: OrderStatus;
  ExpediteType: ExpediteType;
};

// Експорт для зворотної сумісності (тільки аліаси)
export type { OrderSummary as WizardOrderSummary } from '../../types';
export type { OrderStatus as WizardOrderStatus } from '../../types';
export type { ExpediteType as WizardExpediteType } from '../../types';
