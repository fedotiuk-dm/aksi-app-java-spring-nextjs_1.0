/**
 * Константи валідації Order Wizard
 */

// Повідомлення про помилки
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

// Регулярні вирази
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_UA: /^(\+38)?[0-9]{10}$/,
  RECEIPT_NUMBER: /^[A-Za-z0-9\-_]+$/,
  UNIQUE_LABEL: /^[A-Za-z0-9\-_\s]+$/,
  NUMERIC: /^[0-9]+$/,
  DECIMAL: /^[0-9]+(\.[0-9]{1,2})?$/,
  NAME: /^[А-Яа-яІіЇїЄєA-Za-z\s\-']+$/,
} as const;

// Ліміти валідації для полів
export const FIELD_LIMITS = {
  // Клієнт
  FIRST_NAME: { min: 2, max: 50 },
  LAST_NAME: { min: 2, max: 50 },
  PHONE: { min: 10, max: 13 },
  EMAIL: { min: 5, max: 100 },
  ADDRESS: { min: 5, max: 200 },

  // Замовлення
  RECEIPT_NUMBER: { min: 1, max: 20 },
  UNIQUE_LABEL: { min: 1, max: 50 },
  ORDER_NOTES: { min: 0, max: 500 },

  // Предмет
  ITEM_NAME: { min: 2, max: 100 },
  ITEM_COLOR: { min: 2, max: 30 },
  ITEM_NOTES: { min: 0, max: 300 },
  QUANTITY: { min: 1, max: 100 },
  WEIGHT: { min: 0.1, max: 50 },

  // Ціна та оплата
  PRICE: { min: 0, max: 100000 },
  PAID_AMOUNT: { min: 0, max: 100000 },
  DISCOUNT_PERCENT: { min: 0, max: 100 },
} as const;

// Дозволені типи файлів
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// Максимальні розміри файлів (в байтах)
export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const;

// Категорії валідації
export const VALIDATION_CATEGORIES = {
  CLIENT_DATA: 'client_data',
  ORDER_INFO: 'order_info',
  ITEM_DATA: 'item_data',
  PRICING: 'pricing',
  PAYMENT: 'payment',
  UPLOAD: 'upload',
} as const;

// Правила для різних кроків
export const STEP_VALIDATION_RULES = {
  CLIENT_SELECTION: {
    requiredFields: ['selectedClientId'],
    conditionalFields: {
      isNewClient: ['firstName', 'lastName', 'phone'],
    },
  },
  BRANCH_SELECTION: {
    requiredFields: ['selectedBranchId'],
  },
  ITEM_MANAGER: {
    requiredFields: ['itemsList'],
    customValidations: ['hasAtLeastOneItem'],
  },
  ORDER_PARAMETERS: {
    requiredFields: ['executionDate', 'paymentMethod'],
    conditionalFields: {
      hasDiscount: ['discountType'],
    },
  },
  ORDER_CONFIRMATION: {
    requiredFields: ['termsAccepted'],
    conditionalFields: {
      requireSignature: ['signatureData'],
    },
  },
} as const;

// Пріоритети помилок валідації
export const VALIDATION_PRIORITY = {
  CRITICAL: 1, // Блокує продовження
  HIGH: 2, // Важливі помилки
  MEDIUM: 3, // Стандартні помилки
  LOW: 4, // Попередження
} as const;
