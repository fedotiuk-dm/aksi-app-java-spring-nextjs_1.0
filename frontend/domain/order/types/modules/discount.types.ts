/**
 * Типи для модуля Discount (Знижки)
 */

import type { DiscountType } from './financial.types';

/**
 * Знижка замовлення
 */
export interface OrderDiscount {
  id?: string;
  orderId: string;
  type: DiscountType;
  name: string;
  description?: string;
  percentage: number;
  fixedAmount?: number;
  maxAmount?: number;
  minOrderAmount?: number;
  appliedAmount: number;
  excludedCategories: string[]; // Категорії на які не поширюється
  excludedItems: string[]; // Конкретні предмети
  validFrom?: Date;
  validTo?: Date;
  isActive: boolean;
  isAutoApplied: boolean;
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  createdBy?: string;
}

/**
 * Правила застосування знижки
 */
export interface DiscountRules {
  type: DiscountType;
  applicableCategories: string[]; // Категорії на які поширюється
  excludedCategories: string[]; // Категорії виключення
  combinableWith: DiscountType[]; // З якими знижками можна комбінувати
  priority: number; // Пріоритет застосування
  requiresVerification: boolean; // Чи потребує верифікації
  maxUsagePerOrder: number; // Максимальне використання на замовлення
  maxUsagePerClient: number; // Максимальне використання на клієнта
  conditions: DiscountCondition[]; // Умови застосування
}

/**
 * Умова застосування знижки
 */
export interface DiscountCondition {
  type: 'MIN_AMOUNT' | 'MIN_ITEMS' | 'CLIENT_TYPE' | 'BRANCH' | 'DAY_OF_WEEK' | 'ITEM_CATEGORY';
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN';
  value: string | number | string[];
  description: string;
}

/**
 * Результат валідації знижки
 */
export interface DiscountValidationResult {
  isValid: boolean;
  applicableAmount: number;
  excludedAmount: number;
  finalDiscountAmount: number;
  warnings: DiscountWarning[];
  errors: DiscountError[];
  appliedRules: string[];
  excludedItems: DiscountExcludedItem[];
}

/**
 * Попередження про знижку
 */
export interface DiscountWarning {
  type: 'PARTIAL_APPLICATION' | 'CATEGORY_EXCLUDED' | 'AMOUNT_EXCEEDED' | 'EXPIRING_SOON';
  message: string;
  affectedAmount?: number;
  affectedItems?: string[];
}

/**
 * Помилка знижки
 */
export interface DiscountError {
  type: 'INVALID_TYPE' | 'EXPIRED' | 'MIN_AMOUNT_NOT_MET' | 'NOT_APPLICABLE' | 'ALREADY_APPLIED';
  message: string;
  code: string;
}

/**
 * Виключений предмет
 */
export interface DiscountExcludedItem {
  itemId: string;
  itemName: string;
  reason: string;
  category: string;
  amount: number;
}

/**
 * Шаблон знижки
 */
export interface DiscountTemplate {
  id: string;
  type: DiscountType;
  name: string;
  description: string;
  defaultPercentage: number;
  rules: DiscountRules;
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
}

/**
 * Знижки клієнта
 */
export interface ClientDiscountProfile {
  clientId: string;
  availableDiscounts: DiscountType[];
  usedDiscounts: DiscountUsageHistory[];
  eligibleFor: DiscountType[];
  restrictions: DiscountRestriction[];
  totalSavings: number;
}

/**
 * Історія використання знижок
 */
export interface DiscountUsageHistory {
  orderId: string;
  discountType: DiscountType;
  amount: number;
  percentage: number;
  appliedAt: Date;
  savedAmount: number;
}

/**
 * Обмеження знижки
 */
export interface DiscountRestriction {
  type: DiscountType;
  reason: string;
  restrictedUntil?: Date;
  maxUsageReached: boolean;
  requiresDocumentation: boolean;
}

/**
 * Комбінація знижок
 */
export interface DiscountCombination {
  discounts: DiscountType[];
  totalPercentage: number;
  totalAmount: number;
  isValid: boolean;
  conflicts: string[];
  recommendations: string[];
}

/**
 * Пропозиція знижки
 */
export interface DiscountSuggestion {
  type: DiscountType;
  reason: string;
  potentialSavings: number;
  confidence: number;
  autoApplicable: boolean;
  requiresAction: boolean;
  actionDescription?: string;
}

/**
 * Статистика знижок
 */
export interface DiscountStats {
  totalDiscountsApplied: number;
  totalAmountSaved: number;
  averageDiscountPercentage: number;
  mostUsedDiscount: DiscountType;
  byType: Record<DiscountType, DiscountTypeStats>;
  byBranch: Record<string, number>;
  byMonth: Record<string, number>;
}

/**
 * Статистика по типу знижки
 */
export interface DiscountTypeStats {
  usageCount: number;
  totalSaved: number;
  averagePercentage: number;
  averageAmount: number;
  clientsUsed: number;
}
