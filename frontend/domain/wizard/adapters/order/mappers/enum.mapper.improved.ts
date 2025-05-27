/**
 * @fileoverview Покращений маппер для enum замовлень
 * @module domain/wizard/adapters/order/mappers
 *
 * ПОКРАЩЕННЯ:
 * - Використовує нові namespace enum з OpenAPI
 * - Уникає проблем з вкладеними типами
 * - Використовує константи для маппінгу
 * - Більш безпечна типізація
 * - Легше підтримувати при зміні OpenAPI схеми
 */

import { WizardOrderStatus, WizardExpediteType } from '../types/base.types';
import {
  ApiOrderStatus,
  ApiExpediteType,
  ApiPriceModifierType,
  WizardPriceModifierType,
  API_TO_DOMAIN_STATUS_MAP,
  API_TO_DOMAIN_EXPEDITE_MAP,
  API_TO_DOMAIN_MODIFIER_MAP,
  DOMAIN_TO_API_STATUS_MAP,
  DOMAIN_TO_API_EXPEDITE_MAP,
  DOMAIN_TO_API_MODIFIER_MAP,
  isValidApiStatus,
  isValidApiExpediteType,
  isValidApiModifierType,
  isValidWizardStatus,
  isValidWizardExpediteType,
  isValidWizardModifierType,
} from '../types/enums.types';

import type {
  AllApiStatuses,
  AllApiExpediteTypes,
  AllApiModifierTypes,
  OrderDTOStatus,
  OrderDTOExpediteType,
  PriceModifierDTOType,
  OrderDetailedSummaryResponseExpediteType,
} from '../types/enums.types';

// ============= СТАТУСИ ЗАМОВЛЕНЬ =============

/**
 * Перетворює API статус у WizardOrderStatus (покращена версія)
 */
export function mapApiStatusToWizard(
  apiStatus: AllApiStatuses | undefined | null
): WizardOrderStatus {
  if (!apiStatus) {
    return WizardOrderStatus.DRAFT;
  }

  // Валідація вхідного значення
  if (!isValidApiStatus(apiStatus)) {
    console.warn(`[OrderEnumMapper] Невідомий API статус: ${apiStatus}`);
    return WizardOrderStatus.DRAFT;
  }

  // Використовуємо константу для маппінгу
  return API_TO_DOMAIN_STATUS_MAP[apiStatus as unknown as ApiOrderStatus];
}

/**
 * Перетворює WizardOrderStatus у API статус для OrderDTO
 */
export function mapWizardStatusToOrderDTO(
  wizardStatus: WizardOrderStatus | undefined | null
): OrderDTOStatus | undefined {
  if (!wizardStatus) {
    return undefined;
  }

  // Валідація вхідного значення
  if (!isValidWizardStatus(wizardStatus)) {
    console.warn(`[OrderEnumMapper] Невідомий wizard статус: ${wizardStatus}`);
    return undefined;
  }

  // Використовуємо константу для маппінгу
  return DOMAIN_TO_API_STATUS_MAP[wizardStatus] as unknown as OrderDTOStatus;
}

/**
 * Перетворює WizardOrderStatus у API статус для OrderDetailedSummaryResponse
 * Примітка: OrderDetailedSummaryResponse не має поля status, використовуємо загальну функцію
 * @deprecated Використовуйте mapWizardStatusToOrderDTO замість цього
 */
export const mapWizardStatusToOrderDetailedResponse = mapWizardStatusToOrderDTO;

// ============= ТИПИ ТЕРМІНОВОСТІ =============

/**
 * Перетворює API тип терміновості у WizardExpediteType (покращена версія)
 */
export function mapApiExpediteTypeToWizard(
  apiType: AllApiExpediteTypes | undefined | null
): WizardExpediteType {
  if (!apiType) {
    return WizardExpediteType.STANDARD;
  }

  // Валідація вхідного значення
  if (!isValidApiExpediteType(apiType)) {
    console.warn(`[OrderEnumMapper] Невідомий API тип терміновості: ${apiType}`);
    return WizardExpediteType.STANDARD;
  }

  // Використовуємо константу для маппінгу
  return API_TO_DOMAIN_EXPEDITE_MAP[apiType as unknown as ApiExpediteType];
}

/**
 * Перетворює WizardExpediteType у API тип для OrderDTO
 */
export function mapWizardExpediteTypeToOrderDTO(
  wizardType: WizardExpediteType | undefined | null
): OrderDTOExpediteType | undefined {
  if (!wizardType) {
    return undefined;
  }

  // Валідація вхідного значення
  if (!isValidWizardExpediteType(wizardType)) {
    console.warn(`[OrderEnumMapper] Невідомий wizard тип терміновості: ${wizardType}`);
    return undefined;
  }

  // Використовуємо константу для маппінгу
  return DOMAIN_TO_API_EXPEDITE_MAP[wizardType] as unknown as OrderDTOExpediteType;
}

/**
 * Перетворює WizardExpediteType у API тип для OrderDetailedSummaryResponse
 */
export function mapWizardExpediteTypeToOrderDetailedResponse(
  wizardType: WizardExpediteType | undefined | null
): OrderDetailedSummaryResponseExpediteType | undefined {
  if (!wizardType) {
    return undefined;
  }

  // Валідація вхідного значення
  if (!isValidWizardExpediteType(wizardType)) {
    console.warn(`[OrderEnumMapper] Невідомий wizard тип терміновості: ${wizardType}`);
    return undefined;
  }

  // Використовуємо константу для маппінгу
  return DOMAIN_TO_API_EXPEDITE_MAP[
    wizardType
  ] as unknown as OrderDetailedSummaryResponseExpediteType;
}

// ============= ТИПИ МОДИФІКАТОРІВ ЦІН =============

/**
 * Перетворює API тип модифікатора у WizardPriceModifierType (покращена версія)
 */
export function mapApiModifierTypeToWizard(
  apiType: AllApiModifierTypes | undefined | null
): WizardPriceModifierType {
  if (!apiType) {
    return WizardPriceModifierType.PERCENTAGE;
  }

  // Валідація вхідного значення
  if (!isValidApiModifierType(apiType)) {
    console.warn(`[OrderEnumMapper] Невідомий API тип модифікатора: ${apiType}`);
    return WizardPriceModifierType.PERCENTAGE;
  }

  // Використовуємо константу для маппінгу
  return API_TO_DOMAIN_MODIFIER_MAP[apiType as unknown as ApiPriceModifierType];
}

/**
 * Перетворює WizardPriceModifierType у API тип для PriceModifierDTO
 */
export function mapWizardModifierTypeToPriceModifierDTO(
  wizardType: WizardPriceModifierType | undefined | null
): PriceModifierDTOType | undefined {
  if (!wizardType) {
    return undefined;
  }

  // Валідація вхідного значення
  if (!isValidWizardModifierType(wizardType)) {
    console.warn(`[OrderEnumMapper] Невідомий wizard тип модифікатора: ${wizardType}`);
    return undefined;
  }

  // Використовуємо константу для маппінгу
  return DOMAIN_TO_API_MODIFIER_MAP[wizardType] as unknown as PriceModifierDTOType;
}

// ============= УНІВЕРСАЛЬНІ МАППЕРИ =============

/**
 * Універсальний маппер з API в домен (працює з будь-яким API типом)
 */
export function mapAnyApiStatusToWizard(apiStatus: unknown): WizardOrderStatus {
  if (!isValidApiStatus(apiStatus)) {
    return WizardOrderStatus.DRAFT;
  }

  return mapApiStatusToWizard(apiStatus);
}

/**
 * Універсальний маппер з API в домен для типів терміновості
 */
export function mapAnyApiExpediteTypeToWizard(apiType: unknown): WizardExpediteType {
  if (!isValidApiExpediteType(apiType)) {
    return WizardExpediteType.STANDARD;
  }

  return mapApiExpediteTypeToWizard(apiType);
}

/**
 * Універсальний маппер з API в домен для типів модифікаторів
 */
export function mapAnyApiModifierTypeToWizard(apiType: unknown): WizardPriceModifierType {
  if (!isValidApiModifierType(apiType)) {
    return WizardPriceModifierType.PERCENTAGE;
  }

  return mapApiModifierTypeToWizard(apiType);
}

// ============= УТИЛІТАРНІ ФУНКЦІЇ =============

/**
 * Отримує всі доступні статуси для wizard домену
 */
export function getAvailableWizardStatuses(): WizardOrderStatus[] {
  return Object.values(WizardOrderStatus);
}

/**
 * Отримує всі доступні типи терміновості для wizard домену
 */
export function getAvailableWizardExpediteTypes(): WizardExpediteType[] {
  return Object.values(WizardExpediteType);
}

/**
 * Отримує всі доступні типи модифікаторів для wizard домену
 */
export function getAvailableWizardModifierTypes(): WizardPriceModifierType[] {
  return Object.values(WizardPriceModifierType);
}

/**
 * Отримує всі доступні API статуси
 */
export function getAvailableApiStatuses(): ApiOrderStatus[] {
  return Object.values(ApiOrderStatus);
}

/**
 * Отримує всі доступні API типи терміновості
 */
export function getAvailableApiExpediteTypes(): ApiExpediteType[] {
  return Object.values(ApiExpediteType);
}

/**
 * Отримує всі доступні API типи модифікаторів
 */
export function getAvailableApiModifierTypes(): ApiPriceModifierType[] {
  return Object.values(ApiPriceModifierType);
}

// ============= ЕКСПОРТ LEGACY ФУНКЦІЙ (для зворотної сумісності) =============

/**
 * @deprecated Використовуйте mapApiStatusToWizard замість цього
 */
export const mapOrderStatus = mapApiStatusToWizard;

/**
 * @deprecated Використовуйте mapApiExpediteTypeToWizard замість цього
 */
export const mapExpediteType = mapApiExpediteTypeToWizard;

/**
 * @deprecated Використовуйте mapApiModifierTypeToWizard замість цього
 */
export const mapModifierTypeToDomain = mapApiModifierTypeToWizard;
