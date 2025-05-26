/**
 * @fileoverview Базові типи та перелічення для замовлень
 * @module domain/wizard/adapters/order/types/base
 */

// Базові типи
export type WizardOrderId = string;
export type WizardReceiptNumber = string;
export type WizardTagNumber = string;

/**
 * Статуси замовлення
 */
export enum WizardOrderStatus {
  DRAFT = 'DRAFT',
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

/**
 * Типи терміновості виконання
 */
export enum WizardExpediteType {
  STANDARD = 'STANDARD',
  EXPRESS_48H = 'EXPRESS_48H',
  EXPRESS_24H = 'EXPRESS_24H',
}

/**
 * Типи знижок
 */
export enum WizardDiscountType {
  NONE = 'NONE',
  EVERCARD = 'EVERCARD',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  MILITARY = 'MILITARY',
  CUSTOM = 'CUSTOM',
}

/**
 * Способи оплати
 */
export enum WizardPaymentMethod {
  TERMINAL = 'TERMINAL',
  CASH = 'CASH',
  ACCOUNT = 'ACCOUNT',
}
