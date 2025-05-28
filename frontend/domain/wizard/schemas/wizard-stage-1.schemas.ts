/**
 * @fileoverview Схеми валідації для Stage 1: Клієнт та базова інформація замовлення
 * @module domain/wizard/schemas
 */

import { z } from 'zod';

// === КОНСТАНТИ ===

/**
 * Мінімальні довжини для валідації
 */
const MIN_NAME_LENGTH = 2;
const MIN_PHONE_LENGTH = 10;
const MIN_UNIQUE_TAG_LENGTH = 3;

/**
 * Повідомлення про помилки
 */
const VALIDATION_MESSAGES = {
  FIRST_NAME_MIN: `Ім'я від ${MIN_NAME_LENGTH} символів`,
  LAST_NAME_MIN: `Прізвище від ${MIN_NAME_LENGTH} символів`,
  PHONE_MIN: `Телефон від ${MIN_PHONE_LENGTH} символів`,
  EMAIL_INVALID: 'Некоректний email',
  UNIQUE_TAG_MIN: `Унікальна мітка від ${MIN_UNIQUE_TAG_LENGTH} символів`,
  BRANCH_REQUIRED: 'Оберіть філію',
  CLIENT_REQUIRED: 'Потрібен ID клієнта',
} as const;

// === ENUMS ===

/**
 * Доступні методи зв'язку з клієнтом
 */
export const contactMethodEnum = z.enum(['phone', 'sms', 'viber']);

/**
 * Джерела інформації про хімчистку
 */
export const infoSourceEnum = z.enum(['instagram', 'google', 'recommendation', 'other']);

// === СХЕМИ STAGE 1.1: УПРАВЛІННЯ КЛІЄНТАМИ ===

/**
 * Схема для створення/редагування клієнта
 */
export const clientManagementSchema = z.object({
  firstName: z.string().min(MIN_NAME_LENGTH, VALIDATION_MESSAGES.FIRST_NAME_MIN),
  lastName: z.string().min(MIN_NAME_LENGTH, VALIDATION_MESSAGES.LAST_NAME_MIN),
  phone: z.string().min(MIN_PHONE_LENGTH, VALIDATION_MESSAGES.PHONE_MIN),
  email: z.string().email(VALIDATION_MESSAGES.EMAIL_INVALID).optional().nullable(),
  address: z.string().optional().nullable(),
  contactMethods: z.array(contactMethodEnum).optional(),
  infoSource: infoSourceEnum.optional(),
  infoSourceDetails: z.string().optional(),
});

/**
 * Схема для пошуку клієнтів
 */
export const clientSearchSchema = z.object({
  keyword: z.string().min(1, 'Введіть ключове слово для пошуку'),
  searchBy: z.enum(['name', 'phone', 'email', 'address']).optional(),
});

/**
 * Схема для перевірки унікальності
 */
export const clientUniquenessSchema = z.object({
  phone: z.string().min(MIN_PHONE_LENGTH),
  email: z.string().email().optional(),
  excludeClientId: z.string().optional(),
});

// === СХЕМИ STAGE 1.2: ВИБІР ФІЛІЇ ===

/**
 * Схема для вибору філії
 */
export const branchSelectionSchema = z.object({
  branchId: z.string().min(1, VALIDATION_MESSAGES.BRANCH_REQUIRED),
});

/**
 * Схема для фільтрації філій
 */
export const branchFilterSchema = z.object({
  searchTerm: z.string().optional(),
  activeOnly: z.boolean().default(true),
});

// === СХЕМИ STAGE 1.3: ІНІЦІАЛІЗАЦІЯ ЗАМОВЛЕННЯ ===

/**
 * Схема для ініціалізації замовлення
 */
export const orderInitializationSchema = z.object({
  branchId: z.string().min(1, VALIDATION_MESSAGES.BRANCH_REQUIRED),
  clientId: z.string().min(1, VALIDATION_MESSAGES.CLIENT_REQUIRED),
  uniqueTag: z.string().min(MIN_UNIQUE_TAG_LENGTH, VALIDATION_MESSAGES.UNIQUE_TAG_MIN),
});

/**
 * Схема для валідації унікальної мітки
 */
export const uniqueTagValidationSchema = z.object({
  tag: z.string().min(MIN_UNIQUE_TAG_LENGTH, VALIDATION_MESSAGES.UNIQUE_TAG_MIN),
  excludeOrderId: z.string().optional(),
});

/**
 * Схема для базової інформації замовлення
 */
export const orderBasicInfoSchema = z.object({
  receiptNumber: z.string().min(1, 'Потрібен номер квитанції'),
  uniqueTag: z.string().min(MIN_UNIQUE_TAG_LENGTH),
  branchId: z.string().min(1),
  clientId: z.string().min(1),
  createdAt: z.string().datetime('Некоректна дата створення'),
});

/**
 * Схема для генерації номеру квитанції
 */
export const receiptNumberGenerationSchema = z.object({
  branchCode: z.string().min(1, 'Потрібен код філії'),
  timestamp: z.number().optional(),
  randomSuffix: z.string().optional(),
});

// === КОМПОЗИТНІ СХЕМИ ===

/**
 * Повна схема для завершення першого етапу
 */
export const stage1CompletionSchema = z.object({
  client: clientManagementSchema.or(z.object({ id: z.string().min(1) })),
  branch: branchSelectionSchema,
  orderInit: orderInitializationSchema,
});

// === ТИПИ ЗГЕНЕРОВАНІ З ZOD СХЕМ ===

export type ContactMethod = z.infer<typeof contactMethodEnum>;
export type InfoSource = z.infer<typeof infoSourceEnum>;
export type ClientManagementData = z.infer<typeof clientManagementSchema>;
export type ClientSearchData = z.infer<typeof clientSearchSchema>;
export type ClientUniquenessData = z.infer<typeof clientUniquenessSchema>;
export type BranchSelectionData = z.infer<typeof branchSelectionSchema>;
export type BranchFilterData = z.infer<typeof branchFilterSchema>;
export type OrderInitializationData = z.infer<typeof orderInitializationSchema>;
export type UniqueTagValidationData = z.infer<typeof uniqueTagValidationSchema>;
export type OrderBasicInfoData = z.infer<typeof orderBasicInfoSchema>;
export type ReceiptNumberGenerationData = z.infer<typeof receiptNumberGenerationSchema>;
export type Stage1CompletionData = z.infer<typeof stage1CompletionSchema>;
