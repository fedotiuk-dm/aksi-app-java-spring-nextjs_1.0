/**
 * @fileoverview Експорт адаптерів ціноутворення
 * @module domain/wizard/adapters/pricing-adapters
 */

export { PricingMappingAdapter } from './mapping.adapter';
export { PricingCalculationAdapter } from './calculation.adapter';
export { PricingCategoriesAdapter } from './categories.adapter';
export { PricingIssuesAdapter } from './issues.adapter';

// Композиційний адаптер для зворотної сумісності
export { PricingAdapter } from './pricing.adapter';

// Експорт типів
export type {
  ServiceCategory,
  PriceListItem,
  PriceModifier,
  PriceCalculationRequest,
  PriceCalculationResponse,
  CalculationDetail,
  StainType,
  DefectType,
} from './mapping.adapter';

// Групування типів для зручності
import type {
  ServiceCategory,
  PriceListItem,
  PriceModifier,
  PriceCalculationRequest,
  PriceCalculationResponse,
  CalculationDetail,
  StainType,
  DefectType,
} from './mapping.adapter';

export type PricingDomainTypes = {
  ServiceCategory: ServiceCategory;
  PriceListItem: PriceListItem;
  PriceModifier: PriceModifier;
  PriceCalculationRequest: PriceCalculationRequest;
  PriceCalculationResponse: PriceCalculationResponse;
  CalculationDetail: CalculationDetail;
  StainType: StainType;
  DefectType: DefectType;
};

// Експорт для зворотної сумісності
export type { ServiceCategory as PricingServiceCategory } from './mapping.adapter';
export type { PriceListItem as PricingPriceListItem } from './mapping.adapter';
export type { PriceModifier as PricingPriceModifier } from './mapping.adapter';
export type { PriceCalculationRequest as WizardPriceCalculationRequest } from './mapping.adapter';
export type { PriceCalculationResponse as WizardPriceCalculationResponse } from './mapping.adapter';
export type { StainType as WizardStainType } from './mapping.adapter';
export type { DefectType as WizardDefectType } from './mapping.adapter';
