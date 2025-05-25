/**
 * @fileoverview Експорт адаптерів клієнтів
 * @module domain/wizard/adapters/client-adapters
 */

export { ClientMappingAdapter } from './mapping.adapter';
export { ClientApiOperationsAdapter } from './api-operations.adapter';

// Композиційний адаптер для зворотної сумісності
export { ClientAdapter } from './client.adapter';

// Групування типів адаптера (БЕЗ реекспорту доменних типів)
import type { ClientSearchResult } from '../../types';

export type ClientDomainTypes = {
  ClientSearchResult: ClientSearchResult;
};

// Експорт для зворотної сумісності (тільки аліаси)
export type { ClientSearchResult as WizardClientSearchResult } from '../../types';
