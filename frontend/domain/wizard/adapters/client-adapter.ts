/**
 * @fileoverview Адаптер клієнтів API → Domain (SOLID рефакторинг)
 * @module domain/wizard/adapters
 */

// Експорт композиційного адаптера з модульної структури
export { ClientAdapter } from './client-adapters';

// Експорт спеціалізованих адаптерів для прямого використання
export { ClientMappingAdapter, ClientApiOperationsAdapter } from './client-adapters';

// Експорт типів (тільки ті, що доступні в підіндексі)
export type { ClientDomainTypes, WizardClientSearchResult } from './client-adapters';
