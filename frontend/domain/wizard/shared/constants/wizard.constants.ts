/**
 * @fileoverview Константи конфігурації Order Wizard - центральні налаштування для всього wizard
 * @module domain/wizard/shared/constants
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Центральне місце для всіх констант конфігурації Order Wizard.
 * Включає таймаути, ліміти, налаштування UI, валідації та збереження.
 *
 * Принципи організації констант:
 * - Групування за функціональністю
 * - Використання as const для type safety
 * - Зрозумілі назви з одиницями виміру
 * - Коментарі для пояснення складних значень
 *
 * @example
 * // Використання таймаутів
 * import { WIZARD_TIMEOUTS } from '@/domain/wizard/shared/constants';
 *
 * setTimeout(autoSave, WIZARD_TIMEOUTS.AUTO_SAVE_INTERVAL);
 *
 * @example
 * // Перевірка лімітів
 * import { WIZARD_LIMITS } from '@/domain/wizard/shared/constants';
 *
 * if (photos.length > WIZARD_LIMITS.MAX_PHOTOS_PER_ITEM) {
 *   throw new Error('Перевищено ліміт фото');
 * }
 */

/**
 * Таймаути для різних операцій wizard (в мілісекундах)
 *
 * @constant {object} WIZARD_TIMEOUTS
 * @readonly
 * @description
 * Налаштування часових обмежень для операцій wizard.
 * Оптимізовані для балансу між UX та продуктивністю.
 *
 * @property {number} AUTO_SAVE_INTERVAL - Інтервал автозбереження (30 сек)
 * @property {number} VALIDATION_DEBOUNCE - Затримка валідації при вводі (0.5 сек)
 * @property {number} API_REQUEST_TIMEOUT - Таймаут API запитів (10 сек)
 * @property {number} SESSION_WARNING - Попередження про закінчення сесії (30 хв)
 * @property {number} SESSION_TIMEOUT - Повний таймаут сесії (60 хв)
 *
 * @example
 * // Налаштування автозбереження
 * setInterval(() => {
 *   saveDraft();
 * }, WIZARD_TIMEOUTS.AUTO_SAVE_INTERVAL);
 *
 * @since 1.0.0
 */
export const WIZARD_TIMEOUTS = {
  /** Інтервал автозбереження (30 секунд) */
  AUTO_SAVE_INTERVAL: 30000,
  /** Затримка валідації при вводі (0.5 секунд) */
  VALIDATION_DEBOUNCE: 500,
  /** Таймаут API запитів (10 секунд) */
  API_REQUEST_TIMEOUT: 10000,
  /** Попередження про закінчення сесії (30 хвилин) */
  SESSION_WARNING: 1800000,
  /** Повний таймаут сесії (60 хвилин) */
  SESSION_TIMEOUT: 3600000,
} as const;

/**
 * Ліміти для різних аспектів wizard
 *
 * @constant {object} WIZARD_LIMITS
 * @readonly
 * @description
 * Обмеження для запобігання надмірного використання ресурсів
 * та забезпечення стабільної роботи системи.
 *
 * @property {number} MAX_ITEMS_PER_ORDER - Максимум предметів в замовленні (50)
 * @property {number} MAX_PHOTOS_PER_ITEM - Максимум фото на предмет (5)
 * @property {number} MAX_PHOTO_SIZE_MB - Максимальний розмір фото в МБ (5)
 * @property {number} MIN_CLIENT_SEARCH_LENGTH - Мінімум символів для пошуку клієнта (2)
 * @property {number} MAX_SEARCH_RESULTS - Максимум результатів пошуку (20)
 * @property {number} MAX_RECEIPT_NUMBER_LENGTH - Максимум символів номера квитанції (20)
 * @property {number} MAX_UNIQUE_LABEL_LENGTH - Максимум символів унікальної мітки (50)
 *
 * @example
 * // Валідація кількості предметів
 * if (items.length >= WIZARD_LIMITS.MAX_ITEMS_PER_ORDER) {
 *   setError('Досягнуто максимум предметів в замовленні');
 * }
 *
 * @since 1.0.0
 */
export const WIZARD_LIMITS = {
  /** Максимум предметів в замовленні */
  MAX_ITEMS_PER_ORDER: 50,
  /** Максимум фото на предмет */
  MAX_PHOTOS_PER_ITEM: 5,
  /** Максимальний розмір фото в МБ */
  MAX_PHOTO_SIZE_MB: 5,
  /** Мінімум символів для пошуку клієнта */
  MIN_CLIENT_SEARCH_LENGTH: 2,
  /** Максимум результатів пошуку */
  MAX_SEARCH_RESULTS: 20,
  /** Максимум символів номера квитанції */
  MAX_RECEIPT_NUMBER_LENGTH: 20,
  /** Максимум символів унікальної мітки */
  MAX_UNIQUE_LABEL_LENGTH: 50,
} as const;

/**
 * Версія wizard для контролю сумісності
 *
 * @constant {string} WIZARD_VERSION
 * @readonly
 * @description
 * Семантична версія Order Wizard для відстеження змін
 * та забезпечення сумісності з різними версіями API.
 *
 * @example
 * // Перевірка сумісності
 * if (apiVersion !== WIZARD_VERSION) {
 *   console.warn('Невідповідність версій wizard та API');
 * }
 *
 * @since 1.0.0
 */
export const WIZARD_VERSION = '1.0.0' as const;

/**
 * Ключі для локального сховища браузера
 *
 * @constant {object} STORAGE_KEYS
 * @readonly
 * @description
 * Стандартизовані ключі для збереження даних wizard в localStorage.
 * Забезпечує узгодженість та запобігає конфліктам імен.
 *
 * @property {string} WIZARD_DRAFT - Ключ для чернетки замовлення
 * @property {string} WIZARD_CONTEXT - Ключ для контексту wizard
 * @property {string} AUTO_SAVE_ENABLED - Ключ для налаштування автозбереження
 * @property {string} LAST_USED_BRANCH - Ключ для останньої використаної філії
 *
 * @example
 * // Збереження чернетки
 * localStorage.setItem(STORAGE_KEYS.WIZARD_DRAFT, JSON.stringify(draft));
 *
 * // Завантаження налаштувань
 * const autoSaveEnabled = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE_ENABLED) === 'true';
 *
 * @since 1.0.0
 */
export const STORAGE_KEYS = {
  /** Ключ для чернетки замовлення */
  WIZARD_DRAFT: 'wizard_draft',
  /** Ключ для контексту wizard */
  WIZARD_CONTEXT: 'wizard_context',
  /** Ключ для налаштування автозбереження */
  AUTO_SAVE_ENABLED: 'wizard_auto_save',
  /** Ключ для останньої використаної філії */
  LAST_USED_BRANCH: 'wizard_last_branch',
} as const;

/**
 * Конфігурація автозбереження
 *
 * @constant {object} AUTO_SAVE_CONFIG
 * @readonly
 * @description
 * Налаштування поведінки автозбереження wizard.
 * Визначає коли та як часто зберігати дані.
 *
 * @property {boolean} ENABLED_BY_DEFAULT - Чи увімкнено автозбереження за замовчуванням
 * @property {boolean} SAVE_ON_STEP_CHANGE - Зберігати при зміні кроку
 * @property {boolean} SAVE_ON_VALIDATION_SUCCESS - Зберігати після успішної валідації
 * @property {boolean} SAVE_ON_FIELD_CHANGE - Зберігати при зміні полів
 *
 * @example
 * // Налаштування автозбереження
 * if (AUTO_SAVE_CONFIG.ENABLED_BY_DEFAULT) {
 *   enableAutoSave();
 * }
 *
 * @since 1.0.0
 */
export const AUTO_SAVE_CONFIG = {
  /** Чи увімкнено автозбереження за замовчуванням */
  ENABLED_BY_DEFAULT: true,
  /** Зберігати при зміні кроку */
  SAVE_ON_STEP_CHANGE: true,
  /** Зберігати після успішної валідації */
  SAVE_ON_VALIDATION_SUCCESS: false,
  /** Зберігати при зміні полів */
  SAVE_ON_FIELD_CHANGE: false,
} as const;

/**
 * Конфігурація валідації даних
 *
 * @constant {object} VALIDATION_CONFIG
 * @readonly
 * @description
 * Налаштування поведінки валідації полів та кроків wizard.
 * Визначає коли та як валідувати дані користувача.
 *
 * @property {boolean} VALIDATE_ON_CHANGE - Валідувати при зміні значення
 * @property {boolean} VALIDATE_ON_BLUR - Валідувати при втраті фокусу
 * @property {boolean} VALIDATE_ON_STEP_CHANGE - Валідувати при зміні кроку
 * @property {boolean} SHOW_ERRORS_IMMEDIATELY - Показувати помилки відразу
 * @property {boolean} DEBOUNCE_VALIDATION - Використовувати debounce для валідації
 *
 * @example
 * // Налаштування валідації поля
 * const fieldConfig = {
 *   validateOnChange: VALIDATION_CONFIG.VALIDATE_ON_CHANGE,
 *   showErrorsImmediately: VALIDATION_CONFIG.SHOW_ERRORS_IMMEDIATELY
 * };
 *
 * @since 1.0.0
 */
export const VALIDATION_CONFIG = {
  /** Валідувати при зміні значення */
  VALIDATE_ON_CHANGE: true,
  /** Валідувати при втраті фокусу */
  VALIDATE_ON_BLUR: true,
  /** Валідувати при зміні кроку */
  VALIDATE_ON_STEP_CHANGE: true,
  /** Показувати помилки відразу */
  SHOW_ERRORS_IMMEDIATELY: false,
  /** Використовувати debounce для валідації */
  DEBOUNCE_VALIDATION: true,
} as const;

/**
 * Налаштування користувацького інтерфейсу
 *
 * @constant {object} UI_CONFIG
 * @readonly
 * @description
 * Конфігурація поведінки та відображення UI елементів wizard.
 * Визначає які функції інтерфейсу увімкнені.
 *
 * @property {boolean} SHOW_PROGRESS_BAR - Показувати прогрес-бар
 * @property {boolean} SHOW_STEP_NUMBERS - Показувати номери кроків
 * @property {boolean} ENABLE_KEYBOARD_NAVIGATION - Увімкнути навігацію клавіатурою
 * @property {boolean} ANIMATE_TRANSITIONS - Анімувати переходи між кроками
 * @property {boolean} CONFIRM_NAVIGATION_WITH_UNSAVED_CHANGES - Підтверджувати навігацію з незбереженими змінами
 *
 * @example
 * // Налаштування UI компонента
 * <ProgressBar visible={UI_CONFIG.SHOW_PROGRESS_BAR} />
 * <StepIndicator showNumbers={UI_CONFIG.SHOW_STEP_NUMBERS} />
 *
 * @since 1.0.0
 */
export const UI_CONFIG = {
  /** Показувати прогрес-бар */
  SHOW_PROGRESS_BAR: true,
  /** Показувати номери кроків */
  SHOW_STEP_NUMBERS: true,
  /** Увімкнути навігацію клавіатурою */
  ENABLE_KEYBOARD_NAVIGATION: true,
  /** Анімувати переходи між кроками */
  ANIMATE_TRANSITIONS: true,
  /** Підтверджувати навігацію з незбереженими змінами */
  CONFIRM_NAVIGATION_WITH_UNSAVED_CHANGES: true,
} as const;

/**
 * Типи помилок wizard
 *
 * @constant {object} ERROR_TYPES
 * @readonly
 * @description
 * Стандартизовані типи помилок для класифікації та обробки
 * різних видів помилок в wizard.
 *
 * @property {string} VALIDATION_ERROR - Помилка валідації даних
 * @property {string} API_ERROR - Помилка API запиту
 * @property {string} NETWORK_ERROR - Мережева помилка
 * @property {string} PERMISSION_ERROR - Помилка доступу
 * @property {string} TIMEOUT_ERROR - Помилка таймауту
 * @property {string} UNKNOWN_ERROR - Невідома помилка
 *
 * @example
 * // Обробка помилок за типом
 * switch (error.type) {
 *   case ERROR_TYPES.VALIDATION_ERROR:
 *     showValidationErrors(error.details);
 *     break;
 *   case ERROR_TYPES.API_ERROR:
 *     showApiError(error.message);
 *     break;
 * }
 *
 * @since 1.0.0
 */
export const ERROR_TYPES = {
  /** Помилка валідації даних */
  VALIDATION_ERROR: 'validation_error',
  /** Помилка API запиту */
  API_ERROR: 'api_error',
  /** Мережева помилка */
  NETWORK_ERROR: 'network_error',
  /** Помилка доступу */
  PERMISSION_ERROR: 'permission_error',
  /** Помилка таймауту */
  TIMEOUT_ERROR: 'timeout_error',
  /** Невідома помилка */
  UNKNOWN_ERROR: 'unknown_error',
} as const;

/**
 * Рівні логування для діагностики
 *
 * @constant {object} LOG_LEVELS
 * @readonly
 * @description
 * Стандартні рівні логування для системи діагностики wizard.
 * Використовуються для фільтрації та категоризації логів.
 *
 * @property {string} ERROR - Критичні помилки
 * @property {string} WARN - Попередження
 * @property {string} INFO - Інформаційні повідомлення
 * @property {string} DEBUG - Налагоджувальна інформація
 *
 * @example
 * // Логування з рівнем
 * logger.log(LOG_LEVELS.ERROR, 'Критична помилка wizard', error);
 * logger.log(LOG_LEVELS.INFO, 'Wizard успішно ініціалізовано');
 *
 * @since 1.0.0
 */
export const LOG_LEVELS = {
  /** Критичні помилки */
  ERROR: 'error',
  /** Попередження */
  WARN: 'warn',
  /** Інформаційні повідомлення */
  INFO: 'info',
  /** Налагоджувальна інформація */
  DEBUG: 'debug',
} as const;
