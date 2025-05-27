/**
 * @fileoverview Базові типи та перелічення для client адаптерів
 * @module domain/wizard/adapters/client/types
 */

// ============= БАЗОВІ ТИПИ =============

export type WizardClientId = string;
export type WizardClientPhone = string;
export type WizardClientEmail = string;

// ============= ПЕРЕЛІЧЕННЯ =============

/**
 * Канали комунікації з клієнтом
 */
export enum WizardCommunicationChannel {
  PHONE = 'PHONE',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  VIBER = 'VIBER',
}

/**
 * Джерело залучення клієнта
 * Синхронізовано з ClientSource enum з бекенду
 */
export enum WizardClientSource {
  INSTAGRAM = 'INSTAGRAM',
  GOOGLE = 'GOOGLE',
  RECOMMENDATION = 'RECOMMENDATION',
  OTHER = 'OTHER',
}

/**
 * Адреса клієнта (структурована)
 * Базується на AddressDTO з OpenAPI
 */
export interface WizardClientAddress {
  readonly street?: string;
  readonly city?: string;
  readonly state?: string;
  readonly zipCode?: string;
  readonly country?: string;
}

/**
 * Категорія клієнта
 * Базується на ClientCategoryDTO з OpenAPI
 */
export interface WizardClientCategory {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly discountPercentage?: number;
}

/**
 * Налаштування клієнта
 * Базується на ClientPreferenceDTO з OpenAPI
 */
export interface WizardClientPreference {
  readonly id: string;
  readonly type: string;
  readonly value: string;
  readonly description?: string;
}

/**
 * Короткий опис замовлення
 * Базується на OrderSummaryDTO з OpenAPI
 */
export interface ClientOrderSummary {
  readonly id: string;
  readonly receiptNumber: string;
  readonly totalAmount: number;
  readonly status: string;
  readonly createdAt: string;
  readonly completedAt?: string;
}
