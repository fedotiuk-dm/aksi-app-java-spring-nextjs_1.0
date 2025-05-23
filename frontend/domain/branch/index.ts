/**
 * Публічне API домену Branch
 * Експортує тільки ті елементи, які повинні бути доступні ззовні
 *
 * Принципи DDD та SOLID:
 * - Interface Segregation: експортуємо тільки необхідні API
 * - Dependency Inversion: інкапсулюємо внутрішні деталі реалізації
 * - Single Responsibility: кожен експорт має чітку відповідальність
 *
 * ✅ ПОВНА РЕАЛІЗАЦІЯ OpenAPI для BranchLocations:
 * - getAllBranchLocations (з фільтром active)
 * - getBranchLocationById
 * - getBranchLocationByCode
 * - createBranchLocation
 * - updateBranchLocation
 * - setActiveStatus
 * - deleteBranchLocation
 */

// === ТИПИ ===
// Основні доменні типи
export type {
  Branch,
  BranchSearchParams,
  BranchSearchResult,
  BranchOperationResult,
  BranchOperationErrors,
  BranchStatistics,
} from './types/branch.types';

// Типи форм
export type {
  CreateBranchFormData,
  UpdateBranchFormData,
  CreateBranchResult,
  UpdateBranchResult,
  BranchFormErrors,
} from './types/branch-form.types';

// === СУТНОСТІ ===
export { BranchEntity } from './entities';

// === СХЕМИ ВАЛІДАЦІЇ ===
export {
  branchSchema,
  createBranchSchema,
  updateBranchSchema,
  branchSearchSchema,
  branchFilterSchema,
} from './schemas';

export type {
  BranchSchemaType,
  CreateBranchSchemaType,
  UpdateBranchSchemaType,
  BranchSearchSchemaType,
  BranchFilterSchemaType,
} from './schemas';

// === УТИЛІТИ ===
export { BranchAdapter } from './utils';

// === РЕПОЗИТОРІЇ ===
// Експортуємо тільки інтерфейс, а не реалізацію (Dependency Inversion)
export type { IBranchRepository } from './repositories';
// Експортуємо реалізацію для DI контейнерів або прямого використання
export { BranchRepository } from './repositories';

// === ХУКИ ===
// Основний хук для роботи з доменом branch
export { useBranchSelection } from './hooks';

// === STORES (необов'язково експортувати, хуки інкапсулюють доступ) ===
// Експортуємо для випадків коли потрібен прямий доступ до стору
export { useBranchSelectionStore } from './store';
