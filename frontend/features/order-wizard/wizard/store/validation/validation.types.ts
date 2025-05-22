import { WizardStep } from '../navigation/navigation.types';

/**
 * Статус валідації окремого кроку
 */
export enum ValidationStatus {
  INVALID = 'invalid', // Дані невалідні, переходити далі не можна
  VALID = 'valid', // Дані валідні, можна переходити далі
  PENDING = 'pending', // Валідація в процесі (наприклад, асинхронна перевірка)
  NOT_STARTED = 'not_started', // Валідація ще не починалася (наприклад, для кроків, які ще не були відвідані)
}

/**
 * Тип для помилок валідації кроку
 */
export type ValidationErrors = {
  [key: string]: string | string[] | ValidationErrors;
};

/**
 * Стан валідації для конкретного кроку
 */
export type StepValidation = {
  status: ValidationStatus;
  errors: ValidationErrors;
  isComplete: boolean; // Чи повністю заповнені обов'язкові поля на цьому кроці
  timestamp: number; // Час останньої валідації
};

/**
 * Мапа валідації для всіх кроків
 */
export type ValidationMap = {
  [key in WizardStep]?: StepValidation;
};

/**
 * Загальний стан валідації для OrderWizard
 */
export interface ValidationState {
  validationMap: ValidationMap;
  isWizardValid: boolean; // Чи валідний весь візард (всі відвідані кроки)
  activeValidation: boolean; // Чи активна валідація в даний момент
}

/**
 * Дії для управління валідацією
 */
export type ValidationActions = {
  setStepValidation: (step: WizardStep, validation: StepValidation) => void;
  validateStep: (step: WizardStep, forcedStatus?: ValidationStatus) => void;
  resetStepValidation: (step: WizardStep) => void;
  resetAllValidation: () => void;
  updateWizardValidStatus: () => void;
};

/**
 * Повний тип стору валідації
 */
export type ValidationStore = ValidationState & ValidationActions;
