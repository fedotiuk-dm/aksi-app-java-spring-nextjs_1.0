/**
 * @fileoverview Типи для етапу 3 - параметри замовлення
 */

import type {
  OrderDiscountRequest,
  PaymentCalculationRequest,
  CompletionDateCalculationRequest,
  OrderDTO,
} from '@/shared/api/generated/full/aksiApi.schemas';

// ===================================
// Параметри виконання
// ===================================

export type UrgencyLevel = 'normal' | 'urgent_48h' | 'urgent_24h';

export interface ExecutionParameters {
  completionDate: string; // ISO date string
  urgencyLevel: UrgencyLevel;
  customCompletionDate?: string; // Кастомна дата
  autoCalculatedDate?: string; // Автоматично розрахована дата
}

// Типи для предметів замовлення
export interface OrderItemForCalculation {
  category?: {
    code?: string;
    id?: string;
    name?: string;
  };
  quantity?: number;
  serviceType?: string;
}

export interface UseExecutionParametersReturn {
  // Стан
  parameters: ExecutionParameters;
  urgencyOptions: Array<{ value: UrgencyLevel; label: string; priceImpact: number }>;
  isCalculatingDate: boolean;
  calculationError: string | null;

  // Дії
  setCompletionDate: (date: string) => void;
  setUrgencyLevel: (level: UrgencyLevel) => void;
  calculateCompletionDate: (items: OrderItemForCalculation[]) => Promise<void>;
  validateParameters: (items?: OrderItemForCalculation[]) => boolean;
  clearParameters: () => void;
}

// ===================================
// Знижки замовлення
// ===================================

export type DiscountType = 'none' | 'evercard' | 'social_media' | 'military' | 'custom';

export interface OrderDiscounts {
  discountType: DiscountType;
  customDiscountPercent?: number;
  customDiscountAmount?: number;
  applicableItems: string[]; // IDs предметів, на які поширюється знижка
  totalDiscountAmount: number;
}

// Типи для валідації знижок
export interface DiscountValidationResult {
  canApply: boolean;
  warning: string | null;
  applicableCount: number;
  restrictedCount: number;
}

export interface OrderItemForDiscount {
  id?: string;
  category?: {
    code?: string;
    name?: string;
    id?: string;
  };
  serviceType?: string;
  name?: string;
  price?: number;
}

export interface UseOrderDiscountsReturn {
  // Стан
  discounts: OrderDiscounts;
  discountOptions: Array<{ value: DiscountType; label: string; percent: number }>;
  restrictedCategories: string[]; // Категорії, на які не діють знижки
  isCalculating: boolean;
  calculationError: string | null;
  discountWarning: string | null;

  // Дії
  setDiscountType: (type: DiscountType) => void;
  setCustomDiscountPercent: (percent: number) => void;
  setCustomDiscountAmount: (amount: number) => void;
  calculateDiscount: (request: OrderDiscountRequest) => Promise<void>;
  validateDiscountApplication: (items: OrderItemForDiscount[]) => DiscountValidationResult;
  applyDiscountValidation: (items: OrderItemForDiscount[]) => DiscountValidationResult;
  clearDiscounts: () => void;
}

// ===================================
// Оплата замовлення
// ===================================

export type PaymentMethod = 'terminal' | 'cash' | 'bank_transfer';

export interface OrderPayment {
  paymentMethod: PaymentMethod;
  totalAmount: number;
  prepaymentAmount: number;
  remainingAmount: number;
  calculation?: PaymentCalculationRequest;
}

// Типи для розрахунку оплати
export interface PaymentCalculationInput {
  totalAmount: number;
  discountAmount?: number;
  urgencyFee?: number;
  items?: Array<{
    id?: string;
    price: number;
    quantity: number;
  }>;
}

export interface UseOrderPaymentReturn {
  // Стан
  payment: OrderPayment;
  paymentMethods: Array<{ value: PaymentMethod; label: string }>;
  isCalculating: boolean;
  calculationError: string | null;
  validationError: string | null;
  isValidPayment: boolean;

  // Дії
  setPaymentMethod: (method: PaymentMethod) => void;
  setPrepaymentAmount: (amount: number) => void;
  updateTotalAmount: (totalAmount: number) => void;
  calculatePayment: (input: PaymentCalculationInput) => Promise<void>;
  clearPayment: () => void;
}

// ===================================
// Додаткова інформація
// ===================================

export interface OrderAdditionalInfo {
  notes: string;
  clientRequirements: string;
}

export interface UseOrderAdditionalInfoReturn {
  // Стан
  additionalInfo: OrderAdditionalInfo;
  hasAdditionalInfo: boolean;

  // Дії
  setNotes: (notes: string) => void;
  setClientRequirements: (requirements: string) => void;
  clearAdditionalInfo: () => void;
}

// ===================================
// Менеджер параметрів замовлення
// ===================================

export interface OrderParameters {
  execution: ExecutionParameters;
  discounts: OrderDiscounts;
  payment: OrderPayment;
  additionalInfo: OrderAdditionalInfo;
}

export interface UseOrderParametersManagerReturn {
  // Стан
  parameters: OrderParameters;
  isValid: boolean;
  validationErrors: string[];
  totalOrderAmount: number;
  finalOrderAmount: number; // Після знижок та доплат

  // Дії
  updateExecution: (execution: Partial<ExecutionParameters>) => void;
  updateDiscounts: (discounts: Partial<OrderDiscounts>) => void;
  updatePayment: (payment: Partial<OrderPayment>) => void;
  updateAdditionalInfo: (info: Partial<OrderAdditionalInfo>) => void;
  validateParameters: () => boolean;
  clearAllParameters: () => void;
  exportOrderData: () => Partial<OrderDTO>;
}
