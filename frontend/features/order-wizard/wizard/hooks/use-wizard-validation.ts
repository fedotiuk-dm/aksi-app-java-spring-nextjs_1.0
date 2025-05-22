import { useCallback } from 'react';

import { WizardStep } from '../store/navigation';
import {
  useValidationStore,
  ValidationStatus,
  StepValidation,
  ValidationErrors,
} from '../store/validation';

/**
 * Хук для роботи з валідацією в OrderWizard
 * Надає зручний інтерфейс для керування валідацією кроків
 */
export const useWizardValidation = () => {
  const {
    validationMap,
    isWizardValid,
    activeValidation,
    setStepValidation,
    validateStep,
    resetStepValidation,
    resetAllValidation,
    updateWizardValidStatus,
  } = useValidationStore();

  /**
   * Отримання статусу валідації для конкретного кроку
   */
  const getStepValidation = useCallback(
    (step: WizardStep): StepValidation | undefined => {
      return validationMap[step];
    },
    [validationMap]
  );

  /**
   * Перевірка, чи валідний конкретний крок
   */
  const isStepValid = useCallback(
    (step: WizardStep): boolean => {
      const stepValidation = validationMap[step];
      return stepValidation?.status === ValidationStatus.VALID;
    },
    [validationMap]
  );

  /**
   * Перевірка, чи був крок вже раніше валідований
   */
  const isStepValidated = useCallback(
    (step: WizardStep): boolean => {
      return step in validationMap;
    },
    [validationMap]
  );

  /**
   * Створення об'єкта валідації для кроку
   */
  const createStepValidation = useCallback(
    (
      status: ValidationStatus,
      errors: ValidationErrors = {},
      isComplete: boolean = false
    ): StepValidation => {
      return {
        status,
        errors,
        isComplete,
        timestamp: Date.now(),
      };
    },
    []
  );

  /**
   * Встановлення валідного статусу для кроку
   */
  const setStepValid = useCallback(
    (step: WizardStep) => {
      const validation = createStepValidation(ValidationStatus.VALID, {}, true);
      setStepValidation(step, validation);
    },
    [createStepValidation, setStepValidation]
  );

  /**
   * Встановлення невалідного статусу для кроку з помилками
   */
  const setStepInvalid = useCallback(
    (step: WizardStep, errors: ValidationErrors) => {
      const validation = createStepValidation(ValidationStatus.INVALID, errors, false);
      setStepValidation(step, validation);
    },
    [createStepValidation, setStepValidation]
  );

  /**
   * Встановлення статусу "в процесі" для кроку (наприклад, під час асинхронної валідації)
   */
  const setStepPending = useCallback(
    (step: WizardStep) => {
      const currentValidation = validationMap[step];
      const validation = createStepValidation(
        ValidationStatus.PENDING,
        currentValidation?.errors || {},
        currentValidation?.isComplete || false
      );
      setStepValidation(step, validation);
    },
    [createStepValidation, setStepValidation, validationMap]
  );

  /**
   * Отримання помилок валідації для конкретного кроку
   */
  const getStepErrors = useCallback(
    (step: WizardStep): ValidationErrors => {
      return validationMap[step]?.errors || {};
    },
    [validationMap]
  );

  /**
   * Перевірка, чи є помилки валідації для конкретного кроку
   */
  const hasStepErrors = useCallback(
    (step: WizardStep): boolean => {
      const errors = getStepErrors(step);
      return Object.keys(errors).length > 0;
    },
    [getStepErrors]
  );

  return {
    // Стан
    validationMap,
    isWizardValid,
    activeValidation,

    // Утиліти та перевірки
    getStepValidation,
    isStepValid,
    isStepValidated,
    createStepValidation,
    getStepErrors,
    hasStepErrors,

    // Дії для встановлення статусу валідації
    setStepValid,
    setStepInvalid,
    setStepPending,
    validateStep,
    resetStepValidation,
    resetAllValidation,
    updateWizardValidStatus,
  };
};
