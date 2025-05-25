/**
 * Режими роботи та статуси wizard - відповідальність за стани та режими роботи
 */

/**
 * Режим роботи wizard
 */
export enum WizardMode {
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

/**
 * Статус валідації кроку
 */
export enum ValidationStatus {
  PENDING = 'pending',
  VALID = 'valid',
  INVALID = 'invalid',
  NOT_VALIDATED = 'notValidated',
}

/**
 * Статус завершення кроку
 */
export enum StepCompletionStatus {
  NOT_STARTED = 'notStarted',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

/**
 * Загальний статус wizard
 */
export enum WizardStatus {
  INITIALIZING = 'initializing',
  ACTIVE = 'active',
  SAVING = 'saving',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ERROR = 'error',
}

/**
 * Статус збереження
 */
export enum SaveStatus {
  SAVED = 'saved',
  SAVING = 'saving',
  UNSAVED = 'unsaved',
  ERROR = 'error',
}
