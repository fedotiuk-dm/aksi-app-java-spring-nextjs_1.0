/**
 * Публічне API Pricing домену
 * Експортує всі необхідні компоненти для роботи з ціноутворенням
 */

// === ХУКИ ===
export { usePricing, usePriceCalculation, usePriceModifiers } from './hooks';

// === РЕПОЗИТОРІЇ ===
export { PriceListRepository, PriceModifierRepository } from './repositories';

export type {
  IPriceListRepository,
  IPriceModifierRepository,
  FindPriceListOptions,
  FindModifiersOptions,
  PaginatedPriceListResult,
  PaginatedModifiersResult,
  ApplicableModifiersFilter,
} from './repositories';

// === СЕРВІСИ ===
export { PricingService } from './services';

// === УТИЛІТИ ===
export { PricingCalculator } from './utils/pricing.calculator';
export { PricingUtils } from './utils/pricing.utils';
export { PricingValidator } from './utils/pricing.validator';

// === СТОР ===
export {
  usePricingStore,
  pricingSelectors,
  usePriceListItems,
  useSelectedPriceItem,
  usePriceModifiers as usePriceModifiersStore,
  useSelectedModifiers,
  useCurrentCalculation,
  usePricingLoading,
  usePricingError,
  usePricingFilters,
} from './store';

// === СХЕМИ ===
export {
  priceListItemSchema,
  priceModifierSchema,
  priceCalculationParamsSchema,
  priceSearchParamsSchema,
  priceListItemFormSchema,
  priceModifierFormSchema,
  priceCalculationFormSchema,
  csvImportSchema,
  itemNumberSchema,
  modifierCodeSchema,
  priceSchema,
  percentageSchema,
  pricingSettingsSchema,
} from './schemas';

// === ТИПИ СХЕМ ===
export type {
  PriceListItemInput,
  PriceModifierInput,
  PriceCalculationParamsInput,
  PriceSearchParamsInput,
  PriceListItemFormInput,
  PriceModifierFormInput,
  PriceCalculationFormInput,
  CsvImportInput,
  PricingSettingsInput,
} from './schemas';

// === ТИПИ ===
export type {
  // Основні сутності
  PriceListItem,
  PriceModifier,
  ServiceCategoryInfo,

  // Результати розрахунків
  PriceCalculationResult,
  AppliedModifier,
  PriceBreakdownItem,

  // Параметри операцій
  PriceCalculationParams,
  PriceSearchParams,
  PriceSearchResult,

  // Налаштування та статистика
  PricingSettings,
  PricingStatistics,
  PricingOperationResult,
  PricingOperationErrors,
} from './types';

// === ЕНУМИ ===
export {
  ServiceCategory,
  UnitOfMeasure,
  PriceModifierType,
  ModifierApplicationRule,
} from './types';
