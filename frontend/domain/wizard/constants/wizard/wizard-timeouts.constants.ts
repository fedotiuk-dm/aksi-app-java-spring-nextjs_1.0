/**
 * Таймаути wizard - відповідальність за час очікування системи
 */

/**
 * Таймаути (в мілісекундах)
 */
export const WIZARD_TIMEOUTS = {
  AUTO_SAVE_INTERVAL: 30000, // 30 секунд
  VALIDATION_DEBOUNCE: 500, // 0.5 секунд
  API_REQUEST_TIMEOUT: 10000, // 10 секунд
  SESSION_WARNING: 1800000, // 30 хвилин
  SESSION_TIMEOUT: 3600000, // 60 хвилин
} as const;
