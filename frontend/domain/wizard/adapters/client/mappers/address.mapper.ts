/**
 * @fileoverview Маппер для адрес клієнтів
 * @module domain/wizard/adapters/client/mappers
 */

import { AddressDTO } from '@/lib/api';

import { WizardClientAddress } from '../types';

/**
 * Перетворює AddressDTO у WizardClientAddress
 */
export function mapAddressDTOToDomain(apiAddress?: AddressDTO): WizardClientAddress | undefined {
  if (!apiAddress) return undefined;

  return {
    street: apiAddress.street,
    city: apiAddress.city,
    state: undefined, // API не має поля state
    zipCode: apiAddress.postalCode, // посилання на postalCode з API
    country: undefined, // API не має поля country
  };
}

/**
 * Перетворює WizardClientAddress у AddressDTO
 */
export function mapAddressDomainToDTO(domainAddress?: WizardClientAddress): AddressDTO | undefined {
  if (!domainAddress) return undefined;

  return {
    street: domainAddress.street,
    city: domainAddress.city,
    postalCode: domainAddress.zipCode, // маппимо zipCode в postalCode
  };
}
