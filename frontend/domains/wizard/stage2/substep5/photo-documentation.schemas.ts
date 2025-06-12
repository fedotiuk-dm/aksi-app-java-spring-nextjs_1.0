/**
 * @fileoverview Схеми для Substep5 Photo Documentation
 *
 * Відповідальність: Zod схеми + TypeScript типи + експорт Orval схем
 * Принцип: Single Responsibility Principle
 */

import { z } from 'zod';

// Експорт готових Orval схем
export {
  substep5AddPhotoBody as AddPhotoBodySchema,
  photoDocumentationDTO as PhotoDocumentationDTOSchema,
  orderItemPhotoDTO as OrderItemPhotoDTOSchema,
  substepResultDTO as SubstepResultDTOSchema,
} from '@/shared/api/generated/wizard/zod/aksiApi';

// UI форми схеми

/**
 * Схема для завантаження фото
 */
export const photoUploadSchema = z.object({
  file: z
    .instanceof(File, { message: "Файл обов'язковий" })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Розмір файлу не повинен перевищувати 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Підтримуються тільки JPEG, PNG, WebP'
    ),
  description: z.string().max(500, 'Опис не повинен перевищувати 500 символів').optional(),
  annotations: z.string().max(1000, 'Анотації не повинні перевищувати 1000 символів').optional(),
});

/**
 * Схема для редагування фото
 */
export const photoEditSchema = z.object({
  photoId: z.string().min(1, "ID фото обов'язкове"),
  description: z.string().max(500, 'Опис не повинен перевищувати 500 символів').optional(),
  annotations: z.string().max(1000, 'Анотації не повинні перевищувати 1000 символів').optional(),
});

/**
 * Схема для налаштувань камери
 */
export const cameraSettingsSchema = z.object({
  quality: z.enum(['low', 'medium', 'high'], { message: 'Невірна якість' }).default('medium'),
  facingMode: z
    .enum(['user', 'environment'], { message: 'Невірний режим камери' })
    .default('environment'),
  enableFlash: z.boolean().default(false),
  autoFocus: z.boolean().default(true),
});

/**
 * Схема для фільтрування фото
 */
export const photoFilterSchema = z.object({
  searchTerm: z.string().max(100, 'Пошуковий термін занадто довгий').optional(),
  sortBy: z.enum(['date', 'name', 'size'], { message: 'Невірний тип сортування' }).default('date'),
  sortOrder: z.enum(['asc', 'desc'], { message: 'Невірний порядок сортування' }).default('desc'),
  showOnlyWithAnnotations: z.boolean().default(false),
});

/**
 * Схема для валідації документації
 */
export const documentationValidationSchema = z.object({
  minPhotosRequired: z.number().min(0).default(1),
  maxPhotosAllowed: z.number().min(1).default(5),
  requireDescriptions: z.boolean().default(false),
  requireAnnotations: z.boolean().default(false),
});

/**
 * Схема для завершення документації
 */
export const documentationCompletionSchema = z.object({
  notes: z.string().max(1000, 'Примітки не повинні перевищувати 1000 символів').optional(),
  isComplete: z.boolean(),
  skipReason: z.string().max(500, 'Причина пропуску занадто довга').optional(),
});

/**
 * Схема для налаштувань галереї
 */
export const gallerySettingsSchema = z.object({
  thumbnailSize: z
    .enum(['small', 'medium', 'large'], { message: 'Невірний розмір мініатюр' })
    .default('medium'),
  showGrid: z.boolean().default(true),
  enableZoom: z.boolean().default(true),
  showMetadata: z.boolean().default(false),
});

// TypeScript типи для UI форм
export type PhotoUploadFormData = z.infer<typeof photoUploadSchema>;
export type PhotoEditFormData = z.infer<typeof photoEditSchema>;
export type CameraSettingsFormData = z.infer<typeof cameraSettingsSchema>;
export type PhotoFilterFormData = z.infer<typeof photoFilterSchema>;
export type DocumentationValidationFormData = z.infer<typeof documentationValidationSchema>;
export type DocumentationCompletionFormData = z.infer<typeof documentationCompletionSchema>;
export type GallerySettingsFormData = z.infer<typeof gallerySettingsSchema>;

// Додаткові типи для роботи з фото
export interface PhotoMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  uploadedAt: string;
  thumbnailUrl?: string;
  fullUrl?: string;
}

export interface PhotoWithMetadata extends PhotoMetadata {
  description?: string;
  annotations?: string;
  isSelected?: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
}

export interface CameraCapabilities {
  hasCamera: boolean;
  hasMultipleCameras: boolean;
  supportedResolutions: string[];
  hasFlash: boolean;
  hasAutoFocus: boolean;
}

export interface UploadProgress {
  photoId: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}
