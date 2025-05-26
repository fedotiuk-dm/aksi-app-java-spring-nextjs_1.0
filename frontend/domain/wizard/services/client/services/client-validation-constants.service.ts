/**
 * @fileoverview Константи для валідації клієнтів
 * @module domain/wizard/services/client/services/client-validation-constants
 */

/**
 * Константи валідації клієнтів
 */
export const CLIENT_VALIDATION_CONSTANTS = {
  ERROR_MESSAGES: {
    VALIDATION_FAILED: 'Помилка валідації даних клієнта',
    PHONE_REQUIRED: "Номер телефону є обов'язковим",
    NAME_REQUIRED: "Ім'я та прізвище є обов'язковими",
    INVALID_EMAIL: 'Некоректний формат email',
  },
  VALIDATION: {
    PHONE_PATTERN: /^\+380\d{9}$/,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
  },
} as const;
