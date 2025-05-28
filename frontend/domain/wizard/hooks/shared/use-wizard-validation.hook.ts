/**
 * @fileoverview Загальний валідаційний хук для wizard
 * @module domain/wizard/hooks/shared
 */

import { useCallback, useMemo } from 'react';
import { z } from 'zod';

import {
  clientManagementSchema,
  branchSelectionSchema,
  completeItemSchema,
  orderParamsStage3Schema,
} from '../../schemas';
import { useWizardStore } from '../../store';
import { WizardStep } from '../../types';

/**
 * Результат валідації кроку
 */
interface StepValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Загальний валідаційний хук для wizard
 * ✅ Централізована валідація всіх кроків
 */
export const useWizardValidation = () => {
  const {
    selectedBranch,
    // TODO: додати wizardItems коли буде готово
    // TODO: додати orderParameters коли буде готово
  } = useWizardStore();

  // ✅ Валідація кроку "Вибір клієнта"
  const validateClientStep = useCallback((): StepValidationResult => {
    // TODO: валідація клієнта коли буде clientData у сторі
    return {
      isValid: true, // TODO: замінити на реальну валідацію
      errors: [],
      warnings: [],
    };
  }, []);

  // ✅ Валідація кроку "Вибір філії"
  const validateBranchStep = useCallback((): StepValidationResult => {
    try {
      branchSelectionSchema.parse({ selectedBranch });
      return {
        isValid: true,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map((e) => e.message),
          warnings: [],
        };
      }
      return {
        isValid: false,
        errors: ['Оберіть філію для продовження'],
        warnings: [],
      };
    }
  }, [selectedBranch]);

  // ✅ Валідація кроку "Менеджер предметів"
  const validateItemsStep = useCallback((): StepValidationResult => {
    // TODO: реалізувати коли буде wizardItems у сторі
    return {
      isValid: true, // TODO: замінити на реальну валідацію
      errors: [],
      warnings: [],
    };
  }, []);

  // ✅ Валідація кроку "Параметри замовлення"
  const validateOrderParametersStep = useCallback((): StepValidationResult => {
    // TODO: реалізувати коли буде orderParameters у сторі
    return {
      isValid: true, // TODO: замінити на реальну валідацію
      errors: [],
      warnings: [],
    };
  }, []);

  // ✅ Валідація конкретного кроку
  const validateStep = useCallback(
    (step: WizardStep): StepValidationResult => {
      switch (step) {
        case WizardStep.CLIENT_SELECTION:
          return validateClientStep();
        case WizardStep.BRANCH_SELECTION:
          return validateBranchStep();
        case WizardStep.ITEM_MANAGER:
          return validateItemsStep();
        case WizardStep.ORDER_PARAMETERS:
          return validateOrderParametersStep();
        case WizardStep.CONFIRMATION:
          // Підтвердження не потребує додаткової валідації
          return { isValid: true, errors: [], warnings: [] };
        default:
          return { isValid: false, errors: ['Невідомий крок'], warnings: [] };
      }
    },
    [validateClientStep, validateBranchStep, validateItemsStep, validateOrderParametersStep]
  );

  // ✅ Валідація всього wizard
  const validateEntireWizard = useCallback(() => {
    const allSteps = Object.values(WizardStep);
    const results = allSteps.map((step) => ({
      step,
      ...validateStep(step),
    }));

    const allErrors = results.flatMap((r) => r.errors);
    const allWarnings = results.flatMap((r) => r.warnings);

    return {
      isValid: results.every((r) => r.isValid),
      errors: allErrors,
      warnings: allWarnings,
      stepResults: results,
    };
  }, [validateStep]);

  // 📊 Стан валідації для всіх кроків
  const validationStatus = useMemo(() => {
    const steps = Object.values(WizardStep);
    return steps.reduce(
      (acc, step) => {
        acc[step] = validateStep(step);
        return acc;
      },
      {} as Record<WizardStep, StepValidationResult>
    );
  }, [validateStep]);

  // 🔍 Утиліти
  const isStepValid = useCallback(
    (step: WizardStep): boolean => {
      return validateStep(step).isValid;
    },
    [validateStep]
  );

  const getStepErrors = useCallback(
    (step: WizardStep): string[] => {
      return validateStep(step).errors;
    },
    [validateStep]
  );

  const getStepWarnings = useCallback(
    (step: WizardStep): string[] => {
      return validateStep(step).warnings;
    },
    [validateStep]
  );

  return {
    // ✅ Валідація кроків
    validateStep,
    validateEntireWizard,

    // 📊 Стан валідації
    validationStatus,

    // 🔍 Утиліти
    isStepValid,
    getStepErrors,
    getStepWarnings,

    // ✅ Прямі валідатори
    validateClientStep,
    validateBranchStep,
    validateItemsStep,
    validateOrderParametersStep,
  };
};
