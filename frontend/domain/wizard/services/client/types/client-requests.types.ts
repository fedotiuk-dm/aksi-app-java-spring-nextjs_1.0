/**
 * @fileoverview Типи запитів для клієнтів
 * @module domain/wizard/services/client/types/client-requests
 */

import type { AddressDomain, ClientPreferences } from './client-core.types';
import type { ContactMethod, ReferralSource } from './client-enums.types';

/**
 * Запит на створення клієнта
 */
export interface CreateClientDomainRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: AddressDomain;
  contactMethods: ContactMethod[];
  referralSource?: ReferralSource;
  referralSourceOther?: string;
}

/**
 * Запит на оновлення клієнта
 */
export interface UpdateClientDomainRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: AddressDomain;
  contactMethods?: ContactMethod[];
  preferences?: Partial<ClientPreferences>;
}
