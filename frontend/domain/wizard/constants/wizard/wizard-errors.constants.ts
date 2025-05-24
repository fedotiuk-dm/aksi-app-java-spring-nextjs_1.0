/**
 * Обробка помилок wizard - відповідальність за типи помилок та логування
 */

/**
 * Типи помилок
 */
export const ERROR_TYPES = {
  VALIDATION_ERROR: 'validation_error',
  API_ERROR: 'api_error',
  NETWORK_ERROR: 'network_error',
  PERMISSION_ERROR: 'permission_error',
  TIMEOUT_ERROR: 'timeout_error',
  UNKNOWN_ERROR: 'unknown_error',
} as const;

/**
 * Рівні логування
 */
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;
