/**
 * @fileoverview Експорт адаптерів клієнтів
 * @module domain/wizard/adapters/client-adapters
 */

export { ClientMappingAdapter } from './mapping.adapter';
export { ClientApiOperationsAdapter } from './api-operations.adapter';

// Композиційний адаптер для зворотної сумісності
export { ClientAdapter } from './client.adapter';

// Експорт типів з wizard domain
export type { ClientSearchResult } from '../../types';

// Групування типів для зручності
import type { ClientSearchResult } from '../../types';

export type ClientDomainTypes = {
  ClientSearchResult: ClientSearchResult;
};

// Експорт для зворотної сумісності
export type { ClientSearchResult as WizardClientSearchResult } from '../../types';
