import { z } from 'zod';

import { shortText, uuidSchema } from '@features/order-wizard/shared';

/**
 * Схема для фотодокументації предмета
 */
export const itemPhotoSchema = z.object({
  id: uuidSchema.optional(),
  itemId: uuidSchema,
  fileUrl: z.string().url('Невірний формат URL фото').optional(),
  thumbnailUrl: z.string().url('Невірний формат URL мініатюри').optional(),
  description: shortText.optional(),
  annotations: z.string().optional(),
});

/**
 * Схема для форми завантаження фото
 */
export const itemPhotoUploadFormSchema = z.object({
  itemId: uuidSchema,
  file: z.instanceof(File, { message: 'Виберіть файл для завантаження' }),
  description: shortText.optional(),
});

/**
 * Типи даних на основі схем
 */
export type ItemPhoto = z.infer<typeof itemPhotoSchema>;
export type ItemPhotoUploadForm = z.infer<typeof itemPhotoUploadFormSchema>;
