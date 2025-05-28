/**
 * @fileoverview Публічне API для хуків Stage 1 - Client and Order
 *
 * Експорт оновлених хуків, що використовують Orval + Zod + React Query
 * Замінює старі хуки новим централізованим API хуком
 */

// === ОСНОВНИЙ API ХУК ===
export {
  useClientApiOperations,
  type ClientSearchState,
  type ClientOperationsState,
} from './use-client-api-operations.hook';

// === BACKWARD COMPATIBILITY ===
// Перехідні експорти для існуючого UI (будуть видалені пізніше)
export { useClientApiOperations as useClientSearch } from './use-client-api-operations.hook';
export { useClientApiOperations as useClientCreation } from './use-client-api-operations.hook';
export { useClientApiOperations as useClientSelection } from './use-client-api-operations.hook';
