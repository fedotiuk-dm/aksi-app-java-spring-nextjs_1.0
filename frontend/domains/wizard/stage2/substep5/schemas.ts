// Substep5 Schemas - ТІЛЬКИ Orval схеми + мінімальні UI форми
// Використовуємо готові схеми з @/shared/api/generated/substep5

import { z } from 'zod';
import { SUBSTEP5_VALIDATION_RULES, SUBSTEP5_UI_STEPS } from './constants';

// =================== ORVAL СХЕМИ ===================
// Реекспорт готових схем з читабельними назвами

// TypeScript типи
export type {
  PhotoDocumentationDTO as PhotoDocumentationSchema,
  OrderItemPhotoDTO as OrderItemPhotoSchema,
  SubstepResultDTO as SubstepResultSchema,
  ErrorResponse as ErrorResponseSchema,
} from '@/shared/api/generated/substep5';

// Params схеми
export type {
  substep5InitializePhotoDocumentationParams as InitializePhotoDocumentationParamsSchema,
  substep5AddPhotoParams as AddPhotoParamsSchema,
  substep5RemovePhotoParams as RemovePhotoParamsSchema,
  substep5CompletePhotoDocumentationParams as CompletePhotoDocumentationParamsSchema,
  substep5GetDocumentationStatusParams as GetDocumentationStatusParamsSchema,
  substep5GetDocumentationDataParams as GetDocumentationDataParamsSchema,
} from '@/shared/api/generated/substep5';

// Body схеми
export type { Substep5AddPhotoBody as AddPhotoBodySchema } from '@/shared/api/generated/substep5';

// Response схеми
export type {
  substep5InitializePhotoDocumentation200Response as InitializePhotoDocumentationResponseSchema,
  substep5AddPhoto200Response as AddPhotoResponseSchema,
  substep5RemovePhoto200Response as RemovePhotoResponseSchema,
  substep5CompletePhotoDocumentation200Response as CompletePhotoDocumentationResponseSchema,
  substep5GetDocumentationStatus200Response as GetDocumentationStatusResponseSchema,
  substep5GetDocumentationData200Response as GetDocumentationDataResponseSchema,
} from '@/shared/api/generated/substep5';

// =================== UI ФОРМИ ===================
// Мінімальні Zod схеми для UI форм (НЕ дублюють API)

// Форма завантаження фото
export const photoUploadFormSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(SUBSTEP5_VALIDATION_RULES.MIN_PHOTOS, 'Потрібно завантажити хоча б одне фото')
    .max(
      SUBSTEP5_VALIDATION_RULES.MAX_PHOTOS,
      `Максимум ${SUBSTEP5_VALIDATION_RULES.MAX_PHOTOS} фото`
    )
    .refine(
      (files) =>
        files.every(
          (file) => file.size <= SUBSTEP5_VALIDATION_RULES.MAX_FILE_SIZE_MB * 1024 * 1024
        ),
      `Розмір файлу не повинен перевищувати ${SUBSTEP5_VALIDATION_RULES.MAX_FILE_SIZE_MB}MB`
    )
    .refine(
      (files) =>
        files.every((file) =>
          (SUBSTEP5_VALIDATION_RULES.ALLOWED_FORMATS as readonly string[]).includes(file.type)
        ),
      'Дозволені формати: JPEG, PNG, WebP'
    ),
});

// Форма анотацій до фото
export const photoAnnotationFormSchema = z.object({
  photoId: z.string().min(1, "ID фото обов'язкове"),
  annotation: z
    .string()
    .min(SUBSTEP5_VALIDATION_RULES.MIN_ANNOTATION_LENGTH)
    .max(
      SUBSTEP5_VALIDATION_RULES.MAX_ANNOTATION_LENGTH,
      `Максимум ${SUBSTEP5_VALIDATION_RULES.MAX_ANNOTATION_LENGTH} символів`
    )
    .optional(),
  description: z
    .string()
    .max(
      SUBSTEP5_VALIDATION_RULES.MAX_ANNOTATION_LENGTH,
      `Максимум ${SUBSTEP5_VALIDATION_RULES.MAX_ANNOTATION_LENGTH} символів`
    )
    .optional(),
});

// Форма навігації між кроками
export const stepNavigationFormSchema = z.object({
  currentStep: z.enum([
    SUBSTEP5_UI_STEPS.PHOTO_UPLOAD,
    SUBSTEP5_UI_STEPS.PHOTO_REVIEW,
    SUBSTEP5_UI_STEPS.ANNOTATIONS,
    SUBSTEP5_UI_STEPS.COMPLETION,
  ]),
  targetStep: z.enum([
    SUBSTEP5_UI_STEPS.PHOTO_UPLOAD,
    SUBSTEP5_UI_STEPS.PHOTO_REVIEW,
    SUBSTEP5_UI_STEPS.ANNOTATIONS,
    SUBSTEP5_UI_STEPS.COMPLETION,
  ]),
});

// Форма завершення документації
export const completionFormSchema = z.object({
  notes: z
    .string()
    .max(
      SUBSTEP5_VALIDATION_RULES.MAX_ANNOTATION_LENGTH,
      `Максимум ${SUBSTEP5_VALIDATION_RULES.MAX_ANNOTATION_LENGTH} символів`
    )
    .optional(),
  confirmCompletion: z.boolean().refine((val) => val === true, "Підтвердження обов'язкове"),
});

// =================== ТИПИ UI ФОРМ ===================
export type PhotoUploadFormData = z.infer<typeof photoUploadFormSchema>;
export type PhotoAnnotationFormData = z.infer<typeof photoAnnotationFormSchema>;
export type StepNavigationFormData = z.infer<typeof stepNavigationFormSchema>;
export type CompletionFormData = z.infer<typeof completionFormSchema>;
