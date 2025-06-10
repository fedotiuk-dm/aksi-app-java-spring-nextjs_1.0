/**
 * @fileoverview Загальний index для всіх Zod схем
 *
 * Цей файл автоматично генерується скриптом create-zod-index.js
 * НЕ РЕДАГУЙТЕ ВРУЧНУ!
 */

// Re-export zod
export { z, type ZodType, type ZodSchema } from 'zod';

// Auth домен схеми
export * as authSchemas from './auth/zod';

// Branch домен схеми
export * as branchSchemas from './branch/zod';

// Client домен схеми
export * as clientSchemas from './client/zod';

// Order домен схеми
export * as orderSchemas from './order/zod';

// Pricing домен схеми
export * as pricingSchemas from './pricing/zod';

// Receipt домен схеми
export * as receiptSchemas from './receipt/zod';

// Test домен схеми
export * as testSchemas from './test/zod';

// Повні схеми
export * as fullSchemas from './full/zod/aksiApi';

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
   * Створює union схему з кількох схем
   */
  createUnion<T extends readonly [z.ZodTypeAny, ...z.ZodTypeAny[]]>(
    schemas: T
  ): z.ZodUnion<T> {
    return z.union(schemas);
  },

  /**
   * Створює схему з default значенням
   */
  withDefault<T>(schema: z.ZodType<T>, defaultValue: T): z.ZodDefault<z.ZodType<T>> {
    return schema.default(defaultValue);
  },
} as const;
