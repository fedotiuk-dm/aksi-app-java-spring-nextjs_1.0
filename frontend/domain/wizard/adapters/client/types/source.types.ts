/**
 * @fileoverview Типи для джерел залучення клієнтів
 * @module domain/wizard/adapters/client/types
 */

import type { ClientResponse, CreateClientRequest, UpdateClientRequest } from '@/lib/api';

// ============= API ENUM ТИПИ =============

/**
 * Джерела клієнтів з API (консолідовані)
 * Використовує значення з нових namespace enum
 */
export enum ApiClientSource {
  INSTAGRAM = 'INSTAGRAM',
  GOOGLE = 'GOOGLE',
  RECOMMENDATION = 'RECOMMENDATION',
  OTHER = 'OTHER',
}

/**
 * Тип для source поля в ClientResponse (використовує namespace enum)
 */
export type ClientResponseSource = ClientResponse.source;

/**
 * Тип для source поля в CreateClientRequest (використовує namespace enum)
 */
export type CreateClientRequestSource = CreateClientRequest.source;

/**
 * Тип для source поля в UpdateClientRequest (використовує namespace enum)
 */
export type UpdateClientRequestSource = UpdateClientRequest.source;

// ============= ДОМЕННІ ТИПИ =============

/**
 * Джерела клієнтів для wizard домену
 */
export enum WizardClientSource {
  INSTAGRAM = 'INSTAGRAM',
  GOOGLE = 'GOOGLE',
  RECOMMENDATION = 'RECOMMENDATION',
  OTHER = 'OTHER',
}

// ============= КОНСТАНТИ ДЛЯ МАППІНГУ =============

/**
 * Маппінг з API типів в доменні типи
 */
export const API_TO_DOMAIN_SOURCE_MAP: Record<ApiClientSource, WizardClientSource> = {
  [ApiClientSource.INSTAGRAM]: WizardClientSource.INSTAGRAM,
  [ApiClientSource.GOOGLE]: WizardClientSource.GOOGLE,
  [ApiClientSource.RECOMMENDATION]: WizardClientSource.RECOMMENDATION,
  [ApiClientSource.OTHER]: WizardClientSource.OTHER,
} as const;

/**
 * Маппінг з доменних типів в API типи
 */
export const DOMAIN_TO_API_SOURCE_MAP: Record<WizardClientSource, ApiClientSource> = {
  [WizardClientSource.INSTAGRAM]: ApiClientSource.INSTAGRAM,
  [WizardClientSource.GOOGLE]: ApiClientSource.GOOGLE,
  [WizardClientSource.RECOMMENDATION]: ApiClientSource.RECOMMENDATION,
  [WizardClientSource.OTHER]: ApiClientSource.OTHER,
} as const;

// ============= ТИПИ ДЛЯ МАППІНГУ =============

/**
 * Тип для маппінгу API -> Domain
 */
export type API_TO_DOMAIN_SOURCE_MAP = typeof API_TO_DOMAIN_SOURCE_MAP;

/**
 * Тип для маппінгу Domain -> API
 */
export type DOMAIN_TO_API_SOURCE_MAP = typeof DOMAIN_TO_API_SOURCE_MAP;

// ============= УТИЛІТАРНІ ТИПИ =============

/**
 * Всі можливі API джерела (union type)
 */
export type AllApiSources =
  | ClientResponseSource
  | CreateClientRequestSource
  | UpdateClientRequestSource;

/**
 * Перевірка, чи є значення валідним API джерелом
 */
export function isValidApiSource(value: unknown): value is AllApiSources {
  return (
    typeof value === 'string' && Object.values(ApiClientSource).includes(value as ApiClientSource)
  );
}

/**
 * Перевірка, чи є значення валідним доменним джерелом
 */
export function isValidWizardSource(value: unknown): value is WizardClientSource {
  return (
    typeof value === 'string' &&
    Object.values(WizardClientSource).includes(value as WizardClientSource)
  );
}
