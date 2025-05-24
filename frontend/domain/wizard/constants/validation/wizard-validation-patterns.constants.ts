/**
 * Шаблони валідації wizard - відповідальність за регулярні вирази та шаблони
 */

/**
 * Регулярні вирази для валідації
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_UA: /^(\+38)?[0-9]{10}$/,
  RECEIPT_NUMBER: /^[A-Za-z0-9\-_]+$/,
  UNIQUE_LABEL: /^[A-Za-z0-9\-_\s]+$/,
  NUMERIC: /^[0-9]+$/,
  DECIMAL: /^[0-9]+(\.[0-9]{1,2})?$/,
  NAME: /^[А-Яа-яІіЇїЄєA-Za-z\s\-']+$/,
} as const;
