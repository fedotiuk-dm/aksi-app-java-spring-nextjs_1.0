/**
 * Експорт всіх типів домену Order
 *
 * Модульна структура Order домену:
 * - order: основні типи замовлення
 * - order-item: типи предметів замовлення
 * - financial: типи фінансових операцій
 * - completion: типи виконання та терміновості
 * - photo: типи фотодокументації
 * - discount: типи знижок
 * - status: типи статусів
 */

// === ОСНОВНІ ТИПИ ===
export { OrderStatus, ExpediteType } from './order.types';

export type {
  Order,
  OrderItem,
  OrderSummary,
  OrderSearchParams,
  OrderSearchResult,
  OrderSearchStats,
  OrderOperationResult,
  OrderOperationErrors,
  FinancialOperationResponse,
  DiscountOperationResponse,
  PaymentCalculationResponse,
  OrderParametersValidation,
} from './order.types';

export * from './order-form.types';

// === МОДУЛЬНІ ТИПИ ===
export * from './modules/order-item.types';
export * from './modules/financial.types';
export * from './modules/completion.types';
export * from './modules/photo.types';
export * from './modules/discount.types';
export * from './modules/status.types';
