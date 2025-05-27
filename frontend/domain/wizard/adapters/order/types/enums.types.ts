/**
 * @fileoverview Типи enum для замовлень з правильними імпортами з OpenAPI
 * @module domain/wizard/adapters/order/types
 */

import { WizardOrderStatus, WizardExpediteType } from './base.types';

import type { OrderDTO, PriceModifierDTO, OrderDetailedSummaryResponse } from '@/lib/api';

/**
 * Статуси замовлень з API (консолідовані)
 * Використовує значення з namespace enum
 */
export enum ApiOrderStatus {
  DRAFT = 'DRAFT',
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

/**
 * Типи терміновості з API (консолідовані)
 * Використовує значення з namespace enum
 */
export enum ApiExpediteType {
  STANDARD = 'STANDARD',
  EXPRESS_48H = 'EXPRESS_48H',
  EXPRESS_24H = 'EXPRESS_24H',
}

/**
 * Типи модифікаторів цін з API (консолідовані)
 * Використовує значення з namespace enum
 */
export enum ApiPriceModifierType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  MULTIPLIER = 'MULTIPLIER',
}

// ============= ТИПИ З NAMESPACE ENUM =============

/**
 * Тип для status поля в OrderDTO (використовує namespace enum)
 */
export type OrderDTOStatus = OrderDTO.status;

/**
 * Тип для expediteType поля в OrderDTO (використовує namespace enum)
 */
export type OrderDTOExpediteType = OrderDTO.expediteType;

/**
 * Тип для type поля в PriceModifierDTO (використовує namespace enum)
 */
export type PriceModifierDTOType = PriceModifierDTO.type;

/**
 * Тип для expediteType поля в OrderDetailedSummaryResponse (використовує namespace enum)
 */
export type OrderDetailedSummaryResponseExpediteType = OrderDetailedSummaryResponse.expediteType;

// ============= ДОМЕННІ ТИПИ =============
// Примітка: WizardOrderStatus та WizardExpediteType експортуються з base.types.ts

/**
 * Типи модифікаторів цін для wizard домену
 */
export enum WizardPriceModifierType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  MULTIPLIER = 'MULTIPLIER',
}

// ============= КОНСТАНТИ ДЛЯ МАППІНГУ =============

/**
 * Маппінг статусів з API типів в доменні типи
 */
export const API_TO_DOMAIN_STATUS_MAP: Record<ApiOrderStatus, WizardOrderStatus> = {
  [ApiOrderStatus.DRAFT]: WizardOrderStatus.DRAFT,
  [ApiOrderStatus.NEW]: WizardOrderStatus.NEW,
  [ApiOrderStatus.IN_PROGRESS]: WizardOrderStatus.IN_PROGRESS,
  [ApiOrderStatus.COMPLETED]: WizardOrderStatus.COMPLETED,
  [ApiOrderStatus.DELIVERED]: WizardOrderStatus.DELIVERED,
  [ApiOrderStatus.CANCELLED]: WizardOrderStatus.CANCELLED,
} as const;

/**
 * Маппінг типів терміновості з API типів в доменні типи
 */
export const API_TO_DOMAIN_EXPEDITE_MAP: Record<ApiExpediteType, WizardExpediteType> = {
  [ApiExpediteType.STANDARD]: WizardExpediteType.STANDARD,
  [ApiExpediteType.EXPRESS_48H]: WizardExpediteType.EXPRESS_48H,
  [ApiExpediteType.EXPRESS_24H]: WizardExpediteType.EXPRESS_24H,
} as const;

/**
 * Маппінг типів модифікаторів з API типів в доменні типи
 */
export const API_TO_DOMAIN_MODIFIER_MAP: Record<ApiPriceModifierType, WizardPriceModifierType> = {
  [ApiPriceModifierType.PERCENTAGE]: WizardPriceModifierType.PERCENTAGE,
  [ApiPriceModifierType.FIXED_AMOUNT]: WizardPriceModifierType.FIXED_AMOUNT,
  [ApiPriceModifierType.MULTIPLIER]: WizardPriceModifierType.MULTIPLIER,
} as const;

/**
 * Маппінг з доменних статусів в API типи
 */
export const DOMAIN_TO_API_STATUS_MAP: Record<WizardOrderStatus, ApiOrderStatus> = {
  [WizardOrderStatus.DRAFT]: ApiOrderStatus.DRAFT,
  [WizardOrderStatus.NEW]: ApiOrderStatus.NEW,
  [WizardOrderStatus.IN_PROGRESS]: ApiOrderStatus.IN_PROGRESS,
  [WizardOrderStatus.COMPLETED]: ApiOrderStatus.COMPLETED,
  [WizardOrderStatus.DELIVERED]: ApiOrderStatus.DELIVERED,
  [WizardOrderStatus.CANCELLED]: ApiOrderStatus.CANCELLED,
} as const;

/**
 * Маппінг з доменних типів терміновості в API типи
 */
export const DOMAIN_TO_API_EXPEDITE_MAP: Record<WizardExpediteType, ApiExpediteType> = {
  [WizardExpediteType.STANDARD]: ApiExpediteType.STANDARD,
  [WizardExpediteType.EXPRESS_48H]: ApiExpediteType.EXPRESS_48H,
  [WizardExpediteType.EXPRESS_24H]: ApiExpediteType.EXPRESS_24H,
} as const;

/**
 * Маппінг з доменних типів модифікаторів в API типи
 */
export const DOMAIN_TO_API_MODIFIER_MAP: Record<WizardPriceModifierType, ApiPriceModifierType> = {
  [WizardPriceModifierType.PERCENTAGE]: ApiPriceModifierType.PERCENTAGE,
  [WizardPriceModifierType.FIXED_AMOUNT]: ApiPriceModifierType.FIXED_AMOUNT,
  [WizardPriceModifierType.MULTIPLIER]: ApiPriceModifierType.MULTIPLIER,
} as const;

// ============= УТИЛІТАРНІ ТИПИ =============

/**
 * Всі можливі API статуси (union type)
 */
export type AllApiStatuses = OrderDTOStatus;

/**
 * Всі можливі API типи терміновості (union type)
 */
export type AllApiExpediteTypes = OrderDTOExpediteType | OrderDetailedSummaryResponseExpediteType;

/**
 * Всі можливі API типи модифікаторів (union type)
 */
export type AllApiModifierTypes = PriceModifierDTOType;

/**
 * Перевірка, чи є значення валідним API статусом
 */
export function isValidApiStatus(value: unknown): value is AllApiStatuses {
  return (
    typeof value === 'string' && Object.values(ApiOrderStatus).includes(value as ApiOrderStatus)
  );
}

/**
 * Перевірка, чи є значення валідним API типом терміновості
 */
export function isValidApiExpediteType(value: unknown): value is AllApiExpediteTypes {
  return (
    typeof value === 'string' && Object.values(ApiExpediteType).includes(value as ApiExpediteType)
  );
}

/**
 * Перевірка, чи є значення валідним API типом модифікатора
 */
export function isValidApiModifierType(value: unknown): value is AllApiModifierTypes {
  return (
    typeof value === 'string' &&
    Object.values(ApiPriceModifierType).includes(value as ApiPriceModifierType)
  );
}

/**
 * Перевірка, чи є значення валідним доменним статусом
 */
export function isValidWizardStatus(value: unknown): value is WizardOrderStatus {
  return (
    typeof value === 'string' &&
    Object.values(WizardOrderStatus).includes(value as WizardOrderStatus)
  );
}

/**
 * Перевірка, чи є значення валідним доменним типом терміновості
 */
export function isValidWizardExpediteType(value: unknown): value is WizardExpediteType {
  return (
    typeof value === 'string' &&
    Object.values(WizardExpediteType).includes(value as WizardExpediteType)
  );
}

/**
 * Перевірка, чи є значення валідним доменним типом модифікатора
 */
export function isValidWizardModifierType(value: unknown): value is WizardPriceModifierType {
  return (
    typeof value === 'string' &&
    Object.values(WizardPriceModifierType).includes(value as WizardPriceModifierType)
  );
}
