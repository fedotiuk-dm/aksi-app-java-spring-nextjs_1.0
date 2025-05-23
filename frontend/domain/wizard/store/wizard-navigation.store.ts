import { WizardNavigationService } from '../services/wizard-navigation.service';
import { WizardStep, NavigationResult, NavigationDirection } from '../types';

/**
 * Wizard Navigation Store
 * Спеціалізований store для навігаційних операцій wizard
 *
 * SOLID принципи:
 * - Single Responsibility: тільки навігаційна логіка
 * - Open/Closed: легко розширюється новими методами навігації
 * - Dependency Inversion: залежить від navigation service абстракції
 */

/**
 * Domain Constants для навігації
 */
export const NAVIGATION_ERRORS = {
  WIZARD_NOT_INITIALIZED: 'Wizard не ініціалізований',
  NAVIGATION_FAILED: 'Помилка навігації',
  BACK_NAVIGATION_FAILED: 'Помилка повернення назад',
  FORWARD_NAVIGATION_FAILED: 'Помилка переходу вперед',
  NO_PREVIOUS_STEP: 'Немає попереднього кроку',
  NO_NEXT_STEP: 'Немає наступного кроку',
} as const;

/**
 * Навігаційні дії Wizard Store
 */
export interface WizardNavigationActions {
  // Навігація між кроками
  goToStep: (step: WizardStep) => NavigationResult;
  goBack: () => NavigationResult;
  goForward: () => NavigationResult;

  // Сервісні навігаційні методи
  validateStep: (step: WizardStep) => boolean;
  calculateProgress: () => number;
}

/**
 * Helper Function: створення NavigationResult для помилок
 * DDD принцип: Value Object Factory
 */
export const createErrorNavigationResult = (
  error: string,
  fromStep: WizardStep,
  toStep: WizardStep,
  direction: NavigationDirection
): NavigationResult => ({
  success: false,
  fromStep,
  toStep,
  direction,
  errors: [error],
  timestamp: Date.now(),
});

/**
 * Helper Function: створення успішного NavigationResult
 * DDD принцип: Value Object Factory
 */
export const createSuccessNavigationResult = (
  fromStep: WizardStep,
  toStep: WizardStep,
  direction: NavigationDirection
): NavigationResult => ({
  success: true,
  fromStep,
  toStep,
  direction,
  timestamp: Date.now(),
});

/**
 * Factory для Navigation Service
 * SOLID принцип: Dependency Inversion через factory
 */
export const createNavigationService = (): WizardNavigationService => {
  return new WizardNavigationService();
};
