/**
 * Основні типи для домену Order (Замовлення)
 * Адаптовані з OrderDTO але з доменною логікою
 */

import type { BranchLocationDTO, ClientResponse, OrderItemDTO } from '@/lib/api';

/**
 * Статуси замовлення
 */
export enum OrderStatus {
  DRAFT = 'DRAFT', // Чернетка
  NEW = 'NEW', // Нове
  IN_PROGRESS = 'IN_PROGRESS', // В роботі
  COMPLETED = 'COMPLETED', // Завершено
  DELIVERED = 'DELIVERED', // Видано
  CANCELLED = 'CANCELLED', // Скасовано
}

/**
 * Типи терміновості виконання
 */
export enum ExpediteType {
  STANDARD = 'STANDARD', // Стандартно
  EXPRESS_48H = 'EXPRESS_48H', // Терміново 48 год (+50%)
  EXPRESS_24H = 'EXPRESS_24H', // Терміново 24 год (+100%)
}

/**
 * Доменний інтерфейс для замовлення
 */
export interface Order {
  id?: string;
  receiptNumber: string;
  tagNumber?: string;

  // Клієнт
  client: ClientResponse;
  clientId?: string;

  // Предмети замовлення
  items?: OrderItem[];
  itemsCount?: number;

  // Фінанси
  totalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  prepaymentAmount?: number;
  balanceAmount?: number;

  // Філія
  branchLocation: BranchLocationDTO;
  branchLocationId?: string;

  // Статус та дати
  status: OrderStatus;
  createdDate?: Date;
  updatedDate?: Date;
  expectedCompletionDate?: Date;
  completedDate?: Date;

  // Примітки
  customerNotes?: string;
  internalNotes?: string;
  completionComments?: string;

  // Параметри
  expediteType?: ExpediteType;
  termsAccepted?: boolean;
  finalizedAt?: Date;

  // Прапорці стану
  express?: boolean;
  draft?: boolean;
  printed?: boolean;
  emailed?: boolean;

  // Доменні властивості
  isEditable?: boolean;
  canBeCancelled?: boolean;
  canBeCompleted?: boolean;
  displayStatus?: string;
  progressPercentage?: number;
}

/**
 * Скорочена версія замовлення для списків
 */
export interface OrderSummary {
  id?: string;
  receiptNumber?: string;
  status?: OrderStatus;
  totalAmount?: number;
  createdAt?: Date;
  completionDate?: Date;
  itemCount?: number;
  clientName?: string;
  branchName?: string;
}

/**
 * Інтерфейс предмета замовлення (розширений)
 */
export interface OrderItem extends OrderItemDTO {
  // Додаткові доменні властивості
  calculatedPrice?: number;
  discountApplied?: number;
  modifiersApplied?: string[];
  hasPhotos?: boolean;
  photoCount?: number;
  isComplete?: boolean;
  hasIssues?: boolean;
}

/**
 * Критерії пошуку замовлень
 */
export interface OrderSearchParams {
  keyword?: string;
  status?: OrderStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  branchId?: string;
  clientId?: string;
  minAmount?: number;
  maxAmount?: number;
  hasItems?: boolean;
  expediteType?: ExpediteType;
}

/**
 * Результат пошуку замовлень
 */
export interface OrderSearchResult {
  orders: Order[];
  summaries: OrderSummary[];
  totalCount: number;
  filteredCount: number;
  hasMore: boolean;
  stats: OrderSearchStats;
}

/**
 * Статистика пошуку замовлень
 */
export interface OrderSearchStats {
  byStatus: Record<OrderStatus, number>;
  byBranch: Record<string, number>;
  totalAmount: number;
  averageAmount: number;
  completionRate: number;
}

/**
 * Результат операцій з замовленнями
 */
export interface OrderOperationResult {
  order: Order | null;
  success: boolean;
  errors: OrderOperationErrors | null;
  warnings?: string[];
}

/**
 * Помилки операцій з замовленнями
 */
export interface OrderOperationErrors {
  general?: string;
  receiptNumber?: string;
  tagNumber?: string;
  client?: string;
  branchLocation?: string;
  items?: string;
  expectedCompletionDate?: string;
  financial?: string;
  status?: string;
}

/**
 * Інформація про термін виконання замовлення
 */
export interface OrderCompletion {
  baseDays: number;
  adjustedDays: number;
  startDate: Date;
  expectedCompletionDate: Date;
  isExpedited: boolean;
  expediteType: ExpediteType;
  businessDaysUsed: number;
  isOverdue: boolean;
  completionNotes: string;
}

/**
 * Параметри розрахунку терміну виконання
 */
export interface CompletionCalculationParams {
  items: OrderItem[];
  expediteType?: ExpediteType;
  startDate?: Date;
  businessHours?: BusinessHours;
  excludeWeekends?: boolean;
  excludeHolidays?: boolean;
  holidays?: Date[];
}

/**
 * Робочі години для днів тижня
 */
export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

/**
 * Години роботи для окремого дня
 */
export interface DayHours {
  open: string; // Формат 'HH:MM'
  close: string; // Формат 'HH:MM'
  closed: boolean; // Чи закрито в цей день
}

/**
 * Типи знижок
 */
export enum DiscountType {
  NONE = 'NONE',
  EVERCARD = 'EVERCARD',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  MILITARY = 'MILITARY',
  CUSTOM = 'CUSTOM',
}

/**
 * Способи оплати
 */
export enum PaymentMethod {
  TERMINAL = 'TERMINAL',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

/**
 * Статуси оплати
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}

/**
 * Розрахунок ціни предмета з деталізацією
 */
export interface OrderItemPriceCalculation {
  basePrice: number;
  modifiers: any[]; // Використовуємо any тимчасово щоб уникнути циклічних залежностей
  subtotal: number;
  discountAmount: number;
  finalPrice: number;
  breakdown: Array<{
    name: string;
    type: 'BASE' | 'MODIFIER' | 'DISCOUNT';
    amount: number;
    percentage?: number;
    description?: string;
  }>;
}

/**
 * Фінансова інформація замовлення
 */
export interface OrderFinancials {
  basePrice: number;
  modifiersAmount: number;
  subtotal: number;
  discountType: DiscountType;
  discountPercentage: number;
  discountAmount: number;
  expediteAmount: number;
  totalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number;
  paymentMethod: PaymentMethod;
}

/**
 * Результат фінансових операцій
 */
export interface FinancialOperationResponse {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
  errors?: string[];
}

/**
 * Відповідь для операцій зі знижкою
 */
export interface DiscountOperationResponse extends FinancialOperationResponse {
  data?: {
    orderId: string;
    discountType: DiscountType;
    discountPercentage: number;
    discountAmount: number;
    oldTotalAmount: number;
    newTotalAmount: number;
    appliedAt: string;
  };
}

/**
 * Відповідь для розрахунку оплати
 */
export interface PaymentCalculationResponse extends FinancialOperationResponse {
  data?: {
    orderId: string;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    paymentBreakdown: Array<{
      type: PaymentMethod;
      amount: number;
      status: PaymentStatus;
    }>;
    calculatedAt: string;
  };
}

/**
 * Інформація про платіж замовлення
 */
export interface OrderPaymentInfo {
  orderId: string;
  totalAmount: number;
  prepaymentAmount: number;
  balanceAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  transactionId?: string;
  receiptNumber?: string;
}
