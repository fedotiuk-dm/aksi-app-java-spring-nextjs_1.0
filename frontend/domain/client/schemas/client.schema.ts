import { z } from 'zod';

import { ClientSource, CommunicationChannel } from '../types/client-enums';

/**
 * Схема для валідації телефонного номера
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(9, { message: 'Телефон повинен містити мінімум 9 символів' })
  .max(20, { message: 'Телефон не може містити більше 20 символів' })
  .regex(/^\+?[\d\s()-]+$/, {
    message: 'Некоректний формат телефону',
  });

/**
 * Схема для валідації електронної пошти
 */
export const emailSchema = z
  .string()
  .trim()
  .email({ message: 'Некоректний формат електронної пошти' })
  .optional()
  .or(z.literal(''));

/**
 * Схема для валідації джерела клієнта
 */
export const sourceSchema = z.nativeEnum(ClientSource).optional();

/**
 * Схема для валідації комунікаційних каналів
 */
export const communicationChannelsSchema = z.array(z.nativeEnum(CommunicationChannel)).optional();

/**
 * Схема для валідації форми створення клієнта
 */
export const createClientSchema = z.object({
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Прізвище не може бути порожнім' })
    .max(50, { message: 'Прізвище не може бути довшим за 50 символів' }),
  firstName: z
    .string()
    .trim()
    .min(1, { message: "Ім'я не може бути порожнім" })
    .max(50, { message: "Ім'я не може бути довшим за 50 символів" }),
  phone: phoneSchema,
  email: emailSchema,
  address: z
    .string()
    .trim()
    .max(200, { message: 'Адреса не може містити більше 200 символів' })
    .optional()
    .or(z.literal('')),
  communicationChannels: communicationChannelsSchema,
  source: sourceSchema,
  sourceDetails: z
    .string()
    .trim()
    .max(200, { message: 'Деталі джерела не можуть перевищувати 200 символів' })
    .optional()
    .or(z.literal('')),
});

/**
 * Схема для валідації форми оновлення клієнта
 */
export const updateClientSchema = createClientSchema.extend({
  id: z.string().trim().min(1, { message: 'ID клієнта не може бути порожнім' }),
});

/**
 * Схема для пошуку клієнтів
 */
export const clientSearchSchema = z.object({
  keyword: z.string().optional(),
  page: z.number().min(0).optional(),
  size: z.number().min(1).max(100).optional(),
});

/**
 * Експорт типів на основі схем
 */
export type CreateClientSchema = z.infer<typeof createClientSchema>;
export type UpdateClientSchema = z.infer<typeof updateClientSchema>;
export type ClientSearchSchema = z.infer<typeof clientSearchSchema>;
