/**
 * Типи результатів операцій wizard - відповідальність за структури відповідей операцій
 */

/**
 * Базовий результат операції
 */
export interface WizardOperationResult<T = void> {
  success: boolean;
  data?: T;
  errors?: string[];
  warnings?: string[];
}

/**
 * Результат з часовими мітками
 */
export interface TimestampedOperationResult<T = void> extends WizardOperationResult<T> {
  timestamp: Date;
  executionTime: number; // в мілісекундах
}

/**
 * Результат операції збереження
 */
export interface SaveOperationResult extends WizardOperationResult<{ id: string }> {
  isDraft: boolean;
  conflictResolved?: boolean;
  backupCreated?: boolean;
}

/**
 * Результат операції валідації
 */
export interface ValidationOperationResult extends WizardOperationResult<void> {
  isValid: boolean;
  fieldErrors: Record<string, string[]>;
  globalErrors: string[];
  warnings: string[];
}

/**
 * Результат операції навігації
 */
export interface NavigationOperationResult extends WizardOperationResult<void> {
  canProceed: boolean;
  targetReached: boolean;
  blockedByValidation: boolean;
  requiredFields: string[];
}

/**
 * Результат асинхронної операції
 */
export interface AsyncOperationResult<T = void> extends WizardOperationResult<T> {
  isLoading: boolean;
  progress?: number;
  estimatedTime?: number;
}

/**
 * Результат операції з можливістю скасування
 */
export interface CancellableOperationResult<T = void> extends AsyncOperationResult<T> {
  canCancel: boolean;
  isCancelled: boolean;
  cancelReason?: string;
}
