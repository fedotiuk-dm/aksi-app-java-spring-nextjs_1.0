/**
 * @fileoverview Хуки етапу вибору клієнта (DDD архітектура)
 * @module domain/wizard/hooks/steps/client-selection
 *
 * Експорт хуків для етапу 1 Order Wizard:
 * - Пошук клієнтів з пагінацією
 * - Створення нових клієнтів з валідацією
 * - Вибір клієнта для замовлення
 */

// === ХУКИ ЕТАПУ 1: ВИБІР КЛІЄНТА ===
export { useClientSearch } from './use-client-search.hook';
export { useClientForm } from './use-client-form.hook';
export { useClientSelection } from './use-client-selection.hook';

// === ЕКСПОРТ ТИПІВ ===
export type { ClientSearchResult } from '../../../types';
export type {
  ClientSearchPageResult,
  CreateClientData,
  DuplicateCheckResult,
  ClientCreationResult,
  ClientSelectionResult,
  ClientValidationResult,
} from '../../../services';
