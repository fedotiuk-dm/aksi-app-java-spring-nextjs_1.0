/**
 * @fileoverview Публічне API для етапу 1: Клієнт та замовлення
 *
 * Експортує хуки та типи для управління:
 * - Вибором та створенням клієнтів (крок 1.1)
 * - Вибором філії та ініціалізацією замовлення (крок 1.2)
 * - Валідацією етапу
 */

// === КРОК 1.1: Вибір клієнта ===
export { useClientSelection } from './use-client-selection.hook';
export type {
  ClientCreationState,
  ClientSearchState,
  ClientSelectionValidation,
} from './use-client-selection.hook';

// === КРОК 1.2: Філія та ініціалізація замовлення ===
export { useBranchAndOrderInit } from './use-branch-and-order-init.hook';
export type {
  BranchLoadingState,
  OrderBasicInfo,
  BranchAndOrderValidation,
  BranchAndOrderState,
} from './use-branch-and-order-init.hook';
