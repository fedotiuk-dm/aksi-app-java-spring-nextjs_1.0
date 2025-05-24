/**
 * Публічне API для всіх утиліт wizard домену
 * Експорт тільки найважливіших утиліт для зовнішнього використання
 */

// === ГЕНЕРАЦІЯ ІДЕНТИФІКАТОРІВ ===
export {
  generateId,
  generateReceiptNumber,
  generateSessionId,
  generateUniqueOrderLabel,
} from './generators/id-generators.utils';

// === ФОРМАТУВАННЯ ДАНИХ ===
export {
  formatDate,
  formatDateTime,
  formatPrice,
  formatPhone,
  formatPercentage,
  formatQuantity,
} from './formatters/data-formatters.utils';

// === РОЗРАХУНОК ПРОГРЕСУ ===
export {
  calculateWizardProgress,
  calculateItemWizardProgress,
  calculateStepProgress,
  calculateWeightedProgress,
} from './progress/progress-calculators.utils';

// === ВАЛІДАЦІЯ КРОКІВ ===
export {
  isStepValid,
  getAllValidationErrors,
  canProceedToNextStep,
  getStepValidationErrors,
  areRequiredStepsValid,
  getValidStepsCount,
  hasCriticalErrors,
} from './validation/step-validators.utils';

// === НАВІГАЦІЯ КРОКІВ ===
export {
  getStepIndex,
  getItemStepIndex,
  getNextStep,
  getPrevStep,
  isStepRequired,
  calculateProgress,
} from './steps/wizard-steps-navigation.utils';

// === ОПТИМІЗАЦІЯ ПРОДУКТИВНОСТІ ===
export { debounce, throttle, memoize, delay, retry } from './performance/function-helpers.utils';

// === ОПЕРАЦІЇ ===
export {
  createOperationResult,
  createSuccessResult,
  createErrorResult,
  isOperationSuccess,
  getOperationErrors,
  getOperationWarnings,
  combineOperationResults,
} from './operations/operation-helpers.utils';

// === РОБОТА З ДАНИМИ ===
export { deepClone, isEmpty, get, set, deepMerge, compact } from './data/data-helpers.utils';
