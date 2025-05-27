/**
 * @fileoverview Zod схеми для валідації API відповідей
 * @module domain/wizard/services/stage-3-item-management/basic-info/schemas/api-responses
 */

import { z } from 'zod';

/**
 * Схема для API відповіді категорії послуги
 */
export const serviceCategoryApiResponseSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  sortOrder: z.number().optional(),
  active: z.boolean().optional(),
  standardProcessingDays: z.number().optional(),
});

/**
 * Схема для API відповіді предмета з прайсу
 */
export const itemNameApiResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  basePrice: z.number(),
  categoryId: z.string(),
  categoryCode: z.string().optional(),
  unitOfMeasure: z.string(),
  catalogNumber: z.number().optional(),
  active: z.boolean().optional(),
});

/**
 * Типи згенеровані з API схем
 */
export type ServiceCategoryApiResponse = z.infer<typeof serviceCategoryApiResponseSchema>;
export type ItemNameApiResponse = z.infer<typeof itemNameApiResponseSchema>;
