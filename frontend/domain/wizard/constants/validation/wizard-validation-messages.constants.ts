/**
 * Повідомлення валідації wizard - відповідальність за UI повідомлення про помилки
 */

/**
 * Повідомлення про помилки валідації
 */
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: "Це поле є обов'язковим",
  INVALID_EMAIL: 'Введіть коректну email адресу',
  INVALID_PHONE: 'Введіть коректний номер телефону',
  MIN_LENGTH: (min: number) => `Мінімальна довжина ${min} символів`,
  MAX_LENGTH: (max: number) => `Максимальна довжина ${max} символів`,
  MIN_VALUE: (min: number) => `Мінімальне значення ${min}`,
  MAX_VALUE: (max: number) => `Максимальне значення ${max}`,
  POSITIVE_NUMBER: 'Значення повинно бути додатнім числом',
  FUTURE_DATE: 'Дата повинна бути в майбутньому',
  PAST_DATE: 'Дата повинна бути в минулому',
  INVALID_DATE: 'Введіть коректну дату',
  SELECT_OPTION: 'Оберіть опцію зі списку',
  UPLOAD_FILE: 'Завантажте файл',
  FILE_TOO_LARGE: (maxMB: number) => `Розмір файлу не повинен перевищувати ${maxMB}MB`,
  INVALID_FILE_TYPE: 'Невірний тип файлу',
} as const;
