/**
 * @fileoverview Адаптери wizard домену
 * @module domain/wizard/adapters
 *
 * Експорт адаптерів для перетворення згенерованих OpenAPI типів у доменні типи:
 * - Адаптер клієнтів
 * - Адаптер філій
 * - Адаптер предметів замовлення
 * - Адаптер замовлень
 * - Адаптер ціноутворення
 * - Утилітарний адаптер пагінації
 */

// === ОСНОВНІ АДАПТЕРИ ===
export { ClientAdapter } from './client-adapter';
export { BranchAdapter } from './branch-adapters';
export { OrderItemAdapter } from './order-item-adapter';
export { OrderAdapter } from './order-adapter';
export { PricingAdapter } from './pricing-adapter';

// === УТИЛІТАРНІ АДАПТЕРИ ===
export { PaginationAdapter } from './pagination-adapter';

// === ЕКСПОРТ ТИПІВ ===
export type {
  PaginatedDomainResponse,
  PaginationParams,
  PaginationMetadata,
} from './pagination-adapter';
export type {
  PricingDomainTypes,
  ServiceCategory,
  PriceListItem,
  PriceModifier,
  PriceCalculationRequest,
  PriceCalculationResponse,
  StainType,
  DefectType,
} from './pricing-adapters';
export type {
  BranchDomainTypes,
  Branch,
  BranchCreateRequest,
  BranchUpdateRequest,
} from './branch-adapters';
export type { OrderItemDomainTypes, OrderItem as WizardOrderItem } from './order-item-adapters';
export type {
  OrderDomainTypes,
  OrderSummary,
  OrderStatus,
  ExpediteType,
  WizardOrderSummary,
} from './order-adapters';
export type {
  ClientDomainTypes,
  ClientSearchResult,
  WizardClientSearchResult,
} from './client-adapters';
