/**
 * @fileoverview Загальний index для Order Wizard Zod схем
 * 
 * Цей файл автоматично генерується скриптом create-zod-index.js
 * НЕ РЕДАГУЙТЕ ВРУЧНУ!
 */

// Re-export zod
export { z, type ZodType, type ZodSchema } from 'zod';

// Order Wizard схеми валідації
export * as wizardSchemas from './wizard/zod';

// Для сумісності з попередніми версіями
export * from './wizard/zod';

/**
 * Загальні утиліти для роботи з усіма схемами
 */
import { z } from 'zod';

export const zodUtils = {
  /**
   * Перевіряє чи є значення валідним для будь-якої схеми
   */
  isValid<T>(schema: z.ZodType<T>, data: unknown): data is T {
    return schema.safeParse(data).success;
  },

  /**
   * Отримує помилки валідації у зручному форматі
   */
  getValidationErrors<T>(schema: z.ZodType<T>, data: unknown): string[] {
    const result = schema.safeParse(data);
    if (result.success) return [];
    
    return result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    );
  },

  /**
   * Створює union схему з кількох схем (мінімум 2 схеми)
   */
  createUnion<T extends readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]>(
    schemas: T
  ): z.ZodUnion<T> {
    return z.union(schemas);
  },

  /**
   * Створює схему з default значенням
   */
  withDefault<T>(
    schema: z.ZodType<T>, 
    defaultValue: z.util.noUndefined<T>
  ): z.ZodDefault<z.ZodType<T>> {
    return schema.default(defaultValue);
  },

  /**
   * Створює опціональну схему з fallback значенням
   */
  withFallback<T>(
    schema: z.ZodType<T>, 
    fallbackValue: T
  ): z.ZodCatch<z.ZodType<T>> {
    return schema.catch(fallbackValue);
  },
} as const;