/**
 * Публічне API домену Pricing
 * Експортує всю необхідну функціональність для роботи з ціноутворенням
 */

// ============= ТИПИ ТА ІНТЕРФЕЙСИ =============
export type {
  // Базові типи
  PriceListItemId,
  ServiceCategoryId,
  ServiceCategoryCode,
  ModifierCode,

  // Сутності
  PriceListItem,
  ServiceCategory,
  PriceModifier,
  StainType,
  DefectType,

  // Перелічення
  ModifierCategory,
  ModifierType,
  RiskLevel,
  ColorType,

  // Запити та відповіді
  PriceCalculationRequest,
  PriceCalculationResponse,
  CalculationDetails,

  // Стан домену
  PriceListState,
  PriceCalculationState,
  PriceListActions,
  PriceCalculationActions,

  // Сервісні типи
  ModifierSearchParams,
  RecommendationParams,
  ValidationResult,

  // Адаптери
  ApiToDomainAdapter,
  DomainToApiAdapter,
} from './types/pricing.types';

// ============= СУТНОСТІ =============
export { PriceListItemEntity } from './entities/price-list-item.entity';
export { PriceModifierEntity } from './entities/price-modifier.entity';

// ============= СХЕМИ ВАЛІДАЦІЇ =============
export {
  // Основні схеми
  priceListItemSchema,
  serviceCategorySchema,
  priceModifierSchema,
  stainTypeSchema,
  defectTypeSchema,

  // Схеми для запитів та відповідей
  priceCalculationRequestSchema,
  priceCalculationResponseSchema,
  calculationDetailsSchema,

  // Схеми для стану
  priceListStateSchema,
  priceCalculationStateSchema,

  // Схеми для пошуку та фільтрації
  modifierSearchParamsSchema,
  recommendationParamsSchema,
  validationResultSchema,

  // Типи для Zod
  type PriceListItemInput,
  type PriceListItemOutput,
  type ServiceCategoryInput,
  type ServiceCategoryOutput,
  type PriceModifierInput,
  type PriceModifierOutput,
  type StainTypeInput,
  type StainTypeOutput,
  type DefectTypeInput,
  type DefectTypeOutput,
  type PriceCalculationRequestInput,
  type PriceCalculationRequestOutput,
  type PriceCalculationResponseInput,
  type PriceCalculationResponseOutput,
  type ModifierSearchParamsInput,
  type ModifierSearchParamsOutput,
  type RecommendationParamsInput,
  type RecommendationParamsOutput,
  type ValidationResultInput,
  type ValidationResultOutput,
} from './schemas/pricing.schema';

// ============= РЕПОЗИТОРІЇ =============
export {
  type IPricingRepository,
  PricingRepository,
  PricingRepositoryFactory,
} from './repositories/pricing.repository';

// ============= АДАПТЕРИ =============
export {
  PricingApiToDomainAdapter,
  PricingDomainToApiAdapter,
  PricingAdapterFactory,
  AdapterUtils,
} from './utils/api.adapter';

// ============= СТОРИ =============
export {
  // Стори
  usePriceListStore,
  usePriceCalculationStore,

  // Селектори
  pricingSelectors,

  // Утилітарні функції
  setupPricingCacheSubscription,
  setupPricingErrorLogging,
  initializePricingStores,
  resetPricingStores,
} from './store/pricing.store';

// ============= ХУКИ ============= - поки не використовуються
// export { usePricing, default as usePricingDefault } from './hooks/use-pricing.hook';
// export {
//   usePriceCalculator,
//   default as usePriceCalculatorDefault,
// } from './hooks/use-price-calculator.hook';
// export { useServiceCategories } from './hooks/use-service-categories.hook';
// export { usePriceList } from './hooks/use-price-list.hook';

// ============= КОНСТАНТИ ТА УТИЛІТИ =============

/**
 * Константи домену
 */
export const PRICING_CONSTANTS = {
  // Таймаути кешування
  CACHE_TIMEOUT: 30 * 60 * 1000, // 30 хвилин
  CACHE_CHECK_INTERVAL: 5 * 60 * 1000, // 5 хвилин

  // Розрахунки
  DEBOUNCE_MS: 500,
  MAX_CALCULATION_HISTORY: 10,

  // Валідація
  MAX_QUANTITY: 1000,
  MAX_PRICE: 100000,
  MIN_DISCOUNT: 0,
  MAX_DISCOUNT: 100,

  // Категорії модифікаторів
  MODIFIER_CATEGORIES: {
    GENERAL: 'GENERAL',
    TEXTILE: 'TEXTILE',
    LEATHER: 'LEATHER',
  } as const,

  // Типи модифікаторів
  MODIFIER_TYPES: {
    PERCENTAGE: 'PERCENTAGE',
    FIXED_AMOUNT: 'FIXED_AMOUNT',
    RANGE: 'RANGE',
  } as const,

  // Рівні ризику
  RISK_LEVELS: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
  } as const,
} as const;

/**
 * Утилітарні функції домену
 */
export const pricingUtils = {
  /**
   * Форматувати ціну для відображення
   */
  formatPrice: (price: number, currency: string = 'грн'): string => {
    return `${price.toFixed(2)} ${currency}`;
  },

  /**
   * Перевірити чи ціна валідна
   */
  isValidPrice: (price: number): boolean => {
    return (
      typeof price === 'number' &&
      !isNaN(price) &&
      price >= 0 &&
      price <= PRICING_CONSTANTS.MAX_PRICE
    );
  },

  /**
   * Перевірити чи кількість валідна
   */
  isValidQuantity: (quantity: number): boolean => {
    return (
      typeof quantity === 'number' &&
      !isNaN(quantity) &&
      quantity > 0 &&
      quantity <= PRICING_CONSTANTS.MAX_QUANTITY
    );
  },

  /**
   * Перевірити чи знижка валідна
   */
  isValidDiscount: (discount: number): boolean => {
    return (
      typeof discount === 'number' &&
      !isNaN(discount) &&
      discount >= PRICING_CONSTANTS.MIN_DISCOUNT &&
      discount <= PRICING_CONSTANTS.MAX_DISCOUNT
    );
  },

  /**
   * Округлити ціну до копійок
   */
  roundPrice: (price: number): number => {
    return Math.round(price * 100) / 100;
  },

  /**
   * Розрахувати відсоток від суми
   */
  calculatePercentage: (amount: number, percentage: number): number => {
    return (amount * percentage) / 100;
  },

  /**
   * Застосувати знижку
   */
  applyDiscount: (amount: number, discountPercentage: number): number => {
    const discountAmount = pricingUtils.calculatePercentage(amount, discountPercentage);
    return Math.max(0, amount - discountAmount);
  },
} as const;

/**
 * Помилки домену
 */
export class PricingDomainError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'PricingDomainError';
    this.code = code;
    this.context = context;
  }
}

/**
 * Коди помилок
 */
export const PRICING_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CALCULATION_ERROR: 'CALCULATION_ERROR',
  REPOSITORY_ERROR: 'REPOSITORY_ERROR',
  ADAPTER_ERROR: 'ADAPTER_ERROR',
  STORE_ERROR: 'STORE_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
} as const;

/**
 * Фабрики помилок
 */
export const createPricingError = {
  validation: (message: string, context?: Record<string, unknown>) =>
    new PricingDomainError(message, PRICING_ERROR_CODES.VALIDATION_ERROR, context),

  calculation: (message: string, context?: Record<string, unknown>) =>
    new PricingDomainError(message, PRICING_ERROR_CODES.CALCULATION_ERROR, context),

  repository: (message: string, context?: Record<string, unknown>) =>
    new PricingDomainError(message, PRICING_ERROR_CODES.REPOSITORY_ERROR, context),

  adapter: (message: string, context?: Record<string, unknown>) =>
    new PricingDomainError(message, PRICING_ERROR_CODES.ADAPTER_ERROR, context),

  store: (message: string, context?: Record<string, unknown>) =>
    new PricingDomainError(message, PRICING_ERROR_CODES.STORE_ERROR, context),

  cache: (message: string, context?: Record<string, unknown>) =>
    new PricingDomainError(message, PRICING_ERROR_CODES.CACHE_ERROR, context),
} as const;
