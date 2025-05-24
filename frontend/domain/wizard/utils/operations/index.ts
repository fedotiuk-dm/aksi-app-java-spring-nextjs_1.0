/**
 * Публічне API для утиліт операцій
 */

export {
  createOperationResult,
  createSuccessResult,
  createErrorResult,
  isOperationSuccess,
  getOperationErrors,
  getOperationWarnings,
  combineOperationResults,
} from './operation-helpers.utils';
