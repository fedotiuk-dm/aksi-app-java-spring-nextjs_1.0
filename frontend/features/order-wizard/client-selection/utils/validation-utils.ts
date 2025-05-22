import {
  ValidationErrors,
  hasFieldError as hasError,
  getFieldError,
} from '../../shared/schemas/common.schema';

/**
 * Перевіряє наявність помилок у конкретному полі
 * @param errors Об'єкт помилок з React Hook Form
 * @param fieldName Назва поля
 */
export function hasFieldError(errors: ValidationErrors, fieldName: string): boolean {
  return hasError(errors, fieldName);
}

/**
 * Отримати повідомлення про помилку для конкретного поля
 * @param errors Об'єкт помилок з React Hook Form
 * @param fieldName Назва поля
 */
export function getFieldErrorMessage(
  errors: ValidationErrors,
  fieldName: string
): string | undefined {
  return getFieldError(errors, fieldName) || undefined;
}

/**
 * Форматує список помилок валідації для відображення у компоненті Alert
 * @param errors Об'єкт помилок з React Hook Form
 */
export function formatValidationErrors(errors: ValidationErrors): string[] {
  const result: string[] = [];

  // Функція для рекурсивного проходження по об'єкту помилок
  const processErrors = (errObj: ValidationErrors, prefix = ''): void => {
    Object.entries(errObj).forEach(([field, error]) => {
      const fieldName = prefix ? `${prefix}.${field}` : field;

      if (typeof error === 'string') {
        result.push(`${field}: ${error}`);
      } else if (error && typeof error === 'object') {
        processErrors(error as ValidationErrors, fieldName);
      }
    });
  };

  processErrors(errors);
  return result;
}

/**
 * Перевіряє, чи потрібно відображати повідомлення з підказкою для поля
 * @param error Наявність помилки валідації
 * @param value Поточне значення поля
 * @param defaultValue Значення за замовчуванням
 */
export function shouldShowHelperText<T>(error: boolean, value: T, defaultValue?: T): boolean {
  // Якщо є помилка, завжди показуємо підказку
  if (error) return true;

  // Перевіряємо значення на пустоту або відповідність значенню за замовчуванням
  return !(
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'string' && value.trim() === '') ||
    (defaultValue !== undefined && value === defaultValue)
  );
}

/**
 * Перевіряє, чи є вказаний елемент у масиві
 * @param array Масив значень
 * @param value Значення для перевірки
 */
export function arrayIncludes<T>(array: T[] | undefined | null, value: T): boolean {
  return Array.isArray(array) && array.includes(value);
}
