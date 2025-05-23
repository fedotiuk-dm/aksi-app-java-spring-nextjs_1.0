import { WizardEntity } from '../../entities';
import { NavigationDirection, NavigationResult, WizardStep } from '../../types';

/**
 * Store Error Handler
 * Helper для уніфікованого обробки помилок у wizard stores
 *
 * SOLID принципи:
 * - Single Responsibility: тільки error handling логіка
 * - DRY: уникаємо дублювання try-catch блоків
 */

/**
 * Error constants
 */
export const STORE_ERRORS = {
  WIZARD_NOT_INITIALIZED: 'Wizard не ініціалізований',
  OPERATION_FAILED: 'Операція не вдалася',
} as const;

/**
 * Generic error handler for store operations
 */
export interface StoreOperation<T = void> {
  (): T;
}

/**
 * Store error context
 */
export interface StoreErrorContext {
  wizard: WizardEntity | null;
  setError: (error: string | null) => void;
  updateLastSaved?: () => void;
}

/**
 * Safe execution wrapper для store operations
 */
export const executeSafely = <T>(
  operation: StoreOperation<T>,
  context: StoreErrorContext,
  errorMessage: string = STORE_ERRORS.OPERATION_FAILED
): T | null => {
  try {
    const result = operation();
    context.setError(null);
    context.updateLastSaved?.();
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : errorMessage;
    context.setError(message);
    return null;
  }
};

/**
 * Navigation-specific error handler
 */
export const executeNavigationSafely = (
  operation: StoreOperation<void>,
  context: StoreErrorContext,
  fromStep: WizardStep,
  toStep: WizardStep,
  direction: NavigationDirection,
  errorMessage: string
): NavigationResult => {
  try {
    operation();
    context.setError(null);
    context.updateLastSaved?.();

    return {
      success: true,
      fromStep,
      toStep,
      direction,
      timestamp: Date.now(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : errorMessage;
    context.setError(message);

    return {
      success: false,
      errors: [message],
      fromStep,
      toStep,
      direction,
      timestamp: Date.now(),
    };
  }
};

/**
 * Wizard validation helper
 */
export const validateWizardExists = (
  wizard: WizardEntity | null,
  setError: (error: string) => void
): wizard is WizardEntity => {
  if (!wizard) {
    setError(STORE_ERRORS.WIZARD_NOT_INITIALIZED);
    return false;
  }
  return true;
};
