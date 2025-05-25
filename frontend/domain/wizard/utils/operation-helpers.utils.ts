/**
 * Утиліти операцій - відповідальність за створення та обробку результатів операцій
 */

import { WizardOperationResult } from '../types';

/**
 * Створює результат операції з можливістю додавання даних, помилок та попереджень
 */
export const createOperationResult = <T = void>(
  success: boolean,
  data?: T,
  errors?: string[],
  warnings?: string[]
): WizardOperationResult<T> => {
  return {
    success,
    data,
    errors,
    warnings,
  };
};

/**
 * Створює успішний результат операції
 */
export const createSuccessResult = <T = void>(
  data?: T,
  warnings?: string[]
): WizardOperationResult<T> => {
  return createOperationResult(true, data, undefined, warnings);
};

/**
 * Створює результат операції з помилкою
 */
export const createErrorResult = <T = void>(
  errors: string[],
  data?: T
): WizardOperationResult<T> => {
  return createOperationResult(false, data, errors);
};

/**
 * Перевіряє чи операція завершилася успішно
 */
export const isOperationSuccess = <T>(
  result: WizardOperationResult<T>
): result is WizardOperationResult<T> & { success: true } => {
  return result.success === true;
};

/**
 * Отримує помилки з результату операції
 */
export const getOperationErrors = <T>(result: WizardOperationResult<T>): string[] => {
  return result.errors || [];
};

/**
 * Отримує попередження з результату операції
 */
export const getOperationWarnings = <T>(result: WizardOperationResult<T>): string[] => {
  return result.warnings || [];
};

/**
 * Об'єднує кілька результатів операцій в один
 */
export const combineOperationResults = <T>(
  results: WizardOperationResult<T>[]
): WizardOperationResult<T[]> => {
  const allSuccessful = results.every((result) => result.success);
  const allErrors = results.flatMap((result) => result.errors || []);
  const allWarnings = results.flatMap((result) => result.warnings || []);
  const allData = results.map((result) => result.data).filter(Boolean) as T[];

  return createOperationResult(
    allSuccessful,
    allData,
    allErrors.length > 0 ? allErrors : undefined,
    allWarnings.length > 0 ? allWarnings : undefined
  );
};
