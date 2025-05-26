/**
 * @fileoverview Доменні типи для ініціалізації замовлення
 * @module domain/wizard/services/stage-1/order-initialization/types
 */

import { z } from 'zod';

/**
 * Схема для валідації базової інформації замовлення
 */
export const orderInitializationSchema = z.object({
  receiptNumber: z
    .string()
    .trim()
    .min(1, 'Номер квитанції не може бути порожнім')
    .max(20, 'Номер квитанції не може перевищувати 20 символів'),

  uniqueLabel: z
    .string()
    .trim()
    .min(1, 'Унікальна мітка не може бути порожньою')
    .max(50, 'Унікальна мітка не може перевищувати 50 символів'),

  branchId: z.string().trim().min(1, 'Необхідно вибрати пункт прийому'),

  createdAt: z.date().default(() => new Date()),
});

/**
 * Схема для валідації унікальної мітки
 */
export const uniqueLabelSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, 'Унікальна мітка не може бути порожньою')
    .max(50, 'Унікальна мітка не може перевищувати 50 символів')
    .regex(
      /^[A-Za-z0-9\-_]+$/,
      'Унікальна мітка може містити тільки літери, цифри, дефіси та підкреслення'
    ),
});

/**
 * Типи на основі схем
 */
export type OrderInitializationData = z.infer<typeof orderInitializationSchema>;
export type UniqueLabelData = z.infer<typeof uniqueLabelSchema>;

/**
 * Інформація про філію (пункт прийому)
 */
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  workingHours: string;
  isActive: boolean;
}

/**
 * Базова інформація замовлення
 */
export interface OrderBasicInfo {
  receiptNumber: string;
  uniqueLabel: string;
  branchId: string;
  branch?: Branch;
  createdAt: Date;
}

/**
 * Стан процесу ініціалізації замовлення
 */
export interface OrderInitializationState {
  // Базова інформація
  receiptNumber: string;
  uniqueLabel: string;
  selectedBranchId: string | null;
  createdAt: Date;

  // Філії
  branches: Branch[];
  isBranchesLoading: boolean;
  branchesError: string | null;

  // Генерація номера квитанції
  isGeneratingReceiptNumber: boolean;
  receiptNumberError: string | null;

  // Валідація унікальної мітки
  isValidatingUniqueLabel: boolean;
  uniqueLabelError: string | null;
  isUniqueLabelValid: boolean;

  // Форма
  formErrors: Record<string, string>;

  // Операції
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

/**
 * Дії для ініціалізації замовлення
 */
export interface OrderInitializationActions {
  // Номер квитанції
  generateReceiptNumber: () => Promise<void>;
  setReceiptNumber: (receiptNumber: string) => void;

  // Унікальна мітка
  setUniqueLabel: (label: string) => void;
  validateUniqueLabel: (label: string) => Promise<boolean>;
  scanUniqueLabel: () => Promise<void>; // Для майбутньої інтеграції зі сканером

  // Філії
  loadBranches: () => Promise<void>;
  selectBranch: (branchId: string) => void;

  // Валідація
  validateForm: () => boolean;
  clearFormErrors: () => void;

  // Ініціалізація
  initializeOrder: () => Promise<boolean>;
  reset: () => void;

  // Утиліти
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Результат ініціалізації замовлення
 */
export interface OrderInitializationResult {
  success: boolean;
  orderBasicInfo?: OrderBasicInfo;
  error?: string;
}

/**
 * Параметри для генерації номера квитанції
 */
export interface GenerateReceiptNumberRequest {
  branchId?: string;
  date?: Date;
}

/**
 * Параметри для валідації унікальної мітки
 */
export interface ValidateUniqueLabelRequest {
  label: string;
  excludeOrderId?: string; // Для випадку редагування існуючого замовлення
}
