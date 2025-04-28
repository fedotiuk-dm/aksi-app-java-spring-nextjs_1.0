import { z } from 'zod';
import { ItemPhoto } from '../types/types';

/**
 * Схема валідації для одного фото
 */
export const itemPhotoSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'Розмір файлу не повинен перевищувати 5MB'
    ),
});

/**
 * Схема валідації для форми з фотографіями
 */
export const itemPhotosFormSchema = z.object({
  photos: z
    .array(itemPhotoSchema)
    .max(5, 'Максимальна кількість фото - 5')
    .optional(),
});

/**
 * Тип для результату завантаження фото
 */
export interface PhotoUploadResult {
  photo: ItemPhoto;
  success: boolean;
  error?: string;
}

/**
 * Тип для форми фотографій
 */
export type ItemPhotosFormValues = z.infer<typeof itemPhotosFormSchema>;
