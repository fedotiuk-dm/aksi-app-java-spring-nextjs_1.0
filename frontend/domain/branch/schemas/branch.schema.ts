import { z } from 'zod';

/**
 * Zod схеми для валідації даних приймального пункту
 * Згідно з вимогами API та доменної логіки
 */

/**
 * Схема для основних даних приймального пункту
 */
export const branchSchema = z.object({
  id: z.string().uuid('Некоректний формат ID').optional(),
  name: z
    .string()
    .min(1, 'Назва не може бути порожньою')
    .max(100, 'Назва не може перевищувати 100 символів')
    .trim(),
  address: z
    .string()
    .min(1, 'Адреса не може бути порожньою')
    .max(300, 'Адреса не може перевищувати 300 символів')
    .trim(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]{10,15}$/, 'Некоректний формат телефону')
    .optional()
    .nullable(),
  code: z
    .string()
    .min(2, 'Код повинен містити мінімум 2 символи')
    .max(5, 'Код не може перевищувати 5 символів')
    .regex(/^[A-Z0-9]{2,5}$/, 'Код може містити тільки великі літери та цифри')
    .trim(),
  active: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * Схема для створення нового приймального пункту
 */
export const createBranchSchema = branchSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Схема для оновлення приймального пункту
 */
export const updateBranchSchema = createBranchSchema.extend({
  id: z.string().uuid('Некоректний формат ID'),
});

/**
 * Схема для пошуку приймальних пунктів
 */
export const branchSearchSchema = z.object({
  keyword: z.string().optional(),
  active: z.boolean().optional(),
  includeInactive: z.boolean().default(false),
});

/**
 * Схема для параметрів фільтрації
 */
export const branchFilterSchema = z.object({
  active: z.boolean().optional(),
  searchTerm: z.string().optional(),
  codes: z.array(z.string()).optional(),
});

/**
 * Типи згенеровані зі схем
 */
export type BranchSchemaType = z.infer<typeof branchSchema>;
export type CreateBranchSchemaType = z.infer<typeof createBranchSchema>;
export type UpdateBranchSchemaType = z.infer<typeof updateBranchSchema>;
export type BranchSearchSchemaType = z.infer<typeof branchSearchSchema>;
export type BranchFilterSchemaType = z.infer<typeof branchFilterSchema>;
