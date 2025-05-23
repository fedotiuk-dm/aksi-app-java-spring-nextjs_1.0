/**
 * Типи форм для домену Order
 * Адаптовані з API request типів для роботи з формами
 */

import type { Order, OrderStatus, ExpediteType } from './order.types';

/**
 * Дані форми для створення нового замовлення
 * На основі CreateOrderRequest
 */
export interface CreateOrderFormData {
  tagNumber?: string;
  clientId: string;
  items?: OrderItemFormData[];
  discountAmount?: number;
  prepaymentAmount?: number;
  branchLocationId: string;
  expectedCompletionDate?: Date;
  customerNotes?: string;
  internalNotes?: string;
  expediteType?: ExpediteType;
  draft?: boolean;
}

/**
 * Дані форми для оновлення замовлення
 */
export interface UpdateOrderFormData extends CreateOrderFormData {
  id: string;
  receiptNumber?: string;
  status?: OrderStatus;
}

/**
 * Дані форми для предмета замовлення
 */
export interface OrderItemFormData {
  id?: string;
  orderId?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  category?: string;
  color?: string;
  material?: string;
  unitOfMeasure?: string;
  defects?: string;
  specialInstructions?: string;
  fillerType?: string;
  fillerCompressed?: boolean;
  wearDegree?: string;
  stains?: string;
  otherStains?: string;
  defectsAndRisks?: string;
  noGuaranteeReason?: string;
  defectsNotes?: string;
}

/**
 * Результат створення замовлення
 */
export interface CreateOrderResult {
  order: Order | null;
  errors: OrderFormErrors | null;
  receiptNumber?: string;
}

/**
 * Результат оновлення замовлення
 */
export interface UpdateOrderResult {
  order: Order | null;
  errors: OrderFormErrors | null;
  updated: boolean;
}

/**
 * Помилки валідації форм замовлення
 */
export interface OrderFormErrors {
  general?: string;
  tagNumber?: string;
  clientId?: string;
  branchLocationId?: string;
  items?: string;
  discountAmount?: string;
  prepaymentAmount?: string;
  expectedCompletionDate?: string;
  customerNotes?: string;
  internalNotes?: string;
  expediteType?: string;
  status?: string;
}

/**
 * Помилки валідації предмета замовлення
 */
export interface OrderItemFormErrors {
  general?: string;
  name?: string;
  description?: string;
  quantity?: string;
  unitPrice?: string;
  category?: string;
  color?: string;
  material?: string;
  defects?: string;
  specialInstructions?: string;
  fillerType?: string;
  wearDegree?: string;
  stains?: string;
  defectsNotes?: string;
}

/**
 * Стан форми замовлення
 */
export interface OrderFormState {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  hasUnsavedChanges: boolean;
}

/**
 * Дані для збереження чернетки
 */
export interface SaveDraftData {
  orderData: Partial<CreateOrderFormData>;
  formState: OrderFormState;
  savedAt: Date;
  autoSaved?: boolean;
}
