import { z } from 'zod';

import {
  nonEmptyString,
  phoneSchema,
  emailSchema,
  uuidSchema,
} from '../../shared/schemas/common.schema';

// Константи для повідомлень валідації
const MIN_NAME_LENGTH_MSG = 'Мінімальна довжина - 2 символи';
const LAST_NAME_ERROR_MSG = `Прізвище повинно містити ${MIN_NAME_LENGTH_MSG}`;
const FIRST_NAME_ERROR_MSG = `Ім'я повинно містити ${MIN_NAME_LENGTH_MSG}`;

/**
 * Схема для одного джерела звернення клієнта
 */
export const clientSourceItemSchema = z.enum(['INSTAGRAM', 'GOOGLE', 'RECOMMENDATION', 'OTHER']);

/**
 * Схема для масиву джерел звернення клієнта
 */
export const clientSourceSchema = z
  .array(clientSourceItemSchema)
  .min(0)
  .optional()
  .or(z.null())
  .default([])
  .transform((val) => val || []);

/**
 * Схема для каналів комунікації з клієнтом
 */
export const communicationChannelSchema = z.enum(['PHONE', 'SMS', 'VIBER'], {
  errorMap: () => ({ message: 'Виберіть канал комунікації' }),
});

/**
 * Схема для структури адреси
 */
export const addressSchema = z
  .string()
  .min(5, { message: 'Мінімум 5 символів' })
  .max(255, { message: 'Максимум 255 символів' })
  .nullish();

/**
 * Схема для базової інформації про клієнта
 */
export const clientBaseSchema = z.object({
  lastName: nonEmptyString.min(2, LAST_NAME_ERROR_MSG),
  firstName: nonEmptyString.min(2, FIRST_NAME_ERROR_MSG),
  phone: phoneSchema,
  email: emailSchema,
  address: addressSchema,
  communicationChannels: z
    .array(communicationChannelSchema)
    .min(1, 'Виберіть хоча б один канал комунікації'),
  source: clientSourceSchema,
  sourceDetails: z.string().optional(),
});

/**
 * Схема для вибору клієнта з існуючих
 */
export const clientSelectionSchema = z.object({
  clientId: uuidSchema,
});

/**
 * Схема для валідації пошукових параметрів
 */
export const clientSearchSchema = z.object({
  query: z.string().min(2, { message: 'Мінімум 2 символи для пошуку' }),
  page: z
    .union([
      z.number().int().min(0),
      z
        .string()
        .regex(/^\d+$/)
        .transform((val) => parseInt(val, 10)),
    ])
    .optional(),
  size: z
    .union([
      z.number().int().min(1).max(100),
      z
        .string()
        .regex(/^\d+$/)
        .transform((val) => parseInt(val, 10)),
    ])
    .optional(),
});

/**
 * Спрощена схема для створення нового клієнта
 * Для форми створення клієнта в процесі замовлення
 */
export const simpleClientSchema = z.object({
  lastName: nonEmptyString.min(2, LAST_NAME_ERROR_MSG),
  firstName: nonEmptyString.min(2, FIRST_NAME_ERROR_MSG),
  phone: phoneSchema,
  email: emailSchema,
});

/**
 * Схема форми клієнта для компонента ClientForm
 * Використовується для валідації полів у формі створення та редагування клієнта
 */
export const clientFormSchema = z.object({
  firstName: nonEmptyString.min(2, FIRST_NAME_ERROR_MSG),
  lastName: nonEmptyString.min(2, LAST_NAME_ERROR_MSG),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  address: z.string().optional(),
  source: z.array(clientSourceItemSchema).min(0).optional(),
  communicationChannels: z.array(communicationChannelSchema).min(1, {
    message: 'Виберіть хоча б один канал комунікації',
  }),
  sourceDetails: z.string().max(255, { message: 'Максимум 255 символів' }).optional().nullable(),
});

/**
 * Схема для створення нового клієнта
 */
export const createClientSchema = clientFormSchema.extend({
  // Додаткова валідація для створення нового клієнта
});

/**
 * Схема для редагування існуючого клієнта
 */
export const editClientSchema = clientFormSchema.extend({
  id: z.string().optional(),
  // Додаткова валідація для редагування клієнта
});

/**
 * Схема форми для кроку вибору клієнта
 */
export const clientSelectionFormSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('existing'),
    existingClient: clientSelectionSchema,
  }),
  z.object({
    mode: z.literal('new'),
    newClient: createClientSchema,
  }),
  z.object({
    mode: z.literal('edit'),
    editClient: editClientSchema,
  }),
]);

/**
 * Типи даних на основі схем
 */
export type ClientSource = z.infer<typeof clientSourceSchema>;
export type CommunicationChannel = z.infer<typeof communicationChannelSchema>;
export type ClientAddress = z.infer<typeof addressSchema>;
export type ClientBase = z.infer<typeof clientBaseSchema>;
export type ClientSearch = z.infer<typeof clientSearchSchema>;
export type SimpleClient = z.infer<typeof simpleClientSchema>;
export type ClientSelection = z.infer<typeof clientSelectionSchema>;
export type CreateClient = z.infer<typeof createClientSchema>;
export type EditClient = z.infer<typeof editClientSchema>;
export type ClientSelectionForm = z.infer<typeof clientSelectionFormSchema>;
