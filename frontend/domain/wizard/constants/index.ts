/**
 * @fileoverview Константи wizard домену
 * @module domain/wizard/constants
 *
 * Експорт константів для зовнішнього використання:
 * - Константи кроків (порядок, лейбли, конфігурація)
 * - Валідаційні константи (правила, паттерни, ліміти, файли)
 * - Системні константи (поведінка, помилки, таймаути, UI)
 * - API валідаційні правила
 */

// ========================================
// КОНСТАНТИ КРОКІВ
// ========================================
export {
  // Порядок кроків
  WIZARD_STEPS_ORDER,
  ITEM_WIZARD_STEPS_ORDER,

  // Лейбли та описи
  WIZARD_STEP_LABELS,
  ITEM_WIZARD_STEP_LABELS,
  WIZARD_STEP_DESCRIPTIONS,

  // Конфігурація кроків
  REQUIRED_STEPS,
  REQUIRED_ITEM_STEPS,
  STEPS_WITH_UNSAVED_CHANGES,
  STEPS_WITH_API_VALIDATION,
} from './wizard-steps.constants';

// ========================================
// КОНСТАНТИ ВАЛІДАЦІЇ
// ========================================
export {
  // Валідаційні правила та категорії
  VALIDATION_CATEGORIES,
  STEP_VALIDATION_RULES,
  VALIDATION_PRIORITY,

  // Повідомлення про помилки
  VALIDATION_MESSAGES,

  // Паттерни та регулярні вирази
  VALIDATION_PATTERNS,

  // Ліміти полів
  FIELD_LIMITS,

  // Файлові обмеження
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZES,
} from './wizard-validation.constants';

// ========================================
// СИСТЕМНІ КОНСТАНТИ
// ========================================
export {
  // Поведінкові налаштування
  AUTO_SAVE_CONFIG,
  VALIDATION_CONFIG,

  // Помилки та логування
  ERROR_TYPES,
  LOG_LEVELS,

  // Системні ліміти
  WIZARD_LIMITS,

  // Метадані та версії
  WIZARD_VERSION,
  STORAGE_KEYS,

  // Таймаути
  WIZARD_TIMEOUTS,

  // UI конфігурація
  UI_CONFIG,
} from './wizard-system.constants';

// ========================================
// API ВАЛІДАЦІЙНІ КОНСТАНТИ
// ========================================
export {
  CLIENT_VALIDATION_RULES,
  BRANCH_VALIDATION_RULES,
  ITEMS_VALIDATION_RULES,
  ORDER_VALIDATION_RULES,
  VALIDATION_LIMITS,
  COMMUNICATION_CHANNELS,
  CLIENT_SOURCES,
  ORDER_STATUSES,
  EXPEDITE_TYPES,
} from './api-validation.constants';
