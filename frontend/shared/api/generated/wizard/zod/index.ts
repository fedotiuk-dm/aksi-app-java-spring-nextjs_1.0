/**
 * @fileoverview Zod схеми для домену wizard
 * 
 * Цей файл автоматично генерується скриптом create-zod-index.js
 * НЕ РЕДАГУЙТЕ ВРУЧНУ!
 */

// Експорт всіх Zod схем
export * from './aksiApi';

// Re-export zod для зручності
export { z, type ZodType, type ZodSchema } from 'zod';

// Утиліти для валідації
import { z } from 'zod';

/**
 * Утиліта для безпечної валідації з детальними помилками
 */
export function safeValidate<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}

/**
 * Утиліта для валідації з викиданням помилки
 */
export function validateOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = safeValidate(schema, data);
  
  if (!result.success) {
    throw new Error(`Validation failed: ${result.errors.join(', ')}`);
  }
  
  return result.data;
}

/**
 * Утиліта для створення часткової схеми
 */
export function createPartialSchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): z.ZodObject<{ [K in keyof T]: z.ZodOptional<T[K]> }> {
  return schema.partial();
}

/**
 * Константи домену для валідації
 */
export const WIZARD_VALIDATION = {
  DOMAIN_NAME: 'wizard',
  safeValidate,
  validateOrThrow,
  createPartialSchema,
} as const;