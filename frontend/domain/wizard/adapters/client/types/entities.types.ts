/**
 * @fileoverview Сутності клієнтів для client адаптерів
 * @module domain/wizard/adapters/client/types
 */

import type {
  WizardClientAddress,
  WizardClientCategory,
  WizardClientPreference,
  ClientOrderSummary,
  WizardCommunicationChannel,
  WizardClientSource,
} from './base.types';

/**
 * Клієнт для wizard
 * Базується на ClientResponse з OpenAPI
 */
export interface WizardClient {
  readonly id: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly fullName: string;
  readonly phone: string;
  readonly email?: string;
  readonly address?: string;
  readonly structuredAddress?: WizardClientAddress;
  readonly communicationChannels: WizardCommunicationChannel[];
  readonly source?: WizardClientSource;
  readonly sourceDetails?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly category?: WizardClientCategory;
  readonly preferences: WizardClientPreference[];
  readonly recentOrders: ClientOrderSummary[];
  readonly orderCount: number;
}

/**
 * Дані для створення клієнта
 * Базується на CreateClientRequest з OpenAPI
 */
export interface WizardClientCreateData {
  readonly lastName: string;
  readonly firstName: string;
  readonly phone: string;
  readonly email?: string;
  readonly address?: string;
  readonly structuredAddress?: WizardClientAddress;
  readonly communicationChannels?: WizardCommunicationChannel[];
  readonly source?: WizardClientSource;
  readonly sourceDetails?: string;
}

/**
 * Дані для оновлення клієнта
 * Базується на UpdateClientRequest з OpenAPI
 */
export interface WizardClientUpdateData {
  readonly lastName?: string;
  readonly firstName?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly address?: string;
  readonly structuredAddress?: WizardClientAddress;
  readonly communicationChannels?: WizardCommunicationChannel[];
  readonly source?: WizardClientSource;
  readonly sourceDetails?: string;
}
