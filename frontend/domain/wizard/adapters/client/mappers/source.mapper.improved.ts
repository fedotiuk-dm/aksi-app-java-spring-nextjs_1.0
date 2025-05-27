/**
 * @fileoverview Покращений маппер для джерел залучення клієнтів
 * @module domain/wizard/adapters/client/mappers
 *
 * ПОКРАЩЕННЯ:
 * - Використовує нові namespace enum з OpenAPI
 * - Уникає проблем з вкладеними типами
 * - Використовує константи для маппінгу
 * - Більш безпечна типізація
 * - Легше підтримувати при зміні OpenAPI схеми
 */

import {
  ApiClientSource,
  WizardClientSource,
  API_TO_DOMAIN_SOURCE_MAP,
  DOMAIN_TO_API_SOURCE_MAP,
  isValidApiSource,
  isValidWizardSource,
} from '../types/source.types';

import type {
  ClientResponseSource,
  CreateClientRequestSource,
  UpdateClientRequestSource,
  AllApiSources,
} from '../types/source.types';

/**
 * Перетворює API джерело у WizardClientSource (покращена версія)
 *
 * ПЕРЕВАГИ:
 * - Не залежить від вкладених типів
 * - Використовує константи для маппінгу
 * - Легко розширювати
 */
export function mapApiSourceToWizard(
  apiSource: AllApiSources | undefined | null
): WizardClientSource | undefined {
  if (!apiSource) {
    return undefined;
  }

  // Валідація вхідного значення
  if (!isValidApiSource(apiSource)) {
    console.warn(`[SourceMapper] Невідоме API джерело: ${apiSource}`);
    return undefined;
  }

  // Використовуємо константу для маппінгу
  return API_TO_DOMAIN_SOURCE_MAP[apiSource as unknown as ApiClientSource];
}

/**
 * Перетворює WizardClientSource у API джерело для ClientResponse
 */
export function mapWizardSourceToClientResponse(
  wizardSource: WizardClientSource | undefined | null
): ClientResponseSource | undefined {
  if (!wizardSource) {
    return undefined;
  }

  // Валідація вхідного значення
  if (!isValidWizardSource(wizardSource)) {
    console.warn(`[SourceMapper] Невідоме wizard джерело: ${wizardSource}`);
    return undefined;
  }

  // Використовуємо константу для маппінгу
  return DOMAIN_TO_API_SOURCE_MAP[wizardSource] as unknown as ClientResponseSource;
}

/**
 * Перетворює WizardClientSource у API джерело для CreateClientRequest
 */
export function mapWizardSourceToCreateRequest(
  wizardSource: WizardClientSource | undefined | null
): CreateClientRequestSource | undefined {
  if (!wizardSource) {
    return undefined;
  }

  // Валідація вхідного значення
  if (!isValidWizardSource(wizardSource)) {
    console.warn(`[SourceMapper] Невідоме wizard джерело: ${wizardSource}`);
    return undefined;
  }

  // Використовуємо константу для маппінгу
  return DOMAIN_TO_API_SOURCE_MAP[wizardSource] as unknown as CreateClientRequestSource;
}

/**
 * Перетворює WizardClientSource у API джерело для UpdateClientRequest
 */
export function mapWizardSourceToUpdateRequest(
  wizardSource: WizardClientSource | undefined | null
): UpdateClientRequestSource | undefined {
  if (!wizardSource) {
    return undefined;
  }

  // Валідація вхідного значення
  if (!isValidWizardSource(wizardSource)) {
    console.warn(`[SourceMapper] Невідоме wizard джерело: ${wizardSource}`);
    return undefined;
  }

  // Використовуємо константу для маппінгу
  return DOMAIN_TO_API_SOURCE_MAP[wizardSource] as unknown as UpdateClientRequestSource;
}

/**
 * Універсальний маппер з API в домен (працює з будь-яким API типом)
 */
export function mapAnyApiSourceToWizard(apiSource: unknown): WizardClientSource | undefined {
  if (!isValidApiSource(apiSource)) {
    return undefined;
  }

  return mapApiSourceToWizard(apiSource);
}

/**
 * Отримує всі доступні джерела для wizard домену
 */
export function getAvailableWizardSources(): WizardClientSource[] {
  return Object.values(WizardClientSource);
}

/**
 * Отримує всі доступні API джерела
 */
export function getAvailableApiSources(): ApiClientSource[] {
  return Object.values(ApiClientSource);
}

/**
 * Перевіряє, чи підтримується джерело в wizard домені
 */
export function isSourceSupportedInWizard(source: unknown): source is WizardClientSource {
  return isValidWizardSource(source);
}

/**
 * Перевіряє, чи підтримується джерело в API
 */
export function isSourceSupportedInApi(source: unknown): source is AllApiSources {
  return isValidApiSource(source);
}

// ============= ЕКСПОРТ LEGACY ФУНКЦІЙ (для зворотної сумісності) =============

/**
 * @deprecated Використовуйте mapApiSourceToWizard замість цього
 */
export const fromApiToDomain = mapApiSourceToWizard;

/**
 * @deprecated Використовуйте mapWizardSourceToCreateRequest замість цього
 */
export const fromDomainToApi = mapWizardSourceToCreateRequest;
