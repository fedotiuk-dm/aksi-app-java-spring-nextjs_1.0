/**
 * @fileoverview Системні константи wizard
 * @module domain/wizard/constants/wizard-system
 *
 * Відповідальність: управління системними налаштуваннями wizard
 * - Поведінкові налаштування
 * - Помилки та логування
 * - Системні ліміти
 * - Метадані та версії
 * - Таймаути
 * - UI конфігурація
 */

// ========================================
// ПОВЕДІНКОВІ НАЛАШТУВАННЯ
// ========================================

/**
 * Налаштування автозбереження
 */
export const AUTO_SAVE_CONFIG = {
  ENABLED_BY_DEFAULT: true,
  SAVE_ON_STEP_CHANGE: true,
  SAVE_ON_VALIDATION_SUCCESS: false,
  SAVE_ON_FIELD_CHANGE: false,
  INTERVAL: 30000, // 30 секунд
  MAX_DRAFTS: 5, // Максимум 5 draft'ів
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

// ========================================
// ПОМИЛКИ ТА ЛОГУВАННЯ
// ========================================

/**
 * Типи помилок
 */
export const ERROR_TYPES = {
  VALIDATION: 'validation',
  API: 'api',
  NETWORK: 'network',
  SYSTEM: 'system',
  USER: 'user',
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

// ========================================
// СИСТЕМНІ ЛІМІТИ
// ========================================

/**
 * Ліміти системи
 */
export const WIZARD_LIMITS = {
  MAX_ITEMS_PER_ORDER: 50,
  MAX_PHOTOS_PER_ITEM: 5,
  MAX_PHOTO_SIZE_MB: 5,
  MIN_CLIENT_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 20,
  MAX_RECEIPT_NUMBER_LENGTH: 20,
  MAX_UNIQUE_LABEL_LENGTH: 50,
} as const;

// ========================================
// МЕТАДАНІ ТА ВЕРСІЇ
// ========================================

/**
 * Версія wizard (для сумісності)
 */
export const WIZARD_VERSION = '1.0.0' as const;

/**
 * Ключі локального сховища
 */
export const STORAGE_KEYS = {
  WIZARD_DRAFT: 'wizard_draft',
  WIZARD_CONTEXT: 'wizard_context',
  AUTO_SAVE_ENABLED: 'wizard_auto_save',
  AUTO_SAVE_CONFIG: 'wizard_auto_save_config',
  LAST_USED_BRANCH: 'wizard_last_branch',
} as const;

// ========================================
// ТАЙМАУТИ
// ========================================

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

// ========================================
// UI КОНФІГУРАЦІЯ
// ========================================

/**
 * Налаштування UI
 */
export const UI_CONFIG = {
  SHOW_PROGRESS_BAR: true,
  SHOW_STEP_NUMBERS: true,
  ENABLE_KEYBOARD_NAVIGATION: true,
  ANIMATE_TRANSITIONS: true,
  CONFIRM_NAVIGATION_WITH_UNSAVED_CHANGES: true,
} as const;
