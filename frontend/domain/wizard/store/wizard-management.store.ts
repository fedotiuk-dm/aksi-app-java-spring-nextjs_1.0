import { WizardStep, WizardMode, WizardStatus, WizardContext } from '../types';

/**
 * Wizard Management Store
 * Спеціалізований store для загального управління wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки управлінські операції
 * - Open/Closed: легко розширюється новими управлінськими функціями
 * - Interface Segregation: мінімальний API для управління
 */

/**
 * Domain Constants для управління
 */
export const MANAGEMENT_ERRORS = {
  INITIALIZATION_FAILED: 'Помилка ініціалізації wizard',
  INVALID_CONTEXT: 'Невірний контекст wizard',
  UPDATE_FAILED: 'Помилка оновлення wizard',
} as const;

/**
 * Управлінські дії Wizard Store
 */
export interface WizardManagementActions {
  // Lifecycle
  initialize: (context: WizardContext) => void;
  reset: () => void;

  // State management
  updateStepAvailability: (step: WizardStep, isAvailable: boolean) => void;
  changeMode: (mode: WizardMode) => void;
  updateStatus: (status: WizardStatus) => void;
}

/**
 * Helper: валідація контексту wizard
 */
export const validateWizardContext = (
  context: WizardContext
): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!Object.values(WizardMode).includes(context.mode)) {
    errors.push(`Невірний режим: ${context.mode}`);
  }

  if (context.mode === WizardMode.EDIT && !context.orderId) {
    errors.push('Для режиму EDIT необхідний orderId');
  }

  if (!context.metadata || typeof context.metadata !== 'object') {
    errors.push("Metadata має бути об'єктом");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Helper: перевірка необхідності ініціалізації
 */
export const shouldReinitialize = (
  currentContext: WizardContext | undefined,
  newContext: WizardContext
): boolean => {
  if (!currentContext) return true;

  return (
    currentContext.mode !== newContext.mode ||
    currentContext.orderId !== newContext.orderId ||
    currentContext.customerId !== newContext.customerId
  );
};
