/**
 * Типи для фінансового модуля Order (Фінанси, оплата, знижки)
 */

/**
 * Типи оплати
 */
export enum PaymentMethod {
  TERMINAL = 'TERMINAL', // Термінал
  CASH = 'CASH', // Готівка
  BANK_TRANSFER = 'BANK_TRANSFER', // На рахунок
}

/**
 * Типи знижок
 */
export enum DiscountType {
  NONE = 'NONE', // Без знижки
  EVERCARD = 'EVERCARD', // Еверкард (10%)
  SOCIAL_MEDIA = 'SOCIAL_MEDIA', // Соцмережі (5%)
  MILITARY = 'MILITARY', // ЗСУ (10%)
  CUSTOM = 'CUSTOM', // Інше (з полем для вводу відсотка)
}

/**
 * Фінансова інформація замовлення
 */
export interface OrderFinancials {
  basePrice: number; // Базова вартість
  modifiersAmount: number; // Сума модифікаторів
  subtotal: number; // Проміжна сума
  discountType: DiscountType; // Тип знижки
  discountPercentage: number; // Відсоток знижки
  discountAmount: number; // Сума знижки
  expediteAmount: number; // Надбавка за терміновість
  totalAmount: number; // Загальна вартість
  prepaymentAmount: number; // Передоплата
  balanceAmount: number; // Залишок
  paymentMethod: PaymentMethod; // Спосіб оплати
}

/**
 * Деталізований розрахунок вартості
 */
export interface FinancialBreakdown {
  items: FinancialBreakdownItem[];
  totals: FinancialTotals;
  discounts: DiscountBreakdown[];
  expedite: ExpediteBreakdown | null;
  payment: PaymentBreakdown;
}

/**
 * Елемент деталізації фінансів
 */
export interface FinancialBreakdownItem {
  itemId: string;
  itemName: string;
  quantity: number;
  basePrice: number;
  modifiers: ModifierBreakdown[];
  itemSubtotal: number;
  discountApplied: number;
  itemTotal: number;
}

/**
 * Модифікатор у розрахунку
 */
export interface ModifierBreakdown {
  name: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  amount: number;
  description?: string;
}

/**
 * Підсумки розрахунку
 */
export interface FinancialTotals {
  itemsSubtotal: number; // Сума всіх предметів
  modifiersSubtotal: number; // Сума всіх модифікаторів
  beforeDiscounts: number; // До знижок
  totalDiscounts: number; // Загальна знижка
  afterDiscounts: number; // Після знижок
  expediteAmount: number; // Надбавка за терміновість
  finalAmount: number; // Фінальна сума
}

/**
 * Деталізація знижки
 */
export interface DiscountBreakdown {
  type: DiscountType;
  name: string;
  percentage: number;
  appliedToAmount: number;
  discountAmount: number;
  excludedItems: string[]; // Предмети на які не поширюється знижка
}

/**
 * Деталізація терміновості
 */
export interface ExpediteBreakdown {
  type: 'EXPRESS_48H' | 'EXPRESS_24H';
  name: string;
  percentage: number;
  appliedToAmount: number;
  expediteAmount: number;
}

/**
 * Деталізація оплати
 */
export interface PaymentBreakdown {
  method: PaymentMethod;
  totalAmount: number;
  prepaidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
}

/**
 * Статус оплати
 */
export enum PaymentStatus {
  PENDING = 'PENDING', // Очікує оплати
  PARTIAL = 'PARTIAL', // Часткова оплата
  PAID = 'PAID', // Оплачено
  REFUNDED = 'REFUNDED', // Повернуто
}

/**
 * Запит на застосування знижки
 */
export interface ApplyDiscountRequest {
  orderId: string;
  discountType: DiscountType;
  discountPercentage?: number;
  discountDescription?: string;
}

/**
 * Запит на додавання передоплати
 */
export interface AddPrepaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

/**
 * Результат фінансової операції
 */
export interface FinancialOperationResult {
  success: boolean;
  updatedFinancials: OrderFinancials;
  breakdown: FinancialBreakdown;
  errors?: string[];
  warnings?: string[];
}

/**
 * Фінансова статистика замовлення
 */
export interface OrderFinancialStats {
  averageOrderValue: number;
  totalRevenue: number;
  discountUsage: Record<DiscountType, number>;
  paymentMethodDistribution: Record<PaymentMethod, number>;
  prepaymentRate: number;
  expediteUsage: number;
}
