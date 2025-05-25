/**
 * Константи валідації на основі API структур - відповідальність за правила валідації
 */

import { ValidationConstraints } from '../types';

/**
 * Правила валідації для клієнтів
 */
export const CLIENT_VALIDATION_RULES: ValidationConstraints['client'] = {
  requiredFields: ['firstName', 'lastName', 'phone'],
  phonePattern: /^\+38\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

/**
 * Правила валідації для філій
 */
export const BRANCH_VALIDATION_RULES: ValidationConstraints['branch'] = {
  requiredFields: ['name', 'address', 'code'],
};

/**
 * Правила валідації для предметів
 */
export const ITEMS_VALIDATION_RULES: ValidationConstraints['items'] = {
  minimumCount: 1,
  maximumCount: 50,
  requiredFields: ['name', 'quantity', 'unitPrice'],
};

/**
 * Правила валідації для замовлення
 */
export const ORDER_VALIDATION_RULES: ValidationConstraints['order'] = {
  minimumAmount: 1,
  maximumDiscountPercent: 50,
  allowedPaymentMethods: ['terminal', 'cash', 'account'],
};

/**
 * Перелік каналів комунікації
 */
export const COMMUNICATION_CHANNELS = ['PHONE', 'SMS', 'VIBER'] as const;

/**
 * Джерела клієнтів
 */
export const CLIENT_SOURCES = ['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER'] as const;

/**
 * Статуси замовлень
 */
export const ORDER_STATUSES = [
  'DRAFT',
  'NEW',
  'IN_PROGRESS',
  'COMPLETED',
  'DELIVERED',
  'CANCELLED',
] as const;

/**
 * Типи терміновості
 */
export const EXPEDITE_TYPES = ['STANDARD', 'EXPRESS_48H', 'EXPRESS_24H'] as const;

/**
 * Одиниці виміру
 */
export const UNITS_OF_MEASURE = ['pieces', 'kg', 'item', 'pair', 'set'] as const;

/**
 * Способи оплати
 */
export const PAYMENT_METHODS = ['terminal', 'cash', 'account'] as const;

/**
 * Типи знижок
 */
export const DISCOUNT_TYPES = ['none', 'evercard', 'social', 'military', 'other'] as const;

/**
 * Мінімальні значення для валідації
 */
export const VALIDATION_LIMITS = {
  client: {
    firstNameMinLength: 2,
    lastNameMinLength: 2,
    phoneMinLength: 10,
    phoneMaxLength: 20,
    emailMaxLength: 100,
    addressMaxLength: 200,
  },
  branch: {
    nameMinLength: 3,
    addressMinLength: 10,
    codeMinLength: 2,
    codeMaxLength: 10,
  },
  items: {
    nameMinLength: 3,
    nameMaxLength: 100,
    descriptionMaxLength: 500,
    quantityMin: 0.01,
    quantityMax: 1000,
    priceMin: 0.01,
    priceMax: 100000,
  },
  order: {
    notesMaxLength: 1000,
    discountPercentMax: 50,
    expediteMultiplierMax: 3,
  },
} as const;
