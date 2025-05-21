import { z } from 'zod';

import { nonEmptyString, phoneSchema, emailSchema, uuidSchema } from '../../shared/schemas/common.schema';

/**
 * Схема для джерел звернення клієнта
 */
export const clientSourceSchema = z.enum([
  'INSTAGRAM',
  'GOOGLE',
  'RECOMMENDATION',
  'OTHER'
], {
  errorMap: () => ({ message: 'Виберіть джерело звернення' })
});

/**
 * Схема для каналів комунікації з клієнтом
 */
export const communicationChannelSchema = z.enum([
  'PHONE',
  'SMS',
  'VIBER'
], {
  errorMap: () => ({ message: 'Виберіть канал комунікації' })
});

/**
 * Схема для базової інформації про клієнта
 */
export const clientBaseSchema = z.object({
  lastName: nonEmptyString.min(2, "Прізвище повинно містити мінімум 2 символи"),
  firstName: nonEmptyString.min(2, "Ім'я повинно містити мінімум 2 символи"),
  phone: phoneSchema,
  email: emailSchema,
  address: z.string().optional(),
  communicationChannels: z.array(communicationChannelSchema).min(1, 'Виберіть хоча б один канал комунікації'),
  source: clientSourceSchema,
  sourceDetails: z.string().optional()
});

/**
 * Схема для вибору клієнта з існуючих
 */
export const clientSelectionSchema = z.object({
  clientId: uuidSchema
});

/**
 * Схема для створення нового клієнта
 */
export const createClientSchema = clientBaseSchema;

/**
 * Схема форми для кроку вибору клієнта
 */
export const clientSelectionFormSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('existing'),
    existingClient: clientSelectionSchema
  }),
  z.object({
    mode: z.literal('new'),
    newClient: createClientSchema
  })
]);

/**
 * Типи даних на основі схем
 */
export type ClientSource = z.infer<typeof clientSourceSchema>;
export type CommunicationChannel = z.infer<typeof communicationChannelSchema>;
export type ClientBase = z.infer<typeof clientBaseSchema>;
export type ClientSelection = z.infer<typeof clientSelectionSchema>;
export type CreateClient = z.infer<typeof createClientSchema>;
export type ClientSelectionForm = z.infer<typeof clientSelectionFormSchema>;
