/**
 * Схеми для результатів операцій - відповідальність за валідацію відповідей від сервера
 */

import { z } from 'zod';

/**
 * Загальна схема результату операції
 */
export const operationResultSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  errors: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
});

/**
 * Схема результату з типізованими даними
 */
export const typedOperationResultSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    errors: z.array(z.string()).optional(),
    warnings: z.array(z.string()).optional(),
  });

/**
 * Схема результату створення сутності
 */
export const createResultSchema = z.object({
  success: z.boolean(),
  id: z.string().optional(),
  data: z.any().optional(),
  errors: z.array(z.string()).optional(),
});

/**
 * Схема результату оновлення сутності
 */
export const updateResultSchema = z.object({
  success: z.boolean(),
  updated: z.boolean(),
  data: z.any().optional(),
  errors: z.array(z.string()).optional(),
});

/**
 * Схема результату видалення сутності
 */
export const deleteResultSchema = z.object({
  success: z.boolean(),
  deleted: z.boolean(),
  errors: z.array(z.string()).optional(),
});

/**
 * Схема результату з пагінацією
 */
export const paginatedResultSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
    errors: z.array(z.string()).optional(),
  });

/**
 * Схема результату валідації
 */
export const validationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()).optional(),
  field: z.string().optional(),
});
