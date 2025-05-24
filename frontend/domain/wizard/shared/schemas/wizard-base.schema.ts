/**
 * Базові Zod схеми для Order Wizard
 */

import { z } from 'zod';

import {
  VALIDATION_MESSAGES,
  VALIDATION_PATTERNS,
  FIELD_LIMITS,
} from '../constants/validation.constants';
import { WizardMode, ValidationStatus } from '../types/wizard-common.types';

// Базова схема валідації кроку
export const wizardStepStateSchema = z.object({
  isValid: z.boolean(),
  isComplete: z.boolean(),
  validationStatus: z.nativeEnum(ValidationStatus),
  errors: z.array(z.string()),
  lastValidated: z.date().nullable(),
});

// Схема метаданих wizard
export const wizardMetadataSchema = z.object({
  startedAt: z.string(),
  lastUpdated: z.string().optional(),
  userAgent: z.string().optional(),
  sessionId: z.string().optional(),
  version: z.string().optional(),
});

// Схема контексту wizard
export const wizardContextSchema = z.object({
  mode: z.nativeEnum(WizardMode),
  orderId: z.string().optional(),
  customerId: z.string().optional(),
  metadata: wizardMetadataSchema,
});

// Схема стану збереження
export const saveStateSchema = z.object({
  isDraft: z.boolean(),
  autoSaveEnabled: z.boolean(),
  lastSaved: z.date().nullable(),
  hasUnsavedChanges: z.boolean(),
});

// Базові поля для валідації

// ПІБ
export const nameSchema = z
  .string()
  .min(FIELD_LIMITS.FIRST_NAME.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.FIRST_NAME.min))
  .max(FIELD_LIMITS.FIRST_NAME.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.FIRST_NAME.max))
  .regex(VALIDATION_PATTERNS.NAME, "Введіть коректне ім'я");

// Телефон
export const phoneSchema = z
  .string()
  .min(FIELD_LIMITS.PHONE.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.PHONE.min))
  .max(FIELD_LIMITS.PHONE.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.PHONE.max))
  .regex(VALIDATION_PATTERNS.PHONE_UA, VALIDATION_MESSAGES.INVALID_PHONE);

// Email (опціональний)
export const emailSchema = z
  .string()
  .email(VALIDATION_MESSAGES.INVALID_EMAIL)
  .min(FIELD_LIMITS.EMAIL.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.EMAIL.min))
  .max(FIELD_LIMITS.EMAIL.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.EMAIL.max))
  .optional()
  .or(z.literal(''));

// Адреса (опціональна)
export const addressSchema = z
  .string()
  .min(FIELD_LIMITS.ADDRESS.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.ADDRESS.min))
  .max(FIELD_LIMITS.ADDRESS.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.ADDRESS.max))
  .optional()
  .or(z.literal(''));

// Номер квитанції
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

// Унікальна мітка
export const uniqueLabelSchema = z
  .string()
  .min(FIELD_LIMITS.UNIQUE_LABEL.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.UNIQUE_LABEL.min))
  .max(FIELD_LIMITS.UNIQUE_LABEL.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.UNIQUE_LABEL.max))
  .regex(
    VALIDATION_PATTERNS.UNIQUE_LABEL,
    'Використовуйте тільки латинські літери, цифри, дефіси, підкреслення та пробіли'
  );

// Кількість
export const quantitySchema = z
  .number()
  .min(FIELD_LIMITS.QUANTITY.min, VALIDATION_MESSAGES.MIN_VALUE(FIELD_LIMITS.QUANTITY.min))
  .max(FIELD_LIMITS.QUANTITY.max, VALIDATION_MESSAGES.MAX_VALUE(FIELD_LIMITS.QUANTITY.max))
  .int('Кількість повинна бути цілим числом');

// Ціна
export const priceSchema = z
  .number()
  .min(FIELD_LIMITS.PRICE.min, VALIDATION_MESSAGES.MIN_VALUE(FIELD_LIMITS.PRICE.min))
  .max(FIELD_LIMITS.PRICE.max, VALIDATION_MESSAGES.MAX_VALUE(FIELD_LIMITS.PRICE.max));

// Дата в майбутньому
export const futureDateSchema = z.date().refine((date) => date > new Date(), {
  message: VALIDATION_MESSAGES.FUTURE_DATE,
});

// ID (UUID або числовий)
export const idSchema = z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD);

// Схема для файлів
export const fileSchema = z.object({
  file: z.instanceof(File),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
});

// Схема для зображень
export const imageFileSchema = fileSchema.extend({
  type: z.string().refine((type) => type.startsWith('image/'), 'Файл повинен бути зображенням'),
  size: z.number().refine((size) => size <= 5 * 1024 * 1024, VALIDATION_MESSAGES.FILE_TOO_LARGE(5)),
});

// Загальна схема результату операції
export const operationResultSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  errors: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
});
