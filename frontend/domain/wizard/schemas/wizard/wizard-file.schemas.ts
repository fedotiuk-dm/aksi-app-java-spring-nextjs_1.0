/**
 * Схеми для файлів - відповідальність за валідацію завантажених файлів
 */

import { z } from 'zod';

import { VALIDATION_MESSAGES } from '../../constants/validation/wizard-validation-messages.constants';

/**
 * Базова схема для файлу
 */
export const fileSchema = z.object({
  file: z.instanceof(File),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
});

/**
 * Схема для зображень з додатковими обмеженнями
 */
export const imageFileSchema = fileSchema.extend({
  type: z.string().refine((type) => type.startsWith('image/'), 'Файл повинен бути зображенням'),
  size: z.number().refine((size) => size <= 5 * 1024 * 1024, VALIDATION_MESSAGES.FILE_TOO_LARGE(5)),
});

/**
 * Схема для документів PDF
 */
export const pdfFileSchema = fileSchema.extend({
  type: z.string().refine((type) => type === 'application/pdf', 'Файл повинен бути PDF'),
  size: z
    .number()
    .refine((size) => size <= 10 * 1024 * 1024, VALIDATION_MESSAGES.FILE_TOO_LARGE(10)),
});

/**
 * Схема для загальних документів
 */
export const documentFileSchema = fileSchema.extend({
  type: z
    .string()
    .refine(
      (type) =>
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(type),
      'Підтримуються тільки PDF, DOC та DOCX файли'
    ),
  size: z
    .number()
    .refine((size) => size <= 10 * 1024 * 1024, VALIDATION_MESSAGES.FILE_TOO_LARGE(10)),
});

/**
 * Схема для множинного завантаження файлів
 */
export const multipleFilesSchema = z
  .array(fileSchema)
  .min(1, 'Виберіть принаймні один файл')
  .max(10, 'Максимум 10 файлів за раз');
