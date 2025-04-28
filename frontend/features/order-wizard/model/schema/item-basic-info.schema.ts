import { z } from 'zod';

/**
 * Схема валідації для форми основної інформації про предмет
 */
export const basicItemSchema = z.object({
  categoryId: z.string().min(1, { message: 'Виберіть категорію послуги' }),
  itemNameId: z.string().min(1, { message: 'Виберіть найменування виробу' }),
  quantity: z.number()
    .int({ message: 'Кількість повинна бути цілим числом' })
    .min(1, { message: 'Кількість повинна бути більше 0' })
    .max(100, { message: 'Кількість занадто велика' }),
  measurementUnit: z.string().min(1, { message: 'Виберіть одиницю виміру' }),
});

/**
 * Тип для форми основної інформації про предмет
 */
export type ItemBasicInfoFormValues = z.infer<typeof basicItemSchema>;
