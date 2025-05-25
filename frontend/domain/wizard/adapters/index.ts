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
export { ClientAdapter } from './client-adapters';
export { BranchAdapter } from './branch-adapters';
export { OrderItemAdapter } from './order-item-adapters';
export { OrderAdapter } from './order-adapters';
export { PricingAdapter } from './pricing-adapters';

// === УТИЛІТАРНІ АДАПТЕРИ ===
export { PaginationAdapter } from './pagination-adapters';

// === ЕКСПОРТ ТИПІВ ===
export type {
  PaginatedDomainResponse,
  PaginationParams,
  PaginationMetadata,
  PaginationDomainTypes,
  WizardPaginatedDomainResponse,
  WizardPaginationParams,
  WizardPaginationMetadata,
} from './pagination-adapters';
export type {
  PricingDomainTypes,
  ServiceCategory,
  PriceListItem,
  PriceModifier,
  PriceCalculationRequest,
  PriceCalculationResponse,
  CalculationDetail,
  StainType,
  DefectType,
  PricingServiceCategory,
  PricingPriceListItem,
  PricingPriceModifier,
  WizardPriceCalculationRequest,
  WizardPriceCalculationResponse,
  WizardStainType,
  WizardDefectType,
} from './pricing-adapters';
export type {
  BranchDomainTypes,
  Branch,
  BranchCreateRequest,
  BranchUpdateRequest,
  WizardBranch,
  WizardBranchCreateRequest,
  WizardBranchUpdateRequest,
} from './branch-adapters';
export type { OrderItemDomainTypes, OrderItem, WizardOrderItem } from './order-item-adapters';
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
