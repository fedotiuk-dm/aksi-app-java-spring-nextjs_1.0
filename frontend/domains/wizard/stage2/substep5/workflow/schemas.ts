// Substep5 Workflow Schemas - ТІЛЬКИ Orval схеми + мінімальні UI форми
// Використовуємо готові схеми з @/shared/api/generated/substep5

import { z } from 'zod';
import {
  SUBSTEP5_WORKFLOW_STEPS,
  SUBSTEP5_WORKFLOW_LIMITS,
  type Substep5WorkflowStep,
} from './workflow.constants';

// =================== ORVAL СХЕМИ ===================
// Реекспорт готових схем з читабельними назвами
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

// Response схеми (основні DTO)
export type {
  PhotoDocumentationDTO as PhotoDocumentationSchema,
  OrderItemPhotoDTO as OrderItemPhotoSchema,
  SubstepResultDTO as SubstepResultSchema,
  ErrorResponse as ErrorResponseSchema,
} from '@/shared/api/generated/substep5';

// =================== ТИПИ ===================
// Реекспорт типів з читабельними назвами
export type {
  substep5InitializePhotoDocumentationParams as InitializePhotoDocumentationParams,
  substep5AddPhotoParams as AddPhotoParams,
  substep5RemovePhotoParams as RemovePhotoParams,
  substep5CompletePhotoDocumentationParams as CompletePhotoDocumentationParams,
  substep5GetDocumentationStatusParams as GetDocumentationStatusParams,
  substep5GetDocumentationDataParams as GetDocumentationDataParams,
} from '@/shared/api/generated/substep5';

// Response типи
export type {
  PhotoDocumentationDTO as PhotoDocumentationResponse,
  OrderItemPhotoDTO as OrderItemPhotoResponse,
  SubstepResultDTO as SubstepResultResponse,
  ErrorResponse as ErrorResponse,
} from '@/shared/api/generated/substep5';

// =================== МІНІМАЛЬНІ UI ФОРМИ ===================
// Тільки для workflow навігації та координації

// Форма ініціалізації workflow
export const workflowInitializationFormSchema = z.object({
  sessionId: z.string().min(1, "Session ID обов'язковий"),
  itemId: z.string().min(1, "Item ID обов'язковий"),
  startFromStep: z
    .enum([
      SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION,
      SUBSTEP5_WORKFLOW_STEPS.PHOTO_UPLOAD,
      SUBSTEP5_WORKFLOW_STEPS.PHOTO_REVIEW,
      SUBSTEP5_WORKFLOW_STEPS.ANNOTATIONS,
      SUBSTEP5_WORKFLOW_STEPS.COMPLETION,
      SUBSTEP5_WORKFLOW_STEPS.FINALIZATION,
    ])
    .optional(),
});

export type WorkflowInitializationFormData = z.infer<typeof workflowInitializationFormSchema>;

// Форма навігації між кроками
export const workflowNavigationFormSchema = z.object({
  currentStep: z.enum([
    SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION,
    SUBSTEP5_WORKFLOW_STEPS.PHOTO_UPLOAD,
    SUBSTEP5_WORKFLOW_STEPS.PHOTO_REVIEW,
    SUBSTEP5_WORKFLOW_STEPS.ANNOTATIONS,
    SUBSTEP5_WORKFLOW_STEPS.COMPLETION,
    SUBSTEP5_WORKFLOW_STEPS.FINALIZATION,
  ]),
  targetStep: z.enum([
    SUBSTEP5_WORKFLOW_STEPS.INITIALIZATION,
    SUBSTEP5_WORKFLOW_STEPS.PHOTO_UPLOAD,
    SUBSTEP5_WORKFLOW_STEPS.PHOTO_REVIEW,
    SUBSTEP5_WORKFLOW_STEPS.ANNOTATIONS,
    SUBSTEP5_WORKFLOW_STEPS.COMPLETION,
    SUBSTEP5_WORKFLOW_STEPS.FINALIZATION,
  ]),
  skipValidation: z.boolean(),
  saveProgress: z.boolean(),
});

export type WorkflowNavigationFormData = z.infer<typeof workflowNavigationFormSchema>;

// Форма завершення workflow
export const workflowCompletionFormSchema = z.object({
  sessionId: z.string().min(1, "Session ID обов'язковий"),
  documentationCompleted: z
    .boolean()
    .refine((val) => val === true, 'Документація повинна бути завершена'),
  notes: z
    .string()
    .max(
      SUBSTEP5_WORKFLOW_LIMITS.MAX_ANNOTATION_LENGTH,
      `Максимум ${SUBSTEP5_WORKFLOW_LIMITS.MAX_ANNOTATION_LENGTH} символів`
    )
    .optional(),
  confirmCompletion: z
    .boolean()
    .refine((val) => val === true, "Підтвердження завершення обов'язкове"),
});

export type WorkflowCompletionFormData = z.infer<typeof workflowCompletionFormSchema>;

// Форма валідації фото
export const photoValidationFormSchema = z.object({
  photoIds: z
    .array(z.string())
    .min(
      SUBSTEP5_WORKFLOW_LIMITS.MIN_PHOTOS,
      `Мінімум ${SUBSTEP5_WORKFLOW_LIMITS.MIN_PHOTOS} фото`
    ),
  validateAnnotations: z.boolean(),
  requireAllAnnotations: z.boolean(),
});

export type PhotoValidationFormData = z.infer<typeof photoValidationFormSchema>;
