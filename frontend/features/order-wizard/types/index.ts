// Re-export types from generated API for convenience
export type {
  CustomerInfo,
  CreateCustomerRequest,
  CustomerInfoContactPreferencesItem,
  CustomerInfoInfoSource,
} from '@/shared/api/generated/customer';

export type {
  CartInfo,
  CartItemInfo,
  AddCartItemRequest,
  UpdateCartItemRequest,
  ItemCharacteristics,
  ItemStain,
  ItemDefect,
  ItemRisk,
  CartPricingInfo,
  CartItemPricingInfo,
  CartGlobalModifiersUrgencyType,
  CartGlobalModifiersDiscountType,
} from '@/shared/api/generated/cart';

export type {
  OrderInfo,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  AddPaymentRequest,
} from '@/shared/api/generated/order';

export type {
  PriceListItemInfo,
  PriceListItemInfoCategoryCode,
} from '@/shared/api/generated/priceList';

export type {
  BranchInfo,
} from '@/shared/api/generated/branch';

// Custom types for the wizard
export interface OrderWizardConfig {
  maxPhotosPerItem: number;
  maxPhotoSize: number; // in MB
  defaultDeliveryDays: number;
  signatureRequired: boolean;
}

export interface OrderWizardStep {
  id: string;
  title: string;
  description?: string;
  isComplete: boolean;
  isRequired: boolean;
}