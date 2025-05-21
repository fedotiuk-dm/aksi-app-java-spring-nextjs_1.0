import { z } from 'zod';

import { shortText } from '@features/order-wizard/shared';

/**
 * Схема для характеристик предмета замовлення
 */
export const itemPropertiesSchema = z.object({
  color: shortText.optional(),
  material: shortText.optional(),
  fillerType: z.string().optional(),
  fillerCompressed: z.boolean().default(false),
  wearDegree: z.string().optional()
});

/**
 * Схема форми для характеристик предмета
 */
export const itemPropertiesFormSchema = itemPropertiesSchema;

/**
 * Типи даних на основі схем
 */
export type ItemProperties = z.infer<typeof itemPropertiesSchema>;
export type ItemPropertiesForm = z.infer<typeof itemPropertiesFormSchema>;
