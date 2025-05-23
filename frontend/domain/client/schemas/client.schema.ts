import { z } from 'zod';

import { ClientSource, CommunicationChannel } from '../types/client-enums';

/**
 * Схема для валідації телефону
 */
const phoneSchema = z
  .string()
  .min(10, 'Телефон повинен містити мінімум 10 символів')
  .max(15, 'Телефон не може містити більше 15 символів')
  .regex(/^\+?[0-9]+$/, 'Телефон може містити тільки цифри та знак +');

/**
 * Схема для валідації email
 */
const emailSchema = z.string().email('Введіть коректний email').optional().or(z.literal(''));

/**
 * Схема для валідації каналів комунікації
 */
const communicationChannelsSchema = z
  .array(z.nativeEnum(CommunicationChannel))
  .optional()
  .default([]);

/**
 * Схема для валідації джерела
 */
const sourceSchema = z.nativeEnum(ClientSource).optional();

/**
 * Схема для валідації структурованої адреси
 */
export const addressDTOSchema = z
  .object({
    city: z
      .string()
      .trim()
      .min(2, 'Назва міста повинна містити мінімум 2 символи')
      .max(100, 'Назва міста не може бути довшою за 100 символів')
      .optional()
      .or(z.literal('')),
    street: z
      .string()
      .trim()
      .min(2, 'Назва вулиці повинна містити мінімум 2 символи')
      .max(150, 'Назва вулиці не може бути довшою за 150 символів')
      .optional()
      .or(z.literal('')),
    building: z
      .string()
      .trim()
      .max(20, 'Номер будинку не може перевищувати 20 символів')
      .optional()
      .or(z.literal('')),
    apartment: z
      .string()
      .trim()
      .max(20, 'Номер квартири не може перевищувати 20 символів')
      .optional()
      .or(z.literal('')),
    postalCode: z
      .string()
      .trim()
      .max(10, 'Поштовий індекс не може перевищувати 10 символів')
      .regex(/^[0-9\-]*$/, 'Поштовий індекс може містити тільки цифри та тире')
      .optional()
      .or(z.literal('')),
    fullAddress: z
      .string()
      .trim()
      .min(5, 'Адреса повинна містити мінімум 5 символів')
      .max(500, 'Адреса не може містити більше 500 символів')
      .optional()
      .or(z.literal('')),
  })
  .optional();

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
  structuredAddress: addressDTOSchema,
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
  id: z.string().min(1, 'ID клієнта не може бути порожнім'),
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
export type AddressDTOSchemaType = z.infer<typeof addressDTOSchema>;
