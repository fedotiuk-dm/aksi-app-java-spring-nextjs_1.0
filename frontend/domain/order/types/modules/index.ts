/**
 * Експорт модульних типів Order домену
 */

// === ORDER ITEM ===
export type {
  OrderItemDefect,
  OrderItemStain,
  OrderItemModifier,
  OrderItemCharacteristics,
  OrderItemPriceCalculation,
  PriceBreakdownItem,
  OrderItemSearchParams,
  OrderItemStats,
} from './order-item.types';

export { DefectType, StainType, MaterialType, WearDegree, FillerType } from './order-item.types';

// === FINANCIAL ===
export type {
  OrderFinancials,
  FinancialBreakdown,
  FinancialTotals,
  ModifierBreakdown,
  DiscountBreakdown,
  ExpediteBreakdown,
  PaymentBreakdown,
} from './financial.types';

export { DiscountType, PaymentMethod, PaymentStatus } from './financial.types';

// === COMPLETION ===
export type {
  OrderCompletion,
  CompletionCalculationParams,
  BusinessHours,
  ReadinessStatus,
} from './completion.types';

// === PHOTO ===
export type { OrderItemPhoto, PhotoAnnotation, PhotoMetadata, CameraInfo } from './photo.types';

export { AnnotationType } from './photo.types';

// === DISCOUNT ===
export type {
  OrderDiscount,
  DiscountRules,
  DiscountCondition,
  DiscountValidationResult,
} from './discount.types';

// === STATUS ===
export type {
  OrderStatusHistory,
  StatusTransition,
  OrderProgress,
  ProgressMilestone,
} from './status.types';
