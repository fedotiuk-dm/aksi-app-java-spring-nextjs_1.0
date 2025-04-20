/**
 * Типи тривалості виконання замовлення
 */
export enum UrgencyType {
  STANDARD = 'STANDARD',
  HOURS_48 = 'HOURS_48',
  HOURS_24 = 'HOURS_24'
}

/**
 * Типи знижок для замовлення
 */
export enum DiscountType {
  NONE = 'NONE',
  EVERCARD = 'EVERCARD',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  MILITARY = 'MILITARY',
  CUSTOM = 'CUSTOM'
}

/**
 * Методи оплати
 */
export enum PaymentMethod {
  TERMINAL = 'TERMINAL',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

/**
 * Інтерфейс для деталей замовлення
 */
export interface OrderDetails {
  receptionPoint: string;
  expectedCompletionDate: string;
  urgencyType: UrgencyType;
  discountType: DiscountType;
  customDiscountPercentage?: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  notes?: string;
  clientRequirements?: string;
}

/**
 * Інтерфейс для параметрів знижки для конкретного типу
 */
export interface DiscountOption {
  type: DiscountType;
  label: string;
  percentage: number;
  customizable: boolean;
}

/**
 * Доступні опції знижок
 */
export const DISCOUNT_OPTIONS: DiscountOption[] = [
  { type: DiscountType.NONE, label: 'Без знижки', percentage: 0, customizable: false },
  { type: DiscountType.EVERCARD, label: 'Еверкард', percentage: 10, customizable: false },
  { type: DiscountType.SOCIAL_MEDIA, label: 'Соцмережі', percentage: 5, customizable: false },
  { type: DiscountType.MILITARY, label: 'ЗСУ', percentage: 10, customizable: false },
  { type: DiscountType.CUSTOM, label: 'Інше', percentage: 0, customizable: true }
];

/**
 * Інтерфейс для опцій терміновості
 */
export interface UrgencyOption {
  type: UrgencyType;
  label: string;
  percentage: number;
  hours: number;
}

/**
 * Доступні опції терміновості
 */
export const URGENCY_OPTIONS: UrgencyOption[] = [
  { type: UrgencyType.STANDARD, label: 'Звичайне', percentage: 0, hours: 0 },
  { type: UrgencyType.HOURS_48, label: '+50% за 48 год', percentage: 50, hours: 48 },
  { type: UrgencyType.HOURS_24, label: '+100% за 24 год', percentage: 100, hours: 24 }
];

/**
 * Інтерфейс для опцій методу оплати
 */
export interface PaymentOption {
  method: PaymentMethod;
  label: string;
}

/**
 * Доступні опції методів оплати
 */
export const PAYMENT_OPTIONS: PaymentOption[] = [
  { method: PaymentMethod.TERMINAL, label: 'Термінал' },
  { method: PaymentMethod.CASH, label: 'Готівка' },
  { method: PaymentMethod.BANK_TRANSFER, label: 'На рахунок' }
];
