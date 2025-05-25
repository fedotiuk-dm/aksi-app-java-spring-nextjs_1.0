/**
 * Схеми для полів замовлення - відповідальність за валідацію даних замовлень
 */

import { z } from 'zod';

import { FIELD_LIMITS } from '../constants';
import { VALIDATION_MESSAGES } from '../constants';
import { VALIDATION_PATTERNS } from '../constants';

/**
 * Схема для номера квитанції
 */
export const receiptNumberSchema = z
  .string()
  .min(
    FIELD_LIMITS.RECEIPT_NUMBER.min,
    VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.RECEIPT_NUMBER.min)
  )
  .max(
    FIELD_LIMITS.RECEIPT_NUMBER.max,
    VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.RECEIPT_NUMBER.max)
  )
  .regex(
    VALIDATION_PATTERNS.RECEIPT_NUMBER,
    'Використовуйте тільки латинські літери, цифри, дефіси та підкреслення'
  );

/**
 * Схема для унікальної мітки замовлення
 */
export const uniqueLabelSchema = z
  .string()
  .min(FIELD_LIMITS.UNIQUE_LABEL.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.UNIQUE_LABEL.min))
  .max(FIELD_LIMITS.UNIQUE_LABEL.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.UNIQUE_LABEL.max))
  .regex(
    VALIDATION_PATTERNS.UNIQUE_LABEL,
    'Використовуйте тільки латинські літери, цифри, дефіси, підкреслення та пробіли'
  );

/**
 * Схема для дати в майбутньому (дата готовності замовлення)
 */
export const futureDateSchema = z.date().refine((date) => date > new Date(), {
  message: VALIDATION_MESSAGES.FUTURE_DATE,
});

/**
 * Схема для ID замовлення
 */
export const orderIdSchema = z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD);

/**
 * Загальна схема для ID (може використовуватись для різних сутностей)
 */
export const idSchema = z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD);
