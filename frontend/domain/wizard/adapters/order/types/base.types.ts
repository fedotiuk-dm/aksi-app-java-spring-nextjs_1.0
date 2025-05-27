/**
 * @fileoverview Базові типи та перелічення для замовлень
 * @module domain/wizard/adapters/order/types/base
 */

// Базові типи
export type WizardOrderId = string;
export type WizardReceiptNumber = string;
export type WizardTagNumber = string;

/**
 * Статуси замовлень для wizard домену
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
 * Типи терміновості для wizard домену
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
