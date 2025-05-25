/**
 * @fileoverview Адаптер клієнтів API → Domain (SOLID рефакторинг)
 * @module domain/wizard/adapters
 */

// Експорт композиційного адаптера з модульної структури
export { ClientAdapter } from './client-adapters';

// Експорт спеціалізованих адаптерів для прямого використання
export { ClientMappingAdapter, ClientApiOperationsAdapter } from './client-adapters';

// Експорт типів
export type {
  ClientDomainTypes,
  ClientSearchResult,
  WizardClientSearchResult,
} from './client-adapters';
