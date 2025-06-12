/**
 * @fileoverview Публічне API домену Substep4 Price Calculation
 *
 * Експортує тільки необхідні компоненти для UI шару
 * Принцип: Interface Segregation Principle
 */

// Головний хук (основне API)
export { usePriceCalculation } from './use-price-calculation.hook';
export type { UsePriceCalculationReturn } from './use-price-calculation.hook';

// Схеми (якщо потрібні в UI для валідації)
export {
  basePriceCalculationSchema,
  modifierSelectionSchema,
  priceCalculationFormSchema,
  discountApplicationSchema,
  urgencyModifierSchema,
  priceBreakdownSchema,
  quickModifierSelectionSchema,
  priceValidationSchema,
} from './price-calculation.schemas';

// Типи схем (якщо потрібні в UI)
export type {
  BasePriceCalculationFormData,
  ModifierSelectionFormData,
  PriceCalculationFormData,
  DiscountApplicationFormData,
  UrgencyModifierFormData,
  PriceBreakdownFormData,
  QuickModifierSelectionFormData,
  PriceValidationFormData,
} from './price-calculation.schemas';

// Типи стору (якщо потрібні в UI)
export type { PriceCalculationUIState, PriceCalculationUIActions } from './price-calculation.store';
