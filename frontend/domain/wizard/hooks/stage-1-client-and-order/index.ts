/**
 * @fileoverview Публічне API для хуків Stage 1 - Client and Order
 *
 * Експорт спрощених хуків, що використовують Orval + Zod безпосередньо
 */

// === СПРОЩЕНІ ХУКИ (НОВА АРХІТЕКТУРА) ===
export {
  useClientOperations,
  useClientDetails,
  useQuickClientSearch,
} from './use-client-operations.hook';

// === СКЛАДНИЙ ХУК (СТАРША АРХІТЕКТУРА) ===
export {
  useClientApiOperations,
  type ClientSearchState,
  type ClientOperationsState,
} from './use-client-api-operations.hook';

// === BACKWARD COMPATIBILITY ===
// Перехідні експорти для існуючого UI
export { useClientOperations as useClientSearch } from './use-client-operations.hook';
export { useClientOperations as useClientCreation } from './use-client-operations.hook';
export { useClientOperations as useClientSelection } from './use-client-operations.hook';
