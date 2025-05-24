/**
 * @fileoverview Базові Zod схеми для Order Wizard - валідація даних на всіх рівнях
 * @module domain/wizard/shared/schemas
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Центральне місце для всіх Zod схем валідації Order Wizard.
 * Включає базові схеми для полів, станів та результатів операцій.
 *
 * Принципи організації схем:
 * - Повторне використання базових схем
 * - Єдині правила валідації для всього додатку
 * - Зрозумілі повідомлення про помилки
 * - Композиція простих схем у складні
 *
 * @example
 * // Використання в формах
 * import { nameSchema, phoneSchema } from '@/domain/wizard/shared/schemas';
 *
 * const clientSchema = z.object({
 *   firstName: nameSchema,
 *   lastName: nameSchema,
 *   phone: phoneSchema
 * });
 *
 * @example
 * // Валідація даних
 * const result = nameSchema.safeParse(inputValue);
 * if (!result.success) {
 *   console.error(result.error.issues);
 * }
 *
 * @see {@link https://zod.dev/} - Zod документація
 * @see {@link ../constants/validation.constants} - Константи валідації
 */

import { z } from 'zod';

import {
  VALIDATION_MESSAGES,
  VALIDATION_PATTERNS,
  FIELD_LIMITS,
} from '../constants/validation.constants';
import { WizardMode, ValidationStatus } from '../types/wizard-common.types';

/**
 * Базова схема стану кроку wizard
 *
 * @constant {ZodObject} wizardStepStateSchema
 * @description
 * Схема для валідації стану будь-якого кроку wizard.
 * Забезпечує узгодженість структури валідації між всіма кроками.
 *
 * @example
 * // Валідація стану кроку
 * const stepState = {
 *   isValid: true,
 *   isComplete: true,
 *   validationStatus: ValidationStatus.VALID,
 *   errors: [],
 *   lastValidated: new Date()
 * };
 * const result = wizardStepStateSchema.parse(stepState);
 *
 * @since 1.0.0
 */
export const wizardStepStateSchema = z.object({
  /** Чи пройшов крок валідацію */
  isValid: z.boolean(),
  /** Чи завершений крок */
  isComplete: z.boolean(),
  /** Поточний статус валідації */
  validationStatus: z.nativeEnum(ValidationStatus),
  /** Список помилок валідації */
  errors: z.array(z.string()),
  /** Час останньої валідації */
  lastValidated: z.date().nullable(),
});

/**
 * Схема метаданих wizard сесії
 *
 * @constant {ZodObject} wizardMetadataSchema
 * @description
 * Схема для валідації метаданих wizard сесії.
 * Використовується для аналітики та діагностики.
 *
 * @example
 * const metadata = {
 *   startedAt: new Date().toISOString(),
 *   userAgent: navigator.userAgent,
 *   sessionId: generateSessionId(),
 *   version: '1.0.0'
 * };
 * const result = wizardMetadataSchema.parse(metadata);
 *
 * @since 1.0.0
 */
export const wizardMetadataSchema = z.object({
  /** ISO дата початку wizard */
  startedAt: z.string(),
  /** ISO дата останнього оновлення */
  lastUpdated: z.string().optional(),
  /** User agent браузера */
  userAgent: z.string().optional(),
  /** Ідентифікатор сесії */
  sessionId: z.string().optional(),
  /** Версія додатку */
  version: z.string().optional(),
});

/**
 * Схема контексту wizard
 *
 * @constant {ZodObject} wizardContextSchema
 * @description
 * Схема для валідації глобального контексту wizard.
 * Включає режим роботи та ідентифікатори.
 *
 * @example
 * const context = {
 *   mode: WizardMode.CREATE,
 *   metadata: { startedAt: new Date().toISOString() }
 * };
 * const result = wizardContextSchema.parse(context);
 *
 * @since 1.0.0
 */
export const wizardContextSchema = z.object({
  /** Режим роботи wizard */
  mode: z.nativeEnum(WizardMode),
  /** ID замовлення (для режиму EDIT) */
  orderId: z.string().optional(),
  /** ID клієнта (для швидкого заповнення) */
  customerId: z.string().optional(),
  /** Метадані сесії */
  metadata: wizardMetadataSchema,
});

/**
 * Схема стану збереження wizard
 *
 * @constant {ZodObject} saveStateSchema
 * @description
 * Схема для валідації стану збереження та автозбереження wizard.
 * Відстежує чернетки та незбережені зміни.
 *
 * @example
 * const saveState = {
 *   isDraft: true,
 *   autoSaveEnabled: true,
 *   lastSaved: new Date(),
 *   hasUnsavedChanges: false
 * };
 * const result = saveStateSchema.parse(saveState);
 *
 * @since 1.0.0
 */
export const saveStateSchema = z.object({
  /** Чи є замовлення чернеткою */
  isDraft: z.boolean(),
  /** Чи увімкнено автозбереження */
  autoSaveEnabled: z.boolean(),
  /** Час останнього збереження */
  lastSaved: z.date().nullable(),
  /** Чи є незбережені зміни */
  hasUnsavedChanges: z.boolean(),
});

// =============================================================================
// БАЗОВІ ПОЛЯ ДЛЯ ВАЛІДАЦІЇ
// =============================================================================

/**
 * Схема валідації імені та прізвища
 *
 * @constant {ZodString} nameSchema
 * @description
 * Універсальна схема для валідації імен, прізвищ та інших особистих даних.
 * Підтримує українські та латинські символи з дефісами.
 *
 * @example
 * const firstName = nameSchema.parse('Олександр'); // ✓
 * const lastName = nameSchema.parse('Петренко-Сидоренко'); // ✓
 * nameSchema.parse('123'); // ✗ ValidationError
 *
 * @since 1.0.0
 */
export const nameSchema = z
  .string()
  .min(FIELD_LIMITS.FIRST_NAME.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.FIRST_NAME.min))
  .max(FIELD_LIMITS.FIRST_NAME.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.FIRST_NAME.max))
  .regex(VALIDATION_PATTERNS.NAME, "Введіть коректне ім'я");

/**
 * Схема валідації українського номера телефону
 *
 * @constant {ZodString} phoneSchema
 * @description
 * Схема для валідації українських номерів телефону в різних форматах:
 * +380XXXXXXXXX, 380XXXXXXXXX, 0XXXXXXXXX
 *
 * @example
 * const phone1 = phoneSchema.parse('+380501234567'); // ✓
 * const phone2 = phoneSchema.parse('0501234567'); // ✓
 * phoneSchema.parse('123'); // ✗ ValidationError
 *
 * @since 1.0.0
 */
export const phoneSchema = z
  .string()
  .min(FIELD_LIMITS.PHONE.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.PHONE.min))
  .max(FIELD_LIMITS.PHONE.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.PHONE.max))
  .regex(VALIDATION_PATTERNS.PHONE_UA, VALIDATION_MESSAGES.INVALID_PHONE);

/**
 * Схема валідації email адреси (опціональна)
 *
 * @constant {ZodString} emailSchema
 * @description
 * Схема для валідації email адрес з підтримкою опціональних значень.
 * Дозволяє порожні рядки та undefined.
 *
 * @example
 * const email1 = emailSchema.parse('user@example.com'); // ✓
 * const email2 = emailSchema.parse(''); // ✓ (опціональний)
 * const email3 = emailSchema.parse(undefined); // ✓ (опціональний)
 * emailSchema.parse('invalid-email'); // ✗ ValidationError
 *
 * @since 1.0.0
 */
export const emailSchema = z
  .string()
  .email(VALIDATION_MESSAGES.INVALID_EMAIL)
  .min(FIELD_LIMITS.EMAIL.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.EMAIL.min))
  .max(FIELD_LIMITS.EMAIL.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.EMAIL.max))
  .optional()
  .or(z.literal(''));

/**
 * Схема валідації адреси (опціональна)
 *
 * @constant {ZodString} addressSchema
 * @description
 * Схема для валідації поштових адрес з підтримкою опціональних значень.
 * Дозволяє порожні рядки та undefined.
 *
 * @example
 * const address1 = addressSchema.parse('вул. Хрещатик, 1'); // ✓
 * const address2 = addressSchema.parse(''); // ✓ (опціональний)
 * addressSchema.parse('a'.repeat(300)); // ✗ ValidationError (занадто довго)
 *
 * @since 1.0.0
 */
export const addressSchema = z
  .string()
  .min(FIELD_LIMITS.ADDRESS.min, VALIDATION_MESSAGES.MIN_LENGTH(FIELD_LIMITS.ADDRESS.min))
  .max(FIELD_LIMITS.ADDRESS.max, VALIDATION_MESSAGES.MAX_LENGTH(FIELD_LIMITS.ADDRESS.max))
  .optional()
  .or(z.literal(''));

/**
 * Схема валідації номера квитанції
 *
 * @constant {ZodString} receiptNumberSchema
 * @description
 * Схема для валідації номерів квитанцій з обмеженим набором символів.
 * Дозволяє латинські літери, цифри, дефіси та підкреслення.
 *
 * @example
 * const receipt1 = receiptNumberSchema.parse('REC-2024-001'); // ✓
 * const receipt2 = receiptNumberSchema.parse('receipt_123'); // ✓
 * receiptNumberSchema.parse('квитанція-123'); // ✗ ValidationError (кирилиця)
 *
 * @since 1.0.0
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
 * Схема валідації унікальної мітки предмета
 *
 * @constant {ZodString} uniqueLabelSchema
 * @description
 * Схема для валідації унікальних міток предметів.
 * Дозволяє більший набір символів ніж номер квитанції.
 *
 * @example
 * const label1 = uniqueLabelSchema.parse('ITEM-001 blue jacket'); // ✓
 * const label2 = uniqueLabelSchema.parse('предмет_123'); // ✗ ValidationError (кирилиця)
 *
 * @since 1.0.0
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
 * Схема валідації кількості предметів
 *
 * @constant {ZodNumber} quantitySchema
 * @description
 * Схема для валідації кількості предметів (штуки або кілограми).
 * Підтримує тільки додатні цілі числа в дозволених межах.
 *
 * @example
 * const quantity1 = quantitySchema.parse(5); // ✓
 * const quantity2 = quantitySchema.parse(1); // ✓
 * quantitySchema.parse(0); // ✗ ValidationError (мінімум 1)
 * quantitySchema.parse(1.5); // ✗ ValidationError (тільки цілі числа)
 *
 * @since 1.0.0
 */
export const quantitySchema = z
  .number()
  .min(FIELD_LIMITS.QUANTITY.min, VALIDATION_MESSAGES.MIN_VALUE(FIELD_LIMITS.QUANTITY.min))
  .max(FIELD_LIMITS.QUANTITY.max, VALIDATION_MESSAGES.MAX_VALUE(FIELD_LIMITS.QUANTITY.max))
  .int('Кількість повинна бути цілим числом');

/**
 * Схема валідації ціни
 *
 * @constant {ZodNumber} priceSchema
 * @description
 * Схема для валідації цін з підтримкою десяткових значень.
 * Підтримує додатні числа в розумних межах.
 *
 * @example
 * const price1 = priceSchema.parse(150.50); // ✓
 * const price2 = priceSchema.parse(0); // ✓ (безкоштовна послуга)
 * priceSchema.parse(-10); // ✗ ValidationError (від'ємна ціна)
 *
 * @since 1.0.0
 */
export const priceSchema = z
  .number()
  .min(FIELD_LIMITS.PRICE.min, VALIDATION_MESSAGES.MIN_VALUE(FIELD_LIMITS.PRICE.min))
  .max(FIELD_LIMITS.PRICE.max, VALIDATION_MESSAGES.MAX_VALUE(FIELD_LIMITS.PRICE.max));

/**
 * Схема валідації дати в майбутньому
 *
 * @constant {ZodDate} futureDateSchema
 * @description
 * Схема для валідації дат які повинні бути в майбутньому.
 * Використовується для дат виконання замовлень.
 *
 * @example
 * const tomorrow = new Date();
 * tomorrow.setDate(tomorrow.getDate() + 1);
 * const futureDate = futureDateSchema.parse(tomorrow); // ✓
 *
 * const yesterday = new Date();
 * yesterday.setDate(yesterday.getDate() - 1);
 * futureDateSchema.parse(yesterday); // ✗ ValidationError (минуле)
 *
 * @since 1.0.0
 */
export const futureDateSchema = z.date().refine((date) => date > new Date(), {
  message: VALIDATION_MESSAGES.FUTURE_DATE,
});

/**
 * Схема валідації ідентифікаторів
 *
 * @constant {ZodString} idSchema
 * @description
 * Універсальна схема для валідації ідентифікаторів (UUID, числові ID).
 * Забезпечує що ID не порожній.
 *
 * @example
 * const id1 = idSchema.parse('550e8400-e29b-41d4-a716-446655440000'); // ✓ UUID
 * const id2 = idSchema.parse('12345'); // ✓ числовий ID
 * idSchema.parse(''); // ✗ ValidationError (порожній)
 *
 * @since 1.0.0
 */
export const idSchema = z.string().min(1, VALIDATION_MESSAGES.REQUIRED_FIELD);

/**
 * Схема валідації файлів
 *
 * @constant {ZodObject} fileSchema
 * @description
 * Базова схема для валідації об'єктів File з усіма необхідними властивостями.
 * Використовується як основа для більш специфічних схем файлів.
 *
 * @example
 * const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
 * const result = fileSchema.parse({
 *   file: file,
 *   name: file.name,
 *   size: file.size,
 *   type: file.type,
 *   lastModified: file.lastModified
 * });
 *
 * @since 1.0.0
 */
export const fileSchema = z.object({
  /** Об'єкт File */
  file: z.instanceof(File),
  /** Назва файлу */
  name: z.string(),
  /** Розмір файлу в байтах */
  size: z.number(),
  /** MIME тип файлу */
  type: z.string(),
  /** Час останньої модифікації */
  lastModified: z.number(),
});

/**
 * Схема валідації зображень
 *
 * @constant {ZodObject} imageFileSchema
 * @description
 * Спеціалізована схема для валідації зображень з обмеженнями типу та розміру.
 * Розширює базову схему файлів додатковими перевірками.
 *
 * @example
 * const imageFile = new File(['image data'], 'photo.jpg', { type: 'image/jpeg' });
 * const result = imageFileSchema.parse({
 *   file: imageFile,
 *   name: imageFile.name,
 *   size: imageFile.size, // повинен бути <= 5MB
 *   type: imageFile.type, // повинен починатися з 'image/'
 *   lastModified: imageFile.lastModified
 * });
 *
 * @since 1.0.0
 */
export const imageFileSchema = fileSchema.extend({
  /** MIME тип повинен бути зображенням */
  type: z.string().refine((type) => type.startsWith('image/'), 'Файл повинен бути зображенням'),
  /** Розмір не більше 5MB */
  size: z.number().refine((size) => size <= 5 * 1024 * 1024, VALIDATION_MESSAGES.FILE_TOO_LARGE(5)),
});

/**
 * Схема результату операції
 *
 * @constant {ZodObject} operationResultSchema
 * @description
 * Універсальна схема для валідації результатів операцій wizard.
 * Забезпечує узгоджений формат відповідей.
 *
 * @example
 * const successResult = operationResultSchema.parse({
 *   success: true,
 *   data: { id: '123', name: 'Item' }
 * });
 *
 * const errorResult = operationResultSchema.parse({
 *   success: false,
 *   errors: ['Validation failed'],
 *   warnings: ['Minor issue detected']
 * });
 *
 * @since 1.0.0
 */
export const operationResultSchema = z.object({
  /** Чи успішна операція */
  success: z.boolean(),
  /** Дані результату (якщо операція успішна) */
  data: z.any().optional(),
  /** Критичні помилки */
  errors: z.array(z.string()).optional(),
  /** Попередження (не блокують операцію) */
  warnings: z.array(z.string()).optional(),
});
