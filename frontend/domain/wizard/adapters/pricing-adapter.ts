/**
 * @fileoverview Адаптер ціноутворення API → Domain (SOLID рефакторинг)
 * @module domain/wizard/adapters
 */

// Експорт композиційного адаптера з модульної структури
export { PricingAdapter } from './pricing-adapters';

// Експорт спеціалізованих адаптерів для прямого використання
export {
  PricingMappingAdapter,
  PricingCalculationAdapter,
  PricingCategoriesAdapter,
  PricingIssuesAdapter,
} from './pricing-adapters';

// Експорт типів
export type {
  PricingDomainTypes,
  PriceCalculationRequest,
  PriceCalculationResponse,
  ServiceCategory,
  PriceModifier,
} from './pricing-adapters';
