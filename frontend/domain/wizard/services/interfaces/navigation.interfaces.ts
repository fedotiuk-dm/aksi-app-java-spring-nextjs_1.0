/**
 * @fileoverview Інтерфейси навігації для wizard сервісів
 * @module domain/wizard/services/interfaces/navigation
 */

import type { OperationResult } from './operation-result.interfaces';

/**
 * Крок wizard'а
 */
export interface WizardStep {
  id: string;
  name: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  isValid: boolean;
  isOptional?: boolean;
  order: number;
}

/**
 * Стан wizard'а
 */
export interface WizardState {
  currentStepId: string;
  steps: WizardStep[];
  isCompleted: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  progress: number; // 0-100
}

/**
 * Інтерфейс навігації wizard'а
 */
export interface WizardNavigation {
  getCurrentStep(): WizardStep | null;
  getNextStep(): WizardStep | null;
  getPreviousStep(): WizardStep | null;
  goToStep(stepId: string): Promise<OperationResult<boolean>>;
  goNext(): Promise<OperationResult<boolean>>;
  goPrevious(): Promise<OperationResult<boolean>>;
  canNavigateToStep(stepId: string): boolean;
  getProgress(): number;
  reset(): Promise<OperationResult<boolean>>;
}

/**
 * Конфігурація wizard'а
 */
export interface WizardConfig {
  allowSkipSteps?: boolean;
  allowBackNavigation?: boolean;
  validateOnNavigation?: boolean;
  autoSave?: boolean;
  saveInterval?: number;
}

/**
 * Контекст навігації
 */
export interface NavigationContext {
  fromStepId?: string;
  toStepId: string;
  direction: 'forward' | 'backward' | 'jump';
  data?: Record<string, unknown>;
}
