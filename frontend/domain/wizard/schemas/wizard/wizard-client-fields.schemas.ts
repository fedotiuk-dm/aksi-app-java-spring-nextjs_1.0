/**
 * Схеми для клієнтських полів - відповідальність за валідацію особистих даних клієнта
 */

import { z } from 'zod';

import { FIELD_LIMITS } from '../../constants/validation/wizard-validation-limits.constants';
import { VALIDATION_MESSAGES } from '../../constants/validation/wizard-validation-messages.constants';
import { VALIDATION_PATTERNS } from '../../constants/validation/wizard-validation-patterns.constants';

/**
 * Схема для імені/прізвища
 */
export const nameSchema = z
  .string()
  .min(FIELD_LIMITS.FIRST_NAME.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.FIRST_NAME.min))
  .max(FIELD_LIMITS.FIRST_NAME.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.FIRST_NAME.max))
  .regex(VALIDATION_PATTERNS.NAME, "Введіть коректне ім'я");

/**
 * Схема для номера телефону
 */
export const phoneSchema = z
  .string()
  .min(FIELD_LIMITS.PHONE.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.PHONE.min))
  .max(FIELD_LIMITS.PHONE.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.PHONE.max))
  .regex(VALIDATION_PATTERNS.PHONE_UA, VALIDATION_MESSAGES.INVALID_PHONE);

/**
 * Схема для email адреси (опціональна)
 */
export const emailSchema = z
  .string()
  .email(VALIDATION_MESSAGES.INVALID_EMAIL)
  .min(FIELD_LIMITS.EMAIL.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.EMAIL.min))
  .max(FIELD_LIMITS.EMAIL.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.EMAIL.max))
  .optional()
  .or(z.literal(''));

/**
 * Схема для адреси клієнта (опціональна)
 */
export const addressSchema = z
  .string()
  .min(FIELD_LIMITS.ADDRESS.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.ADDRESS.min))
  .max(FIELD_LIMITS.ADDRESS.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.ADDRESS.max))
  .optional()
  .or(z.literal(''));

/**
 * Схема для ID клієнта
 */
export const clientIdSchema = z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD);
