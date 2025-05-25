/**
 * @fileoverview Доменні сервіси wizard
 * @module domain/wizard/services
 *
 * Експорт доменних сервісів для бізнес-логіки wizard:
 * - Сервіс пошуку клієнтів
 * - Сервіс створення клієнтів
 * - Сервіс вибору клієнтів
 */

// === СЕРВІСИ ЕТАПУ 1: КЛІЄНТИ ===
export { ClientSearchService } from './client-search.service';
export { ClientCreationService } from './client-creation.service';
export { ClientSelectionService } from './client-selection.service';

// === ЕКСПОРТ ТИПІВ ===
export type { ClientSearchParams, ClientSearchPageResult } from './client-search.service';

export type {
  CreateClientData,
  DuplicateCheckResult,
  ClientCreationResult,
} from './client-creation.service';

export type { ClientSelectionResult, ClientValidationResult } from './client-selection.service';
