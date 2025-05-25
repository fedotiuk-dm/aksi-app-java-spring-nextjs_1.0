/**
 * @fileoverview Доменні типи для замовлень
 * @module domain/wizard/services/order/types
 */

/**
 * Доменна модель замовлення
 */
export interface OrderDomain {
  id: string;
  receiptNumber: string;
  uniqueLabel?: string;
  clientId: string;
  branchId: string;
  operatorId: string;
  status: OrderStatus;
  items: OrderItemDomain[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  discountType?: DiscountType;
  discountAmount: number;
  expediteType: ExpediteType;
  expediteFee: number;
  completionDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Доменна модель предмета замовлення
 */
export interface OrderItemDomain {
  id: string;
  orderId: string;
  serviceId: string;
  serviceName: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  unitOfMeasure: 'PIECE' | 'KG';
  basePrice: number;
  modifiers: OrderItemModifierDomain[];
  totalPrice: number;
  material?: string;
  color?: string;
  filler?: string;
  wearDegree?: string;
  stains: string[];
  defects: string[];
  risks: string[];
  notes?: string;
  photos: OrderItemPhotoDomain[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Доменна модель модифікатора предмета
 */
export interface OrderItemModifierDomain {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED' | 'MULTIPLIER';
  value: number;
  appliedAmount: number;
}

/**
 * Доменна модель фото предмета
 */
export interface OrderItemPhotoDomain {
  id: string;
  orderItemId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
}

/**
 * Статуси замовлення
 */
export type OrderStatus =
  | 'DRAFT' // Чернетка
  | 'CONFIRMED' // Підтверджено
  | 'IN_PROGRESS' // В роботі
  | 'READY' // Готово
  | 'COMPLETED' // Видано
  | 'CANCELLED'; // Скасовано

/**
 * Способи оплати
 */
export type PaymentMethod =
  | 'CASH' // Готівка
  | 'CARD' // Картка/термінал
  | 'TRANSFER'; // Переказ на рахунок

/**
 * Типи знижок
 */
export type DiscountType =
  | 'EVERCARD' // Еверкард (10%)
  | 'SOCIAL' // Соцмережі (5%)
  | 'MILITARY' // ЗСУ (10%)
  | 'OTHER'; // Інше

/**
 * Типи терміновості
 */
export type ExpediteType =
  | 'STANDARD' // Звичайне
  | 'EXPRESS_48H' // +50% за 48 год
  | 'EXPRESS_24H'; // +100% за 24 год

/**
 * Запит на створення замовлення
 */
export interface CreateOrderDomainRequest {
  clientId: string;
  branchId: string;
  operatorId?: string;
  uniqueLabel?: string;
  items: CreateOrderItemDomainRequest[];
  paymentMethod: PaymentMethod;
  paidAmount: number;
  discountType?: DiscountType;
  discountValue?: number;
  expediteType: ExpediteType;
  completionDate: Date;
  notes?: string;
}

/**
 * Запит на створення предмета замовлення
 */
export interface CreateOrderItemDomainRequest {
  serviceId: string;
  quantity: number;
  unitOfMeasure: 'PIECE' | 'KG';
  modifierIds: string[];
  material?: string;
  color?: string;
  filler?: string;
  wearDegree?: string;
  stains: string[];
  defects: string[];
  risks: string[];
  notes?: string;
  photos: CreateOrderItemPhotoDomainRequest[];
}

/**
 * Запит на створення фото предмета
 */
export interface CreateOrderItemPhotoDomainRequest {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  base64Data: string;
}

/**
 * Запит на оновлення замовлення
 */
export interface UpdateOrderDomainRequest {
  status?: OrderStatus;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
  completionDate?: Date;
  notes?: string;
}

/**
 * Параметри пошуку замовлень
 */
export interface OrderSearchDomainParams {
  query?: string;
  receiptNumber?: string;
  clientId?: string;
  branchId?: string;
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  size?: number;
}

/**
 * Результат пошуку замовлень
 */
export interface OrderSearchDomainResult {
  orders: OrderDomain[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}

/**
 * Статистика замовлень
 */
export interface OrderStatsDomain {
  totalOrders: number;
  totalAmount: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  ordersByPaymentMethod: Record<PaymentMethod, number>;
  topServices: Array<{
    serviceId: string;
    serviceName: string;
    count: number;
    totalAmount: number;
  }>;
}
