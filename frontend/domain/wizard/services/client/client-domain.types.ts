/**
 * @fileoverview Доменні типи для клієнтів
 * @module domain/wizard/services/client/domain-types
 */

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
 * Способи зв'язку
 */
export type ContactMethod = 'PHONE' | 'SMS' | 'VIBER' | 'EMAIL';

/**
 * Джерела інформації
 */
export type ReferralSource = 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER';

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

/**
 * Параметри пошуку клієнтів
 */
export interface ClientSearchDomainParams {
  query?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  page?: number;
  size?: number;
}

/**
 * Результат пошуку клієнтів
 */
export interface ClientSearchDomainResult {
  clients: ClientDomain[];
  total: number;
  page: number;
  size: number;
  hasMore: boolean;
}
