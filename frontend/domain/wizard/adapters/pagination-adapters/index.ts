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
