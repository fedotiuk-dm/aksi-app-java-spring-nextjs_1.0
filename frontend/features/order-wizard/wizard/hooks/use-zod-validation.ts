'use client';

import React, { useEffect } from 'react';
import { z } from 'zod';

import { useWizardNavigation } from './use-wizard-navigation';
import { useWizardValidation } from './use-wizard-validation';
import { WizardStep } from '../store/navigation/navigation.types';
import { ValidationErrors } from '../store/validation';

/**
 * Функція для конвертації помилок Zod у формат ValidationErrors
 */
function zodErrorsToValidationErrors<T>(
  zodErrors: z.ZodFormattedError<T, string> | Record<string, unknown>
): ValidationErrors {
  // Створюємо результат
  const result: ValidationErrors = {};

  // Додаємо загальні помилки, якщо вони є
  if ('_errors' in zodErrors && Array.isArray(zodErrors._errors)) {
    result._errors = zodErrors._errors;
  }

  // Обробляємо інші поля
  Object.entries(zodErrors).forEach(([key, value]) => {
    if (key === '_errors') return;

    if (typeof value === 'object' && value !== null) {
      if ('_errors' in value && Array.isArray(value._errors)) {
        result[key] = value._errors;
      } else {
        result[key] = zodErrorsToValidationErrors(value as Record<string, unknown>);
      }
    }
  });

  return result;
}

/**
 * Функція для валідації даних кроку із використанням Zod схеми
 *
 * @param step - крок майстра замовлень
 * @param data - дані для перевірки
 * @param schema - Zod схема для валідації
 */
export function validateWithZod<T>(
  step: WizardStep,
  data: T,
  schema: z.ZodType<T>
): { success: boolean; errors?: ValidationErrors } {
  try {
    schema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.format();
      return {
        success: false,
        errors: zodErrorsToValidationErrors(formattedErrors),
      };
    }
    return {
      success: false,
      errors: { _errors: ['Невідома помилка валідації'] },
    };
  }
}

/**
 * Хук для інтеграції Zod валідації з системою валідації візарда
 *
 * @param schema - Zod схема для валідації даних
 * @param data - дані для перевірки
 */
export function useZodValidation<T>(schema: z.ZodType<T>, data: T) {
  const { currentStep } = useWizardNavigation();
  const { setStepValid, setStepInvalid } = useWizardValidation();

  useEffect(() => {
    // Валідуємо дані при їх зміні
    const validate = () => {
      const result = validateWithZod<T>(currentStep, data, schema);

      if (result.success) {
        setStepValid(currentStep);
      } else {
        setStepInvalid(currentStep, result.errors || {});
      }

      return result;
    };

    // Валідуємо дані при монтуванні компонента та зміні залежностей
    validate();
  }, [currentStep, data, schema, setStepValid, setStepInvalid]);
}

/**
 * Типи пропсів для компонента-обгортки
 */
interface ZodValidationWrapperProps<T extends Record<string, unknown>> {
  schema: z.ZodType<T>;
  data: T;
  children: React.ReactNode;
}

/**
 * Компонент-обгортка для інтеграції Zod валідації з майстром
 */
export function ZodValidationWrapper<T extends Record<string, unknown>>(
  props: ZodValidationWrapperProps<T>
) {
  const { schema, data, children } = props;
  useZodValidation<T>(schema, data);

  return React.createElement(React.Fragment, null, children);
}
