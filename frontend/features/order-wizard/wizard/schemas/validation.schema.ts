import { z } from 'zod';

import { WizardStep } from '../store/navigation/navigation.types';

/**
 * Схема для помилок валідації
 */
export const validationErrorsSchema = z.record(
  z.string(),
  z.union([z.array(z.string()), z.record(z.string(), z.any())])
);

/**
 * Схема для стану валідації
 */
export const validationStateSchema = z.record(
  z.nativeEnum(WizardStep),
  z.object({
    isValid: z.boolean(),
    isValidated: z.boolean(),
    errors: validationErrorsSchema.optional(),
  })
);

/**
 * Типи для валідації
 */
export type ValidationErrors = z.infer<typeof validationErrorsSchema>;
export type ValidationState = z.infer<typeof validationStateSchema>;

/**
 * Утиліта для перевірки, чи валідний крок
 * @param state - стан валідації
 * @param step - крок для перевірки
 * @returns true, якщо крок валідний або ще не валідований
 */
export const isStepValid = (state: ValidationState, step: WizardStep): boolean => {
  if (!state[step]) {
    return true; // Якщо немає інформації про валідацію, вважаємо крок валідним
  }

  return state[step].isValid || !state[step].isValidated;
};

/**
 * Форматування помилок Zod у формат ValidationErrors
 * @param zodErrors - помилки Zod
 * @returns форматовані помилки валідації
 */
export const formatZodErrors = (zodErrors: z.ZodFormattedError<unknown>): ValidationErrors => {
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
        // Безпечне приведення типу через unknown
        const formattedValue = value as unknown as z.ZodFormattedError<unknown>;
        result[key] = formatZodErrors(formattedValue);
      }
    }
  });

  return result;
};

/**
 * Створення початкового стану валідації
 * @returns початковий стан валідації для всіх кроків
 */
export const createInitialValidationState = (): ValidationState => {
  const steps = Object.values(WizardStep);

  return steps.reduce((acc, step) => {
    acc[step] = {
      isValid: false,
      isValidated: false,
    };
    return acc;
  }, {} as ValidationState);
};
