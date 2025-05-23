import { z } from 'zod';

/**
 * Базові схеми валідації для всіх доменів
 * Централізована валідація згідно DDD принципів
 */

// Базові рядки
export const nonEmptyString = z.string().trim().min(1, "Це поле є обов'язковим");
export const optionalString = z.string().trim().optional();
export const longText = z.string().trim().max(1000, 'Текст занадто довгий');

// UUID схема
export const uuidSchema = z.string().uuid('Невірний формат ідентифікатора');
export const optionalUuidSchema = uuidSchema.optional();

// Дати
export const dateSchema = z.string().datetime('Невірний формат дати');
export const optionalDateSchema = dateSchema.optional();

// Телефони
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]{10,15}$/, 'Невірний формат телефону')
  .transform((val) => val.replace(/\s+/g, ''));

// Email
export const emailSchema = z.string().email('Невірний формат email');
export const optionalEmailSchema = emailSchema.optional();

// Адреси
export const addressSchema = z
  .string()
  .min(5, 'Адреса повинна містити мінімум 5 символів')
  .max(200, 'Адреса занадто довга');

// Ціни та числа
export const priceSchema = z
  .number()
  .positive('Ціна повинна бути позитивною')
  .max(999999.99, 'Ціна занадто велика');

export const quantitySchema = z
  .number()
  .int('Кількість повинна бути цілим числом')
  .positive('Кількість повинна бути позитивною')
  .max(999, 'Занадто велика кількість');

// Пагінація
export const paginationSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20),
});

// Експорт типів
export type NonEmptyString = z.infer<typeof nonEmptyString>;
export type OptionalString = z.infer<typeof optionalString>;
export type LongText = z.infer<typeof longText>;
export type UuidSchema = z.infer<typeof uuidSchema>;
export type OptionalUuidSchema = z.infer<typeof optionalUuidSchema>;
export type DateSchema = z.infer<typeof dateSchema>;
export type OptionalDateSchema = z.infer<typeof optionalDateSchema>;
export type PhoneSchema = z.infer<typeof phoneSchema>;
export type EmailSchema = z.infer<typeof emailSchema>;
export type OptionalEmailSchema = z.infer<typeof optionalEmailSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
export type PriceSchema = z.infer<typeof priceSchema>;
export type QuantitySchema = z.infer<typeof quantitySchema>;
export type PaginationSchema = z.infer<typeof paginationSchema>;
