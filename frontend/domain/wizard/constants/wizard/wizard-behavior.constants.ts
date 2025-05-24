/**
 * Конфігурація поведінки wizard - відповідальність за налаштування функціональної поведінки
 */

/**
 * Налаштування автозбереження
 */
export const AUTO_SAVE_CONFIG = {
  ENABLED_BY_DEFAULT: true,
  SAVE_ON_STEP_CHANGE: true,
  SAVE_ON_VALIDATION_SUCCESS: false,
  SAVE_ON_FIELD_CHANGE: false,
} as const;

/**
 * Конфігурація валідації
 */
export const VALIDATION_CONFIG = {
  VALIDATE_ON_CHANGE: true,
  VALIDATE_ON_BLUR: true,
  VALIDATE_ON_STEP_CHANGE: true,
  SHOW_ERRORS_IMMEDIATELY: false,
  DEBOUNCE_VALIDATION: true,
} as const;
