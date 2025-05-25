/**
 * @fileoverview Адаптер пагінації API → Domain (SOLID рефакторинг)
 * @module domain/wizard/adapters
 */

// Експорт композиційного адаптера з модульної структури
export { PaginationAdapter } from './pagination-adapters';

// Експорт спеціалізованих адаптерів для прямого використання
export { PaginationMappingAdapter, PaginationUtilitiesAdapter } from './pagination-adapters';

// Експорт типів
export type {
  PaginatedDomainResponse,
  PaginationParams,
  PaginationMetadata,
  PaginationDomainTypes,
  WizardPaginatedDomainResponse,
  WizardPaginationParams,
  WizardPaginationMetadata,
} from './pagination-adapters';
