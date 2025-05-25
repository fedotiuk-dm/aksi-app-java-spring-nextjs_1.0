/**
 * @fileoverview Інтерфейси навігації для сервісів
 * @module domain/wizard/services/interfaces/navigation
 */

/**
 * Напрямок навігації
 */
export type NavigationDirection = 'forward' | 'backward' | 'jump';

/**
 * Результат навігації
 */
export interface NavigationResult {
  success: boolean;
  currentStep: string;
  previousStep?: string;
  nextStep?: string;
  canGoBack: boolean;
  canGoForward: boolean;
  error?: string;
}

/**
 * Контекст навігації
 */
export interface NavigationContext {
  currentStep: string;
  availableSteps: string[];
  completedSteps: string[];
  blockedSteps: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Правило навігації
 */
export interface NavigationRule {
  fromStep: string;
  toStep: string;
  condition?: (context: NavigationContext) => boolean;
  message?: string;
}

/**
 * Інтерфейс навігатора
 */
export interface Navigator {
  canNavigate(from: string, to: string, context: NavigationContext): boolean;
  navigate(to: string, context: NavigationContext): NavigationResult;
  getNextStep(current: string, context: NavigationContext): string | null;
  getPreviousStep(current: string, context: NavigationContext): string | null;
}
