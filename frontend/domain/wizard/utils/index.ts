/**
 * @fileoverview Утиліти wizard домену
 * @module domain/wizard/utils
 *
 * Експорт утиліт для зовнішнього використання:
 * - Генерація ідентифікаторів
 * - Форматування даних
 * - Розрахунок прогресу
 * - Валідація кроків
 * - Навігація кроків
 * - Оптимізація продуктивності
 * - Операції з даними
 */

// === ГЕНЕРАЦІЯ ІДЕНТИФІКАТОРІВ ===
export {
  generateId,
  generateReceiptNumber,
  generateSessionId,
  generateUniqueOrderLabel,
} from './id-generators.utils';

// === ФОРМАТУВАННЯ ДАНИХ ===
export {
  formatDate,
  formatDateTime,
  formatPrice,
  formatPhone,
  formatPercentage,
  formatQuantity,
} from './data-formatters.utils';

// === РОЗРАХУНОК ПРОГРЕСУ ===
export {
  calculateWizardProgress,
  calculateItemWizardProgress,
  calculateStepProgress,
  calculateWeightedProgress,
} from './progress-calculators.utils';

// === ВАЛІДАЦІЯ КРОКІВ ===
export {
  isStepValid,
  getAllValidationErrors,
  canProceedToNextStep,
  getStepValidationErrors,
  areRequiredStepsValid,
  getValidStepsCount,
  hasCriticalErrors,
} from './step-validators.utils';

// === НАВІГАЦІЯ КРОКІВ ===
export {
  getStepIndex,
  getItemStepIndex,
  getNextStep,
  getPrevStep,
  isStepRequired,
  calculateProgress,
} from './wizard-steps-navigation.utils';

// === ОПТИМІЗАЦІЯ ПРОДУКТИВНОСТІ ===
export { debounce, throttle, memoize, delay, retry } from './function-helpers.utils';

// === ОПЕРАЦІЇ ===
export {
  createOperationResult,
  createSuccessResult,
  createErrorResult,
  isOperationSuccess,
  getOperationErrors,
  getOperationWarnings,
  combineOperationResults,
} from './operation-helpers.utils';

// === РОБОТА З ДАНИМИ ===
export { deepClone, isEmpty, get, set, deepMerge, compact } from './data-helpers.utils';
