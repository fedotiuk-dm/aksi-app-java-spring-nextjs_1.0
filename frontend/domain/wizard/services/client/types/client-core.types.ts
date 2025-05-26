/**
 * @fileoverview Основні доменні типи клієнтів
 * @module domain/wizard/services/client/types/client-core
 */

import type { ContactMethod, ReferralSource } from './client-enums.types';

/**
 * Доменна модель клієнта
 */
export interface ClientDomain {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: AddressDomain;
  contactMethods: ContactMethod[];
  referralSource?: ReferralSource;
  category?: ClientCategory;
  preferences?: ClientPreferences;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Доменна модель адреси
 */
export interface AddressDomain {
  street: string;
  city: string;
  zipCode?: string;
  country?: string;
}

/**
 * Категорія клієнта
 */
export interface ClientCategory {
  id: string;
  name: string;
  discountPercentage?: number;
}

/**
 * Налаштування клієнта
 */
export interface ClientPreferences {
  preferredContactMethod: ContactMethod;
  notifications: boolean;
  marketing: boolean;
}
