/**
 * @fileoverview Експорт адаптерів пагінації
 * @module domain/wizard/adapters/pagination-adapters
 */

export { PaginationMappingAdapter } from './mapping.adapter';
export { PaginationUtilitiesAdapter } from './utilities.adapter';

// Композиційний адаптер для зворотної сумісності
export { PaginationAdapter } from './pagination.adapter';

// Експорт типів
export type { PaginatedDomainResponse } from './mapping.adapter';
export type { PaginationParams, PaginationMetadata } from './utilities.adapter';

// Групування типів для зручності
import type { PaginatedDomainResponse } from './mapping.adapter';
import type { PaginationParams, PaginationMetadata } from './utilities.adapter';

export type PaginationDomainTypes = {
  PaginatedDomainResponse: PaginatedDomainResponse<any>;
  PaginationParams: PaginationParams;
  PaginationMetadata: PaginationMetadata;
};

// Експорт для зворотної сумісності
export type { PaginatedDomainResponse as WizardPaginatedDomainResponse } from './mapping.adapter';
export type { PaginationParams as WizardPaginationParams } from './utilities.adapter';
export type { PaginationMetadata as WizardPaginationMetadata } from './utilities.adapter';
