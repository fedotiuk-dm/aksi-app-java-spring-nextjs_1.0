/**
 * Публічне API для Order домену
 * Експортує всі необхідні компоненти доменного шару
 */

// Типи та енуми
export type {
  Order,
  OrderItem,
  OrderSummary,
  OrderSearchParams,
  OrderSearchResult,
  OrderSearchStats,
  OrderOperationResult,
  OrderOperationErrors,
  OrderCompletion,
  CompletionCalculationParams,
  BusinessHours,
  DayHours,
  OrderItemModifier,
  OrderItemPriceCalculation,
  OrderItemCharacteristics,
  OrderItemStats,
  OrderItemSearchParams,
  OrderFinancials,
  UrgencyOption,
  OrderParametersValidation,
} from './types';

export {
  OrderStatus,
  ExpediteType,
  DiscountType,
  PaymentMethod,
  PaymentStatus,
  MaterialType,
  WearDegree,
  FillerType,
  DefectType,
  StainType,
} from './types';

// Сутності
export { OrderEntity } from './entities';
export { OrderItemEntity } from './entities/modules/order-item.entity';

// Репозиторії
export { OrderRepository, type IOrderRepository } from './repositories';

// Сервіси
export { OrderService } from './services';
export { OrderParametersService } from './services/order-parameters.service';
export { OrderItemService } from './services/order-item.service';

// Хуки
export {
  useOrder,
  useOrderSearch,
  useOrderParameters,
  useOrderConfirmation,
  useOrderItems,
  useOrderItem,
  useItemWizard,
  useItemBasicInfo,
  useDefectsStains,
  useItemProperties,
  usePhotoDocumentation,
  usePriceCalculator,
} from './hooks';
export type {
  ItemWizardData,
  ItemWizardOperationResult,
  OrderConfirmationData,
  OrderConfirmationActions,
  DefectOption,
  StainOption,
  MaterialOption,
  FillerOption,
  WearLevelOption,
  PhotoDocumentationConstants,
  PhotoItem,
  PriceModifier,
  ModifierCategory,
  PriceCalculationData,
} from './hooks';

// Сторі
export {
  useOrderStore,
  useOrderParametersStore,
  useOrderParametersExecutionParams,
  useOrderParametersDiscountParams,
  useOrderParametersPaymentParams,
  useOrderParametersAdditionalInfo,
  useOrderParametersStatus,
  useItemWizardStore,
} from './store';
export type { ItemWizardData as ItemWizardStoreData } from './store';

// Утиліти
export { OrderUtils } from './utils/order.utils';
export { OrderValidator } from './utils/order.validator';
export { PriceCalculator } from './utils/price.calculator';
export { CompletionCalculator } from './utils/completion.calculator';
export { OrderItemAdapter } from './utils/order-item.adapter';
export { FinancialAdapter } from './utils/financial.adapter';
export { OrderAdapter } from './utils';
export { OrderParametersUtils } from './utils/order-parameters.utils';

// Схеми валідації
export {
  orderSchema,
  orderItemSchema,
  createOrderSchema,
  updateOrderSchema,
  orderSearchParamsSchema,
  applyDiscountSchema,
  changeOrderStatusSchema,
  orderFinancialsSchema,
} from './schemas';

export type {
  CreateOrderFormData,
  UpdateOrderFormData,
  OrderSearchFormData,
  ApplyDiscountFormData,
  ChangeOrderStatusFormData,
  OrderFinancialsFormData,
} from './schemas';

// Константи
export const ORDER_CONSTANTS = {
  CHILD_SIZE_DISCOUNT: 30,
  MANUAL_CLEANING_SURCHARGE: 20,
  EXPEDITE_48H_SURCHARGE: 50,
  EXPEDITE_24H_SURCHARGE: 100,
  STANDARD_COMPLETION_DAYS: 2,
  LEATHER_COMPLETION_DAYS: 14,
  READY_TIME_HOUR: 14,
  MAX_PHOTOS_PER_ITEM: 5,
  MAX_PHOTO_SIZE_MB: 5,
} as const;

export const DISCOUNT_PERCENTAGES = {
  NONE: 0,
  EVERCARD: 10,
  SOCIAL_MEDIA: 5,
  MILITARY: 10,
  CUSTOM: 0,
} as const;

export const DISCOUNT_EXCLUDED_CATEGORIES = ['прасування', 'прання', 'фарбування'] as const;
