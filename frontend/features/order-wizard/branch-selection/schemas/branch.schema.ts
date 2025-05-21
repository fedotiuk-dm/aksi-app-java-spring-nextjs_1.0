import { z } from 'zod';

import { nonEmptyString, uuidSchema, phoneSchema } from '../../shared/schemas/common.schema';

/**
 * Базова схема для філії
 */
export const branchBaseSchema = z.object({
  name: nonEmptyString.min(2, 'Назва філії повинна містити мінімум 2 символи'),
  address: nonEmptyString.min(5, 'Адреса філії повинна містити мінімум 5 символів'),
  phone: phoneSchema.optional(),
  code: nonEmptyString.min(2, 'Код філії повинен містити мінімум 2 символи'),
  active: z.boolean().optional()
});

/**
 * Схема для філії із сервера
 */
export const branchSchema = branchBaseSchema.extend({
  id: uuidSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

/**
 * Схема для форми вибору філії
 */
export const branchSelectionFormSchema = z.object({
  branchId: uuidSchema
});

/**
 * Типи даних на основі схем
 */
export type BranchBase = z.infer<typeof branchBaseSchema>;
export type Branch = z.infer<typeof branchSchema>;
export type BranchSelectionForm = z.infer<typeof branchSelectionFormSchema>;
