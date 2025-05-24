/**
 * @fileoverview Константи валідації Order Wizard - правила, повідомлення та обмеження для валідації
 * @module domain/wizard/shared/constants/validation
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Центральне місце для всіх констант валідації Order Wizard.
 * Включає повідомлення про помилки, регулярні вирази, ліміти полів та правила валідації.
 *
 * Принципи організації валідації:
 * - Централізовані повідомлення для узгодженості UI
 * - Параметризовані функції для динамічних повідомлень
 * - Чіткі ліміти для всіх типів полів
 * - Спеціалізовані правила для кожного кроку wizard
 * - Пріоритизація помилок для кращого UX
 *
 * @example
 * // Використання повідомлень
 * import { VALIDATION_MESSAGES } from '@/domain/wizard/shared/constants/validation';
 *
 * if (value.length < 2) {
 *   return VALIDATION_MESSAGES.MIN_LENGTH(2);
 * }
 *
 * @example
 * // Використання регулярних виразів
 * import { VALIDATION_PATTERNS } from '@/domain/wizard/shared/constants/validation';
 *
 * const isValidPhone = VALIDATION_PATTERNS.PHONE_UA.test(phoneNumber);
 *
 * @example
 * // Використання лімітів
 * import { FIELD_LIMITS } from '@/domain/wizard/shared/constants/validation';
 *
 * const isValidLength = value.length <= FIELD_LIMITS.FIRST_NAME.max;
 *
 * @see {@link ../schemas/wizard-base.schema} - Zod схеми які використовують ці константи
 * @see {@link ./wizard.constants} - Загальні константи wizard
 */

/**
 * Повідомлення про помилки валідації для користувацького інтерфейсу
 *
 * @constant {object} VALIDATION_MESSAGES
 * @readonly
 * @description
 * Стандартизовані повідомлення про помилки валідації для всього Order Wizard.
 * Забезпечує узгоджену терміногологію та зрозумілі пояснення для користувачів.
 *
 * @property {string} REQUIRED_FIELD - Повідомлення для обов'язкових полів
 * @property {string} INVALID_EMAIL - Повідомлення для некоректного email
 * @property {string} INVALID_PHONE - Повідомлення для некоректного телефону
 * @property {Function} MIN_LENGTH - Функція для повідомлення про мінімальну довжину
 * @property {Function} MAX_LENGTH - Функція для повідомлення про максимальну довжину
 * @property {Function} MIN_VALUE - Функція для повідомлення про мінімальне значення
 * @property {Function} MAX_VALUE - Функція для повідомлення про максимальне значення
 * @property {string} POSITIVE_NUMBER - Повідомлення для додатних чисел
 * @property {string} FUTURE_DATE - Повідомлення для дат в майбутньому
 * @property {string} PAST_DATE - Повідомлення для дат в минулому
 * @property {string} INVALID_DATE - Повідомлення для некоректних дат
 * @property {string} SELECT_OPTION - Повідомлення для обов'язкового вибору
 * @property {string} UPLOAD_FILE - Повідомлення для обов'язкового завантаження файлу
 * @property {Function} FILE_TOO_LARGE - Функція для повідомлення про великий розмір файлу
 * @property {string} INVALID_FILE_TYPE - Повідомлення для некоректного типу файлу
 *
 * @example
 * // Статичні повідомлення
 * if (!email) {
 *   setError(VALIDATION_MESSAGES.REQUIRED_FIELD);
 * }
 * if (!emailPattern.test(email)) {
 *   setError(VALIDATION_MESSAGES.INVALID_EMAIL);
 * }
 *
 * @example
 * // Динамічні повідомлення з параметрами
 * if (name.length < 2) {
 *   setError(VALIDATION_MESSAGES.MIN_LENGTH(2)); // "Мінімальна довжина 2 символів"
 * }
 * if (file.size > maxSize) {
 *   setError(VALIDATION_MESSAGES.FILE_TOO_LARGE(5)); // "Розмір файлу не повинен перевищувати 5MB"
 * }
 *
 * @example
 * // Використання в Zod схемах
 * const nameSchema = z.string()
 *   .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
 *   .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50));
 *
 * @since 1.0.0
 */
export const VALIDATION_MESSAGES = {
  /** Повідомлення для обов'язкових полів */
  REQUIRED_FIELD: "Це поле є обов'язковим",
  /** Повідомлення для некоректного email */
  INVALID_EMAIL: 'Введіть коректну email адресу',
  /** Повідомлення для некоректного телефону */
  INVALID_PHONE: 'Введіть коректний номер телефону',
  /** Функція для повідомлення про мінімальну довжину */
  MIN_LENGTH: (min: number) => `Мінімальна довжина ${min} символів`,
  /** Функція для повідомлення про максимальну довжину */
  MAX_LENGTH: (max: number) => `Максимальна довжина ${max} символів`,
  /** Функція для повідомлення про мінімальне значення */
  MIN_VALUE: (min: number) => `Мінімальне значення ${min}`,
  /** Функція для повідомлення про максимальне значення */
  MAX_VALUE: (max: number) => `Максимальне значення ${max}`,
  /** Повідомлення для додатних чисел */
  POSITIVE_NUMBER: 'Значення повинно бути додатнім числом',
  /** Повідомлення для дат в майбутньому */
  FUTURE_DATE: 'Дата повинна бути в майбутньому',
  /** Повідомлення для дат в минулому */
  PAST_DATE: 'Дата повинна бути в минулому',
  /** Повідомлення для некоректних дат */
  INVALID_DATE: 'Введіть коректну дату',
  /** Повідомлення для обов'язкового вибору */
  SELECT_OPTION: 'Оберіть опцію зі списку',
  /** Повідомлення для обов'язкового завантаження файлу */
  UPLOAD_FILE: 'Завантажте файл',
  /** Функція для повідомлення про великий розмір файлу */
  FILE_TOO_LARGE: (maxMB: number) => `Розмір файлу не повинен перевищувати ${maxMB}MB`,
  /** Повідомлення для некоректного типу файлу */
  INVALID_FILE_TYPE: 'Невірний тип файлу',
} as const;

/**
 * Регулярні вирази для валідації різних типів даних
 *
 * @constant {object} VALIDATION_PATTERNS
 * @readonly
 * @description
 * Набір регулярних виразів для валідації форматів даних специфічних для Order Wizard.
 * Включає українські стандарти для телефонів та імен з підтримкою кирилиці.
 *
 * @property {RegExp} EMAIL - Паттерн для валідації email адрес
 * @property {RegExp} PHONE_UA - Паттерн для українських номерів телефону
 * @property {RegExp} RECEIPT_NUMBER - Паттерн для номерів квитанцій
 * @property {RegExp} UNIQUE_LABEL - Паттерн для унікальних міток предметів
 * @property {RegExp} NUMERIC - Паттерн для цілих чисел
 * @property {RegExp} DECIMAL - Паттерн для десяткових чисел (до 2 знаків після коми)
 * @property {RegExp} NAME - Паттерн для імен (кирилиця, латиниця, дефіси, апострофи)
 *
 * @example
 * // Валідація email
 * if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
 *   setError('Некоректний email');
 * }
 *
 * @example
 * // Валідація українського телефону
 * const isValidPhone = VALIDATION_PATTERNS.PHONE_UA.test('+380501234567'); // true
 * const isValid2 = VALIDATION_PATTERNS.PHONE_UA.test('0501234567'); // false
 *
 * @example
 * // Валідація імен з кирилицею
 * const isValidName = VALIDATION_PATTERNS.NAME.test('Олександр-Петро'); // true
 * const isInvalid = VALIDATION_PATTERNS.NAME.test('123John'); // false
 *
 * @example
 * // Використання в Zod схемах
 * const phoneSchema = z.string().regex(
 *   VALIDATION_PATTERNS.PHONE_UA,
 *   VALIDATION_MESSAGES.INVALID_PHONE
 * );
 *
 * @since 1.0.0
 */
export const VALIDATION_PATTERNS = {
  /** Паттерн для валідації email адрес */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** Паттерн для українських номерів телефону (+38 або 38 + 10 цифр) */
  PHONE_UA: /^(\+38)?[0-9]{10}$/,
  /** Паттерн для номерів квитанцій (латинські літери, цифри, дефіси, підкреслення) */
  RECEIPT_NUMBER: /^[A-Za-z0-9\-_]+$/,
  /** Паттерн для унікальних міток (латинські літери, цифри, дефіси, підкреслення, пробіли) */
  UNIQUE_LABEL: /^[A-Za-z0-9\-_\s]+$/,
  /** Паттерн для цілих чисел */
  NUMERIC: /^[0-9]+$/,
  /** Паттерн для десяткових чисел (до 2 знаків після коми) */
  DECIMAL: /^[0-9]+(\.[0-9]{1,2})?$/,
  /** Паттерн для імен (кирилиця, латиниця, пробіли, дефіси, апострофи) */
  NAME: /^[А-Яа-яІіЇїЄєA-Za-z\s\-']+$/,
} as const;

/**
 * Ліміти валідації для різних типів полів
 *
 * @constant {object} FIELD_LIMITS
 * @readonly
 * @description
 * Мінімальні та максимальні значення для всіх полів Order Wizard.
 * Забезпечує узгоджені обмеження та запобігає введенню некоректних даних.
 *
 * @property {object} FIRST_NAME - Ліміти для імені (min: 2, max: 50)
 * @property {object} LAST_NAME - Ліміти для прізвища (min: 2, max: 50)
 * @property {object} PHONE - Ліміти для телефону (min: 10, max: 13)
 * @property {object} EMAIL - Ліміти для email (min: 5, max: 100)
 * @property {object} ADDRESS - Ліміти для адреси (min: 5, max: 200)
 * @property {object} RECEIPT_NUMBER - Ліміти для номера квитанції (min: 1, max: 20)
 * @property {object} UNIQUE_LABEL - Ліміти для унікальної мітки (min: 1, max: 50)
 * @property {object} ORDER_NOTES - Ліміти для приміток замовлення (min: 0, max: 500)
 * @property {object} ITEM_NAME - Ліміти для назви предмета (min: 2, max: 100)
 * @property {object} ITEM_COLOR - Ліміти для кольору предмета (min: 2, max: 30)
 * @property {object} ITEM_NOTES - Ліміти для приміток предмета (min: 0, max: 300)
 * @property {object} QUANTITY - Ліміти для кількості (min: 1, max: 100)
 * @property {object} WEIGHT - Ліміти для ваги (min: 0.1, max: 50)
 * @property {object} PRICE - Ліміти для ціни (min: 0, max: 100000)
 * @property {object} PAID_AMOUNT - Ліміти для сплаченої суми (min: 0, max: 100000)
 * @property {object} DISCOUNT_PERCENT - Ліміти для відсотка знижки (min: 0, max: 100)
 *
 * @example
 * // Валідація довжини імені
 * if (firstName.length < FIELD_LIMITS.FIRST_NAME.min) {
 *   setError(VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.FIRST_NAME.min));
 * }
 *
 * @example
 * // Валідація кількості
 * if (quantity < FIELD_LIMITS.QUANTITY.min || quantity > FIELD_LIMITS.QUANTITY.max) {
 *   setError('Некоректна кількість');
 * }
 *
 * @example
 * // Використання в Zod схемах
 * const nameSchema = z.string()
 *   .min(FIELD_LIMITS.FIRST_NAME.min)
 *   .max(FIELD_LIMITS.FIRST_NAME.max);
 *
 * @since 1.0.0
 */
export const FIELD_LIMITS = {
  // Клієнт
  /** Ліміти для імені клієнта */
  FIRST_NAME: { min: 2, max: 50 },
  /** Ліміти для прізвища клієнта */
  LAST_NAME: { min: 2, max: 50 },
  /** Ліміти для номера телефону */
  PHONE: { min: 10, max: 13 },
  /** Ліміти для email адреси */
  EMAIL: { min: 5, max: 100 },
  /** Ліміти для адреси */
  ADDRESS: { min: 5, max: 200 },

  // Замовлення
  /** Ліміти для номера квитанції */
  RECEIPT_NUMBER: { min: 1, max: 20 },
  /** Ліміти для унікальної мітки */
  UNIQUE_LABEL: { min: 1, max: 50 },
  /** Ліміти для приміток замовлення */
  ORDER_NOTES: { min: 0, max: 500 },

  // Предмет
  /** Ліміти для назви предмета */
  ITEM_NAME: { min: 2, max: 100 },
  /** Ліміти для кольору предмета */
  ITEM_COLOR: { min: 2, max: 30 },
  /** Ліміти для приміток предмета */
  ITEM_NOTES: { min: 0, max: 300 },
  /** Ліміти для кількості предметів */
  QUANTITY: { min: 1, max: 100 },
  /** Ліміти для ваги предметів (кг) */
  WEIGHT: { min: 0.1, max: 50 },

  // Ціна та оплата
  /** Ліміти для ціни */
  PRICE: { min: 0, max: 100000 },
  /** Ліміти для сплаченої суми */
  PAID_AMOUNT: { min: 0, max: 100000 },
  /** Ліміти для відсотка знижки */
  DISCOUNT_PERCENT: { min: 0, max: 100 },
} as const;

/**
 * Дозволені типи файлів для завантаження
 *
 * @constant {object} ALLOWED_FILE_TYPES
 * @readonly
 * @description
 * MIME типи файлів які можна завантажувати в Order Wizard.
 * Розділені по категоріях для різних цілей використання.
 *
 * @property {string[]} IMAGES - Дозволені типи зображень
 * @property {string[]} DOCUMENTS - Дозволені типи документів
 *
 * @example
 * // Перевірка типу зображення
 * if (!ALLOWED_FILE_TYPES.IMAGES.includes(file.type)) {
 *   setError('Дозволені тільки JPEG, PNG, WebP зображення');
 * }
 *
 * @example
 * // Валідація документа
 * const isValidDocument = ALLOWED_FILE_TYPES.DOCUMENTS.includes(uploadedFile.type);
 *
 * @example
 * // Використання в input accept
 * <input type="file" accept={ALLOWED_FILE_TYPES.IMAGES.join(',')} />
 *
 * @since 1.0.0
 */
export const ALLOWED_FILE_TYPES = {
  /** Дозволені типи зображень (JPEG, PNG, WebP) */
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  /** Дозволені типи документів (PDF, DOC, DOCX) */
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

/**
 * Максимальні розміри файлів в байтах
 *
 * @constant {object} MAX_FILE_SIZES
 * @readonly
 * @description
 * Обмеження розмірів файлів для різних типів завантажень.
 * Запобігає завантаженню занадто великих файлів та перевантаженню сервера.
 *
 * @property {number} IMAGE - Максимальний розмір зображення (5MB)
 * @property {number} DOCUMENT - Максимальний розмір документа (10MB)
 *
 * @example
 * // Перевірка розміру зображення
 * if (imageFile.size > MAX_FILE_SIZES.IMAGE) {
 *   setError(VALIDATION_MESSAGES.FILE_TOO_LARGE(5));
 * }
 *
 * @example
 * // Валідація в Zod схемі
 * const imageSchema = z.object({
 *   file: z.instanceof(File),
 *   size: z.number().max(MAX_FILE_SIZES.IMAGE, 'Файл занадто великий')
 * });
 *
 * @since 1.0.0
 */
export const MAX_FILE_SIZES = {
  /** Максимальний розмір зображення (5MB) */
  IMAGE: 5 * 1024 * 1024,
  /** Максимальний розмір документа (10MB) */
  DOCUMENT: 10 * 1024 * 1024,
} as const;

/**
 * Категорії валідації для групування помилок
 *
 * @constant {object} VALIDATION_CATEGORIES
 * @readonly
 * @description
 * Стандартизовані категорії для класифікації помилок валідації.
 * Дозволяють групувати помилки по типу данних для кращої організації UI.
 *
 * @property {string} CLIENT_DATA - Категорія для даних клієнта
 * @property {string} ORDER_INFO - Категорія для інформації замовлення
 * @property {string} ITEM_DATA - Категорія для даних предметів
 * @property {string} PRICING - Категорія для цін та розрахунків
 * @property {string} PAYMENT - Категорія для даних оплати
 * @property {string} UPLOAD - Категорія для завантаження файлів
 *
 * @example
 * // Групування помилок по категоріях
 * const errorsByCategory = {
 *   [VALIDATION_CATEGORIES.CLIENT_DATA]: ['Ім\'я обов\'язкове', 'Некоректний телефон'],
 *   [VALIDATION_CATEGORIES.PRICING]: ['Ціна повинна бути додатною']
 * };
 *
 * @example
 * // Фільтрація помилок
 * const clientErrors = allErrors.filter(error =>
 *   error.category === VALIDATION_CATEGORIES.CLIENT_DATA
 * );
 *
 * @since 1.0.0
 */
export const VALIDATION_CATEGORIES = {
  /** Категорія для даних клієнта */
  CLIENT_DATA: 'client_data',
  /** Категорія для інформації замовлення */
  ORDER_INFO: 'order_info',
  /** Категорія для даних предметів */
  ITEM_DATA: 'item_data',
  /** Категорія для цін та розрахунків */
  PRICING: 'pricing',
  /** Категорія для даних оплати */
  PAYMENT: 'payment',
  /** Категорія для завантаження файлів */
  UPLOAD: 'upload',
} as const;

/**
 * Правила валідації для кожного кроку wizard
 *
 * @constant {object} STEP_VALIDATION_RULES
 * @readonly
 * @description
 * Специфічні правила валідації для кожного кроку Order Wizard.
 * Визначає обов'язкові поля та умовні валідації для кожного кроку.
 *
 * @property {object} CLIENT_SELECTION - Правила для кроку вибору клієнта
 * @property {object} BRANCH_SELECTION - Правила для кроку вибору філії
 * @property {object} ITEM_MANAGER - Правила для кроку управління предметами
 * @property {object} ORDER_PARAMETERS - Правила для кроку параметрів замовлення
 * @property {object} ORDER_CONFIRMATION - Правила для кроку підтвердження
 *
 * @example
 * // Отримання обов'язкових полів кроку
 * const requiredFields = STEP_VALIDATION_RULES.CLIENT_SELECTION.requiredFields;
 * // ['selectedClientId']
 *
 * @example
 * // Перевірка умовних полів
 * const conditionalRules = STEP_VALIDATION_RULES.CLIENT_SELECTION.conditionalFields;
 * if (isNewClient) {
 *   const required = conditionalRules.isNewClient; // ['firstName', 'lastName', 'phone']
 * }
 *
 * @since 1.0.0
 */
export const STEP_VALIDATION_RULES = {
  /** Правила валідації для кроку вибору клієнта */
  CLIENT_SELECTION: {
    requiredFields: ['selectedClientId'],
    conditionalFields: {
      isNewClient: ['firstName', 'lastName', 'phone'],
    },
  },
  /** Правила валідації для кроку вибору філії */
  BRANCH_SELECTION: {
    requiredFields: ['selectedBranchId'],
  },
  /** Правила валідації для кроку управління предметами */
  ITEM_MANAGER: {
    requiredFields: ['itemsList'],
    customValidations: ['hasAtLeastOneItem'],
  },
  /** Правила валідації для кроку параметрів замовлення */
  ORDER_PARAMETERS: {
    requiredFields: ['executionDate', 'paymentMethod'],
    conditionalFields: {
      hasDiscount: ['discountType'],
    },
  },
  /** Правила валідації для кроку підтвердження замовлення */
  ORDER_CONFIRMATION: {
    requiredFields: ['termsAccepted'],
    conditionalFields: {
      requireSignature: ['signatureData'],
    },
  },
} as const;

/**
 * Пріоритети помилок валідації для сортування та відображення
 *
 * @constant {object} VALIDATION_PRIORITY
 * @readonly
 * @description
 * Рівні пріоритету помилок валідації для правильного порядку відображення.
 * Критичні помилки показуються першими, попередження - останніми.
 *
 * @property {number} CRITICAL - Критичні помилки що блокують продовження (1)
 * @property {number} HIGH - Важливі помилки (2)
 * @property {number} MEDIUM - Стандартні помилки (3)
 * @property {number} LOW - Попередження що не блокують (4)
 *
 * @example
 * // Сортування помилок за пріоритетом
 * const sortedErrors = errors.sort((a, b) =>
 *   (a.priority || VALIDATION_PRIORITY.MEDIUM) -
 *   (b.priority || VALIDATION_PRIORITY.MEDIUM)
 * );
 *
 * @example
 * // Класифікація помилки
 * const error = {
 *   message: 'Клієнт не обраний',
 *   priority: VALIDATION_PRIORITY.CRITICAL
 * };
 *
 * @example
 * // Фільтрація критичних помилок
 * const criticalErrors = errors.filter(error =>
 *   error.priority === VALIDATION_PRIORITY.CRITICAL
 * );
 *
 * @since 1.0.0
 */
export const VALIDATION_PRIORITY = {
  /** Критичні помилки що блокують продовження */
  CRITICAL: 1,
  /** Важливі помилки */
  HIGH: 2,
  /** Стандартні помилки */
  MEDIUM: 3,
  /** Попередження що не блокують */
  LOW: 4,
} as const;
