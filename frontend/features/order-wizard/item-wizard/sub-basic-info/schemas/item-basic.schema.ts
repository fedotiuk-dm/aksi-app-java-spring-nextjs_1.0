import { z } from 'zod';

import { nonEmptyString, positiveNumber, priceNumber } from '@features/order-wizard/shared';

/**
 * Схема для основної інформації про предмет замовлення
 */
export const itemBasicSchema = z.object({
  name: nonEmptyString.min(2, 'Назва предмета повинна містити мінімум 2 символи'),
  description: z.string().optional(),
  quantity: positiveNumber.int('Кількість повинна бути цілим числом'),
  unitPrice: priceNumber,
  category: z.string().optional(),
  unitOfMeasure: z.string().optional(),
});

/**
 * Схема форми для основної інформації про предмет
 */
export const itemBasicFormSchema = itemBasicSchema;

/**
 * Типи даних на основі схем
 */
export type ItemBasic = z.infer<typeof itemBasicSchema>;
export type ItemBasicForm = z.infer<typeof itemBasicFormSchema>;
