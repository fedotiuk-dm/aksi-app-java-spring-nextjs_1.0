/**
 * Тип для помилки валідації поля
 */
interface FieldValidationError {
  message?: string;
  type?: string;
}

/**
 * Тип для помилок валідації форми
 */
type FormErrors<T> = Record<string, FieldValidationError | undefined>;

/**
 * Перевіряє наявність помилок у конкретному полі
 * @param errors Об'єкт помилок з React Hook Form
 * @param fieldName Назва поля
 */
export function hasFieldError<T extends Record<string, any>>(
  errors: FormErrors<T>,
  fieldName: keyof T
): boolean {
  return !!errors[fieldName as string];
}

/**
 * Отримати повідомлення про помилку для конкретного поля
 * @param errors Об'єкт помилок з React Hook Form
 * @param fieldName Назва поля
 */
export function getFieldErrorMessage<T extends Record<string, any>>(
  errors: FormErrors<T>,
  fieldName: keyof T
): string | undefined {
  const error = errors[fieldName as string];
  if (!error) return undefined;

  // Повертаємо повідомлення про помилку
  return error.message;
}

/**
 * Форматує список помилок валідації для відображення у компоненті Alert
 * @param errors Об'єкт помилок з React Hook Form
 */
export function formatValidationErrors<T extends Record<string, any>>(
  errors: FormErrors<T>
): string[] {
  const result: string[] = [];

  // Перебираємо всі поля з помилками та додаємо їх у результат
  Object.entries(errors).forEach(([field, error]) => {
    if (error && error.message) {
      result.push(error.message);
    }
  });

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
