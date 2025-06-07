/**
 * @fileoverview Експорт хуків для етапу 1: Клієнт та базова інформація замовлення
 *
 * Цей етап включає:
 * - Пошук існуючих клієнтів
 * - Створення нових клієнтів
 * - Оновлення клієнтів
 * - Вибір філії прийому
 * - Базову інформацію замовлення
 */

// =====================================
// Хуки для роботи з клієнтами
// =====================================

export { useClientSearch } from './useClientSearch';
export { useClientCreate } from './useClientCreate';
export { useClientUpdate } from './useClientUpdate';
export { useClientSelection } from './useClientSelection';

// =====================================
// Хуки для базової інформації замовлення
// =====================================

export { useOrderBasicInfo } from './useOrderBasicInfo';
export { useReceiptNumberGeneration } from './useReceiptNumberGeneration';
export { useUniqueTagValidation } from './useUniqueTagValidation';

// =====================================
// Хуки для філій
// =====================================

export { useBranchLocations } from './useBranchLocations';

// =====================================
// Типи
// =====================================

export type {
  // Клієнти
  Client,
  CreateClientData,
  UpdateClientData,
  ClientSearchParams,
  ClientSearchRequestData,
  UseClientSearchReturn,
  UseClientCreateReturn,
  UseClientUpdateReturn,
  UseClientSelectionReturn,

  // Базова інформація замовлення
  OrderBasicInfo,
  UseOrderBasicInfoReturn,
  UseReceiptNumberGenerationReturn,
  UseUniqueTagValidationReturn,

  // Філії
  BranchLocation,
  UseBranchLocationsReturn,
} from './types';
